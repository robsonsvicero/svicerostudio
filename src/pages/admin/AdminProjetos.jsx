// src/pages/admin/AdminProjetos.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { API_URL } from '../../lib/api';
import { useToast } from '../../hooks/useToast';
import slugify from 'slugify';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

import AdminLayout from '../../components/Admin/AdminLayout';
import Button from '../../components/UI/Button';
import ImageUploadSlot from '../../components/UI/ImageUploadSlot';

const generateSlug = (title) =>
  slugify(title || '', { lower: true, strict: true });

const CATEGORIAS = ['Web Design', 'UX Design', 'Branding', 'Posicionamento'];

const AdminProjetos = () => {
  const { token, signOut } = useAuth();
  const navigate = useNavigate();
  const { showToastMessage } = useToast();

  const initialFormState = {
    titulo: '',
    slug: '',
    categoria: '',
    cliente: '',
    data_projeto: '',
    status: 'draft',
    descricao: '',
    descricao_longa: '',
    descricao_longa_en: '',
    imagem_url: '',
    site_url: '',
    link: '',
    button_text: 'Ver Projeto',
    link2: '',
    button_text2: '',
    mostrar_home: true,
  };

  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [gallery, setGallery] = useState([]);

  // ---------------------------------------------------------------------------
  // Carregar projetos
  // ---------------------------------------------------------------------------
  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/db/projetos/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          operation: 'select',
          sort: { created_at: -1 },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) signOut();
        throw new Error(data.error || `HTTP error! status: ${res.status}`);
      }

      setProjects(data.data || []);
    } catch (err) {
      showToastMessage(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [API_URL, token, signOut, showToastMessage]);

  useEffect(() => {
    if (token) fetchProjects();
  }, [token, fetchProjects]);

  // ---------------------------------------------------------------------------
  // Carregar galeria de um projeto existente
  // ---------------------------------------------------------------------------
  const fetchGallery = useCallback(
    async (projetoId) => {
      try {
        const res = await fetch(`${API_URL}/api/db/projeto_galeria/query`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            operation: 'select',
            filters: [{ column: 'projeto_id', operator: 'eq', value: projetoId }],
            orderBy: { column: 'ordem', ascending: true },
          }),
        });

        const payload = await res.json();

        if (!res.ok) {
          if (res.status === 401) signOut();
          throw new Error(payload.error || `Erro ao carregar galeria (status ${res.status})`);
        }

        setGallery(
          (payload.data || []).map((img) => ({
            id: img.id,
            projeto_id: img.projeto_id,
            imagem_url: img.imagem_url,
            ordem: img.ordem ?? 0,
            legenda: img.legenda || '',
          })),
        );
      } catch (err) {
        showToastMessage(err.message, 'error');
      }
    },
    [API_URL, token, signOut, showToastMessage],
  );

  // ---------------------------------------------------------------------------
  // Handlers de formulário
  // ---------------------------------------------------------------------------
  const handleFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prevForm) => {
      const newState = { ...prevForm, [name]: type === 'checkbox' ? checked : value };

      // Atualiza slug automaticamente a partir do título,
      // mas só enquanto o usuário não mexer manualmente no slug.
      if (name === 'titulo') {
        if (!prevForm.slug || prevForm.slug === generateSlug(prevForm.titulo)) {
          newState.slug = generateSlug(value);
        }
      }

      return newState;
    });
  };

  const handleCreateNew = () => {
    setForm(initialFormState);
    setEditingId(null);
    setGallery([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditProject = async (project) => {
    setEditingId(project.id);

    setForm({
      titulo: project.titulo || '',
      slug: project.slug || '',
      categoria: project.categoria || '',
      cliente: project.cliente || '',
      data_projeto: project.data_projeto || '',
      status: project.status || 'draft',
      descricao: project.descricao || '',
      descricao_longa: project.descricao_longa || '',
      descricao_longa_en: project.descricao_longa_en || '',
      imagem_url: project.imagem_url || '',
      site_url: project.site_url || '',
      link: project.link || '',
      button_text: project.button_text || 'Ver Projeto',
      link2: project.link2 || '',
      button_text2: project.button_text2 || '',
      mostrar_home: project.mostrar_home ?? true,
    });

    await fetchGallery(project.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setForm(initialFormState);
    setEditingId(null);
    setGallery([]);
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Tem certeza que deseja excluir este projeto?')) return;

    try {
      const res = await fetch(`${API_URL}/api/projetos/${projectId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) signOut();
        throw new Error(data.error || 'Erro ao excluir projeto');
      }

      showToastMessage('Projeto excluído com sucesso.', 'success');
      fetchProjects();
      if (editingId === projectId) {
        handleCancelEdit();
      }
    } catch (err) {
      showToastMessage(err.message, 'error');
    }
  };

  // ---------------------------------------------------------------------------
  // Upload da imagem de capa
  // ---------------------------------------------------------------------------
  const handleImageUpload = async (file) => {
    if (!file) return;
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'projetos');
      const safeName = slugify(file.name.replace(/\.[^/.]+$/, ''), { lower: true, strict: true });
      const ext = file.name.split('.').pop();
      const fileName = `${Date.now()}_${safeName}.${ext}`;
      formData.append('key', `projetos/${fileName}`);

      const res = await fetch(`${API_URL}/api/storage/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) signOut();
        throw new Error(data.error || 'Erro ao enviar imagem');
      }

      setForm((prev) => ({ ...prev, imagem_url: data.data.url }));
      showToastMessage('Imagem de capa enviada com sucesso.', 'success');
    } catch (err) {
      showToastMessage(err.message, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Upload da galeria (Jeito A: novo projeto = só memória)
  // ---------------------------------------------------------------------------
  const handleGalleryImageUpload = async (files) => {
    if (!files || files.length === 0) return;
    setIsUploadingGallery(true);

    try {
      const fileArray = Array.from(files);
      const uploadedImages = [];

      for (const file of fileArray) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('bucket', 'projetos-galeria');
        const safeName = slugify(file.name.replace(/\.[^/.]+$/, ''), { lower: true, strict: true });
        const ext = file.name.split('.').pop();
        const fileName = `${Date.now()}_${safeName}.${ext}`;
        formData.append('key', `projetos/${fileName}`);

        const res = await fetch(`${API_URL}/api/storage/upload`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          if (res.status === 401) signOut();
          throw new Error(data.error || 'Erro ao enviar imagem da galeria');
        }

        uploadedImages.push(data.data.url);
      }

      // Jeito A: sempre guarda na memória.
      // Quando for um projeto existente, a persistência é feita no submit (poderíamos fazer também aqui, se quisesse).
      setGallery((prev) => {
        const startIndex = prev.length;
        const newItems = uploadedImages.map((url, idx) => ({
          imagem_url: url,
          ordem: startIndex + idx,
          legenda: '',
        }));
        return [...prev, ...newItems];
      });

      showToastMessage('Imagens da galeria enviadas com sucesso.', 'success');
    } catch (err) {
      showToastMessage(err.message, 'error');
    } finally {
      setIsUploadingGallery(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Submit (criar / atualizar)
  // ---------------------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validações mínimas
    if (!form.titulo.trim()) {
      showToastMessage('O título é obrigatório.', 'error');
      return;
    }

    // Se slug estiver vazio, gerar a partir do título
    let slug = form.slug?.trim();
    if (!slug) {
      slug = generateSlug(form.titulo);
    }

    // descricao é obrigatória no schema
    if (!form.descricao || !form.descricao.trim()) {
      showToastMessage('A descrição é obrigatória.', 'error');
      return;
    }

    const projetoPayload = {
      titulo: form.titulo.trim(),
      slug,
      categoria: form.categoria || '',
      cliente: form.cliente || '',
      data_projeto: form.data_projeto || '',
      status: form.status || 'draft',
      descricao: form.descricao.trim(),
      descricao_longa: form.descricao_longa || '',
      descricao_longa_en: form.descricao_longa_en || '',
      imagem_url: form.imagem_url || '',
      site_url: form.site_url || '',
      link: form.link || '',
      button_text: form.button_text || 'Ver Projeto',
      link2: form.link2 || '',
      button_text2: form.button_text2 || '',
      mostrar_home: form.mostrar_home ?? true,
    };

    setIsSaving(true);

    try {
      if (!editingId) {
        // INSERT
        const res = await fetch(`${API_URL}/api/db/projetos/query`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            operation: 'insert',
            payload: projetoPayload,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          if (res.status === 401) signOut();
          throw new Error(data.error || 'Erro ao salvar projeto');
        }

        const created = data.data;
        const newId = Array.isArray(created) ? created[0]?.id : created?.id;
        if (!newId) {
          throw new Error('ID do projeto não retornado pela API.');
        }

        // Se houver galeria em memória, salvar em projeto_galeria
        if (gallery.length > 0) {
          const galleryPayload = gallery.map((img, idx) => ({
            projeto_id: newId,
            imagem_url: img.imagem_url,
            ordem: idx,
            legenda: img.legenda || '',
          }));

          const galRes = await fetch(`${API_URL}/api/db/projeto_galeria/query`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              operation: 'insert',
              payload: galleryPayload,
            }),
          });

          const galData = await galRes.json();

          if (!galRes.ok) {
            if (galRes.status === 401) signOut();
            throw new Error(galData.error || 'Erro ao salvar galeria do projeto');
          }
        }

        showToastMessage('Projeto criado com sucesso.', 'success');
      } else {
        // UPDATE
        const res = await fetch(`${API_URL}/api/db/projetos/query`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            operation: 'update',
            filters: [{ column: 'id', operator: 'eq', value: editingId }],
            payload: projetoPayload,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          if (res.status === 401) signOut();
          throw new Error(data.error || 'Erro ao atualizar projeto');
        }

        showToastMessage('Projeto atualizado com sucesso.', 'success');
      }

      await fetchProjects();
      handleCancelEdit();
    } catch (err) {
      showToastMessage(err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <AdminLayout
      title="Projetos"
      description="Gerencie os projetos do portfólio, incluindo capa, detalhes e galeria."
      onBack={() => navigate('/admin')}
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-white">Projetos</h1>
          <p className="mt-1 text-sm text-white/60">
            Crie, edite e organize os projetos que serão exibidos no site.
          </p>
        </div>
        <Button onClick={handleCreateNew} variant="primary">
          <FaPlus className="mr-2" />
          Novo Projeto
        </Button>
      </div>

      {/* Formulário principal */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-[minmax(0,_2.3fr)_minmax(0,_1.7fr)] gap-6 lg:gap-8"
      >
        {/* Coluna Esquerda */}
        <div className="space-y-6">
          {/* Bloco: Informações básicas */}
          <section className="rounded-2xl bg-[#141414]/80 border border-white/8 p-6 lg:p-8">
            <h2 className="text-sm font-semibold tracking-wide text-white/80 uppercase mb-4">
              Informações Básicas
            </h2>
            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-white/82">Título</span>
                <input
                  type="text"
                  name="titulo"
                  value={form.titulo}
                  onChange={handleFieldChange}
                  className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                  placeholder="Nome do projeto"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-white/82">Slug</span>
                <input
                  type="text"
                  name="slug"
                  value={form.slug}
                  onChange={handleFieldChange}
                  className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                  placeholder="slug-do-projeto"
                />
                <span className="mt-1 block text-xs text-white/45">
                  Usado na URL do projeto. Deve ser único.
                </span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-white/82">Categoria</span>
                  <select
                    name="categoria"
                    value={form.categoria}
                    onChange={handleFieldChange}
                    className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white outline-none transition focus:border-[#B87333]/40"
                  >
                    <option value="">Selecione uma categoria</option>
                    {CATEGORIAS.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-white/82">Cliente</span>
                  <input
                    type="text"
                    name="cliente"
                    value={form.cliente}
                    onChange={handleFieldChange}
                    className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                    placeholder="Nome do cliente"
                  />
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-white/82">Data</span>
                  <input
                    type="text"
                    name="data_projeto"
                    value={form.data_projeto}
                    onChange={handleFieldChange}
                    className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                    placeholder="2024"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-white/82">Status</span>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleFieldChange}
                    className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white outline-none transition focus:border-[#B87333]/40"
                  >
                    <option value="draft">Rascunho</option>
                    <option value="published">Publicado</option>
                    <option value="archived">Arquivado</option>
                  </select>
                </label>
              </div>
            </div>
          </section>

          {/* Bloco: Descrições */}
          <section className="rounded-2xl bg-[#141414]/80 border border-white/8 p-6 lg:p-8 space-y-6">
            <h2 className="text-sm font-semibold tracking-wide text-white/80 uppercase">
              Descrições
            </h2>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-white/82">
                Descrição curta (obrigatória)
              </span>
              <textarea
                name="descricao"
                value={form.descricao}
                onChange={handleFieldChange}
                className="min-h-[80px] w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                placeholder="Resumo do projeto..."
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-white/82">Descrição longa</span>
              <textarea
                name="descricao_longa"
                value={form.descricao_longa}
                onChange={handleFieldChange}
                className="min-h-[120px] w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                placeholder="Detalhes do projeto..."
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-white/82">
                Descrição longa (EN)
              </span>
              <textarea
                name="descricao_longa_en"
                value={form.descricao_longa_en}
                onChange={handleFieldChange}
                className="min-h-[120px] w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                placeholder="Project details in English..."
              />
            </label>
          </section>
        </div>

        {/* Coluna Direita */}
        <aside className="space-y-6">
          {/* Capa */}
          <section className="rounded-2xl bg-[#141414]/80 border border-white/8 p-6 lg:p-8 space-y-4">
            <h2 className="text-sm font-semibold tracking-wide text-white/80 uppercase">
              Imagem de Capa
            </h2>
            <ImageUploadSlot
              label="Imagem de capa"
              helperText="JPG, PNG até 8MB"
              onUpload={handleImageUpload}
              isUploading={isUploading}
              currentImageUrl={form.imagem_url}
            />
          </section>

          {/* Links e Botões */}
          <section className="rounded-2xl bg-[#141414]/80 border border-white/8 p-6 lg:p-8 space-y-4">
            <h2 className="text-sm font-semibold tracking-wide text-white/80 uppercase">
              Links & Ações
            </h2>
            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-white/82">
                  Link principal
                </span>
                <input
                  type="text"
                  name="link"
                  value={form.link}
                  onChange={handleFieldChange}
                  className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                  placeholder="https://..."
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-white/82">
                  Texto do botão principal
                </span>
                <input
                  type="text"
                  name="button_text"
                  value={form.button_text}
                  onChange={handleFieldChange}
                  className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                  placeholder="Ver Projeto"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-white/82">
                  Segundo Link
                </span>
                <input
                  type="text"
                  name="link2"
                  value={form.link2}
                  onChange={handleFieldChange}
                  className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                  placeholder="https://..."
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-white/82">
                  Texto do Segundo Botão
                </span>
                <input
                  type="text"
                  name="button_text2"
                  value={form.button_text2}
                  onChange={handleFieldChange}
                  className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                  placeholder="Texto alternativo"
                />
              </label>
            </div>
          </section>

          {/* Galeria */}
          <section className="rounded-2xl bg-[#141414]/80 border border-white/8 p-6 lg:p-8 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold tracking-wide text-white/80 uppercase">
                Galeria de Imagens
              </h2>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-[11px] font-medium text-white/70">
                <FaPlus className="h-3 w-3 text-[#B87333]" />
                <span>{gallery.length} imagens</span>
              </span>
            </div>
            <p className="text-xs text-white/55">
              Envie múltiplas imagens para compor a galeria do projeto.
            </p>

            <ImageUploadSlot
              label="Imagens da galeria"
              helperText="Arraste ou selecione múltiplas imagens"
              onUpload={handleGalleryImageUpload}
              isUploading={isUploadingGallery}
              multiple={true}
            />

            {gallery.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {gallery.map((img, index) => (
                  <div
                    key={img.id || img.imagem_url || index}
                    className="relative rounded-xl overflow-hidden border border-white/10 bg-black/30"
                  >
                    <img
                      src={img.imagem_url}
                      alt={`Imagem ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-black/70 px-2 py-1 text-[10px] text-white/80 flex justify-between items-center">
                      <span>#{index + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </aside>
      </form>

      {/* Lista de Projetos */}
      <div className="mt-16">
        <h2 className="text-2xl font-semibold text-white mb-6">Projetos Existentes</h2>
        {isLoading && <p className="text-white/60">Carregando...</p>}
        {!isLoading && projects.length === 0 && (
          <p className="p-6 text-white/60 bg-[#181818] rounded-2xl border border-white/8">
            Nenhum projeto encontrado.
          </p>
        )}
        {projects.length > 0 && (
          <div className="bg-[#181818] rounded-2xl border border-white/8">
            <ul className="divide-y divide-white/8">
              {projects.map((proj) => (
                <li key={proj.id} className="flex items-center p-4 gap-4">
                  <img
                    src={
                      proj.imagem_url ||
                      `https://via.placeholder.com/150/141414/E9BF84?text=${proj.titulo?.charAt(0) || 'P'}`
                    }
                    alt={proj.titulo}
                    className="w-16 h-10 object-cover rounded-lg flex-shrink-0 bg-black/20"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white truncate flex items-center gap-2">
                      {proj.titulo}
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full capitalize ${
                          proj.status === 'published'
                            ? 'bg-green-500/10 text-green-400'
                            : proj.status === 'draft'
                            ? 'bg-yellow-500/10 text-yellow-400'
                            : 'bg-gray-500/10 text-gray-400'
                        }`}
                      >
                        {proj.status === 'published' ? 'Publicado' : proj.status}
                      </span>
                    </p>
                    <p className="text-sm text-white/60 truncate">
                      {proj.categoria || 'Sem categoria'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <Button variant="outline" onClick={() => handleEditProject(proj)}>
                      Editar
                    </Button>
                    <Button variant="danger" onClick={() => handleDeleteProject(proj.id)}>
                      Excluir
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProjetos;