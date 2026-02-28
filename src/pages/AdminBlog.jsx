import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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
    publicado: true
  });

  // Buscar autores publicados
  const fetchAutores = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://svicerostudio-production.up.railway.app'}/api/db/autores/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation: 'select', filters: [{ column: 'publicado', operator: 'eq', value: true }], orderBy: { column: 'nome', ascending: true } }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || 'Erro ao buscar autores');
      setAutores(payload.data || []);
    } catch (error) {
      showToastMessage('Erro ao carregar autores', 'error');
    }
  };

  // Buscar posts
  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://svicerostudio-production.up.railway.app'}/api/db/posts/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation: 'select', orderBy: { column: 'data_publicacao', ascending: false }, limit: 100 }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || 'Erro ao buscar posts');
      setPosts(payload.data || []);
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
    // Busca slug único no backend REST
    const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://svicerostudio-production.up.railway.app'}/api/db/posts/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operation: 'select', filters: [{ column: 'slug', operator: 'eq', value: slug }], single: true }),
    });
    const payload = await res.json();
    if (!res.ok) return slug;
    if (payload.data && (!currentPostId || payload.data.id !== currentPostId)) {
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
      const apiUrl = `${import.meta.env.VITE_API_URL || 'https://svicerostudio-production.up.railway.app'}/api/db/posts/query`;
      if (editingId) {
        result = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operation: 'update', filters: [{ column: 'id', operator: 'eq', value: editingId }], payload }),
        });
      } else {
        result = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operation: 'insert', payload }),
        });
      }
      const payloadRes = await result.json();
      if (!result.ok) throw new Error(payloadRes.error || 'Erro ao salvar post');
      showToastMessage('Post salvo!', 'success');
      setFormData({ titulo: '', slug: '', resumo: '', conteudo: '', imagem_destaque: '', categoria: '', tags: '', data_publicacao: '', autor: '', publicado: false });
      setEditingId(null);
      fetchPosts();
    } catch (error) {
      showToastMessage('Erro ao salvar post', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://svicerostudio-production.up.railway.app'}/api/db/posts/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation: 'delete', filters: [{ column: 'id', operator: 'eq', value: id }] }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || 'Erro ao excluir post');
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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Administração de Blog</h1>
        <button className="mb-4 px-4 py-2 bg-primary text-white rounded" onClick={() => navigate('/admin')}>Voltar ao Admin</button>

        {/* Toast */}
        <Toast show={showToast} message={toastMessage} type={toastType} onClose={hideToast} />

        {/* Formulário de Post */}
        <form onSubmit={handleSubmit} className="bg-white rounded shadow p-8 mb-8 flex flex-col gap-4 w-full">
          <h2 className="text-xl font-semibold mb-2">{editingId ? 'Editar Post' : 'Novo Post'}</h2>
          <input className="border p-2 rounded w-full" name="titulo" required placeholder="Título" value={formData.titulo} onChange={handleInputChange} />
          <input className="border p-2 rounded w-full" name="slug" required placeholder="Slug (URL)" value={formData.slug} onChange={handleInputChange} />
          <input className="border p-2 rounded w-full" name="resumo" required placeholder="Resumo" value={formData.resumo} onChange={handleInputChange} />
          <textarea className="border p-2 rounded w-full" name="conteudo" rows={6} required placeholder="Conteúdo (Markdown)" value={formData.conteudo} onChange={handleInputChange} onPaste={handlePaste} />
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block mb-1 font-medium">Imagem de destaque</label>
              <input className="border p-2 rounded w-full" name="imagem_destaque" placeholder="URL da imagem ou cole uma imagem" value={formData.imagem_destaque} onChange={handleInputChange} />
              <input className="mt-2" type="file" accept="image/*" onChange={handleImageUpload} />
              {imagemPreview && <img src={imagemPreview} alt="preview" className="mt-2 w-full max-h-40 object-contain rounded" />}
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <label className="block font-medium">Categoria</label>
              <input className="border p-2 rounded w-full" name="categoria" placeholder="Categoria" value={formData.categoria} onChange={handleInputChange} />
              <label className="block font-medium">Tags (separadas por vírgula)
                <input className="border p-2 rounded w-full mt-1" name="tags" placeholder="tag1, tag2" value={formData.tags} onChange={handleInputChange} />
              </label>
              <label className="block font-medium">Data de publicação
                <input className="border p-2 rounded w-full mt-1" name="data_publicacao" type="date" value={formData.data_publicacao} onChange={handleInputChange} />
              </label>
              <label className="block font-medium">Autor
                <select className="border p-2 rounded w-full mt-1" name="autor" value={formData.autor} onChange={handleInputChange} required>
                  <option value="">Selecione</option>
                  {autores.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
                </select>
              </label>
              <label className="flex items-center gap-2 mt-2">
                <input type="checkbox" name="publicado" checked={formData.publicado} onChange={handleInputChange} /> Publicado
              </label>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 mt-6 w-full">
            <button type="submit" className={`w-full sm:w-auto px-4 py-3 rounded font-semibold text-lg shadow transition ${isSubmitting ? 'bg-primary/60 text-white cursor-not-allowed' : 'bg-primary text-white hover:bg-primary-dark'}`} disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar Post'}
            </button>
            {editingId && (
              <button type="button" className="w-full sm:w-auto px-4 py-3 rounded font-semibold text-lg shadow bg-gray-300 text-gray-800 hover:bg-gray-400 transition" onClick={handleCancelEdit}>Cancelar</button>
            )}
          </div>
          <div className="mt-4">
            <label className="block font-medium mb-1">Preview Markdown</label>
            <div className="prose prose-sm bg-gray-50 rounded p-4 max-h-64 overflow-auto">
              <Markdown>{previewMarkdown}</Markdown>
            </div>
          </div>
        </form>

        {/* Lista de Posts */}
        <div className="bg-white rounded shadow p-6 w-full">
          <h2 className="text-xl font-semibold mb-4">Posts Cadastrados</h2>
          {isLoading ? (
            <p>Carregando posts...</p>
          ) : sortedPosts.length === 0 ? (
            <p>Nenhum post cadastrado.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr>
                    <th className="p-2 cursor-pointer" onClick={() => handleSort('titulo')}>Título</th>
                    <th className="p-2 cursor-pointer" onClick={() => handleSort('autor')}>Autor</th>
                    <th className="p-2 cursor-pointer" onClick={() => handleSort('data_publicacao')}>Data</th>
                    <th className="p-2 cursor-pointer" onClick={() => handleSort('publicado')}>Publicado</th>
                    <th className="p-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedPosts.map(post => (
                    <tr key={post.id} className="border-t">
                      <td className="p-2 max-w-xs truncate">{post.titulo}</td>
                      <td className="p-2">{autores.find(a => a.id === post.autor)?.nome || '-'}</td>
                      <td className="p-2">{post.data_publicacao ? new Date(post.data_publicacao).toLocaleDateString() : '-'}</td>
                      <td className="p-2">{post.publicado ? 'Sim' : 'Não'}</td>
                      <td className="p-2 flex gap-2">
                        <button className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => {
                          setFormData({ ...post });
                          setPreviewMarkdown(post.conteudo);
                          setImagemPreview(post.imagem_destaque || null);
                          setEditingId(post.id);
                        }}>Editar</button>
                        <button className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600" onClick={() => handleDelete(post.id)}>Excluir</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminBlog;
