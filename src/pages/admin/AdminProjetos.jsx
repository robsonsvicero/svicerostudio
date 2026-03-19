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

const generateLocalId = (titulo = '') => {
  const base = slugify(titulo || 'projeto', { lower: true, strict: true }) || 'projeto';
  return `${base}-${Date.now()}`;
};

const CATEGORIAS = ['Web Design', 'UX Design', 'Branding', 'Posicionamento'];

const AdminProjetos = () => {
  const { token, signOut } = useAuth();
  const navigate = useNavigate();
  const { showToastMessage } = useToast();

  const initialFormState = {
    _id: '',
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
  const [gallery, setGallery] = useState([]); // [{ id?, projeto_id?, imagem_url, ordem, legenda? }]

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
      if (name === 'titulo') {
        newState.slug = generateSlug(value);
        if (!prevForm._id || prevForm._id.startsWith('projeto-')) {
          newState._id = generateLocalId(value);
        }
      }
      return newState;
    });
  };

  const handleCancelEdit = () => {
    setForm(initialFormState);
    setEditingId(null);
    setGallery([]);
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
    [API_URL, token, showToastMessage],
  );

  // ---------------------------------------------------------------------------
  // Upload de imagens da galeria (R2 + estado; grava em banco só em edição)
  // ---------------------------------------------------------------------------
  const handleGalleryImageUpload = useCallback(
    async (files) => {
      if (!files || files.length === 0) return;

      const fileArray = Array.isArray(files) ? files : Array.from(files);
      setIsUploadingGallery(true);

      try {
        const uploadedImages = [];

        for (const file of fileArray) {
          const uploadFormData = new FormData();
          uploadFormData.append('file', file);
          uploadFormData.append('bucket', 'projetos');
          uploadFormData.append('key', `${Date.now()}_${file.name}`);

          const res = await fetch(`${API_URL}/api/storage/upload`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: uploadFormData,
          });
          const payload = await res.json();

          if (!res.ok) {
            throw new Error(payload.error || 'Falha no upload de imagem da galeria');
          }

          let imageUrl = payload.data?.url;
          if (!imageUrl && payload.data?.path) {
            imageUrl = `${API_URL}/api/storage/public/projetos/${payload.data.path}`;
          }
          if (!imageUrl || imageUrl.trim() === '') {
            throw new Error('Backend retornou URL vazia para imagem da galeria.');
          }

          uploadedImages.push({ imagem_url: imageUrl });
        }

        // Atualiza estado (sempre)
        setGallery((prev) => {
          const base = prev.length;
          return [
            ...prev,
            ...uploadedImages.map((img, idx) => ({
              tempId: `temp-${Date.now()}-${idx}`,
              imagem_url: img.imagem_url,
              ordem: base + idx,
              legenda: '',
            })),
          ];
        });

        // Se já está editando um projeto existente, grava também em projeto_galeria
        if (editingId) {
          const payload = uploadedImages.map((img, idx) => ({
            projeto_id: editingId,
            imagem_url: img.imagem_url,
            ordem: gallery.length + idx,
            legenda: '',
          }));

          const res = await fetch(`${API_URL}/api/db/projeto_galeria/query`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              operation: 'insert',
              payload,
            }),
          });

          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.error || 'Erro ao salvar imagens da galeria no banco.');
          }
        }

        showToastMessage('Imagens da galeria enviadas!', 'success');
      } catch (err) {
        showToastMessage(err.message, 'error');
      } finally {
        setIsUploadingGallery(false);
      }
    },
    [API_URL, token, editingId, gallery.length, showToastMessage],
  );

  // ---------------------------------------------------------------------------
  // Editar projeto
  // ---------------------------------------------------------------------------
  const handleEditProject = async (proj) => {
    setForm({
      _id: proj.id || '',
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
    setEditingId(proj.id);
    await fetchGallery(proj.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ---------------------------------------------------------------------------
  // Deletar projeto
  // ---------------------------------------------------------------------------
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

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao excluir projeto');
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
  // Salvar projeto (novo ou edição) + galeria (jeito A)
  // ---------------------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.titulo || !form.slug || !form.descricao) {
      showToastMessage('Preencha pelo menos título, slug e descrição.', 'error');
      return;
    }

    setIsSaving(true);

    try {
      if (!editingId) {
        // NOVO PROJETO: INSERT
        const res = await fetch(`${API_URL}/api/db/projetos/query`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            operation: 'insert',
            payload: {
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
            },
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Erro ao criar projeto');
        }

        const created = data.data?.[0];
        const newProjectId = created?.id;

        if (!newProjectId) {
          throw new Error('API não retornou o id do novo projeto.');
        }

        // SALVAR GALERIA (se houver)
        if (gallery.length > 0) {
          const payloadGallery = gallery.map((img, index) => ({
            projeto_id: newProjectId,
            imagem_url: img.imagem_url,
            ordem: index,
            legenda: img.legenda || '',
          }));

          const resGallery = await fetch(`${API_URL}/api/db/projeto_galeria/query`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              operation: 'insert',
              payload: payloadGallery,
            }),
          });

          const galData = await resGallery.json();
          if (!resGallery.ok) {
            throw new Error(galData.error || 'Erro ao salvar imagens da galeria.');
          }
        }

        showToastMessage('Projeto criado com sucesso!', 'success');
      } else {
        // EDIÇÃO: UPDATE
        const res = await fetch(`${API_URL}/api/db/projetos/query`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            operation: 'update',
            filters: [{ column: 'id', operator: 'eq', value: editingId }],
            payload: {
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
            },
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Erro ao atualizar projeto');
        }

        showToastMessage('Projeto atualizado com sucesso!', 'success');
      }

      await fetchProjects();
      setForm(initialFormState);
      setGallery([]);
      setEditingId(null);
    } catch (err) {
      showToastMessage(err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // ---------------------------------------------------------------------------
  // JSX
  // ---------------------------------------------------------------------------
  return (
    <AdminLayout
      title="Projetos"
      description="Gerencie os projetos exibidos no site."
      primaryAction={
        <Button
          size="sm"
          onClick={() => {
            handleCancelEdit();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <FaPlus className="mr-2" /> Novo Projeto
        </Button>
      }
    >
      {/* Formulário */}
      <form
        onSubmit={handleSubmit}
        className="mt-8 grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)] gap-8 items-start"
      >
        {/* Coluna principal */}
        <div className="space-y-8">
          {/* Card: Informações básicas */}
          <section className="rounded-3xl border border-white/8 bg-[#181818] px-6 py-6 lg:px-8 lg:py-7 shadow-[0_18px_45px_rgba(0,0,0,0.55)]">
            <h2 className="text-sm font-semibold tracking-[0.18em] text-white/60 uppercase mb-1">
              Informações Básicas
            </h2>
            <p className="text-sm text-white/60 mb-6">
              Defina título, slug, categoria, cliente e data do projeto.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block md:col-span-2">
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
                  placeholder="meu-projeto-incrivel"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-white/82">Categoria</span>
                <select
                  name="categoria"
                  value={form.categoria}
                  onChange={handleFieldChange}
                  className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-[13px] text-sm text-white outline-none transition focus:border-[#B87333]/40"
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

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-white/82">
                  Data do Projeto
                </span>
                <input
                  type="text"
                  name="data_projeto"
                  value={form.data_projeto}
                  onChange={handleFieldChange}
                  className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                  placeholder="2024 ou 03/2024"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-white/82">Status</span>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleFieldChange}
                  className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-[13px] text-sm text-white outline-none transition focus:border-[#B87333]/40"
                >
                  <option value="draft">Rascunho</option>
                  <option value="published">Publicado</option>
                </select>
              </label>

              <label className="inline-flex items-center gap-2 md:col-span-2 mt-2">
                <input
                  type="checkbox"
                  name="mostrar_home"
                  checked={form.mostrar_home}
                  onChange={handleFieldChange}
                  className="h-4 w-4 rounded border-white/40 bg-[#141414] text-[#B87333] focus:ring-[#B87333]"
                />
                <span className="text-sm text-white/82">Exibir na página inicial</span>
              </label>
            </div>
          </section>

          {/* Descrição */}
          <section className="rounded-3xl border border-white/8 bg-[#181818] px-6 py-6 lg:px-8 lg:py-7">
            <h2 className="text-sm font-semibold tracking-[0.18em] text-white/60 uppercase mb-1">
              Descrição
            </h2>
            <p className="text-sm text-white/60 mb-6">
              Breve resumo e descrição detalhada do projeto.
            </p>
            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-white/82">
                  Descrição Curta
                </span>
                <textarea
                  name="descricao"
                  value={form.descricao}
                  onChange={handleFieldChange}
                  rows={3}
                  className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40 resize-none"
                  placeholder="Resumo rápido do projeto."
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-white/82">
                  Descrição Longa (PT)
                </span>
                <textarea
                  name="descricao_longa"
                  value={form.descricao_longa}
                  onChange={handleFieldChange}
                  rows={5}
                  className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40 resize-none"
                  placeholder="Conte em detalhes como o projeto foi desenvolvido."
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-white/82">
                  Descrição Longa (EN)
                </span>
                <textarea
                  name="descricao_longa_en"
                  value={form.descricao_longa_en}
                  onChange={handleFieldChange}
                  rows={5}
                  className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40 resize-none"
                  placeholder="Project description in English (optional)."
                />
              </label>
            </div>
          </section>

          {/* IMAGEM DE CAPA */}
          <section className="rounded-3xl border border-white/8 bg-[#181818] px-6 py-6 lg:px-8 lg:py-7">
            <h2 className="text-sm font-semibold tracking-[0.18em] text-white/60 uppercase mb-1">
              Imagem de Capa
            </h2>
            <p className="text-sm text-white/60 mb-6">
              Esta imagem aparece como destaque do projeto no site.
            </p>

            <ImageUploadSlot
              title="Capa do Projeto"
              description="Upload da imagem de capa"
              onUpload={handleImageUpload}
              isUploading={isUploading}
              currentImageUrl={form.imagem_url}
            />

            {form.imagem_url && (
              <p className="mt-3 text-xs text-white/50 break-all">
                URL atual: {form.imagem_url}
              </p>
            )}
          </section>

          {/* GALERIA */}
          <section className="rounded-3xl border border-white/8 bg-[#181818] px-6 py-6 lg:px-8 lg:py-7">
            <h2 className="text-sm font-semibold tracking-[0.18em] text-white/60 uppercase mb-1">
              Galeria
            </h2>
            <p className="text-sm text-white/60 mb-6">
              Adicione múltiplas imagens que compõem a galeria deste projeto.
            </p>

            <ImageUploadSlot
              title="Imagens"
              description="Arraste ou clique para enviar (você pode selecionar várias imagens)"
              onUpload={handleGalleryImageUpload}
              isUploading={isUploadingGallery}
              multiple={true}
            />

            {gallery.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {gallery.map((img, index) => (
                  <div
                    key={img.id || img.tempId || index}
                    className="relative rounded-xl overflow-hidden border border-white/10 bg-black/30"
                  >
                    <img
                      src={img.imagem_url}
                      alt={`Imagem ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-black/65 px-2 py-1 text-[10px] text-white/80 flex justify-between items-center">
                      <span>#{index + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* SIDEBAR */}
        <aside className="space-y-6">
          <section className="rounded-3xl border border-white/8 bg-[#181818] px-6 py-6 lg:px-7 lg:py-7">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold tracking-[0.18em] text-white/60 uppercase">
                Ações
              </h2>
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

        {/* Botões de Ação */}
        <div className="relative border-t border-white/8 px-6 py-6 lg:px-8 flex justify-end gap-3">
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