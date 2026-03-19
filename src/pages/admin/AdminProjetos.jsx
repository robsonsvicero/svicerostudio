// src/pages/admin/AdminProjetos.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { API_URL } from '../../lib/api';
import { useToast } from '../../hooks/useToast';
import slugify from 'slugify'; // Importar slugify
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa'; // Certifique-se que FaPlus está importado aqui

// Importar componentes reutilizáveis (ajuste os caminhos conforme a sua estrutura de pastas)
import AdminLayout from '../../components/Admin/AdminLayout';
import Button from '../../components/UI/Button';
import ImageUploadSlot from '../../components/UI/ImageUploadSlot';

// Função auxiliar para gerar slug (se não for um utilitário global)
const generateSlug = (title) => {
    return slugify(title || '', { lower: true, strict: true });
};

const AdminProjetos = () => {
  const { token, signOut } = useAuth();
  const navigate = useNavigate();

  const { showToastMessage, showToast, toastMessage, toastType, hideToast } = useToast();

  const initialFormState = {
    titulo: '',
    slug: '',
    categoria: '',
    cliente: '',
    data_projeto: '',
    status: 'draft', // 'published', 'draft', 'archived'
    descricao: '',
    descricao_longa: '',
    descricao_longa_en: '',
    imagem_url: '', // Imagem de capa
    galeria_imagens: [], // Novo estado para URLs da galeria
    site_url: '',
    link: '',
    button_text: 'Ver Projeto',
    link2: '',
    button_text2: '',
    mostrar_home: true,
  };

  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null); // Stores the project ID being edited
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false); // Novo estado para upload da galeria

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/db/projetos/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ operation: 'select', sort: { created_at: -1 } }),
      });
      if (!res.ok) {
        if (res.status === 401) signOut();
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setProjects(data.data || []);
    } catch (err) {
      showToastMessage(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [token, signOut, showToastMessage]);

  useEffect(() => {
    if (token) fetchProjects();
  }, [token, fetchProjects]);

  const handleFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prevForm => {
        const newState = { ...prevForm, [name]: type === 'checkbox' ? checked : value };
        if (name === 'titulo') {
            newState.slug = generateSlug(value);
        }
        return newState;
    });
  };

  const handleImageUpload = useCallback(async (file) => {
    if (!file) {
        setForm(prev => ({ ...prev, imagem_url: '' }));
        return;
    }
    setIsUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('bucket', 'projetos'); // Assumindo bucket 'projetos'
    uploadFormData.append('key', `${Date.now()}_${file.name}`);

    try {
        const res = await fetch(`${API_URL}/api/storage/upload`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: uploadFormData,
        });
        const payload = await res.json();
        if (!res.ok) throw new Error(payload.error || 'Falha no upload da imagem');

        const imageUrl = payload.data?.url || `${API_URL}/api/storage/public/projetos/${payload.data.path}`;
        setForm(prev => ({ ...prev, imagem_url: imageUrl }));
        showToastMessage('Imagem de capa enviada com sucesso!', 'success');
    } catch (err) {
        showToastMessage(err.message, 'error');
    } finally {
        setIsUploading(false);
    }
  }, [token, showToastMessage]);

  // Nova função para upload de imagens da galeria
  const handleGalleryImageUpload = useCallback(async (file) => {
    if (!file) return;

    setIsUploadingGallery(true);
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('bucket', 'projetos_galeria'); // Novo bucket para galeria, se desejar
    uploadFormData.append('key', `${Date.now()}_${file.name}`);

    try {
        const res = await fetch(`${API_URL}/api/storage/upload`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: uploadFormData,
        });
        const payload = await res.json();
        if (!res.ok) throw new Error(payload.error || 'Falha no upload da imagem da galeria');

        const imageUrl = payload.data?.url || `${API_URL}/api/storage/public/projetos_galeria/${payload.data.path}`;
        setForm(prev => ({
            ...prev,
            galeria_imagens: [...prev.galeria_imagens, imageUrl] // Adiciona a nova URL à galeria
        }));
        showToastMessage('Imagem da galeria enviada com sucesso!', 'success');
    } catch (err) {
        showToastMessage(err.message, 'error');
    } finally {
        setIsUploadingGallery(false);
    }
  }, [token, showToastMessage]);

  // Função para remover imagem da galeria
  const handleRemoveGalleryImage = useCallback((imageUrlToRemove) => {
    setForm(prev => ({
        ...prev,
        galeria_imagens: prev.galeria_imagens.filter(url => url !== imageUrlToRemove)
    }));
    showToastMessage('Imagem da galeria removida.', 'info');
  }, [showToastMessage]);


  const handleEditProject = (proj) => {
    setEditingId(proj.id);
    setForm({
        ...proj,
        slug: proj.slug || generateSlug(proj.titulo || ''),
        data_projeto: proj.data_projeto ? new Date(proj.data_projeto).toISOString().split('T')[0] : '',
        galeria_imagens: proj.galeria_imagens || [], // Garante que a galeria seja carregada
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(initialFormState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.titulo?.trim() || !form.descricao?.trim() || !form.imagem_url?.trim()) {
        showToastMessage('Título, Resumo Curto e Imagem de Capa são obrigatórios.', 'error');
        return;
    }

    setIsSaving(true);
    let formPayload = { ...form };
    const op = editingId ? 'update' : 'insert';
    const filters = editingId ? [{ column: 'id', operator: 'eq', value: editingId }] : [];

    if (editingId) {
        delete formPayload.id;
        delete formPayload._id;
        delete formPayload.created_at;
        delete formPayload.updated_at;
    }

    if (!formPayload.link?.trim()) {
        formPayload.link = formPayload.slug.trim();
    }

    try {
        const res = await fetch(`${API_URL}/api/db/projetos/query`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ operation: op, filters, payload: formPayload }),
        });
        if (!res.ok) {
            if (res.status === 401) signOut();
            const errorData = await res.json();
            throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
        }
        showToastMessage(`Projeto ${editingId ? 'atualizado' : 'criado'} com sucesso.`, 'success');
        handleCancelEdit();
        await fetchProjects();
    } catch (err) {
        showToastMessage(err.message, 'error');
    } finally {
        setIsSaving(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Tem certeza? Esta ação removerá o projeto e sua galeria.')) {
        try {
            // Deletar galeria associada (via API genérica)
            await fetch(`${API_URL}/api/db/projeto_galeria/query`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ operation: 'delete', filters: [{ column: 'projeto_id', operator: 'eq', value: projectId }] }),
            });

            // Deletar projeto principal (via endpoint personalizado)
            const projectRes = await fetch(`${API_URL}/api/projetos/${projectId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            });

            if (!projectRes.ok) {
                if (projectRes.status === 401) signOut();
                const errorData = await projectRes.json();
                throw new Error(errorData.error || `Erro ao deletar projeto: ${projectRes.status}`);
            }

            showToastMessage('Projeto excluído com sucesso.', 'success');
            await fetchProjects();
        } catch (err) {
            showToastMessage(err.message, 'error');
        }
    }
  };

  return (
    <AdminLayout toastProps={{ show: showToast, message: toastMessage, type: toastType, onClose: hideToast }}>
        <form onSubmit={handleSubmit} className="relative overflow-hidden rounded-[32px] border border-white/8 bg-[#181818] shadow-2xl shadow-black/30">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(184,115,51,0.14),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(95,178,216,0.10),_transparent_22%)]"></div>
            <div className="relative border-b border-white/8 px-6 py-6 lg:px-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center rounded-full border border-[#B87333]/25 bg-[#B87333]/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-[#E9BF84]">
                            Gerenciar Projetos
                        </div>
                        <h1 className="mt-4 font-[Manrope] text-3xl font-semibold tracking-[-0.04em] text-white lg:text-5xl">
                            {editingId ? 'Editando Projeto' : 'Adicionar Novo Projeto'}
                        </h1>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60 lg:text-base">
                            Adicione, edite e gerencie os projetos do portfólio.
                        </p>
                    </div>
                    {/* O botão de submissão foi movido para a parte inferior do formulário */}
                </div>
            </div>

            <div className="relative grid grid-cols-1 gap-6 p-6 lg:grid-cols-12 lg:gap-8 lg:p-8">
                <div className="space-y-6 lg:col-span-8">
                    {/* Seção de Informações Básicas */}
                    <section className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5 backdrop-blur lg:p-6">
                        <div className="mb-6">
                            <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">Informações</p>
                            <h2 className="mt-2 font-[Manrope] text-2xl font-semibold text-white">Detalhes do Projeto</h2>
                        </div>
                        <div className="grid gap-4">
                            <label className="block">
                                <span className="mb-2 block text-sm font-medium text-white/82">Título <span className="text-[#E9BF84]">*</span></span>
                                <input type="text" name="titulo" value={form.titulo} onChange={handleFieldChange} required className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40" />
                            </label>
                            <label className="block">
                                <span className="mb-2 block text-sm font-medium text-white/82">Slug</span>
                                <input type="text" name="slug" value={form.slug} onChange={handleFieldChange} className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40" />
                            </label>
                            <label className="block">
                                <span className="mb-2 block text-sm font-medium text-white/82">Categoria</span>
                                <input type="text" name="categoria" value={form.categoria} onChange={handleFieldChange} className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40" />
                            </label>
                            <label className="block">
                                <span className="mb-2 block text-sm font-medium text-white/82">Cliente</span>
                                <input type="text" name="cliente" value={form.cliente} onChange={handleFieldChange} className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40" />
                            </label>
                            <label className="block">
                                <span className="mb-2 block text-sm font-medium text-white/82">Data do Projeto</span>
                                <input type="date" name="data_projeto" value={form.data_projeto} onChange={handleFieldChange} className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40" />
                            </label>
                            <label className="block">
                                <span className="mb-2 block text-sm font-medium text-white/82">Status</span>
                                <select name="status" value={form.status} onChange={handleFieldChange} className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40">
                                    <option value="draft">Rascunho</option>
                                    <option value="published">Publicado</option>
                                    <option value="archived">Arquivado</option>
                                </select>
                            </label>
                        </div>
                    </section>

                    {/* Seção de Descrições */}
                    <section className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5 backdrop-blur lg:p-6">
                        <div className="mb-6">
                            <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">Conteúdo</p>
                            <h2 className="mt-2 font-[Manrope] text-2xl font-semibold text-white">Descrições do Projeto</h2>
                        </div>
                        <div className="grid gap-4">
                            <label className="block">
                                <span className="mb-2 block text-sm font-medium text-white/82">Resumo Curto <span className="text-[#E9BF84]">*</span></span>
                                <textarea name="descricao" value={form.descricao} onChange={handleFieldChange} required rows="3" className="w-full resize-y rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-4 text-sm leading-6 text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"></textarea>
                            </label>
                            <label className="block">
                                <span className="mb-2 block text-sm font-medium text-white/82">Descrição Longa (PT)</span>
                                <textarea name="descricao_longa" value={form.descricao_longa} onChange={handleFieldChange} rows="5" className="w-full resize-y rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-4 text-sm leading-6 text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"></textarea>
                            </label>
                            <label className="block">
                                <span className="mb-2 block text-sm font-medium text-white/82">Descrição Longa (EN)</span>
                                <textarea name="descricao_longa_en" value={form.descricao_longa_en} onChange={handleFieldChange} rows="5" className="w-full resize-y rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-4 text-sm leading-6 text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"></textarea>
                            </label>
                        </div>
                    </section>

                     {/* Seção de Imagem de Capa */}
                    <section className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5 backdrop-blur lg:p-6">
                        <div className="mb-6">
                            <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">Mídia</p>
                            <h2 className="mt-2 font-[Manrope] text-2xl font-semibold text-white">Imagem de Capa</h2>
                        </div>
                        <ImageUploadSlot
                            title="Imagem de capa do projeto"
                            description="Arraste ou clique para enviar (Recomendado: 1200x800px)"
                            currentImageUrl={form.imagem_url}
                            onUpload={handleImageUpload}
                            isUploading={isUploading}
                        />
                    </section>

                    {/* NOVA SEÇÃO: Galeria de Imagens */}
                    <section className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5 backdrop-blur lg:p-6">
                        <div className="mb-6">
                            <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">Galeria</p>
                            <h2 className="mt-2 font-[Manrope] text-2xl font-semibold text-white">Imagens da Galeria</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                            {form.galeria_imagens.map((imageUrl, index) => (
                                <div key={index} className="relative group">
                                    <img src={imageUrl} alt={`Galeria ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveGalleryImage(imageUrl)}
                                        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Remover imagem"
                                    >
                                        <FaPlus className="rotate-45" /> {/* FaPlus está importado e agora será usado corretamente */}
                                    </button>
                                </div>
                            ))}
                        </div>
                        <ImageUploadSlot
                            title="Adicionar imagem à galeria"
                            description="Arraste ou clique para enviar (Múltiplas imagens)"
                            onUpload={handleGalleryImageUpload}
                            isUploading={isUploadingGallery}
                            // Não passamos currentImageUrl aqui, pois é para adicionar novas imagens
                        />
                        <p className="mt-2 text-sm text-white/60">As imagens da galeria serão salvas com o projeto.</p>
                    </section>
                </div>

                <aside className="space-y-6 lg:col-span-4">
                    <section className="rounded-[28px] border border-white/8 bg-[#2F353B]/30 p-5 shadow-lg shadow-black/20">
                        <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">Configurações</p>
                        <div className="mt-5 grid gap-3">
                            <label className="flex items-center justify-between rounded-2xl border border-white/8 bg-[#141414]/55 px-4 py-4">
                                <span className="text-sm text-white/82">Mostrar na Home?</span>
                                <input type="checkbox" name="mostrar_home" checked={form.mostrar_home} onChange={handleFieldChange} className="sr-only" />
                                <span className={`flex h-7 w-12 items-center rounded-full border border-[#B87333]/20 px-1 ${form.mostrar_home ? 'bg-[#B87333]/50' : 'bg-white/5'}`}>
                                    <span className={`h-5 w-5 rounded-full bg-[#B87333] transition-all ${form.mostrar_home ? 'ml-auto' : 'ml-0'}`}></span>
                                </span>
                            </label>
                        </div>
                    </section>

                    <section className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5 backdrop-blur lg:p-6">
                        <div className="mb-6">
                            <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">Links & Botões</p>
                            <h2 className="mt-2 font-[Manrope] text-2xl font-semibold text-white">Chamadas para Ação</h2>
                        </div>
                        <div className="space-y-4">
                            <label className="block">
                                <span className="mb-2 block text-sm font-medium text-white/82">URL do Site (Opcional)</span>
                                <input type="text" name="site_url" value={form.site_url} onChange={handleFieldChange} className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40" />
                            </label>
                            <label className="block">
                                <span className="mb-2 block text-sm font-medium text-white/82">Link do Projeto (Behance)</span>
                                <input type="text" name="link" value={form.link} onChange={handleFieldChange} className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40" />
                            </label>
                            <label className="block">
                                <span className="mb-2 block text-sm font-medium text-white/82">Texto do Botão</span>
                                <input type="text" name="button_text" value={form.button_text} onChange={handleFieldChange} className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40" />
                            </label>
                            <hr className="border-white/10"/>
                            <label className="block">
                                <span className="mb-2 block text-sm font-medium text-white/82">Segundo Link (Opcional)</span>
                                <input type="text" name="link2" value={form.link2} onChange={handleFieldChange} className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40" />
                            </label>
                            <label className="block">
                                <span className="mb-2 block text-sm font-medium text-white/82">Texto do Segundo Botão</span>
                                <input type="text" name="button_text2" value={form.button_text2} onChange={handleFieldChange} className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40" />
                            </label>
                        </div>
                    </section>
                </aside>
            </div>

            {/* NOVA SEÇÃO: Botões de Ação do Formulário (na parte inferior) */}
            <div className="relative border-t border-white/8 px-6 py-6 lg:px-8 flex justify-end gap-3">
                {editingId && (
                    <Button type="button" variant="outline" onClick={handleCancelEdit} disabled={isSaving || isUploading || isUploadingGallery}>
                        Cancelar Edição
                    </Button>
                )}
                <Button type="submit" variant="primary" disabled={isSaving || isUploading || isUploadingGallery}>
                    {isSaving ? 'Salvando...' : (editingId ? 'Atualizar Projeto' : 'Publicar Projeto')}
                </Button>
            </div>
        </form>

        <div className="mt-16">
            <h2 className="text-2xl font-semibold text-white mb-6">Projetos Existentes</h2>
            {isLoading && <p className="text-white/60">Carregando...</p>}
            {!isLoading && projects.length === 0 && (
                <p className="p-6 text-white/60 bg-[#181818] rounded-2xl border border-white/8">Nenhum projeto encontrado.</p>
            )}
            {projects.length > 0 && (
                <div className="bg-[#181818] rounded-2xl border border-white/8">
                    <ul className="divide-y divide-white/8">
                        {projects.map(proj => (
                            <li key={proj.id} className="flex items-center p-4 gap-4">
                                 <img
                                    src={proj.imagem_url || `https://via.placeholder.com/150/141414/E9BF84?text=${proj.titulo.charAt(0)}`}
                                    alt={proj.titulo}
                                    className="w-16 h-10 object-cover rounded-lg flex-shrink-0 bg-black/20"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-white truncate flex items-center gap-2">
                                        {proj.titulo}
                                        <span className={`px-2 py-0.5 text-xs rounded-full capitalize ${
                                            proj.status === 'published' ? 'bg-green-500/10 text-green-400'
                                            : proj.status === 'draft' ? 'bg-yellow-500/10 text-yellow-400'
                                            : 'bg-gray-500/10 text-gray-400'
                                        }`}>
                                            {proj.status === 'published' ? 'Publicado' : proj.status}
                                        </span>
                                    </p>
                                    <p className="text-sm text-white/60 truncate">{proj.categoria || 'Sem categoria'}</p>
                                </div>
                                <div className="flex items-center gap-3 flex-shrink-0">
                                    <Button variant="outline" onClick={() => handleEditProject(proj)}>Editar</Button>
                                    <Button variant="danger" onClick={() => handleDeleteProject(proj.id)}>Excluir</Button>
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