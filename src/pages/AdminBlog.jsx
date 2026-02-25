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
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
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
      let query = supabase
        .from('posts')
        .select('*')
        .order('data_publicacao', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false });
      const { data, error } = await query;
      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      showToastMessage('Erro ao carregar posts', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  // Função para ordenar os posts conforme sortConfig
  const sortedPosts = React.useMemo(() => {
    if (!posts) return [];
    const sorted = [...posts];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        // Para datas, converter para Date
        if (sortConfig.key === 'data_publicacao' || sortConfig.key === 'created_at') {
          aValue = aValue ? new Date(aValue) : new Date(0);
          bValue = bValue ? new Date(bValue) : new Date(0);
        }
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [posts, sortConfig]);

  // Handler para clicar no cabeçalho e ordenar
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        // Alterna asc/desc
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
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
      <div className="max-w-screen-xl mx-auto mb-4">
        <Button variant="outline" onClick={() => navigate('/admin')} icon={<i className="fa-solid fa-arrow-left"></i>}>
          Voltar
        </Button>
      </div>
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
            <div className="flex flex-col gap-1">
              <label htmlFor="titulo">Título *</label>
              <input id="titulo" name="titulo" value={formData.titulo} onChange={handleInputChange} placeholder="Título *" required className="border border-gray-300 rounded px-3 py-2" />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="slug">Slug</label>
              <input id="slug" name="slug" value={formData.slug} onChange={handleInputChange} placeholder="Slug" className="border border-gray-300 rounded px-3 py-2" />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="resumo">Resumo</label>
              <textarea id="resumo" name="resumo" value={formData.resumo} onChange={handleInputChange} placeholder="Resumo" className="border border-gray-300 rounded px-3 py-2" />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="conteudo">Conteúdo *</label>
              <textarea id="conteudo" name="conteudo" value={formData.conteudo} onChange={handleInputChange} onPaste={handlePaste} placeholder="Conteúdo *" required className="border border-gray-300 rounded px-3 py-2" />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="imagem_destaque">Imagem de destaque (link do Imgur):</label>
              <input id="imagem_destaque" name="imagem_destaque" value={formData.imagem_destaque} onChange={handleInputChange} placeholder="https://i.imgur.com/xxxxxxx.jpg" className="border border-gray-300 rounded px-3 py-2" />
              <span className="text-xs text-gray-500">Cole o link direto da imagem hospedada no Imgur.</span>
              {formData.imagem_destaque && formData.imagem_destaque.startsWith('http') && (
                <img src={formData.imagem_destaque} alt="Preview" className="max-w-xs rounded-xl mt-2" />
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="categoria">Categoria</label>
              <select id="categoria" name="categoria" value={formData.categoria} onChange={handleInputChange} className="border border-gray-300 rounded px-3 py-2">
                <option value="">Selecione</option>
                <option value="Design Estratégico & Psicologia do Valor">Design Estratégico & Psicologia do Valor</option>
                <option value="UX Design & Engenharia de Lucro">UX Design & Engenharia de Lucro</option>
                <option value="Execução Técnica & Performance Digital">Execução Técnica & Performance Digital</option>
                <option value="Carreira & Mercado Freelance">Carreira & Mercado Freelance</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="tags">Tags</label>
              <input id="tags" name="tags" value={formData.tags} onChange={handleInputChange} placeholder="Tags (separadas por vírgula)" className="border border-gray-300 rounded px-3 py-2" />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="data_publicacao">Data de publicação</label>
              <input id="data_publicacao" name="data_publicacao" value={formData.data_publicacao} onChange={handleInputChange} placeholder="Data de publicação" type="date" className="border border-gray-300 rounded px-3 py-2" />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="autor">Autor *</label>
              {autores.length > 0 ? (
                <select id="autor" name="autor" value={formData.autor} onChange={handleInputChange} required className="border border-gray-300 rounded px-3 py-2">
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
              <label htmlFor="publicado">Status:</label>
              <input id="publicado" type="checkbox" name="publicado" checked={formData.publicado} onChange={handleInputChange} />
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
          <table className="min-w-full w-full text-left border border-cream/40 rounded-xl table-fixed">
            <colgroup>
              <col style={{ width: '260px' }} /> {/* Título */}
              <col /> {/* Categoria */}
              <col /> {/* Data */}
              <col /> {/* Status */}
              <col /> {/* Autor */}
              <col style={{ width: '200px' }} /> {/* Ações */}
            </colgroup>
            <thead>
              <tr>
                <th className="truncate cursor-pointer select-none" onClick={() => handleSort('titulo')}>Título {sortConfig.key === 'titulo' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}</th>
                <th className="cursor-pointer select-none" onClick={() => handleSort('categoria')}>Categoria {sortConfig.key === 'categoria' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}</th>
                <th className="cursor-pointer select-none" onClick={() => handleSort('data_publicacao')}>Data {sortConfig.key === 'data_publicacao' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}</th>
                <th className="cursor-pointer select-none" onClick={() => handleSort('publicado')}>Status {sortConfig.key === 'publicado' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}</th>
                <th className="cursor-pointer select-none" onClick={() => handleSort('autor')}>Autor {sortConfig.key === 'autor' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {sortedPosts.map((post, idx) => (
                <tr key={idx}>
                  <td className="truncate" title={post.titulo}>{post.titulo}</td>
                  <td>{post.categoria}</td>
                  <td>{post.data_publicacao}</td>
                  <td>{post.publicado ? 'Publicado' : 'Rascunho'}</td>
                  <td>{post.autor}</td>
                  <td>
                    <div className="flex flex-row gap-2">
                      <Button variant="primary" onClick={() => handleEdit(post)}>Editar</Button>
                      <Button variant="danger" onClick={() => handleDelete(post.id)}>Excluir</Button>
                    </div>
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
