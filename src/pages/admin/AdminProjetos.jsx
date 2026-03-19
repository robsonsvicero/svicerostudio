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

    // Galeria vinculada ao projeto (tabela projeto_galeria)
    const [gallery, setGallery] = useState([]); // [{ id, projeto_id, imagem_url, ordem, legenda }]

    // ---------------------------------------------------------------------------
    // Carregar projetos
    // ---------------------------------------------------------------------------
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

    // ---------------------------------------------------------------------------
    // Carregar galeria de um projeto
    // ---------------------------------------------------------------------------
    const fetchGallery = useCallback(async (projetoId) => {
        try {
            const res = await fetch(`${API_URL}/api/db/projeto_galeria/query`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
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
    }, [token, signOut, showToastMessage]);

    // ---------------------------------------------------------------------------
    // Handlers de formulário
    // ---------------------------------------------------------------------------
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

    // ---------------------------------------------------------------------------
    // Upload da imagem de capa (R2)
    // ---------------------------------------------------------------------------
    const handleImageUpload = useCallback(async (file) => {
        if (!file) {
            setForm(prev => ({ ...prev, imagem_url: '' }));
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

            setForm(prev => ({ ...prev, imagem_url: imageUrl }));
            showToastMessage('Imagem de capa enviada com sucesso!', 'success');
        } catch (err) {
            showToastMessage(err.message, 'error');
        } finally {
            setIsUploading(false);
        }
    }, [token, showToastMessage]);

    // ---------------------------------------------------------------------------
    // Upload de imagem da galeria (R2 + projeto_galeria)
    // ---------------------------------------------------------------------------
    const handleGalleryImageUpload = useCallback(
        async (filesOrFile) => {
            if (!filesOrFile) return;
            if (!editingId) {
                showToastMessage('Salve o projeto antes de adicionar imagens à galeria.', 'error');
                return;
            }

            // Normalizar para array
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
                        throw new Error('Backend retornou URL vazia para uma das imagens.');
                    }

                    // 2) Inserir registro no projeto_galeria
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
                            },
                        }),
                    });

                    const insertPayload = await resInsert.json();
                    if (!resInsert.ok) {
                        throw new Error(insertPayload.error || 'Falha ao salvar uma imagem da galeria no banco');
                    }

                    const inserted = Array.isArray(insertPayload.data)
                        ? insertPayload.data[0]
                        : insertPayload.data;

                    newImages.push(inserted);
                }

                // 3) Atualizar galeria local com todas as novas imagens
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
        [API_URL, token, editingId, gallery.length, showToastMessage]
    );

    // ---------------------------------------------------------------------------
    // Remover imagem da galeria (projeto_galeria)
    // ---------------------------------------------------------------------------
    const handleRemoveGalleryImage = useCallback(async (image) => {
        if (!window.confirm('Remover esta imagem da galeria?')) return;

        try {
            const res = await fetch(`${API_URL}/api/db/projeto_galeria/query`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    operation: 'delete',
                    filters: [{ column: 'id', operator: 'eq', value: image.id }],
                }),
            });

            const payload = await res.json();
            if (!res.ok) {
                throw new Error(payload.error || 'Falha ao remover imagem da galeria');
            }

            setGallery(prev => prev.filter(item => item.id !== image.id));
            showToastMessage('Imagem removida da galeria.', 'success');
        } catch (err) {
            showToastMessage(err.message, 'error');
        }
    }, [API_URL, token, showToastMessage]);

    // ---------------------------------------------------------------------------
    // Edição de projeto
    // ---------------------------------------------------------------------------
    const handleEditProject = (proj) => {
        setEditingId(proj.id);
        setForm({
            ...proj,
            slug: proj.slug || generateSlug(proj.titulo || ''),
            data_projeto: proj.data_projeto ? new Date(proj.data_projeto).toISOString().split('T')[0] : '',
        });
        setGallery([]);
        fetchGallery(proj.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setForm(initialFormState);
        setGallery([]);
    };

    // ---------------------------------------------------------------------------
    // Salvar projeto (somente tabela "projetos")
    // ---------------------------------------------------------------------------
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

        // Garantir que não estamos enviando nada extra
        delete formPayload.id;
        delete formPayload._id;
        delete formPayload.created_at;
        delete formPayload.updated_at;
        // Não mandar galeria aqui (é outra tabela)
        delete formPayload.galeria_imagens;

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

            // Após criar um novo projeto, precisamos pegar o id para poder vincular galeria depois
            if (!editingId) {
                const data = await res.json().catch(() => null);
                const created = data?.data?.[0] || data?.data || null;
                if (created?.id) {
                    setEditingId(created.id);
                }
            }

            await fetchProjects();
            // não limpamos gallery aqui, para manter as imagens já salvas se for edição
        } catch (err) {
            showToastMessage(err.message, 'error');
        } finally {
            setIsSaving(false);
        }
    };

    // ---------------------------------------------------------------------------
    // Deletar projeto (já deleta galeria pelo backend)
    // ---------------------------------------------------------------------------
    const handleDeleteProject = async (projectId) => {
        if (window.confirm('Tem certeza? Esta ação removerá o projeto.')) {
            try {
                const projectRes = await fetch(`${API_URL}/api/projetos/${projectId}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                });

                if (!projectRes.ok) {
                    if (projectRes.status === 401) signOut();
                    const errorData = await projectRes.json();
                    throw new Error(errorData.error || `Erro ao deletar: ${projectRes.status}`);
                }

                showToastMessage('Projeto excluído com sucesso.', 'success');
                await fetchProjects();
            } catch (err) {
                showToastMessage(err.message, 'error');
            }
        }
    };

    // ---------------------------------------------------------------------------
    // JSX
    // ---------------------------------------------------------------------------
    return (
        <AdminLayout
            toastProps={{
                show: showToast,
                message: toastMessage,
                type: toastType,
                onClose: hideToast,
            }}
        >
            <form
                onSubmit={handleSubmit}
                className="relative overflow-hidden rounded-[32px] border border-white/8 bg-[#181818] shadow-2xl shadow-black/30"
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(184,115,51,0.14),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(95,178,216,0.10),_transparent_22%)]" />

                {/* Header */}
                <div className="relative border-b border-white/8 px-6 py-6 lg:px-8">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center rounded-full border border-[#B87333]/25 bg-[#B87333]/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-[#E9BF84]">
                            Gerenciar Projetos
                        </div>
                        <h1 className="mt-4 font-[Manrope] text-3xl font-semibold text-white lg:text-5xl">
                            {editingId ? 'Editando Projeto' : 'Novo Projeto'}
                        </h1>
                        <p className="mt-3 text-sm text-white/60">
                            {editingId ? 'Atualize os detalhes do projeto.' : 'Preencha os detalhes e adicione imagens.'}
                        </p>
                    </div>
                </div>

                {/* Corpo do formulário */}
                <div className="relative z-10 grid gap-6 p-5 md:grid-cols-8 lg:gap-8 lg:p-8">
                    {/* Coluna esquerda */}
                    <div className="space-y-6 md:col-span-4">
                        {/* Básico */}
                        <section className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5 backdrop-blur lg:p-6">
                            <div className="mb-6">
                                <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">Básico</p>
                                <h2 className="mt-2 font-[Manrope] text-2xl font-semibold text-white">Detalhes</h2>
                            </div>
                            <div className="space-y-4">
                                <label className="block">
                                    <span className="mb-2 block text-sm font-medium text-white/82">Título *</span>
                                    <input
                                        type="text"
                                        name="titulo"
                                        value={form.titulo}
                                        onChange={handleFieldChange}
                                        required
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
                                        readOnly
                                        className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white/50 outline-none"
                                    />
                                </label>
                                <label className="block">
                                    <span className="mb-2 block text-sm font-medium text-white/82">Categoria</span>
                                    <input
                                        type="text"
                                        name="categoria"
                                        value={form.categoria}
                                        onChange={handleFieldChange}
                                        className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                                        placeholder="Ex: Web Design"
                                    />
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
                                    <span className="mb-2 block text-sm font-medium text-white/82">Data do Projeto</span>
                                    <input
                                        type="date"
                                        name="data_projeto"
                                        value={form.data_projeto}
                                        onChange={handleFieldChange}
                                        className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white outline-none transition focus:border-[#B87333]/40"
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
                        </section>

                        {/* Descrições */}
                        <section className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5 backdrop-blur lg:p-6">
                            <div className="mb-6">
                                <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">Conteúdo</p>
                                <h2 className="mt-2 font-[Manrope] text-2xl font-semibold text-white">Descrições</h2>
                            </div>
                            <div className="space-y-4">
                                <label className="block">
                                    <span className="mb-2 block text-sm font-medium text-white/82">Resumo Curto *</span>
                                    <textarea
                                        name="descricao"
                                        value={form.descricao}
                                        onChange={handleFieldChange}
                                        required
                                        rows={3}
                                        className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                                        placeholder="Breve descrição do projeto"
                                    />
                                </label>
                                <label className="block">
                                    <span className="mb-2 block text-sm font-medium text-white/82">Descrição Longa (PT)</span>
                                    <textarea
                                        name="descricao_longa"
                                        value={form.descricao_longa}
                                        onChange={handleFieldChange}
                                        rows={4}
                                        className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                                        placeholder="Detalhes do projeto em português"
                                    />
                                </label>
                                <label className="block">
                                    <span className="mb-2 block text-sm font-medium text-white/82">Descrição Longa (EN)</span>
                                    <textarea
                                        name="descricao_longa_en"
                                        value={form.descricao_longa_en}
                                        onChange={handleFieldChange}
                                        rows={4}
                                        className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                                        placeholder="Project details in English"
                                    />
                                </label>
                            </div>
                        </section>

                        {/* Imagem de capa */}
                        <section className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5 backdrop-blur lg:p-6">
                            <div className="mb-6">
                                <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">Imagem de Capa</p>
                                <h2 className="mt-2 font-[Manrope] text-2xl font-semibold text-white">Capa do Projeto</h2>
                            </div>
                            <ImageUploadSlot
                                title="Upload da imagem de capa"
                                description="Arraste ou clique para enviar"
                                onUpload={handleImageUpload}
                                isUploading={isUploading}
                                currentImageUrl={form.imagem_url}
                                multiple={true}
                            />
                            {form.imagem_url && (
                                <p className="mt-2 text-xs text-white/50 break-all">
                                    URL atual: {form.imagem_url}
                                </p>
                            )}
                        </section>

                        {/* Galeria */}
                        <section className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5 backdrop-blur lg:p-6">
                            <div className="mb-6">
                                <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">Galeria</p>
                                <h2 className="mt-2 font-[Manrope] text-2xl font-semibold text-white">Imagens</h2>
                            </div>

                            {gallery.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                                    {gallery.map((img) => (
                                        <div key={img.id} className="relative group">
                                            <img
                                                src={img.imagem_url}
                                                alt={img.legenda || 'Imagem da galeria'}
                                                className="w-full h-32 object-cover rounded-lg bg-[#141414]"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveGalleryImage(img)}
                                                className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <FaPlus className="rotate-45 text-sm" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <ImageUploadSlot
                                title="Adicionar à galeria"
                                description="Arraste ou clique para enviar"
                                onUpload={handleGalleryImageUpload}
                                isUploading={isUploadingGallery}
                            />
                            <p className="mt-2 text-sm text-white/60">
                                As imagens são vinculadas ao projeto após o upload.
                            </p>
                        </section>
                    </div>

                    {/* Coluna direita (Configurações, Links, etc.) */}
                    <aside className="space-y-6 md:col-span-4">
                        {/* Configurações */}
                        <section className="rounded-[28px] border border-white/8 bg-[#2F353B]/30 p-5 shadow-lg shadow-black/20">
                            <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">Configurações</p>
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
                                        className={`flex h-7 w-12 items-center rounded-full border border-[#B87333]/20 px-1 transition-all ${form.mostrar_home ? 'bg-[#B87333]/50' : 'bg-white/5'
                                            }`}
                                    >
                                        <span
                                            className={`h-5 w-5 rounded-full bg-[#B87333] transition-all ${form.mostrar_home ? 'ml-auto' : 'ml-0'
                                                }`}
                                        />
                                    </span>
                                </label>
                            </div>
                        </section>

                        {/* Links e Botões */}
                        <section className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5 backdrop-blur lg:p-6">
                            <div className="mb-6">
                                <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">Links</p>
                                <h2 className="mt-2 font-[Manrope] text-2xl font-semibold text-white">Ações</h2>
                            </div>
                            <div className="space-y-4">
                                <label className="block">
                                    <span className="mb-2 block text-sm font-medium text-white/82">URL do Site</span>
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
                                    <span className="mb-2 block text-sm font-medium text-white/82">Link (Behance)</span>
                                    <input
                                        type="text"
                                        name="link"
                                        value={form.link}
                                        onChange={handleFieldChange}
                                        className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                                        placeholder="https://behance.net/..."
                                    />
                                </label>
                                <label className="block">
                                    <span className="mb-2 block text-sm font-medium text-white/82">Texto do Botão</span>
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
                                    <span className="mb-2 block text-sm font-medium text-white/82">Segundo Link</span>
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
                                    <span className="mb-2 block text-sm font-medium text-white/82">Texto do Segundo Botão</span>
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
                                            `https://via.placeholder.com/150/141414/E9BF84?text=${proj.titulo.charAt(0)}`
                                        }
                                        alt={proj.titulo}
                                        className="w-16 h-10 object-cover rounded-lg flex-shrink-0 bg-black/20"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-white truncate flex items-center gap-2">
                                            {proj.titulo}
                                            <span
                                                className={`px-2 py-0.5 text-xs rounded-full capitalize ${proj.status === 'published'
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