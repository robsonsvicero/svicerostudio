import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import Button from '../../components/UI/Button.jsx';
import { API_URL } from '../../lib/api.js';
import ImageUploadSlot from '../../components/UI/ImageUploadSlot.jsx';
import AdminLayout from '../../components/Admin/AdminLayout.jsx';
import { useToast } from '../../hooks/useToast.js';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const AdminProjetos = () => {
  const navigate = useNavigate();
  const { token, signOut } = useAuth();
  const { showToast, toastMessage, toastType, showToastMessage, hideToast } = useToast();

  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploadError, setUploadError] = useState('');

  const initialFormState = {
    titulo: '',
    slug: '',
    categoria: '',
    cliente: '',
    data_projeto: '',
    status: 'published',
    descricao: '',
    descricao_longa: '',
    descricao_longa_en: '',
    imagem_url: '',
    mostrar_home: false,
    permitir_navegacao: true,
    link: '',
    button_text: 'Ver Projeto',
    site_url: '',
    link2: '',
    button_text2: '',
  };

  const [form, setForm] = useState(initialFormState);
  const [gallery, setGallery] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(null);

  const slugify = (text) =>
    text
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');

  const handleFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setForm((prev) => {
      const updated = { ...prev, [name]: newValue };
      if (name === 'titulo') {
        updated.slug = slugify(value);
      }
      return updated;
    });
  };

  const handleSingleImageUpload = useCallback(
    async (file, fieldName) => {
      if (!file) {
        setForm((prev) => ({ ...prev, [fieldName]: '' }));
        return;
      }

      if (!token) {
        signOut();
        navigate('/login');
        return;
      }

      setUploadError('');
      setIsUploading(true);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'projetos');
      formData.append('key', `${Date.now()}_${file.name}`);

      try {
        const res = await fetch(`${API_URL}/api/storage/upload`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        const payload = await res.json();

        if (!res.ok) {
          if (res.status === 401) {
            signOut();
            navigate('/login');
            return;
          }
          setUploadError(`Erro no upload (${res.status}): ${payload.error || 'tente novamente'}`);
          return;
        }

        if (payload.data?.url || payload.data?.path) {
          const imageUrl = payload.data.url || `${API_URL}/api/storage/public/projetos/${payload.data.path}`;
          setForm((prev) => ({ ...prev, [fieldName]: imageUrl }));
          showToastMessage('Imagem de capa enviada com sucesso!', 'success');
        } else {
          setUploadError('Upload concluído mas URL não retornada pelo servidor.');
        }
      } catch (err) {
        setUploadError(`Falha no upload: ${err.message}`);
      } finally {
        setIsUploading(false);
      }
    },
    [token, signOut, navigate, showToastMessage],
  );

  const handleGalleryUpload = useCallback(
    async (files) => {
      if (!token) {
        signOut();
        navigate('/login');
        return;
      }

      setUploadError('');
      setIsUploading(true);
      const uploadedUrls = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('bucket', 'projetos');
        formData.append('key', `${Date.now()}_${file.name}`);

        try {
          const res = await fetch(`${API_URL}/api/storage/upload`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          });
          const payload = await res.json();

          if (!res.ok) {
            setUploadError(`Erro no upload de "${file.name}": ${payload.error || res.status}`);
            continue;
          }

          if (payload.data?.url || payload.data?.path) {
            const imageUrl = payload.data.url || `${API_URL}/api/storage/public/projetos/${payload.data.path}`;
            uploadedUrls.push({ url: imageUrl });
          }
        } catch (err) {
          setUploadError(`Falha no upload de "${file.name}": ${err.message}`);
        }
      }

      setGallery((prev) => [...prev, ...uploadedUrls]);
      setIsUploading(false);
      if (uploadedUrls.length > 0) {
        showToastMessage(`${uploadedUrls.length} imagem(ns) adicionada(s) à galeria!`, 'success');
      }
    },
    [token, signOut, navigate, showToastMessage],
  );

  const handleRemoveFromGallery = (indexToRemove) => {
    setGallery((prev) => prev.filter((_, index) => index !== indexToRemove));
    showToastMessage('Imagem removida da galeria.', 'info');
  };

  const fetchProjects = useCallback(async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/db/projetos/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          operation: 'select',
          orderBy: { column: 'data_projeto', ascending: false },
        }),
      });
      const payload = await res.json();
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          signOut();
          navigate('/login');
          return;
        }
        throw new Error(payload.error || 'Erro ao buscar projetos');
      }
      setProjects(payload.data || []);
    } catch (err) {
      setError(err.message || 'Erro ao buscar projetos');
      showToastMessage(err.message || 'Erro ao buscar projetos', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [token, navigate, signOut, showToastMessage]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUploadError('');

    if (!token) {
      signOut();
      navigate('/login');
      return;
    }

    // Validação frontend
    const validationErrors = [];
    if (!form.titulo?.trim()) validationErrors.push('Título é obrigatório.');
    if (!form.descricao?.trim()) validationErrors.push('Resumo curto é obrigatório.');
    if (!form.imagem_url?.trim()) validationErrors.push('Faça o upload da imagem de capa antes de salvar.');

    if (validationErrors.length > 0) {
      setError(validationErrors.join(' '));
      showToastMessage(validationErrors.join(' '), 'error');
      return;
    }

    setSubmitting(true);

    // --- CORREÇÃO AQUI: MUDAR 'const' PARA 'let' ---
    let formPayload = { ...form };
    // --- FIM DA CORREÇÃO ---

    const op = editing ? 'update' : 'insert';
    const filters = editing ? [{ column: 'id', operator: 'eq', value: editing }] : [];

    // Garante que o slug seja gerado se o título existir e o slug estiver vazio (para casos de projetos antigos sem slug)
    // ou se o título foi alterado e o slug precisa ser atualizado.
    if (formPayload.titulo && (!formPayload.slug || (editing && formPayload.titulo !== projects.find(p => p.id === editing)?.titulo))) {
        formPayload.slug = slugify(formPayload.titulo);
    }

    // Remove id e _id do payload se for atualização para evitar problemas com o DB
    if (editing) {
        // Não precisamos mais de payloadForUpdate, podemos modificar formPayload diretamente
        delete formPayload.id;
        delete formPayload._id; // Se o seu DB usa _id como PK, remova também
        delete formPayload.created_at;
        delete formPayload.updated_at;
    }

    if (!editing) {
      formPayload._id = formPayload.slug.trim();
    }

    if (!formPayload.link?.trim()) {
      formPayload.link = formPayload.slug.trim();
    }

    try {
      const res = await fetch(`${API_URL}/api/db/projetos/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ operation: op, filters, payload: formPayload }),
      });
      const resData = await res.json();

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          signOut();
          navigate('/login');
          return;
        }
        throw new Error(resData.error || 'Erro ao salvar projeto');
      }

      const projetoId = editing || (resData.data && resData.data[0]?.id);
      if (!projetoId) throw new Error('Não foi possível obter o ID do projeto.');

      // Sincroniza galeria
      await fetch(`${API_URL}/api/db/projeto_galeria/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          operation: 'delete',
          filters: [{ column: 'projeto_id', operator: 'eq', value: projetoId }],
        }),
      });

      for (const [index, img] of gallery.entries()) {
        await fetch(`${API_URL}/api/db/projeto_galeria/query`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            operation: 'insert',
            payload: {
              projeto_id: projetoId,
              imagem_url: img.url || img.imagem_url,
              ordem: index,
            },
          }),
        });
      }

      showToastMessage(`Projeto ${editing ? 'atualizado' : 'publicado'} com sucesso!`, 'success');
      setForm(initialFormState);
      setGallery([]);
      setEditing(null);
      await fetchProjects();
    } catch (err) {
      setError(err.message);
      showToastMessage(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditProject = useCallback(
    async (proj) => {
      setEditing(proj.id);
      setError('');
      setUploadError('');
      setForm({ ...initialFormState, ...proj });

      try {
        const res = await fetch(`${API_URL}/api/db/projeto_galeria/query`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            operation: 'select',
            filters: [{ column: 'projeto_id', operator: 'eq', value: proj.id }],
            orderBy: { column: 'ordem', ascending: true },
          }),
        });
        const galleryData = await res.json();
        if (res.ok && Array.isArray(galleryData.data)) {
          const normalized = galleryData.data.map((img) => ({
            ...img,
            url: img.url || img.imagem_url,
          }));
          setGallery(normalized);
        } else {
          setGallery([]);
        }
      } catch {
        setGallery([]);
      }

      window.scrollTo(0, 0);
    },
    [token],
  );

  const handleDeleteProject = async (projectId) => {
    if (!token) {
      signOut();
      navigate('/login');
      return;
    }
    if (window.confirm('Tem certeza? Esta ação removerá o projeto e sua galeria.')) {
      try {
        await fetch(`${API_URL}/api/db/projeto_galeria/query`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            operation: 'delete',
            filters: [{ column: 'projeto_id', operator: 'eq', value: projectId }],
          }),
        });
        await fetch(`${API_URL}/api/db/projetos/query`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            operation: 'delete',
            filters: [{ column: 'id', operator: 'eq', value: projectId }],
          }),
        });
        showToastMessage('Projeto excluído com sucesso.', 'success');
        await fetchProjects();
      } catch (err) {
        setError(err.message);
        showToastMessage(err.message, 'error');
      }
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const reorderedGallery = Array.from(gallery);
    const [removed] = reorderedGallery.splice(result.source.index, 1);
    reorderedGallery.splice(result.destination.index, 0, removed);

    setGallery(reorderedGallery);
  };

  const fields = [
    {
      name: 'titulo',
      label: 'Título do projeto',
      placeholder: 'Ex: Plataforma de investimento institucional',
      type: 'text',
      required: true,
      col: 'lg:col-span-2',
    },
    {
      name: 'slug',
      label: 'Slug (gerado automaticamente)',
      placeholder: 'plataforma-de-investimento-institucional',
      type: 'text',
      required: true,
      col: 'lg:col-span-1',
    },
    {
      name: 'categoria',
      label: 'Categoria',
      placeholder: 'Selecione uma categoria',
      type: 'select',
      required: true,
      options: ['UI/UX Design', 'Web Development', 'Branding'],
      col: 'lg:col-span-1',
    },
    {
      name: 'cliente',
      label: 'Cliente',
      placeholder: 'Nome do cliente ou marca',
      type: 'text',
      required: false,
      col: 'lg:col-span-1',
    },
    {
      name: 'data_projeto',
      label: 'Data do projeto',
      placeholder: 'YYYY-MM-DD',
      type: 'date',
      required: false,
      col: 'lg:col-span-1',
    },
    {
      name: 'status',
      label: 'Status',
      placeholder: 'Publicado',
      type: 'select',
      required: true,
      options: ['published', 'draft', 'archived'],
      col: 'lg:col-span-1',
    },
  ];

  return (
    <AdminLayout
      toastProps={{
        show: showToast,
        message: toastMessage,
        type: toastType,
        onClose: hideToast
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="relative overflow-hidden rounded-[32px] border border-white/8 bg-[#181818] shadow-2xl shadow-black/30"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(184,115,51,0.14),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(95,178,216,0.10),_transparent_22%)]" />

        {/* Header */}
        <div className="relative border-b border-white/8 px-6 py-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center rounded-full border border-[#B87333]/25 bg-[#B87333]/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-[#E9BF84]">
                {editing ? 'Edição de Projeto' : 'Cadastro de Projeto'}
              </div>
              <h1 className="mt-4 font-[Manrope] text-3xl font-semibold tracking-[-0.04em] text-white lg:text-5xl">
                {editing
                  ? 'Refinando detalhes com precisão'
                  : 'Novo projeto com menos ruído, mais direção.'}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60 lg:text-base">
                Preencha os campos obrigatórios e faça o upload da imagem de capa antes de salvar.
              </p>
            </div>
            {/* Botões removidos daqui e movidos para o rodapé */}
          </div>

          {error && (
            <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}
          {uploadError && (
            <div className="mt-3 rounded-2xl border border-orange-500/30 bg-orange-500/10 px-4 py-3 text-sm text-orange-400">
              ⚠️ {uploadError}
            </div>
          )}
        </div>

        <div className="relative grid gap-6 px-6 py-6 lg:grid-cols-12 lg:px-8 lg:py-8">
          <div className="space-y-6 lg:col-span-8">

            {/* Informações principais */}
            <section className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5 backdrop-blur lg:p-6">
              <div className="mb-6">
                <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">Base do projeto</p>
                <h2 className="mt-2 font-[Manrope] text-2xl font-semibold text-white">
                  Informações principais
                </h2>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                {fields.map((field) => (
                  <label key={field.name} className={`${field.col} block`}>
                    <span className="mb-2 block text-sm font-medium text-white/82">
                      {field.label}
                      {field.required && <span className="ml-1 text-[#E9BF84]">*</span>}
                    </span>
                    {field.type === 'select' ? (
                      <select
                        name={field.name}
                        value={form[field.name]}
                        onChange={handleFieldChange}
                        className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white outline-none transition focus:border-[#B87333]/40"
                      >
                        <option value="" disabled>{field.placeholder}</option>
                        {field.options.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <>
                        <input
                          type={field.type}
                          name={field.name}
                          value={form[field.name] || ''}
                          onChange={handleFieldChange}
                          placeholder={field.placeholder}
                          readOnly={field.name === 'slug'}
                          className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40 read-only:opacity-60 read-only:cursor-not-allowed"
                        />
                        {field.name === 'slug' && (
                          <p className="mt-1.5 text-xs text-white/40">
                            O slug é gerado automaticamente a partir do título.
                          </p>
                        )}
                      </>
                    )}
                  </label>
                ))}
              </div>
            </section>

            {/* Descrição */}
            <section className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5 backdrop-blur lg:p-6">
              <div className="mb-6">
                <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">Narrativa</p>
                <h2 className="mt-2 font-[Manrope] text-2xl font-semibold text-white">
                  Descrição e contexto
                </h2>
              </div>
              <div className="grid gap-4">
                <label>
                  <span className="mb-2 block text-sm font-medium text-white/82">
                    Resumo curto (para cards) <span className="text-[#E9BF84]">*</span>
                  </span>
                  <textarea
                    name="descricao"
                    value={form.descricao}
                    onChange={handleFieldChange}
                    placeholder="Uma síntese elegante do projeto para listagens e destaques."
                    rows={3}
                    className="w-full resize-none rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-4 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                  />
                </label>
                <label>
                  <span className="mb-2 block text-sm font-medium text-white/82">
                    Descrição em Português (PT-BR)
                  </span>
                  <textarea
                    name="descricao_longa"
                    value={form.descricao_longa}
                    onChange={handleFieldChange}
                    placeholder="Descreva o contexto, desafio, solução e resultado do projeto em Português-BR."
                    rows={6}
                    className="w-full resize-none rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-4 text-sm leading-6 text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                  />
                </label>
                <label>
                  <span className="mb-2 block text-sm font-medium text-white/82">
                    Descrição em Inglês
                  </span>
                  <textarea
                    name="descricao_longa_en"
                    value={form.descricao_longa_en}
                    onChange={handleFieldChange}
                    placeholder="Describe the project's context, challenge, solution, and outcome in English."
                    rows={8}
                    className="w-full resize-none rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-4 text-sm leading-6 text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                  />
                </label>
              </div>
            </section>

            {/* Links */}
            <section className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5 backdrop-blur lg:p-6">
              <div className="mb-6">
                <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">Links</p>
                <h2 className="mt-2 font-[Manrope] text-2xl font-semibold text-white">
                  Ações e referências
                </h2>
                <p className="mt-1 text-sm text-white/40">
                  Se o link principal for deixado em branco, o slug será usado automaticamente.
                </p>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                <label className="block lg:col-span-2">
                  <span className="mb-2 block text-sm font-medium text-white/82">
                    Link principal
                  </span>
                  <input
                    type="text"
                    name="link"
                    value={form.link}
                    onChange={handleFieldChange}
                    placeholder="Ex: /projetos/meu-projeto ou https://behance.net/..."
                    className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
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
                    placeholder="Ver Projeto"
                    className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-white/82">URL do site</span>
                  <input
                    type="text"
                    name="site_url"
                    value={form.site_url}
                    onChange={handleFieldChange}
                    placeholder="https://www.cliente.com.br"
                    className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-white/82">
                    Link secundário
                  </span>
                  <input
                    type="text"
                    name="link2"
                    value={form.link2}
                    onChange={handleFieldChange}
                    placeholder="URL ou rota secundária (opcional)"
                    className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-white/82">
                    Texto do botão secundário
                  </span>
                  <input
                    type="text"
                    name="button_text2"
                    value={form.button_text2}
                    onChange={handleFieldChange}
                    placeholder="Ver Case, GitHub, etc."
                    className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                  />
                </label>
              </div>
            </section>

            {/* Mídia */}
            <section className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5 backdrop-blur lg:p-6">
              <div className="mb-6">
                <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">Mídia</p>
                <h2 className="mt-2 font-[Manrope] text-2xl font-semibold text-white">
                  Galeria visual
                </h2>
              </div>

              {/* Indicador de status da imagem de capa */}
              {form.imagem_url ? (
                <div className="mb-4 rounded-2xl border border-green-500/20 bg-green-900/10 px-4 py-2 text-sm text-green-400">
                  ✓ Imagem de capa carregada com sucesso.
                </div>
              ) : (
                <div className="mb-4 rounded-2xl border border-orange-500/20 bg-orange-900/10 px-4 py-2 text-sm text-orange-400">
                  ⚠️ Imagem de capa obrigatória — faça o upload antes de salvar.
                </div>
              )}

              <div className="grid gap-4">
                <ImageUploadSlot
                  title="Imagem de capa"
                  description="Arraste ou clique para enviar"
                  currentImageUrl={form.imagem_url}
                  onUpload={(file) => handleSingleImageUpload(file, 'imagem_url')}
                  isUploading={isUploading}
                />
              </div>

              <div className="mt-6 rounded-[24px] border border-white/8 bg-[#141414]/45 p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h3 className="font-[Manrope] text-xl font-semibold text-white">
                      Imagens de Destaque da Galeria
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-white/55">
                      Arraste e solte para reordenar. Arraste ou clique para adicionar múltiplas imagens.
                    </p>
                  </div>
                  <label className="cursor-pointer rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white/80 transition hover:bg-white/8">
                    {isUploading ? 'Enviando...' : 'Adicionar Imagens'}
                    <input
                      type="file"
                      multiple
                      className="sr-only"
                      accept="image/*"
                      disabled={isUploading}
                      onChange={(e) => handleGalleryUpload(Array.from(e.target.files))}
                    />
                  </label>
                </div>
                {gallery.length > 0 && (
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="gallery">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="mt-5 grid gap-3 md:grid-cols-3 xl:grid-cols-4"
                        >
                          {gallery.map((img, index) => (
                            <Draggable key={img.url || img.imagem_url} draggableId={img.url || img.imagem_url} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="group relative aspect-square"
                                >
                                  <img
                                    src={img.url || img.imagem_url}
                                    alt={`Galeria ${index + 1}`}
                                    className="h-full w-full rounded-xl object-cover"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveFromGallery(index)}
                                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600/80 text-white shadow-lg opacity-0 transition-opacity group-hover:opacity-100"
                                    aria-label="Remover imagem"
                                  >
                                    &#x2715;
                                  </button>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                )}
              </div>
            </section>

            {/* Configurações */}
            <section className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5 backdrop-blur lg:p-6">
              <div className="mb-6">
                <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">Configurações</p>
                <h2 className="mt-2 font-[Manrope] text-2xl font-semibold text-white">
                  Exibição e comportamento
                </h2>
              </div>
              <div className="grid gap-3">
                <label className="flex items-center justify-between rounded-2xl border border-white/8 bg-[#141414]/55 px-4 py-4">
                  <span className="text-sm text-white/82">Mostrar no portfólio (público)</span>
                  <input
                    type="checkbox"
                    name="status"
                    checked={form.status === 'published'}
                    onChange={(e) =>
                      handleFieldChange({
                        target: {
                          name: 'status',
                          value: e.target.checked ? 'published' : 'draft',
                        },
                      })
                    }
                    className="sr-only"
                  />
                  <span
                    className={`flex h-7 w-12 items-center rounded-full border border-[#B87333]/20 px-1 transition-colors ${form.status === 'published' ? 'bg-[#B87333]/50' : 'bg-white/5'}`}
                  >
                    <span
                      className={`h-5 w-5 rounded-full bg-[#B87333] transition-all ${form.status === 'published' ? 'ml-auto' : 'ml-0'}`}
                    />
                  </span>
                </label>
                <label className="flex items-center justify-between rounded-2xl border border-white/8 bg-[#141414]/55 px-4 py-4">
                  <span className="text-sm text-white/82">Destacar na home</span>
                  <input
                    type="checkbox"
                    name="mostrar_home"
                    checked={form.mostrar_home}
                    onChange={handleFieldChange}
                    className="sr-only"
                  />
                  <span
                    className={`flex h-7 w-12 items-center rounded-full border border-[#B87333]/20 px-1 transition-colors ${form.mostrar_home ? 'bg-[#B87333]/50' : 'bg-white/5'}`}
                  >
                    <span
                      className={`h-5 w-5 rounded-full bg-[#B87333] transition-all ${form.mostrar_home ? 'ml-auto' : 'ml-0'}`}
                    />
                  </span>
                </label>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:col-span-4">
            <section className="rounded-[28px] border border-white/8 bg-[#2F353B]/30 p-5 shadow-lg shadow-black/20">
              <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">
                Status do cadastro
              </p>
              <div className="mt-5 space-y-3">
                <div className="rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/35">Status Atual</p>
                  <p className="mt-2 text-sm font-medium capitalize text-white/88">
                    {form.status}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/35">ID / Slug</p>
                  <p className="mt-2 break-all text-sm font-medium text-white/88">
                    {form.slug || (
                      <span className="italic text-white/30">não definido</span>
                    )}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/35">Imagem de capa</p>
                  <p className={`mt-2 text-sm font-medium ${form.imagem_url ? 'text-green-400' : 'text-orange-400'}`}>
                    {form.imagem_url ? '✓ Carregada' : '⚠️ Pendente'}
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </div>

        {/* Botões movidos para o rodapé do formulário */}
        <div className="relative border-t border-white/8 px-6 py-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => {
                setForm(initialFormState);
                setGallery([]);
                setEditing(null);
                setError('');
                setUploadError('');
              }}
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white/80 transition hover:bg-white/8"
            >
              {editing ? 'Cancelar Edição' : 'Limpar Campos'}
            </button>
            <button
              type="submit"
              className="rounded-2xl bg-[#B87333] px-5 py-3 text-sm font-semibold text-[#141414] transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={submitting || isUploading}
            >
              {submitting
                ? 'Salvando...'
                : isUploading
                  ? 'Aguarde o upload...'
                  : editing
                    ? 'Atualizar Projeto'
                    : 'Publicar Projeto'}
            </button>
          </div>
        </div>
      </form>

      {/* Lista de projetos */}
      <div className="mt-16">
        <h2 className="mb-6 text-2xl font-semibold text-white">Projetos Cadastrados</h2>
        {isLoading && <p className="text-white/60">Carregando...</p>}
        <div className="rounded-2xl border border-white/8 bg-[#181818]">
          {projects.length > 0 ? (
            <ul className="divide-y divide-white/8">
              {projects.map((proj) => (
                <li key={proj.id} className="flex items-center gap-4 p-4">
                  {proj.imagem_url ? (
                    <img
                      src={proj.imagem_url}
                      alt={proj.titulo}
                      className="h-10 w-16 flex-shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="h-10 w-16 flex-shrink-0 rounded-lg bg-white/5 flex items-center justify-center text-white/20 text-xs">
                      sem img
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-white">{proj.titulo}</p>
                    <p className="truncate text-sm text-white/60">
                      {proj.categoria || 'Sem categoria'}
                    </p>
                    <p className="truncate text-xs text-white/30">ID: {proj.id}</p>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-3">
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
          ) : (
            !isLoading && <p className="p-6 text-white/60">Nenhum projeto encontrado.</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProjetos;