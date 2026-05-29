// src/pages/admin/AdminProjetos.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../styles/datepicker.css';
import { useAuth } from '../../contexts/AuthContext';
import { API_URL } from '../../lib/api';
import { useToast } from '../../hooks/useToast';
import { getPlaceholderImage } from '../../utils/placeholders';
import slugify from 'slugify';
import { FaEdit, FaTrash, FaPlus, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import AdminLayout from '../../components/Admin/AdminLayout';
import Button from '../../components/UI/Button';
import ImageUploadSlot from '../../components/UI/ImageUploadSlot';
import { adminInputClass, adminLabelClass } from '../../components/Admin/adminFormStyles';
import AdminSectionCard from '../../components/Admin/AdminSectionCard';
import AdminListCard from '../../components/Admin/AdminListCard';
import AdminRowActions from '../../components/Admin/AdminRowActions';
import AdminHeaderActionButton from '../../components/Admin/AdminHeaderActionButton';

const generateSlug = (title) =>
  slugify(title || '', { lower: true, strict: true });

const CATEGORIAS = ['Blindagem de percepção', 'Business design', 'Conceptual case', 'Estratégia de marca'];
const MAX_UPLOAD_SIZE_BYTES = 8 * 1024 * 1024;
const TARGET_UPLOAD_SIZE_BYTES = Math.floor(7.5 * 1024 * 1024);

const loadImageFromFile = (file) =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Não foi possível ler a imagem para otimização.'));
    };
    img.src = url;
  });

const canvasToBlob = (canvas, type, quality) =>
  new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Falha ao converter imagem para upload.'));
        return;
      }
      resolve(blob);
    }, type, quality);
  });

