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
    _id: '',                 // *** vamos controlar o id localmente
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
  const [editingId, setEditingId] = useState(null); // sempre string do _id
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  // Galeria (tabela projeto_galeria)
  const [gallery, setGallery] = useState([]); // [{ id, projeto_id, imagem_url, ordem, legenda }]

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
  // Carregar galeria de um projeto
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

        setGallery(payload.data || []);
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
        // se ainda não temos _id na criação, regeneramos um id local mais amigável
        if (!prevForm._id || prevForm._id.startsWith('projeto-')) {
          newState._id = generateLocalId(value);
        }
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
  // Upload de imagem da galeria (R2 + projeto_galeria)
  // ---------------------------------------------------------------------------
  const handleGalleryImageUpload = useCallback(
    async (filesOrFile) => {
      if (!filesOrFile) return;

      // *** agora SEM exigência de "salvar antes":
      // se não temos editingId, geramos aqui um id local
      let projetoId = editingId;
      if (!projetoId) {
        const newId = form._id && form._id.trim() ? form._id : generateLocalId(form.titulo);
        setEditingId(newId);
        setForm((prev) => ({ ...prev, _id: newId }));
        projetoId = newId;
      }

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

          // 2) Inserir na tabela projeto_galeria
          const ordem =
            gallery.length + newImages.length; // adiciona em sequência depois das já existentes

          const resInsert = await fetch(`${API_URL}/api/db/projeto_galeria/query`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              operation: 'insert',
              payload: {
                projeto_id: projetoId,
                imagem_url: imageUrl,
                ordem,
                legenda: '',
              },
            }),
          });

          const insertPayload = await resInsert.json();
          if (!resInsert.ok) {
            throw new Error(insertPayload.error || 'Erro ao salvar imagem da galeria no banco.');
          }

          const inserted = Array.isArray(insertPayload.data)
            ? insertPayload.data[0]
            : insertPayload.data;

          newImages.push(inserted);
        }

        setGallery((prev) => [...prev, ...newImages]);

        showToastMessage(
          newImages.length > 1
            ? `${newImages.length} imagens da galeria enviadas com sucesso!`
            : 'Imagem da galeria enviada com sucesso!',
          'success'
        );
      } catch (err) {
        showToastMessage(err.message, 'error');
      } finally {
        setIsUploadingGallery(false);
      }
    },
    [API_URL, token, gallery.length, editingId, form._id, form.titulo, showToastMessage]
  );

  // ---------------------------------------------------------------------------
  // Remover imagem da galeria
  // ---------------------------------------------------------------------------
  const handleRemoveGalleryImage = useCallback(
    async (imageId) => {
      try {
        await fetch(`${API_URL}/api/db/projeto_galeria/query`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            operation: 'delete',
            filters: [{ column: 'id', operator: 'eq', value: imageId }],
          }),
        });
      } catch (err) {
        console.error(err);
      } finally {
        setGallery((prev) => prev.filter((img) => img.id !== imageId));
      }
    },
    [API_URL, token]
  );

  // ---------------------------------------------------------------------------
  // Editar projeto
  // ---------------------------------------------------------------------------
  const handleEditProject = useCallback(
    async (proj) => {
      // proj.id é o id normalizado pelo backend
      setEditingId(proj.id);
      setForm({
        _id: proj.id,
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
    },
    [fetchGallery]
  );

  // ---------------------------------------------------------------------------
  // Cancelar edição
  // ---------------------------------------------------------------------------
  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(initialFormState);
    setGallery([]);
  };

  // ---------------------------------------------------------------------------
  // Salvar projeto (insert / update)
  // ---------------------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // garante que temos um id para o projeto
      let projetoId = editingId || form._id;
      if (!projetoId) {
        projetoId = generateLocalId(form.titulo);
        setEditingId(projetoId);
      }

      // monta payload do projeto
      const projectPayload = {
        _id: projetoId, // *** string
        titulo: form.titulo,
        slug: form.slug || generateSlug(form.titulo),
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

      const operation = editingId ? 'update' : 'insert';

      const body = {
        operation,
        payload: operation === 'insert' ? projectPayload : { $set: projectPayload },
        ...(operation === 'update'
          ? {
              filters: [{ column: 'id', operator: 'eq', value: projetoId }],
              single: true,
            }
          : {}),
      };

      const res = await fetch(`${API_URL}/api/db/projetos/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Erro ao salvar projeto (status ${res.status})`);
      }

      if (!editingId) {
        // inserção bem-sucedida
        setEditingId(projetoId);
      }

      showToastMessage('Projeto salvo com sucesso!', 'success');
      await fetchProjects();
    } catch (err) {
      showToastMessage(err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Excluir projeto
  // ---------------------------------------------------------------------------
  const handleDeleteProject = useCallback(
    async (id) => {
      if (!window.confirm('Tem certeza que deseja excluir este projeto?')) return;
      try {
        const res = await fetch(`${API_URL}/api/projetos/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || `Erro ao excluir projeto (status ${res.status})`);
        }

        showToastMessage('Projeto excluído com sucesso!', 'success');
        setProjects((prev) => prev.filter((p) => p.id !== id));

        if (editingId === id) {
          handleCancelEdit();
        }
      } catch (err) {
        showToastMessage(err.message, 'error');
      }
    },
    [API_URL, token, editingId, showToastMessage]
  );

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <AdminLayout title="Projetos">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">
            Administração
          </p>
          <h1 className="mt-2 font-[Manrope] text-3xl font-semibold text-white">
            Projetos
          </h1>
          <p className="mt-1 text-sm text-white/60">
            Crie, edite e organize os projetos do seu portfólio.
          </p>
        </div>
        <Button
          onClick={handleCancelEdit}
          className="inline-flex items-center gap-2"
        >
          <FaPlus className="h-4 w-4" />
          Novo Projeto
        </Button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-[32px] border border-white/10 bg-gradient-to-br from-[#0A0A0A] via-[#090909] to-[#10141B] shadow-xl shadow-black/40"
      >
        <div className="grid gap-6 border-b border-white/8 px-4 py-5 md:grid-cols-12 md:px-6 lg:px-8">
          {/* Coluna esquerda */}
          <div className="md:col-span-8 space-y-6">
            {/* Dados principais */}
            <section className="rounded-[28px] border border-white/8 bg-[#0F1012]/80 p-5 lg:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">
                    Informações principais
                  </p>
                  <h2 className="mt-2 font-[Manrope] text-2xl font-semibold text-white">
                    {editingId ? 'Editar Projeto' : 'Novo Projeto'}
                  </h2>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <label className="md:col-span-2 block">
                  <span className="mb-2 block text-sm font-medium text-white/82">
                    Título
                  </span>
                  <input
                    type="text"
                    name="titulo"
                    value={form.titulo}
                    onChange={handleFieldChange}
                    className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                    placeholder="Nome do projeto"
                    required
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
                    Data do Projeto
                  </span>
                  <input
                    type="date"
                    name="data_projeto"
                    value={form.data_projeto}
                    onChange={handleFieldChange}
                    className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white outline-none transition focus:border-[#B87333]/40"
                  />
                </label>

                <label className="block">
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
                    className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                    placeholder="Resumo do projeto"
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
                    rows={6}
                    className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                    placeholder="Detalhes do projeto em português"
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
                    rows={6}
                    className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                    placeholder="Project details in English"
                  />
                </label>
              </div>
            </section>

            {/* Imagem de capa */}
            <section className="rounded-[28px] border border-white/8 bg-[#0F1012]/80 p-5 lg:p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">
                    Imagem de Capa
                  </p>
                  <h2 className="mt-2 font-[Manrope] text-xl font-semibold text-white">
                    Capa do Projeto
                  </h2>
                </div>
              </div>

              <ImageUploadSlot
                title="Upload da imagem de capa"
                description="Arraste ou clique para enviar a capa"
                onUpload={handleImageUpload}
                isUploading={isUploading}
                currentImageUrl={form.imagem_url}
              />

              {form.imagem_url && (
                <p className="mt-2 text-xs text-white/50 break-all">
                  URL atual: {form.imagem_url}
                </p>
              )}
            </section>

            {/* Galeria */}
            <section className="rounded-[28px] border border-white/8 bg-[#0F1012]/80 p-5 lg:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">
                    Galeria
                  </p>
                  <h2 className="mt-2 font-[Manrope] text-xl font-semibold text-white">
                    Imagens do Projeto
                  </h2>
                </div>
              </div>

              <ImageUploadSlot
                title="Adicionar à galeria"
                description="Arraste ou clique para enviar (pode selecionar várias imagens)"
                onUpload={handleGalleryImageUpload}
                isUploading={isUploadingGallery}
                multiple={true}
              />

              {gallery.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {gallery.map((img) => (
                    <div
                      key={img.id}
                      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#141414]"
                    >
                      <img
                        src={img.imagem_url}
                        alt={img.legenda || 'Imagem da galeria'}
                        className="h-32 w-full object-cover transition duration-200 group-hover:scale-[1.02] group-hover:brightness-110"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(img.id)}
                        className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-xs text-white opacity-0 shadow-md transition group-hover:opacity-100"
                        title="Remover imagem"
                      >
                        <FaTrash className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {gallery.length === 0 && (
                <p className="mt-3 text-sm text-white/45">
                  Nenhuma imagem na galeria ainda. As imagens são vinculadas ao projeto
                  assim que o upload é concluído.
                </p>
              )}
            </section>
          </div>

          {/* Coluna direita */}
          <aside className="space-y-6 md:col-span-4">
            {/* Configurações */}
            <section className="rounded-[28px] border border-white/8 bg-[#2F353B]/30 p-5 shadow-lg shadow-black/20">
              <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">
                Configurações
              </p>
              <div className="mt-5 grid gap-3">
                <label className="flex items-center justify-between rounded-2xl border border-white/8 bg-[#141414]/55 px-4 py-4">
                  <span className="text-sm text-white/82">Mostrar na Home?</span>
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