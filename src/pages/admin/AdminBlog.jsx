import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import Button from '../../components/UI/Button';
import Markdown from 'react-markdown';
import ImageUploadSlot from '../../components/UI/ImageUploadSlot';
import AdminLayout from '../../components/Admin/AdminLayout';

import { API_URL } from '../../lib/api.js';
import { getPlaceholderImage } from '../../utils/placeholders';

const getEntityId = (item) => item?.id || item?._id || '';
const isUuid = (value) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value || '');
const isObjectId = (value) => /^[0-9a-f]{24}$/i.test(value || '');
const isPersistedId = (value) => isUuid(value) || isObjectId(value);
const getDisplayAuthorName = (value) => (value && !isPersistedId(value) ? value : '');

const AdminBlog = () => {
  const navigate = useNavigate();
  const { token, signOut } = useAuth();
  const { showToast, toastMessage, toastType, showToastMessage, hideToast } = useToast();

  const initialFormState = {
    titulo: '',
    slug: '',
    resumo: '',
    conteudo: '',
    imagem_destaque: '',
    categoria: '',
    tags: '',
    data_publicacao: new Date().toISOString().slice(0, 10),
    autor: '',
    publicado: true,
  };

  const [posts, setPosts] = useState([]);
  const [autores, setAutores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialFormState);

  const fetchAutores = useCallback(async () => {
    try {
      // Admin precisa ver TODOS os autores (sem filtro de publicado)
      const res = await fetch(`${API_URL}/api/db/autores/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ operation: 'select', orderBy: { column: 'nome', ascending: true } }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || 'Erro ao buscar autores');
      setAutores((payload.data || []).map((autor) => ({
        ...autor,
        id: getEntityId(autor),
      })));
    } catch (error) {
      showToastMessage(error.message, 'error');
    }
  }, [token, showToastMessage]);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/db/posts/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ operation: 'select', orderBy: { column: 'data_publicacao', ascending: false } }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || 'Erro ao buscar posts');
      setPosts(payload.data || []);
    } catch (error) {
      showToastMessage(error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [token, showToastMessage]);

  useEffect(() => {
    if (token) {
      fetchAutores();
      fetchPosts();
    }
  }, [token, fetchAutores, fetchPosts]);

  const handleFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newSlug = formData.slug;
    if (name === 'titulo') {
      newSlug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value, ...(name === 'titulo' && { slug: newSlug }) }));
  };

  const handleImageUpload = useCallback(async (file) => {
  if (!file) {
    setFormData(prev => ({ ...prev, imagem_destaque: '' }));
    return;
  }
  setIsUploading(true);
  const uploadFormData = new FormData();
  uploadFormData.append('file', file);
  uploadFormData.append('bucket', 'posts');
  uploadFormData.append('key', `${Date.now()}_${file.name}`);

  try {
    const res = await fetch(`${API_URL}/api/storage/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: uploadFormData,
    });
    const payload = await res.json();
    if (!res.ok) throw new Error(payload.error || 'Falha no upload');

    const imageUrl = payload.data?.url
      || `${API_URL}/api/storage/public/posts/${payload.data.path}`;
    setFormData(prev => ({ ...prev, imagem_destaque: imageUrl }));
    showToastMessage('Imagem enviada com sucesso!', 'success');
  } catch (err) {
    showToastMessage(err.message, 'error');
  } finally {
    setIsUploading(false);
  }
}, [token, showToastMessage]);
  
  const resetForm = () => {
    setFormData(initialFormState);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Remove campos computados pelo $lookup e campos de controle interno
    // eslint-disable-next-line no-unused-vars
    const { id, _id, autor_nome, autor_foto, autor_cargo, autor_bio, autor_email, ...payloadData } = formData;
    const payload = payloadData;

    const op = editingId ? 'update' : 'insert';
    const filters = editingId ? [{ column: 'id', operator: 'eq', value: editingId }] : [];

    try {
      const res = await fetch(`${API_URL}/api/db/posts/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ operation: op, filters, payload }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao salvar o post.');
      
      showToastMessage(`Post ${editingId ? 'atualizado' : 'criado'} com sucesso!`, 'success');
      resetForm();
      await fetchPosts();
    } catch (err) {
      showToastMessage(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (post) => {
    setEditingId(getEntityId(post));
    const data_publicacao = post.data_publicacao
      ? new Date(post.data_publicacao).toISOString().slice(0, 10)
      : '';

    // Separa os campos computados pelo $lookup dos campos reais do post
    // eslint-disable-next-line no-unused-vars
    const { id, _id, autor_nome, autor_foto, autor_cargo, autor_bio, autor_email, ...postFields } = post;

    const autorIdByReference = getEntityId(
      autores.find((autor) => String(getEntityId(autor)) === String(postFields.autor)),
    );
    const autorIdByName = getEntityId(
      autores.find((autor) => autor.nome === postFields.autor || autor.nome === autor_nome),
    );
    const autorId = autorIdByReference || autorIdByName || (isPersistedId(postFields.autor) ? postFields.autor : '');

    setFormData({
      ...initialFormState,
      ...postFields,
      autor: autorId,
      data_publicacao,
    });
    window.scrollTo(0, 0);
  };
  
  const handleDelete = async (postId) => {
    if (window.confirm('Tem certeza que deseja excluir este post?')) {
      try {
        const res = await fetch(`${API_URL}/api/db/posts/query`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ operation: 'delete', filters: [{ column: 'id', operator: 'eq', value: postId }]}),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Erro ao excluir');
        showToastMessage('Post excluído!', 'success');
        await fetchPosts();
      } catch (err) {
        showToastMessage(err.message, 'error');
      }
    }
  };

  const fields = [
    { name: 'titulo', label: 'Título do post', placeholder: 'Como criar uma marca memorável', type: 'text', required: true, col: 'lg:col-span-2' },
    { name: 'slug', label: 'Slug', placeholder: 'como-criar-marca-memoravel', type: 'text', required: true, col: 'lg:col-span-2' },
    { name: 'autor', label: autores.length === 0 ? 'Autor ⚠ Nenhum autor cadastrado — acesse Autores primeiro' : 'Autor', placeholder: 'Selecione um autor', type: 'select', required: true, options: autores.map(a => ({ value: getEntityId(a), label: a.nome })), col: 'lg:col-span-1' },
    { name: 'categoria', label: 'Categoria', placeholder: 'Selecione uma categoria', type: 'select', required: true, options: ['Posicionamento', 'Marca', 'Digital', 'Negócios', 'Processo', 'Cases', 'Designer'].map(c => ({ value: c, label: c})), col: 'lg:col-span-1' },
    { name: 'data_publicacao', label: 'Data de publicação', placeholder: 'YYYY-MM-DD', type: 'date', required: true, col: 'lg:col-span-1' },
    { name: 'tags', label: 'Tags', placeholder: 'branding, ux, design', type: 'text', required: false, col: 'lg:col-span-1' },
  ];

  // Redesign dashboard: Blog management with consistent SaaS styling

  const formActions = (
    <div className="flex items-center gap-3">
      <Button type="button" onClick={resetForm} className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-muted hover:text-cream hover:bg-white/10 transition">
        {editingId ? 'Cancelar' : 'Limpar'}
      </Button>
    </div>
  );

  return (
    <AdminLayout
      title="Blog"
      actions={formActions}
      toastProps={{ show: showToast, message: toastMessage, type: toastType, onClose: hideToast }}
    >
      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Main form column */}
          <div className="space-y-6 lg:col-span-8">
            {/* Metadata section */}
            <div className="rounded-xl border border-white/5 bg-surface p-6">
              <div className="mb-5">
                <p className="text-xs font-mono uppercase tracking-widest text-copper mb-1">Informações</p>
                <h2 className="text-base font-semibold text-cream">
                  {editingId ? 'Editando Artigo' : 'Novo Artigo'}
                </h2>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                {fields.map((field) => (
                  <label key={field.name} className={`${field.col} block`}>
                    <span className="mb-1.5 block text-sm font-medium text-muted">
                      {field.label}
                      {field.required && <span className="ml-1 text-copper">*</span>}
                    </span>
                    {field.type === 'select' ? (
                      <select name={field.name} value={formData[field.name]} onChange={handleFieldChange} required={field.required} className="w-full rounded-lg border border-white/10 bg-charcoal px-4 py-3 text-sm text-cream outline-none transition focus:border-copper/40 focus:ring-1 focus:ring-copper/20">
                        <option value="" disabled>{field.placeholder}</option>
                        {field.options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleFieldChange}
                        placeholder={field.placeholder}
                        required={field.required}
                        className="w-full rounded-lg border border-white/10 bg-charcoal px-4 py-3 text-sm text-cream placeholder:text-muted/50 outline-none transition focus:border-copper/40 focus:ring-1 focus:ring-copper/20"
                      />
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Content section */}
            <div className="rounded-xl border border-white/5 bg-surface p-6">
              <div className="mb-5">
                <p className="text-xs font-mono uppercase tracking-widest text-copper mb-1">Conteúdo</p>
                <h2 className="text-base font-semibold text-cream">Corpo do Artigo</h2>
              </div>
              <div className="space-y-4">
                <label>
                  <span className="mb-1.5 block text-sm font-medium text-muted">Resumo</span>
                  <textarea name="resumo" value={formData.resumo} onChange={handleFieldChange} placeholder="Uma síntese para SEO e chamadas." rows={3} className="w-full resize-none rounded-lg border border-white/10 bg-charcoal px-4 py-3 text-sm text-cream placeholder:text-muted/50 outline-none transition focus:border-copper/40 focus:ring-1 focus:ring-copper/20" />
                </label>
                <label>
                  <span className="mb-1.5 block text-sm font-medium text-muted">Conteúdo (Markdown)</span>
                  <textarea name="conteudo" value={formData.conteudo} onChange={handleFieldChange} placeholder="Escreva o artigo aqui..." rows={15} className="w-full resize-y rounded-lg border border-white/10 bg-charcoal px-4 py-3 text-sm leading-6 text-cream placeholder:text-muted/50 outline-none transition focus:border-copper/40 focus:ring-1 focus:ring-copper/20" />
                </label>
              </div>
            </div>

            {/* Media section */}
            <div className="rounded-xl border border-white/5 bg-surface p-6">
              <div className="mb-5">
                <p className="text-xs font-mono uppercase tracking-widest text-copper mb-1">Mídia</p>
                <h2 className="text-base font-semibold text-cream">Imagem de Destaque</h2>
              </div>
              <ImageUploadSlot title="Imagem de capa do post" description="Arraste ou clique para enviar" currentImageUrl={formData.imagem_destaque} onUpload={handleImageUpload} isUploading={isUploading} />
            </div>
          </div>

          {/* Sidebar column */}
          <aside className="space-y-6 lg:col-span-4">
            {/* Publish settings */}
            <div className="rounded-xl border border-white/5 bg-surface p-5">
              <p className="text-xs font-mono uppercase tracking-widest text-copper mb-4">Publicação</p>
              <label className="flex items-center justify-between rounded-lg border border-white/5 bg-charcoal px-4 py-3.5 cursor-pointer hover:border-white/10 transition-colors">
                <span className="text-sm text-cream">Publicar artigo</span>
                <input type="checkbox" name="publicado" checked={formData.publicado} onChange={handleFieldChange} className="sr-only" />
                <span className={`flex h-6 w-11 items-center rounded-full border border-copper/20 px-0.5 transition-colors ${formData.publicado ? 'bg-copper/40' : 'bg-white/5'}`}>
                  <span className={`h-5 w-5 rounded-full bg-copper transition-all ${formData.publicado ? 'ml-auto' : 'ml-0'}`} />
                </span>
              </label>
              <Button type="submit" className="mt-4 w-full rounded-lg bg-copper px-5 py-3 text-sm font-semibold text-white hover:brightness-110 transition" disabled={isSubmitting || isUploading}>
                {isSubmitting ? 'Salvando...' : (editingId ? 'Atualizar Artigo' : 'Publicar Artigo')}
              </Button>
            </div>

            {/* Markdown preview */}
            <div className="rounded-xl border border-white/5 bg-surface p-5">
              <p className="text-xs font-mono uppercase tracking-widest text-copper mb-4">Preview</p>
              <div className="prose prose-sm prose-invert max-h-96 overflow-auto">
                <Markdown>{formData.conteudo || 'O preview do seu texto em Markdown aparecerá aqui.'}</Markdown>
              </div>
            </div>
          </aside>
        </div>
      </form>

      {/* Posts list */}
      <div className="rounded-xl border border-white/5 bg-surface">
        <div className="border-b border-white/5 px-6 py-4">
          <h2 className="text-base font-semibold text-cream">
            Artigos Cadastrados
            {!isLoading && <span className="ml-2 text-sm font-normal text-muted">({posts.length})</span>}
          </h2>
        </div>
        {isLoading && <p className="p-6 text-muted">Carregando artigos...</p>}
        {!isLoading && posts.length === 0 && <p className="p-6 text-muted">Nenhum artigo encontrado.</p>}
        {posts.length > 0 && (
          <ul className="divide-y divide-white/5">
            {posts.map(post => {
              const autorFallback = autores.find(a => String(getEntityId(a)) === String(post.autor));
              const autorNome = getDisplayAuthorName(post.autor_nome) || autorFallback?.nome || getDisplayAuthorName(post.autor) || 'Autor desconhecido';
              return (
                <li key={getEntityId(post)} className="flex items-center justify-between px-6 py-4 gap-4 hover:bg-white/[.02] transition-colors">
                  <img src={post.imagem_destaque || getPlaceholderImage(post.titulo.charAt(0), '141414', 150)} alt={post.titulo} className="w-14 h-10 object-cover rounded-lg flex-shrink-0 bg-charcoal" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-cream truncate">{post.titulo}</p>
                    <p className="text-xs text-muted truncate">{autorNome} · {new Date(post.data_publicacao).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`px-2.5 py-1 text-xs rounded-md font-medium ${post.publicado ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                      {post.publicado ? 'Publicado' : 'Rascunho'}
                    </span>
                    <Button onClick={() => handleEdit(post)} className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-muted hover:text-cream hover:bg-white/10 transition">Editar</Button>
                    <Button onClick={() => handleDelete(getEntityId(post))} className="rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/15 transition">Excluir</Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
  </AdminLayout>
  );
};

export default AdminBlog;
