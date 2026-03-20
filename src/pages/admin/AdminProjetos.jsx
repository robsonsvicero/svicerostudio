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

  const handleEditProject = async (proj) => {
    setForm({ ...initialFormState, ...proj }); // Preenche o form com os dados do projeto
    setEditingId(proj.id); // Define o ID do projeto que está sendo editado
    await fetchGallery(proj.id); // Carrega a galeria do projeto
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Volta para o topo da página
  };

  const handleCancelEdit = () => {
    setForm(initialFormState);
    setEditingId(null);
    setGallery([]);
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este projeto?')) return;

    try {
      const res = await fetch(`${API_URL}/api/projetos/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        if (res.status === 401) signOut();
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }

      showToastMessage('Projeto excluído com sucesso!', 'success');
      fetchProjects(); // Recarrega a lista de projetos
      handleCancelEdit(); // Limpa o formulário
    } catch (err) {
      showToastMessage(err.message, 'error');
    }
  };

  // ---------------------------------------------------------------------------
  // Upload de Imagens (Capa e Galeria)
  // ---------------------------------------------------------------------------
  const handleImageUpload = useCallback(
    async (uploadedFiles) => {
      if (!uploadedFiles || uploadedFiles.length === 0) return;

      setIsUploading(true);
      try {
        const file = uploadedFiles[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('bucket', 'svicerostudio'); // Seu bucket R2
        formData.append('key', `projetos/${form.slug || generateSlug(form.titulo)}/capa-${file.name}`);

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
          throw new Error(data.error || `Erro ao fazer upload da capa (status ${res.status})`);
        }

        setForm((prevForm) => ({ ...prevForm, imagem_url: data.data.url }));
        showToastMessage('Capa enviada com sucesso!', 'success');
      } catch (err) {
        showToastMessage(err.message, 'error');
      } finally {
        setIsUploading(false);
      }
    },
    [API_URL, token, signOut, showToastMessage, form.slug, form.titulo],
  );

  const handleGalleryImageUpload = useCallback(
    async (uploadedFiles) => {
      if (!uploadedFiles || uploadedFiles.length === 0) return;

      setIsUploadingGallery(true);
      try {
        const newGalleryItems = [];
        for (const file of uploadedFiles) {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('bucket', 'svicerostudio');
          formData.append('key', `projetos/${form.slug || generateSlug(form.titulo)}/galeria/${Date.now()}-${file.name}`);

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
            throw new Error(data.error || `Erro ao fazer upload da imagem da galeria (status ${res.status})`);
          }

          const newImage = {
            imagem_url: data.data.url,
            ordem: gallery.length + newGalleryItems.length, // Ordem provisória
            legenda: '',
          };

          // Se estiver editando, já salva no banco. Se for novo projeto, só adiciona no estado.
          if (editingId) {
            const galleryRes = await fetch(`${API_URL}/api/db/projeto_galeria/query`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                operation: 'insert',
                payload: { ...newImage, projeto_id: editingId },
              }),
            });

            const galleryData = await galleryRes.json();
            if (!galleryRes.ok) {
              if (galleryRes.status === 401) signOut();
              throw new Error(galleryData.error || `Erro ao salvar imagem da galeria no DB (status ${galleryRes.status})`);
            }
            newImage.id = galleryData.data[0].id; // Pega o ID do item da galeria salvo
          }

          newGalleryItems.push(newImage);
        }

        setGallery((prevGallery) => [...prevGallery, ...newGalleryItems]);
        showToastMessage('Imagens da galeria enviadas com sucesso!', 'success');
      } catch (err) {
        showToastMessage(err.message, 'error');
      } finally {
        setIsUploadingGallery(false);
      }
    },
    [API_URL, token, signOut, showToastMessage, form.slug, form.titulo, gallery.length, editingId],
  );

  // ---------------------------------------------------------------------------
  // Salvar/Publicar Projeto
  // ---------------------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    // Validação básica para campos obrigatórios do schema
    if (!form.titulo.trim()) {
      showToastMessage('O título é obrigatório.', 'error');
      setIsSaving(false);
      return;
    }
    if (!form.slug.trim()) {
      showToastMessage('O slug é obrigatório.', 'error');
      setIsSaving(false);
      return;
    }
    if (!form.descricao.trim()) {
      showToastMessage('A descrição curta é obrigatória.', 'error');
      setIsSaving(false);
      return;
    }

    // Prepara o payload do projeto
    const projetoPayload = {
      ...form,
      slug: form.slug.trim() || generateSlug(form.titulo), // Garante slug
      descricao: form.descricao.trim(), // Garante descrição
      updated_at: new Date(),
    };

    try {
      let res;
      let data;
      let projectId = editingId;

      if (editingId) {
        // Atualizar projeto existente
        res = await fetch(`${API_URL}/api/db/projetos/query`, {
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
        data = await res.json();
        if (!res.ok) {
          if (res.status === 401) signOut();
          throw new Error(data.error || `Erro ao atualizar projeto (status ${res.status})`);
        }
        showToastMessage('Projeto atualizado com sucesso!', 'success');
      } else {
        // Criar novo projeto
        res = await fetch(`${API_URL}/api/db/projetos/query`, {
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
        data = await res.json();
        if (!res.ok) {
          if (res.status === 401) signOut();
          throw new Error(data.error || `Erro ao criar projeto (status ${res.status})`);
        }
        projectId = data.data[0].id; // Pega o ID do projeto recém-criado
        showToastMessage('Projeto criado com sucesso!', 'success');

        // Se houver imagens na galeria (em memória), salva-as agora
        if (gallery.length > 0) {
          const galleryPayload = gallery.map((img, index) => ({
            projeto_id: projectId,
            imagem_url: img.imagem_url,
            ordem: index,
            legenda: img.legenda || '',
          }));

          const galleryRes = await fetch(`${API_URL}/api/db/projeto_galeria/query`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              operation: 'insert',
              payload: galleryPayload, // Envia um array para insertMany
            }),
          });

          if (!galleryRes.ok) {
            const galleryErrorData = await galleryRes.json();
            if (galleryRes.status === 401) signOut();
            console.error('Erro ao salvar galeria após criar projeto:', galleryErrorData);
            showToastMessage('Erro ao salvar galeria do projeto.', 'error');
          } else {
            showToastMessage('Galeria salva com sucesso!', 'success');
          }
        }
      }

      fetchProjects(); // Recarrega a lista de projetos
      handleCancelEdit(); // Limpa o formulário e a galeria
    } catch (err) {
      showToastMessage(err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Gerenciar Projetos</h1>
        <Button onClick={handleCancelEdit} disabled={isSaving || isUploading || isUploadingGallery}>
          <FaPlus className="mr-2" /> Novo Projeto
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Esquerda (Main Content) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informações Básicas */}
            <section className="rounded-2xl bg-[#141414]/80 border border-white/8 p-6 lg:p-8 space-y-4">
              <h2 className="text-sm font-semibold tracking-wide text-white/80 uppercase">
                Informações Básicas
              </h2>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-white/82">
                  Título do Projeto <span className="text-red-500">*</span>
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
                  Slug (URL amigável) <span className="text-red-500">*</span>
                </span>
                <input
                  type="text"
                  name="slug"
                  value={form.slug}
                  onChange={handleFieldChange}
                  className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                  placeholder="nome-do-projeto"
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
                  type="text"
                  name="data_projeto"
                  value={form.data_projeto}
                  onChange={handleFieldChange}
                  className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                  placeholder="Ex: 2023-01-15"
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
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-white/82">
                  Mostrar na Home
                </span>
                <input
                  type="checkbox"
                  name="mostrar_home"
                  checked={form.mostrar_home}
                  onChange={handleFieldChange}
                  className="ml-2 h-4 w-4 rounded border-white/10 bg-[#141414]/70 text-[#B87333] focus:ring-[#B87333]/40"
                />
              </label>
            </section>

            {/* Descrições */}
            <section className="rounded-2xl bg-[#141414]/80 border border-white/8 p-6 lg:p-8 space-y-4">
              <h2 className="text-sm font-semibold tracking-wide text-white/80 uppercase">
                Descrições
              </h2>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-white/82">
                  Descrição curta <span className="text-red-500">*</span>
                </span>
                <textarea
                  name="descricao"
                  value={form.descricao}
                  onChange={handleFieldChange}
                  className="min-h-[80px] w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                  placeholder="Uma breve descrição do projeto..."
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

            {/* Botões de Ação - AGORA DENTRO DO FORM */}
            <section className="rounded-2xl bg-[#141414]/80 border border-white/8 p-4 lg:p-6 flex justify-end gap-3">
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
            </section>
          </aside>
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