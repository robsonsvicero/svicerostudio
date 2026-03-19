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

      // Atualiza automaticamente o slug ao digitar o título, se o usuário
      // ainda não mexeu manualmente no slug.
      if (name === 'titulo') {
        if (!prevForm.slug || prevForm.slug === generateSlug(prevForm.titulo)) {
          newState.slug = generateSlug(value);
        }
      }

      return newState;
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(initialFormState);
    setGallery([]);
  };

  const handleEditProject = (proj) => {
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
      mostrar_home: typeof proj.mostrar_home === 'boolean' ? proj.mostrar_home : true,
    });
    fetchGallery(proj.id);
  };

  // ---------------------------------------------------------------------------
  // Upload da capa
  // ---------------------------------------------------------------------------
  const handleImageUpload = async (file) => {
    if (!file) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      const key = `projetos/${Date.now()}_${file.name}`;
      formData.append('file', file);
      formData.append('bucket', 'projetos');
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
        throw new Error(data.error || 'Erro ao fazer upload da imagem');
      }

      setForm((prev) => ({ ...prev, imagem_url: data.data.url }));
    } catch (err) {
      showToastMessage(err.message, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Upload da galeria (jeito A)
  // ---------------------------------------------------------------------------
  const handleGalleryImageUpload = async (files) => {
    if (!files || files.length === 0) return;
    const fileList = Array.isArray(files) ? files : Array.from(files);

    setIsUploadingGallery(true);
    try {
      const uploadedItems = [];

      for (const file of fileList) {
        const formData = new FormData();
        const key = `projetos/${Date.now()}_${file.name}`;
        formData.append('file', file);
        formData.append('bucket', 'projetos');
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
          throw new Error(data.error || 'Erro ao fazer upload de imagem da galeria');
        }

        uploadedItems.push({
          imagem_url: data.data.url,
        });
      }

      // Jeito A: sempre adiciona ao estado; persistência só ocorre no submit
      setGallery((prev) => {
        const startIndex = prev.length;
        const withOrder = uploadedItems.map((item, idx) => ({
          ...item,
          ordem: startIndex + idx,
        }));
        return [...prev, ...withOrder];
      });
    } catch (err) {
      showToastMessage(err.message, 'error');
    } finally {
      setIsUploadingGallery(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Submit (criar / atualizar projeto + salvar galeria se novo)
  // ---------------------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;

    // Garante campos obrigatórios
    const titulo = form.titulo?.trim();
    const descricao = form.descricao?.trim();
    let slug = form.slug?.trim();

    if (!titulo || !descricao) {
      showToastMessage('Preencha pelo menos título e descrição.', 'error');
      return;
    }

    if (!slug) {
      slug = generateSlug(titulo);
    }

    setIsSaving(true);
    try {
      // Monta payload do projeto
      const projetoPayload = {
        titulo,
        slug,
        categoria: form.categoria || '',
        cliente: form.cliente || '',
        data_projeto: form.data_projeto || '',
        status: form.status || 'draft',
        descricao,
        descricao_longa: form.descricao_longa || '',
        descricao_longa_en: form.descricao_longa_en || '',
        imagem_url: form.imagem_url || '',
        site_url: form.site_url || '',
        link: form.link || '',
        button_text: form.button_text || 'Ver Projeto',
        link2: form.link2 || '',
        button_text2: form.button_text2 || '',
        mostrar_home: !!form.mostrar_home,
      };

      console.log('SUBMIT PAYLOAD', { editingId, projetoPayload });

      let projetoId = editingId;

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
          throw new Error(data.error || `Erro ao criar projeto (status ${res.status})`);
        }

        const created = (data.data && Array.isArray(data.data) ? data.data[0] : data.data) || null;
        if (!created || !created.id) {
          throw new Error('Projeto criado, mas resposta não contém id.');
        }
        projetoId = created.id;

        // Se houver galeria no estado, insere agora
        if (gallery.length > 0) {
          const galeriaPayload = gallery.map((img, idx) => ({
            projeto_id: projetoId,
            imagem_url: img.imagem_url,
            ordem: typeof img.ordem === 'number' ? img.ordem : idx,
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
              payload: galeriaPayload,
            }),
          });

          const dataGal = await resGal.json();
          if (!resGal.ok) {
            throw new Error(dataGal.error || `Erro ao salvar galeria (status ${resGal.status})`);
          }
        }

        showToastMessage('Projeto criado com sucesso!', 'success');
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
          throw new Error(data.error || `Erro ao atualizar projeto (status ${res.status})`);
        }

        showToastMessage('Projeto atualizado com sucesso!', 'success');
      }

      // Reload lista e reset se era novo
      await fetchProjects();

      if (!editingId) {
        setForm(initialFormState);
        setGallery([]);
        setEditingId(null);
      }
    } catch (err) {
      showToastMessage(err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Excluir projeto
  // ---------------------------------------------------------------------------
  const handleDeleteProject = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este projeto?')) return;
    try {
      const res = await fetch(`${API_URL}/api/projetos/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || `Erro ao excluir projeto (status ${res.status})`);
      }

      showToastMessage('Projeto e galeria excluídos com sucesso!', 'success');
      await fetchProjects();

      if (editingId === id) {
        setEditingId(null);
        setForm(initialFormState);
        setGallery([]);
      }
    } catch (err) {
      showToastMessage(err.message, 'error');
    }
  };

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------
  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Projetos
          </h1>
          <p className="mt-1 text-sm text-white/60">
            Cadastre e gerencie os projetos exibidos no site.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setEditingId(null);
            setForm(initialFormState);
            setGallery([]);
          }}
        >
          <FaPlus className="mr-2 h-4 w-4" />
          Novo Projeto
        </Button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-8 rounded-3xl border border-white/10 bg-[#111111]/90 p-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)] lg:p-10"
      >
        {/* Coluna esquerda */}
        <div className="space-y-8">
          {/* Título e slug */}
          <section className="space-y-4">
            <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-white/82">
                  Título do Projeto
                </span>
                <input
                  type="text"
                  name="titulo"
                  value={form.titulo}
                  onChange={handleFieldChange}
                  className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                  placeholder="Ex: Redesign do site da Empresa X"
                  required
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-white/82">
                  Slug
                </span>
                <input
                  type="text"
                  name="slug"
                  value={form.slug}
                  onChange={handleFieldChange}
                  className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                  placeholder="redesign-site-empresa-x"
                  required
                />
              </label>
            </div>
          </section>

          {/* Metadados */}
          <section className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
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
                  <option value="">Selecione</option>
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
                  placeholder="2025, 2º semestre…"
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
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
              <label className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  name="mostrar_home"
                  checked={form.mostrar_home}
                  onChange={handleFieldChange}
                  className="h-4 w-4 rounded border-white/20 bg-transparent text-[#B87333] focus:ring-[#B87333]"
                />
                <span className="text-sm text-white/80">Mostrar na Home</span>
              </label>
            </div>
          </section>

          {/* Descrições */}
          <section className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-white/82">
                Descrição curta
              </span>
              <textarea
                name="descricao"
                value={form.descricao}
                onChange={handleFieldChange}
                className="min-h-[80px] w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                placeholder="Resumo breve do projeto"
                required
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
                className="min-h-[120px] w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                placeholder="Detalhes do projeto, desafios, soluções..."
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
                placeholder="Long description in English (optional)"
              />
            </label>
          </section>
        </div>

        {/* Coluna direita */}
        <aside className="space-y-8">
          {/* Links & CTAs */}
          <section className="space-y-4 rounded-2xl border border-white/10 bg-[#141414]/80 p-5">
            <h2 className="text-sm font-semibold tracking-wide text-white/80 uppercase">
              Links do Projeto
            </h2>
            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-white/82">
                  Link Principal
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
                  Texto do Botão Principal
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

          {/* Capa */}
          <section className="space-y-4 rounded-2xl border border-white/10 bg-[#141414]/80 p-5">
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
          <section className="space-y-4 rounded-2xl border border-white/10 bg-[#141414]/80 p-5">
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