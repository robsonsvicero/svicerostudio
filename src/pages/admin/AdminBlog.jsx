import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import Button from '../../components/UI/Button';
import Markdown from 'react-markdown';
import ImageUploadSlot from '../../components/UI/ImageUploadSlot';
import AdminLayout from '../../components/Admin/AdminLayout';

import { API_URL } from '../../lib/api.js';

const AdminBlog = () => {
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
      const res = await fetch(`${API_URL}/api/db/autores/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ operation: 'select', filters: [{ column: 'publicado', operator: 'eq', value: true }], orderBy: { column: 'nome', ascending: true } }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || 'Erro ao buscar autores');
      setAutores(payload.data || []);
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
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', 'posts'); // Assuming 'posts' bucket
    formData.append('key', `${Date.now()}_${file.name}`);

    try {
      const res = await fetch(`${API_URL}/api/storage/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || 'Falha no upload');
      
      const imageUrl = `${API_URL}/api/storage/public/posts/${payload.data.path}`;
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

    // Envia o campo autor corretamente
    const payload = { ...formData };

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
    setEditingId(post.id);
    // Garante que o campo autor seja preenchido corretamente ao editar
    setFormData({ ...initialFormState, ...post, autor: post.autor });
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
    { name: 'autor', label: 'Autor', placeholder: 'Selecione um autor', type: 'select', required: true, options: autores.map(a => ({ value: a.id, label: a.nome })), col: 'lg:col-span-1' },
    { name: 'categoria', label: 'Categoria', placeholder: 'Selecione uma categoria', type: 'select', required: true, options: ['Performance & Conversão', 'Estratégia de Ativos (Business & IA)', 'Engenharia de Percepção (Branding)', 'UX Design & Engenharia de Lucro'].map(c => ({ value: c, label: c})), col: 'lg:col-span-1' },
    { name: 'data_publicacao', label: 'Data de publicação', placeholder: 'YYYY-MM-DD', type: 'date', required: true, col: 'lg:col-span-1' },
    { name: 'tags', label: 'Tags', placeholder: 'branding, ux, design', type: 'text', required: false, col: 'lg:col-span-1' },
  ];

  return (
    <AdminLayout toastProps={{ show: showToast, message: toastMessage, type: toastType, onClose: hideToast }}>
        <form onSubmit={handleSubmit} className="relative overflow-hidden rounded-[32px] border border-white/8 bg-[#181818] shadow-2xl shadow-black/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(184,115,51,0.14),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(95,178,216,0.10),_transparent_22%)]" />
          <div className="relative border-b border-white/8 px-6 py-6 lg:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="inline-flex items-center rounded-full border border-[#B87333]/25 bg-[#B87333]/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-[#E9BF84]">
                  Gerenciar Blog
                </div>
                <h1 className="mt-4 font-[Manrope] text-3xl font-semibold tracking-[-0.04em] text-white lg:text-5xl">
                  {editingId ? 'Editando Artigo' : 'Criar um novo artigo'}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60 lg:text-base">
                  Crie, edite e gerencie o conteúdo do blog do Svicero Studio.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                 <button type="button" onClick={resetForm} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white/80 transition hover:bg-white/8">
                  {editingId ? 'Cancelar Edição' : 'Limpar Campos'}
                </button>
                <button type="submit" className="rounded-2xl bg-[#B87333] px-5 py-3 text-sm font-semibold text-[#141414] transition hover:brightness-110" disabled={isSubmitting || isUploading}>
                  {isSubmitting ? 'Salvando...' : (editingId ? 'Atualizar Artigo' : 'Publicar Artigo')}
                </button>
              </div>
            </div>
          </div>

          <div className="relative grid gap-6 px-6 py-6 lg:grid-cols-12 lg:px-8 lg:py-8">
            <div className="space-y-6 lg:col-span-8">
              
              <section className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5 backdrop-blur lg:p-6">
                 <div className="mb-6"><p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">Informações Principais</p><h2 className="mt-2 font-[Manrope] text-2xl font-semibold text-white">Metadados do Artigo</h2></div>
                 <div className="grid gap-4 lg:grid-cols-2">
                   {fields.map((field) => (
                     <label key={field.name} className={`${field.col} block`}>
                       <span className="mb-2 block text-sm font-medium text-white/82">
                         {field.label}
                         {field.required && <span className="ml-1 text-[#E9BF84]">*</span>}
                       </span>
                        {field.type === 'select' ? (
                            <select name={field.name} value={formData[field.name]} onChange={handleFieldChange} required={field.required} className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40">
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
                             className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                           />
                        )}
                     </label>
                   ))}
                 </div>
              </section>

              <section className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5 backdrop-blur lg:p-6">
                <div className="mb-6"><p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">Conteúdo</p><h2 className="mt-2 font-[Manrope] text-2xl font-semibold text-white">Corpo do Artigo</h2></div>
                <div className="grid gap-4">
                  <label>
                    <span className="mb-2 block text-sm font-medium text-white/82">Resumo</span>
                    <textarea name="resumo" value={formData.resumo} onChange={handleFieldChange} placeholder="Uma síntese para SEO e chamadas." rows={3} className="w-full resize-none rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-4 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40" />
                  </label>
                  <label>
                    <span className="mb-2 block text-sm font-medium text-white/82">Conteúdo (suporta Markdown)</span>
                    <textarea name="conteudo" value={formData.conteudo} onChange={handleFieldChange} placeholder="Escreva o artigo aqui..." rows={15} className="w-full resize-y rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-4 text-sm leading-6 text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40" />
                  </label>
                </div>
              </section>
              
              <section className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5 backdrop-blur lg:p-6">
                 <div className="mb-6"><p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">Mídia</p><h2 className="mt-2 font-[Manrope] text-2xl font-semibold text-white">Imagem de Destaque</h2></div>
                 <div className="grid gap-4">
                    <ImageUploadSlot title="Imagem de capa do post" description="Arraste ou clique para enviar" currentImageUrl={formData.imagem_destaque} onUpload={handleImageUpload} isUploading={isUploading} />
                 </div>
              </section>
            </div>

            <aside className="space-y-6 lg:col-span-4">
              <section className="rounded-[28px] border border-white/8 bg-[#2F353B]/30 p-5 shadow-lg shadow-black/20">
                <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">Configurações de Publicação</p>
                 <div className="mt-5 grid gap-3">
                    <label className="flex items-center justify-between rounded-2xl border border-white/8 bg-[#141414]/55 px-4 py-4">
                      <span className="text-sm text-white/82">Publicar artigo</span>
                      <input type="checkbox" name="publicado" checked={formData.publicado} onChange={handleFieldChange} className="sr-only" />
                      <span className={`flex h-7 w-12 items-center rounded-full border border-[#B87333]/20  px-1 ${formData.publicado ? 'bg-[#B87333]/50' : 'bg-white/5'}`}>
                        <span className={`h-5 w-5 rounded-full bg-[#B87333] transition-all ${formData.publicado ? 'ml-auto' : 'ml-0'}`} />
                      </span>
                    </label>
                </div>
              </section>
              <section className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">Preview do Conteúdo</p>
                  <div className="prose prose-sm prose-invert mt-4 max-h-96 overflow-auto">
                    <Markdown>{formData.conteudo || 'O preview do seu texto em Markdown aparecerá aqui.'}</Markdown>
                  </div>
              </section>
            </aside>
          </div>
        </form>

        <div className="mt-16">
            <h2 className="text-2xl font-semibold text-white mb-6">Artigos Cadastrados</h2>
            {isLoading && <p className="text-white/60">Carregando artigos...</p>}
            {!isLoading && posts.length === 0 && <p className="p-6 text-white/60 bg-[#181818] rounded-2xl border border-white/8">Nenhum artigo encontrado.</p>}
            {posts.length > 0 && (
              <div className="bg-[#181818] rounded-2xl border border-white/8">
                  <ul className="divide-y divide-white/8">
                      {posts.map(post => {
                          const autor = autores.find(a => a.id === post.autor);
                          return (
                            <li key={post.id} className="flex items-center justify-between p-4 gap-4">
                               <img src={post.imagem_destaque || `https://via.placeholder.com/150/141414/E9BF84?text=${post.titulo.charAt(0)}`} alt={post.titulo} className="w-16 h-10 object-cover rounded-lg flex-shrink-0 bg-black/20" />
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-white truncate">{post.titulo}</p>
                                    <p className="text-sm text-white/60 truncate">{autor?.nome || 'Autor desconhecido'} • {new Date(post.data_publicacao).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>
                                </div>
                                <div className="flex items-center gap-3 flex-shrink-0">
                                    <span className={`px-2 py-1 text-xs rounded-full ${post.publicado ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                                      {post.publicado ? 'Publicado' : 'Rascunho'}
                                    </span>
                                    <Button variant="outline" onClick={() => handleEdit(post)}>Editar</Button>
                                    <Button variant="danger" onClick={() => handleDelete(post.id)}>Excluir</Button>
                                </div>
                            </li>
                          );
                      })}
                  </ul>
              </div>
            )}
        </div>
  </AdminLayout>
  );
};

export default AdminBlog;
