import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';
import Button from '../components/UI/Button';
import ImageUploadSlot from '../components/UI/ImageUploadSlot';
import AdminLayout from '../components/Admin/AdminLayout';

import { API_URL } from '../lib/api.js';

const AdminAutores = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const { showToast, toastMessage, toastType, showToastMessage, hideToast } = useToast();

    const initialFormState = {
        nome: '',
        cargo: '',
        foto_url: '',
        bio: '',
        email: '',
        publicado: true,
    };

    const [autores, setAutores] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState(initialFormState);

    const fetchAutores = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/db/autores/query`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ operation: 'select', orderBy: { column: 'nome', ascending: true } }),
            });
            const payload = await res.json();
            if (!res.ok) throw new Error(payload.error || 'Erro ao buscar autores');
            setAutores(payload.data || []);
        } catch (error) {
            showToastMessage(error.message, 'error');
        } finally {
            setIsLoading(false);
        }
    }, [token, showToastMessage]);

    useEffect(() => {
        if (token) fetchAutores();
    }, [token, fetchAutores]);
    
    const handleFieldChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

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
            
            const imageUrl = `${API_URL}/api/storage/public/autores/${payload.data.path}`;
            setFormData(prev => ({ ...prev, foto_url: imageUrl }));
            showToastMessage('Foto enviada com sucesso!', 'success');
        } catch (err) {
            showToastMessage(err.message, 'error');
        } finally {
            setIsUploading(false);
        }
    }, [token, showToastMessage]);
    
    const resetForm = () => {
        setFormData(initialFormState);
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.nome || !formData.cargo) {
            showToastMessage('Nome e Cargo são obrigatórios.', 'error');
            return;
        }
        setIsSubmitting(true);
        

        let payload = { ...formData };
        const op = editingId ? 'update' : 'insert';
        const filters = editingId ? [{ column: 'id', operator: 'eq', value: editingId }] : [];

        if (!editingId) {
            // Novo autor: gera UUID como _id
            payload._id = uuidv4();
        } else {
            // Edição: nunca alterar o _id
            delete payload._id;
            delete payload.id;
        }

        try {
            const res = await fetch(`${API_URL}/api/db/autores/query`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ operation: op, filters, payload }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Erro ao salvar autor.');
            
            showToastMessage(`Autor ${editingId ? 'atualizado' : 'criado'} com sucesso!`, 'success');
            resetForm();
            await fetchAutores();
        } catch (err) {
            showToastMessage(err.message, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (autor) => {
        setEditingId(autor.id);
        setFormData({ ...initialFormState, ...autor });
        window.scrollTo(0, 0);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este autor?')) {
            try {
                const res = await fetch(`${API_URL}/api/db/autores/query`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ operation: 'delete', filters: [{ column: 'id', operator: 'eq', value: id }] }),
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

    const fields = [
        { name: 'nome', label: 'Nome do autor', placeholder: 'Ex: Robson Svicero', type: 'text', required: true, col: 'lg:col-span-1' },
        { name: 'cargo', label: 'Cargo', placeholder: 'Ex: Diretor de Arte & Design', type: 'text', required: true, col: 'lg:col-span-1' },
        { name: 'email', label: 'Email de contato', placeholder: 'contato@svicero.com', type: 'email', required: false, col: 'lg:col-span-2' },
    ];

    return (
        <AdminLayout toastProps={{ show: showToast, message: toastMessage, type: toastType, onClose: hideToast }}>
            <form onSubmit={handleSubmit} className="relative overflow-hidden rounded-[32px] border border-white/8 bg-[#181818] shadow-2xl shadow-black/30">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(184,115,51,0.14),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(95,178,216,0.10),_transparent_22%)]" />
                    <div className="relative border-b border-white/8 px-6 py-6 lg:px-8">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                            <div className="max-w-3xl">
                                <div className="inline-flex items-center rounded-full border border-[#B87333]/25 bg-[#B87333]/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-[#E9BF84]">
                                    Gerenciar Autores
                                </div>
                                <h1 className="mt-4 font-[Manrope] text-3xl font-semibold tracking-[-0.04em] text-white lg:text-5xl">
                                    {editingId ? 'Editando Perfil de Autor' : 'Adicionar Novo Autor'}
                                </h1>
                                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60 lg:text-base">
                                    Gerencie os perfis que assinam os conteúdos do studio.
                                </p>
                            </div>
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <button type="button" onClick={resetForm} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white/80 transition hover:bg-white/8">
                                    {editingId ? 'Cancelar Edição' : 'Limpar'}
                                </button>
                                <button type="submit" className="rounded-2xl bg-[#B87333] px-5 py-3 text-sm font-semibold text-[#141414] transition hover:brightness-110" disabled={isSubmitting || isUploading}>
                                    {isSubmitting ? 'Salvando...' : (editingId ? 'Atualizar Autor' : 'Publicar Autor')}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="relative grid gap-6 px-6 py-6 lg:grid-cols-12 lg:px-8 lg:py-8">
                        <div className="space-y-6 lg:col-span-8">
                            <section className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5 backdrop-blur lg:p-6">
                                <div className="mb-6"><p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">Identificação</p><h2 className="mt-2 font-[Manrope] text-2xl font-semibold text-white">Informações do Autor</h2></div>
                                <div className="grid gap-4 lg:grid-cols-2">
                                    {fields.map((field) => (
                                        <label key={field.name} className={`${field.col} block`}>
                                            <span className="mb-2 block text-sm font-medium text-white/82">
                                                {field.label}
                                                {field.required && <span className="ml-1 text-[#E9BF84]">*</span>}
                                            </span>
                                            <input type={field.type} name={field.name} value={formData[field.name] || ''} onChange={handleFieldChange} placeholder={field.placeholder} required={field.required} className="w-full rounded-2xl border border-white/10 bg-dark-bg/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"/>
                                        </label>
                                    ))}
                                </div>
                            </section>

                            <section className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5 backdrop-blur lg:p-6">
                                <div className="mb-6"><p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">Conteúdo</p><h2 className="mt-2 font-[Manrope] text-2xl font-semibold text-white">Biografia</h2></div>
                                <div className="grid gap-4">
                                    <label>
                                        <span className="mb-2 block text-sm font-medium text-white/82">Bio</span>
                                        <textarea name="bio" value={formData.bio} onChange={handleFieldChange} placeholder="Escreva uma biografia curta..." rows={4} className="w-full resize-y rounded-2xl border border-white/10 bg-dark-bg/70 px-4 py-4 text-sm leading-6 text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40" />
                                    </label>
                                </div>
                            </section>
                            
                            <section className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5 backdrop-blur lg:p-6">
                                <div className="mb-6"><p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">Mídia</p><h2 className="mt-2 font-[Manrope] text-2xl font-semibold text-white">Foto de Perfil</h2></div>
                                <ImageUploadSlot title="Foto de perfil do autor" description="Arraste ou clique para enviar (Recomendado: 400x400px)" currentImageUrl={formData.foto_url} onUpload={handleImageUpload} isUploading={isUploading} />
                            </section>
                        </div>
                        <aside className="space-y-6 lg:col-span-4">
                            <section className="rounded-[28px] border border-white/8 bg-[#2F353B]/30 p-5 shadow-lg shadow-black/20">
                                <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">Configurações</p>
                                <div className="mt-5 grid gap-3">
                                    <label className="flex items-center justify-between rounded-2xl border border-white/8 bg-dark-bg/55 px-4 py-4">
                                      <span className="text-sm text-white/82">Perfil público</span>
                                      <input type="checkbox" name="publicado" checked={formData.publicado} onChange={handleFieldChange} className="sr-only" />
                                      <span className={`flex h-7 w-12 items-center rounded-full border border-[#B87333]/20  px-1 ${formData.publicado ? 'bg-[#B87333]/50' : 'bg-white/5'}`}>
                                        <span className={`h-5 w-5 rounded-full bg-[#B87333] transition-all ${formData.publicado ? 'ml-auto' : 'ml-0'}`} />
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
                    {!isLoading && autores.length === 0 && <p className="p-6 text-white/60 bg-[#181818] rounded-2xl border border-white/8">Nenhum autor encontrado.</p>}
                    {autores.length > 0 && (
                        <div className="bg-[#181818] rounded-2xl border border-white/8">
                            <ul className="divide-y divide-white/8">
                                {autores.map(autor => (
                                    <li key={autor.id} className="flex items-center p-4 gap-4">
                                        <img src={autor.foto_url || `https://via.placeholder.com/150/141414/E9BF84?text=${autor.nome.charAt(0)}`} alt={autor.nome} className="w-12 h-12 object-cover rounded-full flex-shrink-0 bg-black/20" />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-white truncate flex items-center gap-2">{autor.nome}
                                                <span className={`px-2 py-0.5 text-xs rounded-full ${autor.publicado ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                                                    {autor.publicado ? 'Público' : 'Privado'}
                                                </span>
                                            </p>
                                            <p className="text-sm text-white/60 truncate">{autor.cargo}</p>
                                        </div>
                                        <div className="flex items-center gap-3 flex-shrink-0">
                                            <Button variant="outline" onClick={() => handleEdit(autor)}>Editar</Button>
                                            <Button variant="danger" onClick={() => handleDelete(autor.id)}>Excluir</Button>
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
