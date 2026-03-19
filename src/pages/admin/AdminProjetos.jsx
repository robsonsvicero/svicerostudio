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
  const [editingId, setEditingId] = useState(null); // id do projeto (string normalizada)
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  // Galeria:
  // - novo projeto: apenas em memória
  // - edição: sincronizada com projeto_galeria
  const [gallery, setGallery] = useState([]); // [{ id?, imagem_url, ordem, legenda }]

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
  // Carregar galeria de um projeto (em edição)
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

        setGallery((payload.data || []).map((img) => ({
          id: img.id,
          imagem_url: img.imagem_url,
          ordem: img.ordem ?? 0,
          legenda: img.legenda || '',
        })));
      } catch (err) {
        showToastMessage(err.message, 'error');
      }
    },
    [API_URL, token, signOut, showToastMessage]
  );

  // ---------------------------------------------------------------------------
  // Handlers de formulário
  // ---------------------------------------------------------------------------
  const handleFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prevForm) => {
      const newState = { ...prevForm, [name]: type === 'checkbox' ? checked : value };
      if (name === 'titulo') {
        newState.slug = generateSlug(value);
      }
      return newState;
    });
  };

  // ---------------------------------------------------------------------------
  // Upload da imagem de capa (R2)
  // ---------------------------------------------------------------------------
  const handleImageUpload = useCallback(
    async (file) => {
      if (!file) {
        setForm((prev) => ({ ...prev, imagem_url: '' }));
        return;
      }
      setIsUploading(true);

      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('bucket', 'projetos');
      uploadFormData.append('key', `${Date.now()}_${file.name}`);

      try {
        const res = await fetch(`${API_URL}/api/storage/upload`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: uploadFormData,
        });
        const payload = await res.json();

        if (!res.ok) {
          throw new Error(payload.error || 'Falha no upload da imagem');
        }

        let imageUrl = payload.data?.url;
        if (!imageUrl && payload.data?.path) {
          imageUrl = `${API_URL}/api/storage/public/projetos/${payload.data.path}`;
        }
        if (!imageUrl || imageUrl.trim() === '') {
          throw new Error('Backend retornou URL vazia.');
        }

        setForm((prev) => ({ ...prev, imagem_url: imageUrl }));
        showToastMessage('Imagem de capa enviada com sucesso!', 'success');
      } catch (err) {
        showToastMessage(err.message, 'error');
      } finally {
        setIsUploading(false);
      }
    },
    [API_URL, token, showToastMessage]
  );

  // ---------------------------------------------------------------------------
  // Upload de imagem da galeria (Jeito A)
  // ---------------------------------------------------------------------------
  const handleGalleryImageUpload = useCallback(
    async (filesOrFile) => {
      if (!filesOrFile) return;

      const files = Array.isArray(filesOrFile) ? filesOrFile : [filesOrFile];
      if (files.length === 0) return;

      setIsUploadingGallery(true);

      try {
        const uploadedImages = [];

        for (const file of files) {
          // 1) Upload para R2
          const uploadFormData = new FormData();
          uploadFormData.append('file', file);
          uploadFormData.append('bucket', 'projetos_galeria');
          uploadFormData.append('key', `${Date.now()}_${file.name}`);

          const resUpload = await fetch(`${API_URL}/api/storage/upload`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: uploadFormData,
          });

          const uploadPayload = await resUpload.json();
          if (!resUpload.ok) {
            throw new Error(uploadPayload.error || 'Falha no upload de uma das imagens da galeria');
          }

          let imageUrl = uploadPayload.data?.url;
          if (!imageUrl && uploadPayload.data?.path) {
            imageUrl = `${API_URL}/api/storage/public/projetos_galeria/${uploadPayload.data.path}`;
          }
          if (!imageUrl || imageUrl.trim() === '') {
            throw new Error('Backend retornou URL vazia para uma imagem da galeria.');
          }

          uploadedImages.push(imageUrl);
        }

        // 2) Atualizar estado local da galeria (SEM mexer no banco ainda)
        setGallery((prev) => {
          const base = prev.length;
          const newItems = uploadedImages.map((url, idx) => ({
            tempId: `${Date.now()}-${idx}`,
            imagem_url: url,
            ordem: base + idx,
            legenda: '',
          }));
          return [...prev, ...newItems];
        });

        showToastMessage('Imagens da galeria enviadas com sucesso!', 'success');
      } catch (err) {
        showToastMessage(err.message, 'error');
      } finally {
        setIsUploadingGallery(false);
      }
    },
    [API_URL, token, showToastMessage]
  );

  // ---------------------------------------------------------------------------
  // Editar / Cancelar / Deletar projeto
  // ---------------------------------------------------------------------------
  const handleEditProject = async (proj) => {
    setEditingId(proj.id);
    setForm({
      titulo: proj.titulo || '',
      slug: proj.slug || '',
      categoria: proj.categoria || '',
      cliente: proj.cliente || '',
      data_projeto: proj.data_projeto || '',
      status: proj.status || 'draft',
      descricao: proj.descricao || '',
      descricao_longa: proj.descricao_longa || '',
      descricao_longa_en: proj.descricao_longa_en || '',
      imagem_url: proj.imagem_url || '',
      site_url: proj.site_url || '',
      link: proj.link || '',
      button_text: proj.button_text || 'Ver Projeto',
      link2: proj.link2 || '',
      button_text2: proj.button_text2 || '',
      mostrar_home: proj.mostrar_home ?? true,
    });
    await fetchGallery(proj.id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(initialFormState);
    setGallery([]);
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este projeto?')) return;
    try {
      const res = await fetch(`${API_URL}/api/db/projetos/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          operation: 'delete',
          filters: [{ column: 'id', operator: 'eq', value: id }],
        }),
      });

      const payload = await res.json();

      if (!res.ok) {
        if (res.status === 401) signOut();
        throw new Error(payload.error || 'Erro ao excluir projeto');
      }

      showToastMessage('Projeto excluído com sucesso!', 'success');
      fetchProjects();
      if (editingId === id) {
        handleCancelEdit();
      }
    } catch (err) {
      showToastMessage(err.message, 'error');
    }
  };

  // ---------------------------------------------------------------------------
  // Salvar projeto (insert/update) + persistir galeria se necessário
  // ---------------------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const payloadProjeto = {
        titulo: form.titulo,
        slug: form.slug,
        categoria: form.categoria,
        cliente: form.cliente,
        data_projeto: form.data_projeto,
        status: form.status,
        descricao: form.descricao,
        descricao_longa: form.descricao_longa,
        descricao_longa_en: form.descricao_longa_en,
        imagem_url: form.imagem_url,
        site_url: form.site_url,
        link: form.link,
        button_text: form.button_text,
        link2: form.link2,
        button_text2: form.button_text2,
        mostrar_home: form.mostrar_home,
      };

      let savedProjectId = editingId;

      if (editingId) {
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
            payload: payloadProjeto,
          }),
        });

        const payload = await res.json();
        if (!res.ok) {
          if (res.status === 401) signOut();
          throw new Error(payload.error || 'Erro ao atualizar projeto');
        }
        savedProjectId = editingId;
      } else {
        // INSERT
        const res = await fetch(`${API_URL}/api/db/projetos/query`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            operation: 'insert',
            payload: payloadProjeto,
          }),
        });

        const payload = await res.json();
        if (!res.ok) {
          if (res.status === 401) signOut();
          throw new Error(payload.error || 'Erro ao criar projeto');
        }

        const created = Array.isArray(payload.data) ? payload.data[0] : payload.data;
        if (!created || !created.id) {
          throw new Error('Resposta de criação de projeto não retornou id.');
        }
        savedProjectId = created.id;
      }

      // Persistir galeria caso existam imagens não persistidas (Jeito A):
      // Aqui vamos fazer um insertMany na tabela projeto_galeria
      if (gallery.length > 0) {
        const payloadGaleria = gallery.map((img, index) => ({
          projeto_id: savedProjectId,
          imagem_url: img.imagem_url,
          ordem: index,
          legenda: img.legenda || '',
        }));

        const resGal = await fetch(`${API_URL}/api/db/projeto_galeria/query`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            operation: 'insert',
            payload: payloadGaleria,
          }),
        });

        const payloadGal = await resGal.json();
        if (!resGal.ok) {
          if (resGal.status === 401) signOut();
          throw new Error(payloadGal.error || 'Erro ao salvar galeria do projeto');
        }
      }

      showToastMessage('Projeto salvo com sucesso!', 'success');
      setForm(initialFormState);
      setGallery([]);
      setEditingId(null);
      fetchProjects();
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
      description="Gerencie o portfólio de projetos apresentados no site."
      activeRoute="/admin/projetos"
    >
      <form onSubmit={handleSubmit} className="overflow-hidden rounded-[28px] border border-white/10 bg-[#050509] text-white shadow-[0_32px_120px_rgba(0,0,0,0.55)]">
        {/* Cabeçalho do Formulário */}
        <div className="border-b border-white/8 bg-gradient-to-r from-[#12101F] via-[#0B0813] to-[#0A070F] px-6 py-5 lg:px-8 lg:py-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">Projetos</p>
              <h1 className="mt-1.5 font-[Manrope] text-2xl font-semibold text-white">
                {editingId ? 'Editar Projeto' : 'Novo Projeto'}
              </h1>
              <p className="mt-1 text-sm text-white/60">
                Crie e gerencie os projetos exibidos na página de portfólio.
              </p>
            </div>
            <div className="hidden items-center gap-3 md:flex">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/')}
                className="!px-3 text-sm text-white/70 hover:text-white"
              >
                Ver site
              </Button>
              <Button type="submit" disabled={isSaving || isUploading || isUploadingGallery}>
                {isSaving ? 'Salvando...' : editingId ? 'Atualizar' : 'Publicar'}
              </Button>
            </div>
          </div>
        </div>

        {/* Conteúdo do Formulário */}
        <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1.05fr)] lg:p-8">
          {/* Coluna Esquerda */}
          <div className="space-y-6">
            {/* Informações Básicas */}
            <section className="rounded-[24px] border border-white/8 bg-white/[0.02] p-5 lg:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">
                    Informações
                  </p>
                  <h2 className="mt-1 font-[Manrope] text-lg font-semibold text-white">
                    Dados principais
                  </h2>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="md:col-span-2">
                  <span className="mb-2 block text-sm font-medium text-white/82">
                    Título do Projeto
                  </span>
                  <input
                    type="text"
                    name="titulo"
                    value={form.titulo}
                    onChange={handleFieldChange}
                    className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                    placeholder="Ex: Rebranding Svícero Studio"
                    required
                  />
                </label>

                <label>
                  <span className="mb-2 block text-sm font-medium text-white/82">
                    Categoria
                  </span>
                  <select
                    name="categoria"
                    value={form.categoria}
                    onChange={handleFieldChange}
                    className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white outline-none transition focus:border-[#B87333]/40"
                  >
                    <option value="">Selecione...</option>
                    {CATEGORIAS.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span className="mb-2 block text-sm font-medium text-white/82">
                    Cliente
                  </span>
                  <input
                    type="text"
                    name="cliente"
                    value={form.cliente}
                    onChange={handleFieldChange}
                    className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                    placeholder="Nome do cliente"
                  />
                </label>

                <label>
                  <span className="mb-2 block text-sm font-medium text-white/82">
                    Data do Projeto
                  </span>
                  <input
                    type="text"
                    name="data_projeto"
                    value={form.data_projeto}
                    onChange={handleFieldChange}
                    className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                    placeholder="Ex: 2025"
                  />
                </label>

                <label>
                  <span className="mb-2 block text-sm font-medium text-white/82">
                    Status
                  </span>
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
            </section>

            {/* Descrição */}
            <section className="rounded-[24px] border border-white/8 bg-white/[0.02] p-5 lg:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">
                    Descrição
                  </p>
                  <h2 className="mt-1 font-[Manrope] text-lg font-semibold text-white">
                    Conteúdo do projeto
                  </h2>
                </div>
              </div>
              <div className="space-y-4">
                <label>
                  <span className="mb-2 block text-sm font-medium text-white/82">
                    Descrição curta
                  </span>
                  <textarea
                    name="descricao"
                    value={form.descricao}
                    onChange={handleFieldChange}
                    rows={2}
                    className="w-full resize-none rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                    placeholder="Resumo breve do projeto..."
                    required
                  />
                </label>
                <label>
                  <span className="mb-2 block text-sm font-medium text-white/82">
                    Descrição longa (PT)
                  </span>
                  <textarea
                    name="descricao_longa"
                    value={form.descricao_longa}
                    onChange={handleFieldChange}
                    rows={4}
                    className="w-full resize-none rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                    placeholder="Detalhes do projeto, processo criativo, desafios, etc."
                  />
                </label>
                <label>
                  <span className="mb-2 block text-sm font-medium text-white/82">
                    Descrição longa (EN)
                  </span>
                  <textarea
                    name="descricao_longa_en"
                    value={form.descricao_longa_en}
                    onChange={handleFieldChange}
                    rows={4}
                    className="w-full resize-none rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                    placeholder="Long description in English..."
                  />
                </label>
              </div>
            </section>

            {/* Galeria */}
            <section className="rounded-[24px] border border-white/8 bg-white/[0.02] p-5 lg:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">
                    Galeria
                  </p>
                  <h2 className="mt-1 font-[Manrope] text-lg font-semibold text-white">
                    Imagens adicionais
                  </h2>
                  <p className="mt-1 text-sm text-white/60">
                    Adicione as imagens que serão exibidas na página detalhada do projeto.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Slot de upload da galeria (multi) */}
                <ImageUploadSlot
                  title="Adicionar à galeria"
                  description="Arraste ou clique para enviar (várias imagens)"
                  onUpload={handleGalleryImageUpload}
                  isUploading={isUploadingGallery}
                  multiple={true}
                />

                {/* Grade de imagens da galeria */}
                {gallery.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {gallery
                      .slice()
                      .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0))
                      .map((img, index) => (
                        <div
                          key={img.id || img.tempId || index}
                          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/40"
                        >
                          <img
                            src={img.imagem_url}
                            alt={`Imagem ${index + 1}`}
                            className="h-32 w-full object-cover transition duration-200 group-hover:scale-[1.02]"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setGallery((prev) =>
                                prev.filter(
                                  (g, i) =>
                                    i !== index &&
                                    g.imagem_url !== img.imagem_url
                                )
                              );
                            }}
                            className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100"
                          >
                            Remover
                          </button>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Coluna Direita */}
          <aside className="space-y-6">
            {/* Capa do Projeto */}
            <section className="rounded-[24px] border border-white/8 bg-white/[0.02] p-5 lg:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">
                    Imagem de capa
                  </p>
                  <h2 className="mt-1 font-[Manrope] text-lg font-semibold text-white">
                    Capa do projeto
                  </h2>
                  <p className="mt-1 text-sm text-white/60">
                    Esta imagem será usada como destaque do projeto na listagem.
                  </p>
                </div>
              </div>

              <ImageUploadSlot
                title="Upload da imagem de capa"
                description="Arraste ou clique para enviar"
                onUpload={handleImageUpload}
                isUploading={isUploading}
                currentImageUrl={form.imagem_url}
              />
            </section>

            {/* Visibilidade */}
            <section className="rounded-[24px] border border-white/8 bg-white/[0.02] p-5 lg:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">
                    Destaque
                  </p>
                  <h2 className="mt-1 font-[Manrope] text-lg font-semibold text-white">
                    Exibição na home
                  </h2>
                </div>
              </div>
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  name="mostrar_home"
                  checked={form.mostrar_home}
                  onChange={handleFieldChange}
                  className="mt-1 h-4 w-4 rounded border-white/30 bg-[#141414] text-[#E9BF84] focus:ring-[#E9BF84]"
                />
                <div>
                  <p className="text-sm font-medium text-white/90">
                    Mostrar este projeto na seção de destaques da página inicial
                  </p>
                  <p className="text-xs text-white/55">
                    Ideal para projetos recentes ou estratégicos.
                  </p>
                </div>
              </label>
            </section>

            {/* Links / Ações */}
            <section className="rounded-[24px] border border-white/8 bg-white/[0.02] p-5 lg:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">
                    Links
                  </p>
                  <h2 className="mt-1 font-[Manrope] text-lg font-semibold text-white">
                    Ações
                  </h2>
                </div>
              </div>
              <div className="space-y-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-white/82">
                    URL do Site
                  </span>
                  <input
                    type="text"
                    name="site_url"
                    value={form.site_url}
                    onChange={handleFieldChange}
                    className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                    placeholder="https://exemplo.com"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-white/82">
                    Link (Behance)
                  </span>
                  <input
                    type="text"
                    name="link"
                    value={form.link}
                    onChange={handleFieldChange}
                    className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                    placeholder="https://www.behance.net/..."
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-white/82">
                    Texto do Botão
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
                <hr className="border-white/10" />
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
          </aside>
        </div>

        {/* Botões de Ação (responsivo) */}
        <div className="border-t border-white/8 px-6 py-6 lg:px-8 flex justify-end gap-3 md:hidden">
          {editingId && (
            <Button
              type="button"
              variant="outline"
              onClick={handleCancelEdit}
              disabled={isSaving || isUploading || isUploadingGallery}
            >
              Cancelar
            </Button>
          )}
          <Button type="submit" disabled={isSaving || isUploading || isUploadingGallery}>
            {isSaving ? 'Salvando...' : editingId ? 'Atualizar' : 'Publicar'}
          </Button>
        </div>
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