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
  const [editingId, setEditingId] = useState(null); // id vindo do backend (string)
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
      const newState = {
        ...prevForm,
        [name]: type === 'checkbox' ? checked : value,
      };
      if (name === 'titulo') {
        newState.slug = generateSlug(value);
      }
      return newState;
    });
  };

  const resetForm = () => {
    setForm(initialFormState);
    setEditingId(null);
    setGallery([]);
  };

  // ---------------------------------------------------------------------------
  // Upload da imagem de capa
  // ---------------------------------------------------------------------------
  const handleImageUpload = async (file) => {
    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'projetos');
      const ext = file.name.split('.').pop() || 'jpg';
      const key = `projetos/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      formData.append('key', key);

      const res = await fetch(`${API_URL}/api/storage/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao fazer upload da imagem de capa');
      }

      const imageUrl = data?.data?.url;
      if (!imageUrl) {
        throw new Error('Resposta inválida do servidor ao fazer upload da imagem de capa');
      }

      setForm((prev) => ({ ...prev, imagem_url: imageUrl }));
      showToastMessage('Imagem de capa atualizada com sucesso!', 'success');
    } catch (err) {
      console.error(err);
      showToastMessage(err.message || 'Erro ao fazer upload da imagem de capa', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Upload da galeria ("Jeito A")
  // ---------------------------------------------------------------------------
  const handleGalleryImageUpload = async (files) => {
    try {
      setIsUploadingGallery(true);

      const fileArray = Array.isArray(files) ? files : [files];

      for (const file of fileArray) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('bucket', 'projetos');
        const ext = file.name.split('.').pop() || 'jpg';
        const key = `projetos/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
        formData.append('key', key);

        const res = await fetch(`${API_URL}/api/storage/upload`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Erro ao fazer upload da imagem da galeria');
        }

        const imageUrl = data?.data?.url;
        if (!imageUrl) {
          throw new Error('Resposta inválida ao enviar imagem da galeria');
        }

        // Sempre adiciona ao estado da galeria
        setGallery((prev) => {
          const nextOrdem =
            prev.length > 0 ? Math.max(...prev.map((g) => g.ordem ?? 0)) + 1 : 0;
          return [
            ...prev,
            {
              imagem_url: imageUrl,
              ordem: nextOrdem,
            },
          ];
        });

        // Se já estamos editando um projeto (já existe no banco), podemos persistir de imediato
        if (editingId) {
          try {
            const imgRes = await fetch(`${API_URL}/api/db/projeto_galeria/query`, {
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
                  ordem: 0, // a ordem definitiva pode ser reordenada depois
                  legenda: '',
                },
              }),
            });

            const imgData = await imgRes.json();
            if (!imgRes.ok) {
              throw new Error(imgData.error || 'Erro ao salvar imagem da galeria no banco');
            }
          } catch (err) {
            console.error(err);
            showToastMessage(
              err.message || 'Erro ao salvar registro da galeria no banco',
              'error',
            );
          }
        }
      }

      showToastMessage('Imagens da galeria processadas com sucesso!', 'success');
    } catch (err) {
      console.error(err);
      showToastMessage(err.message || 'Erro ao processar imagens da galeria', 'error');
    } finally {
      setIsUploadingGallery(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Enviar formulário (criar / atualizar)
  // ---------------------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;

    // Valida campos obrigatórios (schema do Projeto)
    if (!form.titulo || !form.slug || !form.descricao) {
      showToastMessage(
        'Preencha pelo menos Título, Slug e Descrição antes de salvar.',
        'error',
      );
      return;
    }

    setIsSaving(true);

    try {
      if (!editingId) {
        // ----------------------------
        // INSERT (novo projeto)
        // ----------------------------
        const insertRes = await fetch(`${API_URL}/api/db/projetos/query`, {
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

        const insertData = await insertRes.json();

        if (!insertRes.ok) {
          throw new Error(insertData.error || `Erro ao criar projeto (status ${insertRes.status})`);
        }

        const createdArray = Array.isArray(insertData.data)
          ? insertData.data
          : [insertData.data];
        const created = createdArray[0];
        const newId = created?.id;

        if (!newId) {
          throw new Error('Projeto criado, mas resposta não contém id.');
        }

        // Persistir galeria (se houver imagens)
        if (gallery.length > 0) {
          const galleryPayload = gallery.map((img, idx) => ({
            projeto_id: newId,
            imagem_url: img.imagem_url,
            ordem: typeof img.ordem === 'number' ? img.ordem : idx,
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
            throw new Error(
              galData.error ||
                `Erro ao salvar galeria (status ${galRes.status})`,
            );
          }
        }

        showToastMessage('Projeto criado com sucesso!', 'success');
        resetForm();
        fetchProjects();
        navigate('/admin/projetos');
      } else {
        // ----------------------------
        // UPDATE (projeto existente)
        // ----------------------------
        const updateRes = await fetch(`${API_URL}/api/db/projetos/query`, {
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

        const updateData = await updateRes.json();

        if (!updateRes.ok) {
          throw new Error(updateData.error || `Erro ao atualizar projeto (status ${updateRes.status})`);
        }

        showToastMessage('Projeto atualizado com sucesso!', 'success');
        resetForm();
        fetchProjects();
      }
    } catch (err) {
      console.error(err);
      showToastMessage(err.message || 'Erro ao salvar projeto', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Editar / excluir
  // ---------------------------------------------------------------------------
  const handleEditProject = (proj) => {
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
    setEditingId(proj.id);
    fetchGallery(proj.id);
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
        throw new Error(data.error || 'Erro ao excluir projeto');
      }

      // Também removemos as imagens da galeria relacionadas
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
      } catch (err) {
        console.error('Erro ao excluir galeria do projeto', err);
      }

      showToastMessage('Projeto excluído com sucesso.', 'success');
      fetchProjects();
    } catch (err) {
      console.error(err);
      showToastMessage(err.message || 'Erro ao excluir projeto', 'error');
    }
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <AdminLayout title="Projetos">
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl bg-[#101010] border border-white/10 shadow-xl shadow-black/60 overflow-hidden"
      >
        {/* Header do formulário */}
        <div className="border-b border-white/8 px-6 py-5 lg:px-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">
              {editingId ? 'Editar Projeto' : 'Novo Projeto'}
            </h1>
            <p className="text-sm text-white/55 mt-1">
              Preencha os detalhes do projeto, capa e imagens da galeria antes de publicar.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/')}
            >
              Ver Site
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              disabled={isSaving || isUploading || isUploadingGallery}
            >
              Limpar
            </Button>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr,1.1fr] gap-0 lg:gap-6">
          {/* Coluna Esquerda */}
          <section className="border-b border-white/8 lg:border-b-0 lg:border-r border-white/8 px-6 py-6 lg:px-8 lg:py-8 flex flex-col gap-8">
            {/* Informações principais */}
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-white/82">
                    Título do Projeto *
                  </span>
                  <input
                    type="text"
                    name="titulo"
                    value={form.titulo}
                    onChange={handleFieldChange}
                    className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                    placeholder="Ex: Landing page para agência criativa"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-white/82">
                    Slug *
                  </span>
                  <input
                    type="text"
                    name="slug"
                    value={form.slug}
                    onChange={handleFieldChange}
                    className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                    placeholder="exemplo-de-projeto"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
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
                    <option value="">Selecione...</option>
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
                    type="text"
                    name="data_projeto"
                    value={form.data_projeto}
                    onChange={handleFieldChange}
                    className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                    placeholder="Mar/2024"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
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

                <label className="flex items-center gap-3 mt-7">
                  <input
                    type="checkbox"
                    name="mostrar_home"
                    checked={form.mostrar_home}
                    onChange={handleFieldChange}
                    className="h-4 w-4 rounded border-white/30 bg-transparent text-[#B87333] focus:ring-[#B87333]"
                  />
                  <span className="text-sm text-white/80">Exibir na Home</span>
                </label>
              </div>
            </div>

            {/* Descrição */}
            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-white/82">
                  Descrição curta *
                </span>
                <textarea
                  name="descricao"
                  value={form.descricao}
                  onChange={handleFieldChange}
                  rows={3}
                  className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                  placeholder="Resumo do projeto para cards e destaques."
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-white/82">
                  Descrição longa
                </span>
                <textarea
                  name="descricao_longa"
                  value={form.descricao_longa}
                  onChange={handleFieldChange}
                  rows={5}
                  className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                  placeholder="Detalhes do projeto para a página interna."
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
                  className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                  placeholder="Versão em inglês da descrição longa."
                />
              </label>
            </div>

            {/* Links */}
            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-white/82">
                  URL do site / projeto
                </span>
                <input
                  type="text"
                  name="site_url"
                  value={form.site_url}
                  onChange={handleFieldChange}
                  className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                  placeholder="https://..."
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-white/82">
                    Primeiro Link
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
                    Texto do Primeiro Botão
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
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
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
            </div>
          </section>

          {/* Coluna Direita */}
          <aside className="px-6 py-6 lg:px-8 lg:py-8 flex flex-col gap-8 bg-[#0b0b0b]/80">
            {/* Capa do Projeto */}
            <section className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold tracking-wide text-white/80 uppercase">
                  Capa do Projeto
                </h2>
              </div>
              <ImageUploadSlot
                label="Imagem de capa"
                helperText="Recomendado: 1600x900px"
                onUpload={handleImageUpload}
                isUploading={isUploading}
                currentImageUrl={form.imagem_url}
              />
            </section>

            {/* Galeria */}
            <section className="space-y-4">
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
                Envie múltiplas imagens para compor a galeria do projeto. Você pode organizar a
                ordem depois.
              </p>

              <ImageUploadSlot
                label="Imagens da galeria"
                helperText="Arraste ou selecione múltiplas imagens"
                onUpload={handleGalleryImageUpload}
                isUploading={isUploadingGallery}
                multiple={true}
              />

              {/* Grid da galeria */}
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