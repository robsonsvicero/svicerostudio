import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import Button from '../../components/UI/Button';
import ImageUploadSlot from '../../components/UI/ImageUploadSlot';
import AdminLayout from '../../components/Admin/AdminLayout';

import { API_URL } from '../../lib/api.js';

const AdminDepoimentos = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const { showToast, toastMessage, toastType, showToastMessage, hideToast } = useToast();

    const initialFormState = {
        nome: '',
        cargo: '',
        empresa: '',
        texto: '',
        nota: 5,
        imagem_autor_url: '',
        ativo: true,
        ordem: 0,
    };

    const [depoimentos, setDepoimentos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState(initialFormState);

    const fetchDepoimentos = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/db/depoimentos/query`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ operation: 'select', orderBy: { column: 'ordem', ascending: true } }),
            });
            const payload = await res.json();
            if (!res.ok) throw new Error(payload.error || 'Erro ao buscar depoimentos');
            setDepoimentos(payload.data || []);
        } catch (error) {
            showToastMessage(error.message, 'error');
        } finally {
            setIsLoading(false);
        }
    }, [token, showToastMessage]);

    useEffect(() => {
        if (token) fetchDepoimentos();
    }, [token, fetchDepoimentos]);
    
    const handleFieldChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleImageUpload = useCallback(async (file) => {
        if (!file) {
            setFormData(prev => ({ ...prev, imagem_autor_url: '' }));
            return;
        }
        setIsUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        uploadFormData.append('bucket', 'autores'); // Reusing 'autores' bucket
        uploadFormData.append('key', `${Date.now()}_${file.name}`);

        try {
            const res = await fetch(`${API_URL}/api/storage/upload`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: uploadFormData,
            });
            const payload = await res.json();
            if (!res.ok) throw new Error(payload.error || 'Falha no upload');
            
            const imageUrl = `${API_URL}/api/storage/public/autores/${payload.data.path}`;
            setFormData(prev => ({ ...prev, imagem_autor_url: imageUrl }));
            showToastMessage('Imagem enviada!', 'success');
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
        if (!formData.nome || !formData.texto) {
            showToastMessage('Nome e texto do depoimento são obrigatórios.', 'error');
            return;
        }
        setIsSubmitting(true);
        
        const payload = { ...formData, nota: parseInt(formData.nota), ordem: parseInt(formData.ordem) };
        const op = editingId ? 'update' : 'insert';
        const filters = editingId ? [{ column: 'id', operator: 'eq', value: editingId }] : [];

        try {
            const res = await fetch(`${API_URL}/api/db/depoimentos/query`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ operation: op, filters, payload }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Erro ao salvar depoimento.');
            
            showToastMessage(`Depoimento ${editingId ? 'atualizado' : 'criado'}!`, 'success');
            resetForm();
            await fetchDepoimentos();
        } catch (err) {
            showToastMessage(err.message, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (depoimento) => {
        setEditingId(depoimento.id);
        setFormData({ ...initialFormState, ...depoimento });
        window.scrollTo(0, 0);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir?')) {
            try {
                const res = await fetch(`${API_URL}/api/db/depoimentos/query`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ operation: 'delete', filters: [{ column: 'id', operator: 'eq', value: id }] }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Erro ao excluir');
                showToastMessage('Depoimento excluído.', 'success');
                await fetchDepoimentos();
            } catch (err) {
                showToastMessage(err.message, 'error');
            }
        }
    };

    const fields = [
        { name: 'nome', label: 'Nome do autor', placeholder: 'Ex: João da Silva', type: 'text', required: true, col: 'lg:col-span-1' },
        { name: 'cargo', label: 'Cargo', placeholder: 'Ex: CEO, Sócio-fundador', type: 'text', required: false, col: 'lg:col-span-1' },
        { name: 'empresa', label: 'Empresa', placeholder: 'Ex: Inovatech', type: 'text', required: false, col: 'lg:col-span-1' },
        { name: 'nota', label: 'Nota (1 a 5)', placeholder: '5', type: 'select', required: true, options: [5,4,3,2,1].map(n => ({ value: n, label: `${n} estrela(s)` })), col: 'lg:col-span-1' },
    ];

    return (
        <AdminLayout toastProps={{ show: showToast, message: toastMessage, type: toastType, onClose: hideToast }}>
            <form onSubmit={handleSubmit} className="relative overflow-hidden rounded-[32px] border border-white/8 bg-[#181818] shadow-2xl shadow-black/30">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(184,115,51,0.14),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(95,178,216,0.10),_transparent_22%)]" />
                    <div className="relative border-b border-white/8 px-6 py-6 lg:px-8">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                            <div className="max-w-3xl">
                                <div className="inline-flex items-center rounded-full border border-[#B87333]/25 bg-[#B87333]/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-[#E9BF84]">
                                    Gerenciar Depoimentos
                                </div>
                                <h1 className="mt-4 font-[Manrope] text-3xl font-semibold tracking-[-0.04em] text-white lg:text-5xl">
                                    {editingId ? 'Editando Depoimento' : 'Adicionar Prova Social'}
                                </h1>
                                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60 lg:text-base">
                                    Gerencie os feedbacks que constroem a reputação do studio.
                                </p>
                            </div>
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <button type="button" onClick={resetForm} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white/80 transition hover:bg-white/8">
                                    {editingId ? 'Cancelar Edição' : 'Limpar'}
                                </button>
                                <button type="submit" className="rounded-2xl bg-[#B87333] px-5 py-3 text-sm font-semibold text-[#141414] transition hover:brightness-110" disabled={isSubmitting || isUploading}>
                                    {isSubmitting ? 'Salvando...' : (editingId ? 'Atualizar' : 'Publicar')}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="relative grid gap-6 px-6 py-6 lg:grid-cols-12 lg:px-8 lg:py-8">
                        <div className="space-y-6 lg:col-span-8">
                            <section className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5 backdrop-blur lg:p-6">
                                <div className="mb-6"><p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">Informações</p><h2 className="mt-2 font-[Manrope] text-2xl font-semibold text-white">Dados do Autor</h2></div>
                                <div className="grid gap-4 lg:grid-cols-2">
                                    {fields.map((field) => (
                                        <label key={field.name} className={`${field.col} block`}>
                                            <span className="mb-2 block text-sm font-medium text-white/82">
                                                {field.label}
                                                {field.required && <span className="ml-1 text-[#E9BF84]">*</span>}
                                            </span>
                                            {field.type === 'select' ? (
                                                <select name={field.name} value={formData[field.name]} onChange={handleFieldChange} required={field.required} className="w-full rounded-2xl border border-white/10 bg-dark-bg/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40">
                                                    <option value="" disabled>{field.placeholder}</option>
                                                    {field.options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                                </select>
                                            ) : (
                                                <input type={field.type} name={field.name} value={formData[field.name] || ''} onChange={handleFieldChange} placeholder={field.placeholder} required={field.required} className="w-full rounded-2xl border border-white/10 bg-dark-bg/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"/>
                                            )}
                                        </label>
                                    ))}
                                </div>
                            </section>

                            <section className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5 backdrop-blur lg:p-6">
                                <div className="mb-6"><p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">Conteúdo</p><h2 className="mt-2 font-[Manrope] text-2xl font-semibold text-white">Texto do Depoimento</h2></div>
                                <div className="grid gap-4">
                                    <label>
                                        <span className="mb-2 block text-sm font-medium text-white/82">Depoimento</span>
                                        <textarea name="texto" value={formData.texto} onChange={handleFieldChange} placeholder="Escreva o depoimento aqui..." rows={6} required className="w-full resize-y rounded-2xl border border-white/10 bg-dark-bg/70 px-4 py-4 text-sm leading-6 text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40" />
                                    </label>
                                </div>
                            </section>
                            
                            <section className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5 backdrop-blur lg:p-6">
                                <div className="mb-6"><p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">Mídia</p><h2 className="mt-2 font-[Manrope] text-2xl font-semibold text-white">Foto do Autor</h2></div>
                                <ImageUploadSlot title="Foto do autor" description="Arraste ou clique para enviar" currentImageUrl={formData.imagem_autor_url} onUpload={handleImageUpload} isUploading={isUploading} />
                            </section>
                        </div>
                        <aside className="space-y-6 lg:col-span-4">
                            <section className="rounded-[28px] border border-white/8 bg-[#2F353B]/30 p-5 shadow-lg shadow-black/20">
                                <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">Configurações</p>
                                <div className="mt-5 grid gap-3">
                                    <label className="flex items-center justify-between rounded-2xl border border-white/8 bg-dark-bg/55 px-4 py-4">
                                      <span className="text-sm text-white/82">Depoimento ativo</span>
                                      <input type="checkbox" name="ativo" checked={formData.ativo} onChange={handleFieldChange} className="sr-only" />
                                      <span className={`flex h-7 w-12 items-center rounded-full border border-[#B87333]/20  px-1 ${formData.ativo ? 'bg-[#B87333]/50' : 'bg-white/5'}`}>
                                        <span className={`h-5 w-5 rounded-full bg-[#B87333] transition-all ${formData.ativo ? 'ml-auto' : 'ml-0'}`} />
                                      </span>
                                    </label>
                                    <label className="block rounded-2xl border border-white/8 bg-dark-bg/55 px-4 py-4">
                                      <span className="mb-2 block text-sm text-white/82">Ordem de exibição</span>
                                      <input type="number" name="ordem" value={formData.ordem} onChange={handleFieldChange} placeholder="0" className="w-full rounded-lg border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none" />
                                    </label>
                                </div>
                            </section>
                        </aside>
                    </div>
                </form>

                <div className="mt-16">
                    <h2 className="text-2xl font-semibold text-white mb-6">Depoimentos Cadastrados</h2>
                    {isLoading && <p className="text-white/60">Carregando...</p>}
                    {!isLoading && depoimentos.length === 0 && <p className="p-6 text-white/60 bg-[#181818] rounded-2xl border border-white/8">Nenhum depoimento encontrado.</p>}
                    {depoimentos.length > 0 && (
                        <div className="bg-[#181818] rounded-2xl border border-white/8">
                            <ul className="divide-y divide-white/8">
                                {depoimentos.map(depoimento => (
                                    <li key={depoimento.id} className="flex items-center p-4 gap-4">
                                        <img src={depoimento.imagem_autor_url || `https://via.placeholder.com/150/141414/E9BF84?text=${depoimento.nome.charAt(0)}`} alt={depoimento.nome} className="w-12 h-12 object-cover rounded-full flex-shrink-0 bg-black/20" />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-white truncate flex items-center gap-2">{depoimento.nome} 
                                                <span className={`px-2 py-0.5 text-xs rounded-full ${depoimento.ativo ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                                                    {depoimento.ativo ? 'Ativo' : 'Inativo'}
                                                </span>
                                            </p>
                                            <p className="text-sm text-white/60 truncate">"{depoimento.texto}"</p>
                                        </div>
                                        <div className="flex items-center gap-3 flex-shrink-0">
                                            <Button variant="outline" onClick={() => handleEdit(depoimento)}>Editar</Button>
                                            <Button variant="danger" onClick={() => handleDelete(depoimento.id)}>Excluir</Button>
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

export default AdminDepoimentos;
