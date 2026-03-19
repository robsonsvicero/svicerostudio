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

// gera um id string local (poderia usar uuid, mas isso aqui já evita colisão)
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
  const [editingId, setEditingId] = useState(null); // sempre string do id normalizado vindo da API
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  // Galeria
  // - Novo projeto: só em memória (R2 + estado)
  // - Edição: carregada de projeto_galeria e novas imagens podem ser persistidas
  const [gallery, setGallery] = useState([]); // [{ id?, projeto_id?, imagem_url, ordem, legenda }]

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
  // Carregar galeria de um projeto (edição)
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
  // Upload de imagem da galeria (R2 + estado / opcionalmente banco em edição)
  // ---------------------------------------------------------------------------
  const handleGalleryImageUpload = useCallback(
    async (filesOrFile) => {
      if (!filesOrFile) return;

      const files = Array.isArray(filesOrFile) ? filesOrFile : [filesOrFile];
      if (files.length === 0) return;

      setIsUploadingGallery(true);

      try {
        const newImages = [];

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

          const payloadUpload = await resUpload.json();

          if (!resUpload.ok) {
            throw new Error(payloadUpload.error || 'Erro ao fazer upload da imagem da galeria');
          }

          let imageUrl = payloadUpload.data?.url;
          if (!imageUrl && payloadUpload.data?.path) {
            imageUrl = `${API_URL}/api/storage/public/projetos/${payloadUpload.data.path}`;
          }
          if (!imageUrl || imageUrl.trim() === '') {
            throw new Error('Backend retornou URL vazia para imagem da galeria');
          }

          const baseImage = {
            imagem_url: imageUrl,
            legenda: '',
          };

          // 2) Se estiver editando um projeto já existente, podemos opcionalmente persistir no banco agora
          if (editingId) {
            const ordem = gallery.length + newImages.length;

            const resInsert = await fetch(`${API_URL}/api/db/projeto_galeria/query`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                operation: 'insert',
                payload: {
                  projeto_id: editingId,
                  imagem_url: imageUrl,
                  ordem,
                  legenda: '',
                },
              }),
            });

            const insertPayload = await resInsert.json();

            if (!resInsert.ok) {
              if (resInsert.status === 401) signOut();
              throw new Error(insertPayload.error || 'Erro ao salvar imagem da galeria.');
            }

            const saved = insertPayload.data?.[0] || insertPayload.data || {};
            newImages.push({
              id: saved.id,
              projeto_id: editingId,
              imagem_url: imageUrl,
              ordem,
              legenda: '',
            });
          } else {
            // 3) Novo projeto: só em memória
            newImages.push({
              tempId: `${Date.now()}-${Math.random()}`,
              imagem_url: imageUrl,
              ordem: gallery.length + newImages.length,
              legenda: '',
            });
          }
        }

        setGallery((prev) => [...prev, ...newImages]);
        showToastMessage('Imagens da galeria enviadas com sucesso!', 'success');
      } catch (err) {
        showToastMessage(err.message, 'error');
      } finally {
        setIsUploadingGallery(false);
      }
    },
    [API_URL, token, showToastMessage, editingId, gallery.length, signOut],
  );

  // ---------------------------------------------------------------------------
  // Salvar projeto (insert/update + salvar galeria em novo projeto)
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

      if (!form.titulo || !form.slug || !form.descricao) {
        throw new Error('Preencha pelo menos título, slug e descrição curta.');
      }

      if (!editingId) {
        // --------------------------- INSERT ---------------------------
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

        const data = await res.json();

        if (!res.ok) {
          if (res.status === 401) signOut();
          throw new Error(data.error || 'Erro ao criar projeto.');
        }

        const created = Array.isArray(data.data) ? data.data[0] : data.data;
        const projetoId = created?.id;

        if (!projetoId) {
          throw new Error('API não retornou id do projeto criado.');
        }

        // Se tiver galeria em memória, salvar tudo agora
        if (gallery.length > 0) {
          const resGallery = await fetch(`${API_URL}/api/db/projeto_galeria/query`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              operation: 'insert',
              payload: gallery.map((img, idx) => ({
                projeto_id: projetoId,
                imagem_url: img.imagem_url,
                ordem: idx,
                legenda: img.legenda || '',
              })),
            }),
          });

          const gData = await resGallery.json();
          if (!resGallery.ok) {
            if (resGallery.status === 401) signOut();
            throw new Error(gData.error || 'Erro ao salvar galeria do projeto.');
          }
        }

        showToastMessage('Projeto criado com sucesso!', 'success');
      } else {
        // --------------------------- UPDATE ---------------------------
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

        const data = await res.json();

        if (!res.ok) {
          if (res.status === 401) signOut();
          throw new Error(data.error || 'Erro ao atualizar projeto.');
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
  // Editar / excluir projeto
  // ---------------------------------------------------------------------------
  const handleEditProject = async (proj) => {
    // proj.id já vem da API genérica
    setEditingId(proj.id);
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
      mostrar_home: typeof proj.mostrar_home === 'boolean' ? proj.mostrar_home : true,
    });

    await fetchGallery(proj.id);
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

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) signOut();
        throw new Error(data.error || 'Erro ao excluir projeto.');
      }

      // opcional: apagar galeria associada
      try {
        await fetch(`${API_URL}/api/db/projeto_galeria/query`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            operation: 'delete',
            filters: [{ column: 'projeto_id', operator: 'eq', value: id }],
          }),
        });
      } catch (inner) {
        console.warn('Falha ao excluir galeria do projeto:', inner.message);
      }

      showToastMessage('Projeto excluído com sucesso!', 'success');
      fetchProjects();
    } catch (err) {
      showToastMessage(err.message, 'error');
    }
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <AdminLayout
      title="Projetos"
      description="Gerencie os projetos exibidos no portfólio."
      primaryAction={
        <button
          onClick={() => {
            setForm(initialFormState);
            setEditingId(null);
            setGallery([]);
          }}
          className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white hover:bg-white/15"
        >
          <FaPlus className="h-3 w-3" />
          Novo Projeto
        </button>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2.3fr)_minmax(0,1.3fr)]">
          {/* Coluna esquerda -------------------------------------------------- */}
          <main className="space-y-6">
            {/* Cabeçalho do Formulário */}
            <section className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5 backdrop-blur lg:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">
                    Projeto
                  </p>
                  <h2 className="mt-2 font-[Manrope] text-2xl font-semibold text-white">
                    {editingId ? 'Editar Projeto' : 'Novo Projeto'}
                  </h2>
                  <p className="mt-1 text-sm text-white/60">
                    Preencha as informações abaixo para criar ou atualizar um projeto.
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/70">
                    {editingId ? 'Modo edição' : 'Modo criação'}
                  </div>
                </div>
              </div>
            </section>

            {/* Informações principais */}
            <section className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5 backdrop-blur lg:p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block md:col-span-2">
                  <span className="mb-2 block text-sm font-medium text-white/82">
                    Título do Projeto
                  </span>
                  <input
                    type="text"
                    name="titulo"
                    value={form.titulo}
                    onChange={handleFieldChange}
                    className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                    placeholder="Ex: Rebranding da Marca X"
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

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-white/82">
                    Categoria
                  </span>
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
                  <span className="mb-2 block text-sm font-medium text-white/82">
                    Data do Projeto
                  </span>
                  <input
                    type="text"
                    name="data_projeto"
                    value={form.data_projeto}
                    onChange={handleFieldChange}
                    className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                    placeholder="2024-01, 2024 ou outro formato que você usa"
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

              <div className="mt-6 space-y-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-white/82">
                    Descrição curta
                  </span>
                  <textarea
                    name="descricao"
                    value={form.descricao}
                    onChange={handleFieldChange}
                    rows={3}
                    className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                    placeholder="Resumo breve do projeto para cards e listagens."
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-white/82">
                    Descrição longa (PT)
                  </span>
                  <textarea
                    name="descricao_longa"
                    value={form.descricao_longa}
                    onChange={handleFieldChange}
                    rows={5}
                    className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                    placeholder="Detalhes do projeto em português."
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
                    rows={5}
                    className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                    placeholder="Project details in English."
                  />
                </label>
              </div>
            </section>

            {/* Galeria de Imagens */}
            <section className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5 backdrop-blur lg:p-6">
              <div className="mb-4 flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">
                    Galeria
                  </p>
                  <h2 className="mt-2 font-[Manrope] text-xl font-semibold text-white">
                    Imagens do Projeto
                  </h2>
                  <p className="mt-1 text-xs text-white/60">
                    Adicione múltiplas imagens para compor a galeria do projeto.
                  </p>
                </div>
              </div>

              <ImageUploadSlot
                title="Galeria do projeto"
                description="Arraste ou clique para enviar imagens (pode selecionar várias)"
                onUpload={handleGalleryImageUpload}
                isUploading={isUploadingGallery}
                multiple={true}
              />

              {/* Grid da galeria */}
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
                {gallery.length === 0 && (
                  <p className="text-xs text-white/50">
                    Nenhuma imagem adicionada à galeria ainda.
                  </p>
                )}
              </div>
            </section>
          </main>

          {/* Coluna direita --------------------------------------------------- */}
          <aside className="space-y-6">
            {/* Imagem de Capa */}
            <section className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5 backdrop-blur lg:p-6">
              <div className="mb-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">
                  Capa
                </p>
                <h2 className="mt-2 font-[Manrope] text-xl font-semibold text-white">
                  Imagem principal
                </h2>
                <p className="mt-1 text-xs text-white/60">
                  Esta imagem será usada como capa do projeto na listagem.
                </p>
              </div>

              <ImageUploadSlot
                title="Upload da imagem de capa"
                description="Arraste ou clique para enviar"
                onUpload={handleImageUpload}
                isUploading={isUploading}
                currentImageUrl={form.imagem_url}
              />
            </section>

            {/* Configurações de Destaque */}
            <section className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5 backdrop-blur lg:p-6">
              <div className="mb-6 flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">
                    Destaque
                  </p>
                  <h2 className="mt-2 font-[Manrope] text-xl font-semibold text-white">
                    Exibição
                  </h2>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-white/80">Mostrar na página inicial</span>
                <label className="inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    name="mostrar_home"
                    checked={form.mostrar_home}
                    onChange={handleFieldChange}
                    className="sr-only"
                  />
                  <span
                    className={`flex h-7 w-12 items-center rounded-full border border-[#B87333]/20 px-1 transition-all ${
                      form.mostrar_home ? 'bg-[#B87333]/50' : 'bg-white/5'
                    }`}
                  >
                    <span
                      className={`h-5 w-5 rounded-full bg-[#B87333] transition-all ${
                        form.mostrar_home ? 'ml-auto' : 'ml-0'
                      }`}
                    />
                  </span>
                </label>
              </div>
            </section>

            {/* Links e Botões */}
            <section className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5 backdrop-blur lg:p-6">
              <div className="mb-6">
                <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">
                  Links
                </p>
                <h2 className="mt-2 font-[Manrope] text-2xl font-semibold text-white">
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
        </div>

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