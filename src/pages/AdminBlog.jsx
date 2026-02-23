import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useToast } from '../hooks/useToast';
import Toast from '../components/UI/Toast';
import Button from '../components/UI/Button';
import Markdown from 'react-markdown';

const AdminBlog = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { showToast, toastMessage, toastType, showToastMessage, hideToast } = useToast();

  // Estados
  const [posts, setPosts] = useState([]);
  const [autores, setAutores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [previewMarkdown, setPreviewMarkdown] = useState('');
  const [imagemPreview, setImagemPreview] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    slug: '',
    resumo: '',
    conteudo: '',
    imagem_destaque: '',
    categoria: '',
    tags: '',
    data_publicacao: '',
    autor: '',
    publicado: false
  });

  // Buscar autores publicados
  const fetchAutores = async () => {
    try {
      const { data, error } = await supabase
        .from('autores')
        .select('id, nome, publicado')
        .eq('publicado', true)
        .order('nome', { ascending: true });
      if (error) throw error;
      setAutores(data || []);
    } catch (error) {
      showToastMessage('Erro ao carregar autores', 'error');
    }
  };

  // Buscar posts
  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      showToastMessage('Erro ao carregar posts', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAutores();
    fetchPosts();
  }, []);

  // Slug único
  const getUniqueSlug = async (slug, currentPostId = null) => {
    // Busca slug único no backend
    const { data, error } = await supabase
      .from('posts')
      .select('id')
      .eq('slug', slug);
    if (error) return slug;
    if (data && data.length > 0 && (!currentPostId || data[0].id !== currentPostId)) {
      return slug + '-' + Math.floor(Math.random() * 1000);
    }
    return slug;
  };

  // Manipulação de campos
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'titulo') {
      setFormData(prev => ({ ...prev, titulo: value, slug: value.toLowerCase().replace(/\s+/g, '-') }));
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
    if (name === 'conteudo') setPreviewMarkdown(value);
  };

  // Processar imagens coladas
  const handlePaste = async (e) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        const reader = new FileReader();
        reader.onload = (ev) => {
          setImagemPreview(ev.target.result);
          setFormData(prev => ({ ...prev, imagem_destaque: ev.target.result }));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Upload de imagem
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagemPreview(ev.target.result);
      setFormData(prev => ({ ...prev, imagem_destaque: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  // Submissão do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Validação básica
      if (!formData.titulo || !formData.conteudo || !formData.autor) {
        showToastMessage('Preencha todos os campos obrigatórios', 'error');
        setIsSubmitting(false);
        return;
      }
      // Slug único
      const slug = await getUniqueSlug(formData.slug, editingId);
      const payload = { ...formData, slug };
      let result;
      if (editingId) {
        result = await supabase
          .from('posts')
          .update(payload)
          .eq('id', editingId);
      } else {
        result = await supabase
          .from('posts')
          .insert([payload]);
      }
      if (result.error) throw result.error;
      showToastMessage('Post salvo!', 'success');
      setFormData({ titulo: '', slug: '', resumo: '', conteudo: '', imagem_destaque: '', categoria: '', tags: '', data_publicacao: '', autor: '', publicado: false });
      setEditingId(null);
      fetchPosts();
    } catch (error) {
      showToastMessage('Erro ao salvar post', 'error');
    }
    setIsSubmitting(false);
  };

  // Editar post
  const handleEdit = (post) => {
    setFormData({ ...post });
    setPreviewMarkdown(post.conteudo);
    setImagemPreview(post.imagem_destaque);
    setEditingId(post.id);
  };

  // Excluir post
  const handleDelete = async (id) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);
      if (error) throw error;
      showToastMessage('Post excluído!', 'success');
      fetchPosts();
    } catch (error) {
      showToastMessage('Erro ao excluir post', 'error');
    }
  };

  // Cancelar edição
  const handleCancelEdit = () => {
    setFormData({ titulo: '', slug: '', resumo: '', conteudo: '', imagem_destaque: '', categoria: '', tags: '', data_publicacao: '', autor: '', publicado: false });
    setPreviewMarkdown('');
    setImagemPreview(null);
    setEditingId(null);
  };

  // Logout
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      showToastMessage('Erro ao sair', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-cream pt-20 pb-24 px-4 md:px-16">
      <Toast 
        message={toastMessage} 
        type={toastType} 
        show={showToast} 
        onClose={hideToast}
      />
      <div className="max-w-screen-xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white rounded-xl shadow-lg p-6 border border-cream/20">
          <div className="flex-1">
            <h1 className="font-title text-4xl md:text-5xl font-semibold text-low-dark mb-2">Painel Blog</h1>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleLogout} className="px-6 py-2 bg-red-500 text-white rounded">Sair</Button>
          </div>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12 border border-cream/20">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <input name="titulo" value={formData.titulo} onChange={handleInputChange} placeholder="Título *" required />
            <input name="slug" value={formData.slug} onChange={handleInputChange} placeholder="Slug" />
            <textarea name="resumo" value={formData.resumo} onChange={handleInputChange} placeholder="Resumo" />
            <textarea name="conteudo" value={formData.conteudo} onChange={handleInputChange} onPaste={handlePaste} placeholder="Conteúdo *" required />
            <div className="flex flex-col gap-2">
              <label>Imagem de destaque:</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} />
              {imagemPreview && <img src={imagemPreview} alt="Preview" className="max-w-xs rounded-xl mt-2" />}
            </div>
            <input name="categoria" value={formData.categoria} onChange={handleInputChange} placeholder="Categoria" />
            <input name="tags" value={formData.tags} onChange={handleInputChange} placeholder="Tags (separadas por vírgula)" />
            <input name="data_publicacao" value={formData.data_publicacao} onChange={handleInputChange} placeholder="Data de publicação" type="date" />
            <div className="flex flex-col gap-2">
              <label>Autor *</label>
              {autores.length > 0 ? (
                <select name="autor" value={formData.autor} onChange={handleInputChange} required>
                  <option value="">Selecione</option>
                  {autores.map(autor => (
                    <option key={autor.id} value={autor.nome}>{autor.nome}</option>
                  ))}
                </select>
              ) : (
                <div className="text-red-500">Nenhum autor publicado. <a href="/admin/autores" className="underline">Criar autor</a></div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <label>Status:</label>
              <input type="checkbox" name="publicado" checked={formData.publicado} onChange={handleInputChange} />
              <span>{formData.publicado ? 'Publicado' : 'Rascunho'}</span>
            </div>
            <div className="flex gap-4 justify-end">
              <Button type="submit" disabled={isSubmitting} variant="primary">Salvar</Button>
              {editingId && <Button type="button" variant="secondary" onClick={handleCancelEdit}>Cancelar</Button>}
            </div>
          </form>
          {/* Preview Markdown */}
          {previewMarkdown && (
            <div className="mt-8">
              <h3 className="font-title text-lg mb-2">Preview do conteúdo:</h3>
              <div className="prose prose-lg max-w-none bg-cream rounded-xl p-4">
                <Markdown>{previewMarkdown}</Markdown>
              </div>
            </div>
          )}
        </div>

        {/* Listagem de posts */}
        <h2 className="font-title text-2xl font-light text-low-dark mb-6">Posts Cadastrados ({posts.length})</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border border-cream/40 rounded-xl">
            <thead>
              <tr>
                <th>Título</th>
                <th>Categoria</th>
                <th>Data</th>
                <th>Status</th>
                <th>Autor</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post, idx) => (
                <tr key={idx}>
                  <td>{post.titulo}</td>
                  <td>{post.categoria}</td>
                  <td>{post.data_publicacao}</td>
                  <td>{post.publicado ? 'Publicado' : 'Rascunho'}</td>
                  <td>{post.autor}</td>
                  <td>
                    <Button variant="secondary" onClick={() => handleEdit(post)}>Editar</Button>
                    <Button variant="danger" onClick={() => handleDelete(post.id)}>Excluir</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBlog;
