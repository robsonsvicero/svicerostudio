import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import Button from '../../components/UI/Button';
import ImageUploadSlot from '../../components/UI/ImageUploadSlot';
import AdminLayout from '../../components/Admin/AdminLayout';

import { API_URL } from '../../lib/api.js';
import { getAvatarPlaceholder, getNameInitials } from '../../utils/placeholders';

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

    // Redesign dashboard: Testimonials management with consistent SaaS styling
    return (
        <AdminLayout
          title="Depoimentos"
          actions={
            <div className="flex items-center gap-3">
              <Button type="button" onClick={resetForm} className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-muted hover:text-cream hover:bg-white/10 transition">
                {editingId ? 'Cancelar' : 'Limpar'}
              </Button>
            </div>
          }
          toastProps={{ show: showToast, message: toastMessage, type: toastType, onClose: hideToast }}
        >
          {/* Form */}
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="grid gap-6 lg:grid-cols-12">
              <div className="space-y-6 lg:col-span-8">
                {/* Author info */}
                <div className="rounded-xl border border-white/5 bg-surface p-6">
                  <div className="mb-5">
                    <p className="text-xs font-mono uppercase tracking-widest text-copper mb-1">Informações</p>
                    <h2 className="text-base font-semibold text-cream">{editingId ? 'Editando Depoimento' : 'Novo Depoimento'}</h2>
                  </div>
                  <div className="grid gap-4 lg:grid-cols-2">
                    {fields.map((field) => (
                      <label key={field.name} className={`${field.col} block`}>
                        <span className="mb-1.5 block text-sm font-medium text-muted">
                          {field.label}
                          {field.required && <span className="ml-1 text-copper">*</span>}
                        </span>
                        {field.type === 'select' ? (
                          <select name={field.name} value={formData[field.name]} onChange={handleFieldChange} required={field.required} className="w-full rounded-lg border border-white/10 bg-charcoal px-4 py-3 text-sm text-cream outline-none transition focus:border-copper/40 focus:ring-1 focus:ring-copper/20">
                            <option value="" disabled>{field.placeholder}</option>
                            {field.options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                          </select>
                        ) : (
                          <input type={field.type} name={field.name} value={formData[field.name] || ''} onChange={handleFieldChange} placeholder={field.placeholder} required={field.required} className="w-full rounded-lg border border-white/10 bg-charcoal px-4 py-3 text-sm text-cream placeholder:text-muted/50 outline-none transition focus:border-copper/40 focus:ring-1 focus:ring-copper/20" />
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Testimonial text */}
                <div className="rounded-xl border border-white/5 bg-surface p-6">
                  <div className="mb-5">
                    <p className="text-xs font-mono uppercase tracking-widest text-copper mb-1">Conteúdo</p>
                    <h2 className="text-base font-semibold text-cream">Texto do Depoimento</h2>
                  </div>
                  <label>
                    <span className="mb-1.5 block text-sm font-medium text-muted">Depoimento</span>
                    <textarea name="texto" value={formData.texto} onChange={handleFieldChange} placeholder="Escreva o depoimento aqui..." rows={6} required className="w-full resize-y rounded-lg border border-white/10 bg-charcoal px-4 py-3 text-sm leading-6 text-cream placeholder:text-muted/50 outline-none transition focus:border-copper/40 focus:ring-1 focus:ring-copper/20" />
                  </label>
                </div>

                {/* Photo */}
                <div className="rounded-xl border border-white/5 bg-surface p-6">
                  <div className="mb-5">
                    <p className="text-xs font-mono uppercase tracking-widest text-copper mb-1">Mídia</p>
                    <h2 className="text-base font-semibold text-cream">Foto do Autor</h2>
                  </div>
                  <ImageUploadSlot title="Foto do autor" description="Arraste ou clique para enviar" currentImageUrl={formData.imagem_autor_url} onUpload={handleImageUpload} isUploading={isUploading} />
                </div>
              </div>

              {/* Sidebar */}
              <aside className="space-y-6 lg:col-span-4">
                <div className="rounded-xl border border-white/5 bg-surface p-5">
                  <p className="text-xs font-mono uppercase tracking-widest text-copper mb-4">Configurações</p>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between rounded-lg border border-white/5 bg-charcoal px-4 py-3.5 cursor-pointer hover:border-white/10 transition-colors">
                      <span className="text-sm text-cream">Depoimento ativo</span>
                      <input type="checkbox" name="ativo" checked={formData.ativo} onChange={handleFieldChange} className="sr-only" />
                      <span className={`flex h-6 w-11 items-center rounded-full border border-copper/20 px-0.5 transition-colors ${formData.ativo ? 'bg-copper/40' : 'bg-white/5'}`}>
                        <span className={`h-5 w-5 rounded-full bg-copper transition-all ${formData.ativo ? 'ml-auto' : 'ml-0'}`} />
                      </span>
                    </label>
                    <label className="block rounded-lg border border-white/5 bg-charcoal px-4 py-3.5 hover:border-white/10 transition-colors">
                      <span className="mb-1.5 block text-sm text-cream">Ordem de exibição</span>
                      <input type="number" name="ordem" value={formData.ordem} onChange={handleFieldChange} placeholder="0" className="w-full rounded-lg border border-white/10 bg-surface px-3 py-2 text-sm text-cream outline-none focus:border-copper/40" />
                    </label>
                  </div>
                  <Button type="submit" className="mt-4 w-full rounded-lg bg-copper px-5 py-3 text-sm font-semibold text-white hover:brightness-110 transition" disabled={isSubmitting || isUploading}>
                    {isSubmitting ? 'Salvando...' : (editingId ? 'Atualizar' : 'Publicar')}
                  </Button>
                </div>
              </aside>
            </div>
          </form>

          {/* List */}
          <div className="rounded-xl border border-white/5 bg-surface">
            <div className="border-b border-white/5 px-6 py-4">
              <h2 className="text-base font-semibold text-cream">
                Depoimentos Cadastrados
                {!isLoading && <span className="ml-2 text-sm font-normal text-muted">({depoimentos.length})</span>}
              </h2>
            </div>
            {isLoading && <p className="p-6 text-muted">Carregando...</p>}
            {!isLoading && depoimentos.length === 0 && <p className="p-6 text-muted">Nenhum depoimento encontrado.</p>}
            {depoimentos.length > 0 && (
              <ul className="divide-y divide-white/5">
                {depoimentos.map(depoimento => (
                  <li key={depoimento.id} className="flex items-center px-6 py-4 gap-4 hover:bg-white/[.02] transition-colors">
                    <img src={depoimento.imagem_autor_url || getAvatarPlaceholder(getNameInitials(depoimento.nome), '141414', 150)} alt={depoimento.nome} className="w-10 h-10 object-cover rounded-full flex-shrink-0 bg-charcoal" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-cream truncate flex items-center gap-2">
                        {depoimento.nome}
                        <span className={`px-2 py-0.5 text-xs rounded-md font-medium ${depoimento.ativo ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                          {depoimento.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </p>
                      <p className="text-xs text-muted truncate">"{depoimento.texto}"</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button onClick={() => handleEdit(depoimento)} className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-muted hover:text-cream hover:bg-white/10 transition">Editar</Button>
                      <Button onClick={() => handleDelete(depoimento.id)} className="rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/15 transition">Excluir</Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
    </AdminLayout>
    );
};

export default AdminDepoimentos;

