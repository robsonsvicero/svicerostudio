// src/pages/admin/AdminAutores.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from "../../contexts/AuthContext";
import { API_URL } from "../../lib/api.js"; // Certifique-se de que este caminho está correto
import { useToast } from "../../hooks/useToast"; // Certifique-se de que este caminho está correto
import Button from "../../components/UI/Button.jsx"; // Certifique-se de que este caminho está correto
import ImageUploadSlot from "../../components/UI/ImageUploadSlot.jsx"; // Certifique-se de que este caminho está correto
import AdminLayout from "../../components/Admin/AdminLayout.jsx"; // Certifique-se de que este caminho está correto
import { generateSlug } from '../../utils/slugGenerator'; // Importa a função de slug
import { getAvatarPlaceholder } from '../../utils/placeholders';

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

    // Redesign dashboard: Authors management with consistent SaaS styling
    return (
        <AdminLayout
          title="Autores"
          actions={
            <div className="flex items-center gap-3">
              <Button type="button" onClick={clearForm} className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-muted hover:text-cream hover:bg-white/10 transition">
                {editingAuthorId ? 'Cancelar' : 'Limpar'}
              </Button>
            </div>
          }
          toastProps={{ show: showToast, message: toastMessage, type: toastType, onClose: hideToast }}
        >
          {/* Form */}
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="grid gap-6 lg:grid-cols-12">
              <div className="space-y-6 lg:col-span-8">
                {/* Author identification */}
                <div className="rounded-xl border border-white/5 bg-surface p-6">
                  <div className="mb-5">
                    <p className="text-xs font-mono uppercase tracking-widest text-copper mb-1">Identificação</p>
                    <h2 className="text-base font-semibold text-cream">{editingAuthorId ? 'Editando Autor' : 'Novo Autor'}</h2>
                  </div>
                  <div className="grid gap-4 lg:grid-cols-2">
                    <label className="lg:col-span-1 block">
                      <span className="mb-1.5 block text-sm font-medium text-muted">Nome do autor <span className="ml-1 text-copper">*</span></span>
                      <input type="text" name="nome" value={formData.nome || ''} onChange={handleInputChange} placeholder="Ex: Robson Svicero" required className="w-full rounded-lg border border-white/10 bg-charcoal px-4 py-3 text-sm text-cream placeholder:text-muted/50 outline-none transition focus:border-copper/40 focus:ring-1 focus:ring-copper/20" />
                    </label>
                    <label className="lg:col-span-1 block">
                      <span className="mb-1.5 block text-sm font-medium text-muted">Cargo <span className="ml-1 text-copper">*</span></span>
                      <input type="text" name="cargo" value={formData.cargo || ''} onChange={handleInputChange} placeholder="Ex: Diretor de Arte & Design" required className="w-full rounded-lg border border-white/10 bg-charcoal px-4 py-3 text-sm text-cream placeholder:text-muted/50 outline-none transition focus:border-copper/40 focus:ring-1 focus:ring-copper/20" />
                    </label>
                    <label className="lg:col-span-2 block">
                      <span className="mb-1.5 block text-sm font-medium text-muted">Email de contato</span>
                      <input type="email" name="email" value={formData.email || ''} onChange={handleInputChange} placeholder="contato@svicero.com" className="w-full rounded-lg border border-white/10 bg-charcoal px-4 py-3 text-sm text-cream placeholder:text-muted/50 outline-none transition focus:border-copper/40 focus:ring-1 focus:ring-copper/20" />
                    </label>
                    <label className="lg:col-span-2 block">
                      <span className="mb-1.5 block text-sm font-medium text-muted">Slug (URL amigável)</span>
                      <input type="text" name="slug" value={formData.slug || ''} onChange={handleInputChange} placeholder="Ex: robson-svicero" className="w-full rounded-lg border border-white/10 bg-charcoal px-4 py-3 text-sm text-cream placeholder:text-muted/50 outline-none transition focus:border-copper/40 focus:ring-1 focus:ring-copper/20" />
                    </label>
                  </div>
                </div>

                {/* Bio */}
                <div className="rounded-xl border border-white/5 bg-surface p-6">
                  <div className="mb-5">
                    <p className="text-xs font-mono uppercase tracking-widest text-copper mb-1">Conteúdo</p>
                    <h2 className="text-base font-semibold text-cream">Biografia</h2>
                  </div>
                  <label>
                    <span className="mb-1.5 block text-sm font-medium text-muted">Bio</span>
                    <textarea name="bio" value={formData.bio} onChange={handleInputChange} placeholder="Escreva uma biografia curta..." rows={4} className="w-full resize-y rounded-lg border border-white/10 bg-charcoal px-4 py-3 text-sm leading-6 text-cream placeholder:text-muted/50 outline-none transition focus:border-copper/40 focus:ring-1 focus:ring-copper/20" />
                  </label>
                </div>

                {/* Photo */}
                <div className="rounded-xl border border-white/5 bg-surface p-6">
                  <div className="mb-5">
                    <p className="text-xs font-mono uppercase tracking-widest text-copper mb-1">Mídia</p>
                    <h2 className="text-base font-semibold text-cream">Foto de Perfil</h2>
                  </div>
                  <ImageUploadSlot title="Foto de perfil do autor" description="Arraste ou clique para enviar (Recomendado: 400x400px)" currentImageUrl={formData.foto_url} onUpload={handleImageUpload} isUploading={isUploading} />
                </div>
              </div>

              {/* Sidebar */}
              <aside className="space-y-6 lg:col-span-4">
                <div className="rounded-xl border border-white/5 bg-surface p-5">
                  <p className="text-xs font-mono uppercase tracking-widest text-copper mb-4">Configurações</p>
                  <label className="flex items-center justify-between rounded-lg border border-white/5 bg-charcoal px-4 py-3.5 cursor-pointer hover:border-white/10 transition-colors">
                    <span className="text-sm text-cream">Perfil público</span>
                    <input type="checkbox" name="publicado" checked={formData.publicado} onChange={handleInputChange} className="sr-only" />
                    <span className={`flex h-6 w-11 items-center rounded-full border border-copper/20 px-0.5 transition-colors ${formData.publicado ? 'bg-copper/40' : 'bg-white/5'}`}>
                      <span className={`h-5 w-5 rounded-full bg-copper transition-all ${formData.publicado ? 'ml-auto' : 'ml-0'}`} />
                    </span>
                  </label>
                  <Button type="submit" className="mt-4 w-full rounded-lg bg-copper px-5 py-3 text-sm font-semibold text-white hover:brightness-110 transition" disabled={isSaving || isUploading}>
                    {isSaving ? 'Salvando...' : editingAuthorId ? 'Atualizar Autor' : 'Publicar Autor'}
                  </Button>
                </div>
              </aside>
            </div>
          </form>

          {/* List */}
          <div className="rounded-xl border border-white/5 bg-surface">
            <div className="border-b border-white/5 px-6 py-4">
              <h2 className="text-base font-semibold text-cream">
                Autores Cadastrados
                {!isLoading && <span className="ml-2 text-sm font-normal text-muted">({autores.length})</span>}
              </h2>
            </div>
            {isLoading && <p className="p-6 text-muted">Carregando...</p>}
            {!isLoading && autores.length === 0 && <p className="p-6 text-muted">Nenhum autor encontrado.</p>}
            {autores.length > 0 && (
              <ul className="divide-y divide-white/5">
                {autores.map(author => (
                  <li key={author.id} className="flex items-center px-6 py-4 gap-4 hover:bg-white/[.02] transition-colors">
                    <img src={author.foto_url || getAvatarPlaceholder(author.nome.charAt(0), '141414', 150)} alt={author.nome} className="w-10 h-10 object-cover rounded-full flex-shrink-0 bg-charcoal" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-cream truncate flex items-center gap-2">
                        {author.nome}
                        <span className={`px-2 py-0.5 text-xs rounded-md font-medium ${author.publicado ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                          {author.publicado ? 'Público' : 'Privado'}
                        </span>
                      </p>
                      <p className="text-xs text-muted truncate">{author.cargo}</p>
                      {author.slug && <p className="text-xs text-muted/60 truncate">/{author.slug}</p>}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button onClick={() => handleEditAuthor(author)} className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-muted hover:text-cream hover:bg-white/10 transition">Editar</Button>
                      <Button onClick={() => handleDeleteAuthor(author.id)} className="rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/15 transition">Excluir</Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </AdminLayout>
    );
};

export default AdminAutores;

