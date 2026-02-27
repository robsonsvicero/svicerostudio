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
        e.preventDefault();
        setIsSubmitting(true);
        try {
          // Validação básica
          if (!formData.titulo || !formData.conteudo || !formData.autor) {
            showToastMessage('Preencha todos os campos obrigatórios', 'error');
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
      {/* ...existing code... */}
    </div>
  );
}

export default AdminBlog;
