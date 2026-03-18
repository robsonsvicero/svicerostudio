// src/pages/admin/AdminAutores.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from "../../contexts/AuthContext";
import { API_URL } from "../../lib/api.js"; // Certifique-se de que este caminho está correto
import { useToast } from "../../hooks/useToast"; // Certifique-se de que este caminho está correto
import Button from "../../components/UI/Button.jsx"; // Certifique-se de que este caminho está correto
import ImageUploadSlot from "../../components/UI/ImageUploadSlot.jsx"; // Certifique-se de que este caminho está correto
import AdminLayout from "../../components/Admin/AdminLayout.jsx"; // Certifique-se de que este caminho está correto
import { generateSlug } from '../../utils/slugGenerator'; // Importa a função de slug

const AdminAutores = () => {
    const { token } = useAuth();
    const { showToast, toastMessage, toastType, showToastMessage, hideToast } = useToast();

    // Estado inicial do formulário, agora incluindo 'slug'
    const initialFormData = {
        nome: '',
        cargo: '',
        foto_url: '',
        bio: '',
        email: '',
        publicado: true,
        slug: '' // Adicionado o campo slug
    };

    const [autores, setAutores] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [editingAuthorId, setEditingAuthorId] = useState(null);
    const [formData, setFormData] = useState(initialFormData);

    // Função para buscar autores
    const fetchAutores = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/db/autores/query`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    operation: 'select',
                    orderBy: {
                        column: 'nome',
                        ascending: true
                    }
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Erro ao buscar autores');
            setAutores(data.data || []);
        } catch (err) {
            showToastMessage(err.message, 'error');
        } finally {
            setIsLoading(false);
        }
    }, [token, showToastMessage]);

    useEffect(() => {
        if (token) {
            fetchAutores();
        }
    }, [token, fetchAutores]);

    // Handler para mudanças nos inputs do formulário
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => {
            const newState = {
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            };

            // Gera o slug automaticamente quando o nome muda
            if (name === 'nome') {
                newState.slug = generateSlug(value);
            }
            return newState;
        });
    };

    // Handler para upload de imagem
    const handleImageUpload = useCallback(async (file) => {
        if (!file) {
            setFormData(prev => ({ ...prev, foto_url: '' }));
            return;
        }
        setIsUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        uploadFormData.append('bucket', 'autores');
        uploadFormData.append('key', `${Date.now()}_${file.name}`);

        try {
            const res = await fetch(`${API_URL}/api/storage/upload`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: uploadFormData,
            });
            const payload = await res.json();
            if (!res.ok) throw new Error(payload.error || 'Falha no upload da foto');

            const imageUrl = payload.data?.url
                || `${API_URL}/api/storage/public/autores/${payload.data.path}`;
            setFormData(prev => ({ ...prev, foto_url: imageUrl }));
            showToastMessage('Foto enviada com sucesso!', 'success');
        } catch (err) {
            showToastMessage(err.message, 'error');
        } finally {
            setIsUploading(false);
        }
    }, [token, showToastMessage]);

    // Limpa o formulário e o ID de edição
    const clearForm = () => {
        setFormData(initialFormData);
        setEditingAuthorId(null);
    };

    // Handler para salvar autor (criar ou atualizar)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.nome || !formData.cargo) {
            showToastMessage('Nome e Cargo são obrigatórios.', 'error');
            return;
        }
        setIsSaving(true);

        const payloadToSend = { ...formData };
        const operation = editingAuthorId ? 'update' : 'insert';
        const filters = editingAuthorId ? [{ column: 'id', operator: 'eq', value: editingAuthorId }] : [];

        // Remove id e _id do payload se for atualização para evitar problemas com o DB
        if (editingAuthorId) {
            delete payloadToSend.id;
            delete payloadToSend._id;
        }

        try {
            const res = await fetch(`${API_URL}/api/db/autores/query`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    operation: operation,
                    filters: filters,
                    payload: payloadToSend
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Erro ao salvar autor.');

            showToastMessage(`Autor ${editingAuthorId ? 'atualizado' : 'criado'} com sucesso!`, 'success');
            clearForm();
            await fetchAutores();
        } catch (err) {
            showToastMessage(err.message, 'error');
        } finally {
            setIsSaving(false);
        }
    };

    // Handler para editar autor
    const handleEditAuthor = (author) => {
        setEditingAuthorId(author.id);
        setFormData({ ...initialFormData, ...author }); // Preenche o formulário com os dados do autor
        window.scrollTo(0, 0); // Rola para o topo da página
    };

    // Handler para excluir autor
    const handleDeleteAuthor = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este autor?')) {
            try {
                const res = await fetch(`${API_URL}/api/db/autores/query`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        operation: 'delete',
                        filters: [{ column: 'id', operator: 'eq', value: id }]
                    })
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Erro ao excluir autor');

                showToastMessage('Autor excluído.', 'success');
                await fetchAutores();
            } catch (err) {
                showToastMessage(err.message, 'error');
            }
        }
    };

    return (
        <AdminLayout
            toastProps={{
                show: showToast,
                message: toastMessage,
                type: toastType,
                onClose: hideToast
            }}
        >
            <form onSubmit={handleSubmit} className="relative overflow-hidden rounded-[32px] border border-white/8 bg-[#181818] shadow-2xl shadow-black/30">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(184,115,51,0.14),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(95,178,216,0.10),_transparent_22%)]"></div>
                <div className="relative border-b border-white/8 px-6 py-6 lg:px-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-3xl">
                            <div className="inline-flex items-center rounded-full border border-[#B87333]/25 bg-[#B87333]/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-[#E9BF84]">
                                Gerenciar Autores
                            </div>
                            <h1 className="mt-4 font-[Manrope] text-3xl font-semibold tracking-[-0.04em] text-white lg:text-5xl">
                                {editingAuthorId ? 'Editando Perfil de Autor' : 'Adicionar Novo Autor'}
                            </h1>
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60 lg:text-base">
                                Gerencie os perfis que assinam os conteúdos do studio.
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={clearForm}
                            >
                                {editingAuthorId ? 'Cancelar Edição' : 'Limpar'}
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={isSaving || isUploading}
                            >
                                {isSaving ? 'Salvando...' : editingAuthorId ? 'Atualizar Autor' : 'Publicar Autor'}
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="relative grid gap-6 px-6 py-6 lg:grid-cols-12 lg:px-8 lg:py-8">
                    <div className="space-y-6 lg:col-span-8">
                        <section className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5 backdrop-blur lg:p-6">
                            <div className="mb-6">
                                <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">Identificação</p>
                                <h2 className="mt-2 font-[Manrope] text-2xl font-semibold text-white">Informações do Autor</h2>
                            </div>
                            <div className="grid gap-4 lg:grid-cols-2">
                                {/* Campo Nome */}
                                <label className="lg:col-span-1 block">
                                    <span className="mb-2 block text-sm font-medium text-white/82">Nome do autor <span className="ml-1 text-[#E9BF84]">*</span></span>
                                    <input
                                        type="text"
                                        name="nome"
                                        value={formData.nome || ''}
                                        onChange={handleInputChange}
                                        placeholder="Ex: Robson Svicero"
                                        required
                                        className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                                    />
                                </label>
                                {/* Campo Cargo */}
                                <label className="lg:col-span-1 block">
                                    <span className="mb-2 block text-sm font-medium text-white/82">Cargo <span className="ml-1 text-[#E9BF84]">*</span></span>
                                    <input
                                        type="text"
                                        name="cargo"
                                        value={formData.cargo || ''}
                                        onChange={handleInputChange}
                                        placeholder="Ex: Diretor de Arte & Design"
                                        required
                                        className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                                    />
                                </label>
                                {/* Campo Email */}
                                <label className="lg:col-span-2 block">
                                    <span className="mb-2 block text-sm font-medium text-white/82">Email de contato</span>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email || ''}
                                        onChange={handleInputChange}
                                        placeholder="contato@svicero.com"
                                        className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                                    />
                                </label>
                                {/* Campo Slug (NOVO) */}
                                <label className="lg:col-span-2 block">
                                    <span className="mb-2 block text-sm font-medium text-white/82">Slug (URL amigável)</span>
                                    <input
                                        type="text"
                                        name="slug"
                                        value={formData.slug || ''}
                                        onChange={handleInputChange}
                                        placeholder="Ex: robson-svicero"
                                        className="w-full rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                                    />
                                </label>
                            </div>
                        </section>

                        <section className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5 backdrop-blur lg:p-6">
                            <div className="mb-6">
                                <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">Conteúdo</p>
                                <h2 className="mt-2 font-[Manrope] text-2xl font-semibold text-white">Biografia</h2>
                            </div>
                            <div className="grid gap-4">
                                <label>
                                    <span className="mb-2 block text-sm font-medium text-white/82">Bio</span>
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleInputChange}
                                        placeholder="Escreva uma biografia curta..."
                                        rows={4}
                                        className="w-full resize-y rounded-2xl border border-white/10 bg-[#141414]/70 px-4 py-4 text-sm leading-6 text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                                    ></textarea>
                                </label>
                            </div>
                        </section>

                        <section className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5 backdrop-blur lg:p-6">
                            <div className="mb-6">
                                <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">Mídia</p>
                                <h2 className="mt-2 font-[Manrope] text-2xl font-semibold text-white">Foto de Perfil</h2>
                            </div>
                            <ImageUploadSlot
                                title="Foto de perfil do autor"
                                description="Arraste ou clique para enviar (Recomendado: 400x400px)"
                                currentImageUrl={formData.foto_url}
                                onUpload={handleImageUpload}
                                isUploading={isUploading}
                            />
                        </section>
                    </div>

                    <aside className="space-y-6 lg:col-span-4">
                        <section className="rounded-[28px] border border-white/8 bg-[#2F353B]/30 p-5 shadow-lg shadow-black/20">
                            <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">Configurações</p>
                            <div className="mt-5 grid gap-3">
                                <label className="flex items-center justify-between rounded-2xl border border-white/8 bg-[#141414]/55 px-4 py-4">
                                    <span className="text-sm text-white/82">Perfil público</span>
                                    <input
                                        type="checkbox"
                                        name="publicado"
                                        checked={formData.publicado}
                                        onChange={handleInputChange}
                                        className="sr-only"
                                    />
                                    <span className={`flex h-7 w-12 items-center rounded-full border border-[#B87333]/20 px-1 ${formData.publicado ? 'bg-[#B87333]/50' : 'bg-white/5'}`}>
                                        <span className={`h-5 w-5 rounded-full bg-[#B87333] transition-all ${formData.publicado ? 'ml-auto' : 'ml-0'}`}></span>
                                    </span>
                                </label>
                            </div>
                        </section>
                    </aside>
                </div>
            </form>

            <div className="mt-16">
                <h2 className="text-2xl font-semibold text-white mb-6">Autores Cadastrados</h2>
                {isLoading && <p className="text-white/60">Carregando...</p>}
                {!isLoading && autores.length === 0 && (
                    <p className="p-6 text-white/60 bg-[#181818] rounded-2xl border border-white/8">Nenhum autor encontrado.</p>
                )}
                {autores.length > 0 && (
                    <div className="bg-[#181818] rounded-2xl border border-white/8">
                        <ul className="divide-y divide-white/8">
                            {autores.map(author => (
                                <li key={author.id} className="flex items-center p-4 gap-4">
                                    <img
                                        src={author.foto_url || `https://via.placeholder.com/150/141414/E9BF84?text=${author.nome.charAt(0)}`}
                                        alt={author.nome}
                                        className="w-12 h-12 object-cover rounded-full flex-shrink-0 bg-black/20"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-white truncate flex items-center gap-2">
                                            {author.nome}
                                            <span className={`px-2 py-0.5 text-xs rounded-full ${author.publicado ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                                                {author.publicado ? 'Público' : 'Privado'}
                                            </span>
                                        </p>
                                        <p className="text-sm text-white/60 truncate">{author.cargo}</p>
                                        {author.slug && <p className="text-xs text-white/40 truncate">Slug: /{author.slug}</p>}
                                    </div>
                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        <Button variant="outline" onClick={() => handleEditAuthor(author)}>Editar</Button>
                                        <Button variant="danger" onClick={() => handleDeleteAuthor(author.id)}>Excluir</Button>
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

export default AdminAutores;