const optimizeImageForUpload = async (file) => {
  if (!file || file.size <= MAX_UPLOAD_SIZE_BYTES) return file;
  if (!file.type.startsWith('image/')) {
    throw new Error('Somente imagens podem ser enviadas.');
  }

  const img = await loadImageFromFile(file);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Seu navegador não suporta processamento de imagem para upload.');
  }

  let scale = 1;
  let quality = 0.9;
  let optimizedBlob = null;

  for (let i = 0; i < 8; i += 1) {
    const width = Math.max(1, Math.round(img.width * scale));
    const height = Math.max(1, Math.round(img.height * scale));

    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);

    optimizedBlob = await canvasToBlob(canvas, 'image/webp', quality);

    if (optimizedBlob.size <= TARGET_UPLOAD_SIZE_BYTES) {
      break;
    }

    scale *= 0.85;
    quality = Math.max(0.5, quality - 0.08);
  }

  if (!optimizedBlob || optimizedBlob.size > MAX_UPLOAD_SIZE_BYTES) {
    throw new Error('A imagem excede 8MB mesmo após otimização. Reduza a resolução e tente novamente.');
  }

  const baseName = (file.name || 'imagem').replace(/\.[^.]+$/, '');
  return new File([optimizedBlob], `${baseName}.webp`, {
    type: 'image/webp',
    lastModified: Date.now(),
  });
};

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
    ordem: 0,
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
          orderBy: { column: 'ordem', ascending: true },
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
  // Reordenar projetos
  // ---------------------------------------------------------------------------
  const updateOrderBackendProjects = (reorderedProjects) => {
    reorderedProjects.forEach((item, idx) => {
      const id = item.id || item._id;
      if (!id) return;
      fetch(`${API_URL}/api/db/projetos/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          operation: 'update',
          filters: [{ column: 'id', operator: 'eq', value: id }],
          payload: { ordem: idx }
        })
      }).catch(err => console.error('Erro ao atualizar ordem do projeto:', err));
    });
  };

  const handleDragEndProjects = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(projects);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setProjects(reordered);
    updateOrderBackendProjects(reordered);
  };

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
  const getProjectSlug = useCallback(() => form.slug?.trim() || generateSlug(form.titulo) || 'novo-projeto', [form.slug, form.titulo]);

  const handleImageUpload = useCallback(
    async (uploadedFiles) => {
      // Se foi removida a imagem
      if (uploadedFiles === null) {
        setForm((prevForm) => ({ ...prevForm, imagem_url: '' }));
        return;
      }

      // Aceita um arquivo único ou array
      const files = Array.isArray(uploadedFiles) ? uploadedFiles : [uploadedFiles];
      if (!files || files.length === 0) return;

      setIsUploading(true);
      try {
        const optimizedFile = await optimizeImageForUpload(files[0]);
        if (optimizedFile !== files[0]) {
          showToastMessage('Imagem otimizada automaticamente para envio.', 'success');
        }

        const formData = new FormData();
        formData.append('file', optimizedFile);
        formData.append('bucket', 'svicerostudio');
        formData.append('key', `projetos/${getProjectSlug()}/capa-${optimizedFile.name}`);

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
    [API_URL, token, signOut, showToastMessage, getProjectSlug],
  );

  const handleGalleryImageUpload = useCallback(
    async (uploadedFiles) => {
      // Aceita um arquivo único ou array
      const files = Array.isArray(uploadedFiles) ? uploadedFiles : [uploadedFiles];
      if (!files || files.length === 0) return;

      setIsUploadingGallery(true);
      try {
        const newGalleryItems = [];
        for (const file of files) {
          const optimizedFile = await optimizeImageForUpload(file);
          if (optimizedFile !== file) {
            showToastMessage(`Imagem ${file.name} otimizada para envio.`, 'success');
          }

          const formData = new FormData();
          formData.append('file', optimizedFile);
          formData.append('bucket', 'svicerostudio');
          formData.append('key', `projetos/${getProjectSlug()}/galeria/${Date.now()}-${optimizedFile.name}`);

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
    [API_URL, token, signOut, showToastMessage, getProjectSlug, gallery.length, editingId],
  );

  // ---------------------------------------------------------------------------
  // Excluir imagem da galeria
  // ---------------------------------------------------------------------------
  const handleDeleteGalleryImage = useCallback(
    async (index) => {
      const img = gallery[index];
      if (editingId && img.id) {
        try {
          const res = await fetch(`${API_URL}/api/db/projeto_galeria/query`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({
              operation: 'delete',
              filters: [{ column: 'id', operator: 'eq', value: img.id }],
            }),
          });
          if (!res.ok) {
            const errData = await res.json();
            if (res.status === 401) signOut();
            throw new Error(errData.error || 'Erro ao excluir imagem da galeria');
          }
        } catch (err) {
          showToastMessage(err.message, 'error');
          return;
        }
      }
      setGallery((prev) => prev.filter((_, i) => i !== index));
      showToastMessage('Imagem removida.', 'success');
    },
    [gallery, editingId, API_URL, token, signOut, showToastMessage],
  );

  // ---------------------------------------------------------------------------
  // Reordenar imagens da galeria
  // ---------------------------------------------------------------------------
  const handleMoveGalleryImage = useCallback(
    async (index, direction) => {
      const targetIndex = direction === 'left' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= gallery.length) return;

      const newGallery = [...gallery];
      [newGallery[index], newGallery[targetIndex]] = [newGallery[targetIndex], newGallery[index]];
      setGallery(newGallery);

      if (editingId) {
        const updates = [
          { id: newGallery[index].id, ordem: index },
          { id: newGallery[targetIndex].id, ordem: targetIndex },
        ].filter((u) => u.id);

        for (const update of updates) {
          try {
            await fetch(`${API_URL}/api/db/projeto_galeria/query`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify({
                operation: 'update',
                filters: [{ column: 'id', operator: 'eq', value: update.id }],
                payload: { ordem: update.ordem },
              }),
            });
          } catch (err) {
            console.error('Erro ao atualizar ordem da galeria:', err);
          }
        }
      }
    },
    [gallery, editingId, API_URL, token],
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
        projectId = data.data[0]?.id || data.data[0]?._id || data.data?.id || data.data?._id; // Pega o ID do projeto recém-criado
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
            throw new Error(galleryErrorData.error || `Erro ao salvar galeria do projeto (status ${galleryRes.status})`);
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

  // Redesign dashboard: Projects management with consistent SaaS styling

  return (
    <AdminLayout
      title="Projetos"
      actions={
        <AdminHeaderActionButton
          onClick={handleCancelEdit}
          size="lg"
          disabled={isSaving || isUploading || isUploadingGallery}
        >
          {editingId ? 'Cancelar' : 'Novo'}
        </AdminHeaderActionButton>
      }
    >
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic info */}
            <AdminSectionCard badge="Informações" title={editingId ? 'Editando Projeto' : 'Novo Projeto'} className="space-y-4">
              <label className="block">
                <span className={adminLabelClass}>Título <span className="text-ds-accent">*</span></span>
                <input type="text" name="titulo" value={form.titulo} onChange={handleFieldChange} className={adminInputClass} placeholder="Nome do projeto" required />
              </label>
              <label className="block">
                <span className={adminLabelClass}>Slug <span className="text-ds-accent">*</span></span>
                <input type="text" name="slug" value={form.slug} onChange={handleFieldChange} className={adminInputClass} placeholder="nome-do-projeto" required />
              </label>
              <div className="grid gap-4 lg:grid-cols-2">
                <label className="block">
                  <span className={adminLabelClass}>Categoria</span>
                  <input
                    type="text"
                    name="categoria"
                    value={form.categoria}
                    onChange={handleFieldChange}
                    className={adminInputClass}
                    list="categoria-sugestoes"
                    placeholder="Selecione ou digite uma categoria"
                  />
                  <datalist id="categoria-sugestoes">
                    {CATEGORIAS.map((cat) => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </label>
                <label className="block">
                  <span className={adminLabelClass}>Cliente</span>
                  <input type="text" name="cliente" value={form.cliente} onChange={handleFieldChange} className={adminInputClass} placeholder="Nome do cliente" />
                </label>
                <label className="block">
                  <span className={adminLabelClass}>Data do Projeto</span>
                  <DatePicker
                    selected={form.data_projeto ? new Date(form.data_projeto) : null}
                    onChange={(date) => {
                      if (date) {
                        const formatted = date.toISOString().split('T')[0];
                        handleFieldChange({ target: { name: 'data_projeto', value: formatted } });
                      }
                    }}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Selecione a data"
                    className={adminInputClass}
                    calendarClassName="bg-[#1a1a1a] text-white border-white/10"
                  />
                </label>
                <label className="block">
                  <span className={adminLabelClass}>Status</span>
                  <select name="status" value={form.status} onChange={handleFieldChange} className={adminInputClass}>
                    <option value="draft">Rascunho</option>
                    <option value="published">Publicado</option>
                  </select>
                </label>
                <label className="block">
                  <span className={adminLabelClass}>Ordem</span>
                  <input type="number" name="ordem" value={form.ordem} onChange={handleFieldChange} className={adminInputClass} min={0} />
                </label>
              </div>
              <label className="flex items-center gap-3 rounded-lg border border-white/5 bg-ds-bg px-4 py-3 cursor-pointer hover:border-white/10 transition-colors">
                <input type="checkbox" name="mostrar_home" checked={form.mostrar_home} onChange={handleFieldChange} className="h-4 w-4 rounded border-white/10 bg-ds-bg text-ds-accent focus:ring-copper/40" />
                <span className="text-sm text-ds-text">Mostrar na Home</span>
              </label>
            </AdminSectionCard>

            {/* Descriptions */}
            <AdminSectionCard badge="Conteúdo" title="Descrições" className="space-y-4">
              <label className="block">
                <span className={adminLabelClass}>Descrição curta <span className="text-ds-accent">*</span></span>
                <textarea name="descricao" value={form.descricao} onChange={handleFieldChange} className={`${adminInputClass} min-h-[80px] resize-y`} placeholder="Uma breve descrição do projeto..." required />
              </label>
              <label className="block">
                <span className={adminLabelClass}>Descrição longa (PT)</span>
                <textarea name="descricao_longa" value={form.descricao_longa} onChange={handleFieldChange} className={`${adminInputClass} min-h-[120px] resize-y`} placeholder="Detalhes do projeto..." />
              </label>
              <label className="block">
                <span className={adminLabelClass}>Descrição longa (EN)</span>
                <textarea name="descricao_longa_en" value={form.descricao_longa_en} onChange={handleFieldChange} className={`${adminInputClass} min-h-[120px] resize-y`} placeholder="Project details in English..." />
              </label>
            </AdminSectionCard>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Cover image */}
            <AdminSectionCard badge="Imagem de Capa" paddingClassName="p-5">
              <ImageUploadSlot title="Imagem de capa" description="JPG, PNG até 8MB" onUpload={handleImageUpload} isUploading={isUploading} currentImageUrl={form.imagem_url} useTechText={true} />
            </AdminSectionCard>

            {/* Links */}
            <AdminSectionCard badge="Links & Ações" paddingClassName="p-5">
              <label className="block">
                <span className={labelClass}>Link principal</span>
                <input type="text" name="link" value={form.link} onChange={handleFieldChange} className={inputClass} placeholder="https://..." />
              </label>
              <label className="block">
                <span className={labelClass}>Texto do botão</span>
                <input type="text" name="button_text" value={form.button_text} onChange={handleFieldChange} className={inputClass} placeholder="Ver Projeto" />
              </label>
              <label className="block">
                <span className={labelClass}>Segundo Link</span>
                <input type="text" name="link2" value={form.link2} onChange={handleFieldChange} className={inputClass} placeholder="https://..." />
              </label>
              <label className="block">
                <span className={labelClass}>Texto do 2º botão</span>
                <input type="text" name="button_text2" value={form.button_text2} onChange={handleFieldChange} className={inputClass} placeholder="Texto alternativo" />
              </label>
            </AdminSectionCard>

            {/* Gallery */}
            <AdminSectionCard paddingClassName="p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-mono uppercase tracking-widest text-ds-accent">Galeria</p>
                <span className="text-xs text-ds-text">{gallery.length} imagens</span>
              </div>
              <ImageUploadSlot title="Imagens da galeria" description="Arraste ou selecione múltiplas imagens" onUpload={handleGalleryImageUpload} isUploading={isUploadingGallery} multiple={true} useTechText={true} />
              {gallery.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {gallery.map((img, index) => (
                    <div key={img.id || img.imagem_url || index} className="relative rounded-lg overflow-hidden border border-white/5 bg-ds-bg group">
                      <img src={img.imagem_url} alt={`Imagem ${index + 1}`} className="w-full h-24 object-cover relative z-0" />
                      
                      {/* Botão de Excluir no Topo Direito */}
                      <button 
                        type="button" 
                        onClick={() => handleDeleteGalleryImage(index)} 
                        className="absolute top-2 right-2 z-10 flex items-center justify-center w-8 h-8 bg-black/80 hover:bg-red-600 text-red-400 hover:text-white rounded-full transition-colors border border-white/20 shadow-md" 
                        title="Excluir imagem"
                      >
                        <FaTrash size={14} />
                      </button>

                      {/* Controles de Paginação Embaixo */}
                      <div className="absolute inset-x-0 bottom-0 z-10 bg-ds-bg/95 px-3 py-2 text-[11px] font-mono text-ds-muted flex justify-between items-center border-t border-white/10">
                        <button type="button" onClick={() => handleMoveGalleryImage(index, 'left')} disabled={index === 0} className="disabled:opacity-30 hover:text-white transition-colors flex items-center justify-center w-7 h-7 bg-white/10 hover:bg-white/20 rounded-full border border-white/10" title="Mover para a esquerda">
                          <FaChevronLeft size={12} />
                        </button>
                        <span className="font-bold tracking-widest text-[#B87333]">#{index + 1}</span>
                        <button type="button" onClick={() => handleMoveGalleryImage(index, 'right')} disabled={index === gallery.length - 1} className="disabled:opacity-30 hover:text-white transition-colors flex items-center justify-center w-7 h-7 bg-white/10 hover:bg-white/20 rounded-full border border-white/10" title="Mover para a direita">
                          <FaChevronRight size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </AdminSectionCard>

            {/* Action buttons */}
            <div className="rounded-xl border border-white/5 bg-ds-surface p-5 flex justify-end gap-3">
              {editingId && (
                <Button type="button" onClick={handleCancelEdit} disabled={isSaving || isUploading || isUploadingGallery} className="rounded-full border border-ds-text bg-ds-bg/10 px-4 py-2.5 text-sm font-medium text-ds-text hover:text-ds-surface hover:bg-ds-tech transition hover:border-ds-tech uppercase">
                  Cancelar
                </Button>
              )}
              <Button type="submit" disabled={isSaving || isUploading || isUploadingGallery} variant='primary'>
                {isSaving ? 'Salvando...' : editingId ? 'Atualizar' : 'Publicar'}
              </Button>
            </div>
          </aside>
        </div>
      </form>

      {/* Projects list */}
      <AdminListCard
        title="Projetos Existentes"
        count={projects.length}
        loading={isLoading}
        loadingText="Carregando..."
        emptyText="Nenhum projeto encontrado."
        bodyClassName="p-0"
      >
        <DragDropContext onDragEnd={handleDragEndProjects}>
          <Droppable droppableId="projects-list">
            {(provided) => (
              <div
                className="divide-y divide-white/5"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {projects.map((proj, idx) => (
                  <Draggable key={String(proj.id || proj._id)} draggableId={String(proj.id || proj._id)} index={idx}>
                    {(dragProvided, dragSnapshot) => (
                      <div
                        ref={dragProvided.innerRef}
                        {...dragProvided.draggableProps}
                        {...dragProvided.dragHandleProps}
                        className={`flex items-center px-6 py-4 gap-4 transition-colors ${dragSnapshot.isDragging ? 'bg-white/5 shadow-lg' : 'hover:bg-white/[.02]'}`}
                      >
                        <i className="fa-solid fa-grip-vertical text-ds-muted/30 hover:text-ds-muted cursor-grab active:cursor-grabbing"></i>
                        <img src={proj.imagem_url || getPlaceholderImage(proj.titulo?.charAt(0) || 'P', '141414', 150)} alt={proj.titulo} className="w-14 h-10 object-cover rounded-lg flex-shrink-0 bg-ds-bg" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-ds-text truncate flex items-center gap-2">
                            {proj.titulo}
                            <span className={`px-2 py-0.5 text-xs rounded-md font-medium capitalize ${proj.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                              {proj.status === 'published' ? 'Publicado' : proj.status}
                            </span>
                          </p>
                          <p className="text-xs text-ds-muted truncate">{proj.categoria || 'Sem categoria'}</p>
                        </div>
                        <AdminRowActions
                          onEdit={() => handleEditProject(proj)}
                          onDelete={() => handleDeleteProject(proj.id)}
                          editClassName="uppercase rounded-full border border-ds-border bg-white/5 px-3 py-1.5 text-xs font-medium text-ds-muted hover:text-ds-text hover:bg-ds-tech transition"
                          deleteClassName="uppercase rounded-full border border-red-500/20 bg-red-500 px-3 py-1.5 text-xs font-medium text-ds-surface hover:bg-red-700 transition"
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </AdminListCard>
    </AdminLayout>
  );
};

export default AdminProjetos;

