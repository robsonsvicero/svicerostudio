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
import { adminInputClass, adminLabelClass } from '../../components/Admin/adminFormStyles';
import AdminSectionCard from '../../components/Admin/AdminSectionCard';
import AdminListCard from '../../components/Admin/AdminListCard';
import AdminRowActions from '../../components/Admin/AdminRowActions';
import AdminHeaderActionButton from '../../components/Admin/AdminHeaderActionButton';

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
              <AdminHeaderActionButton onClick={clearForm} size="md">
                {editingAuthorId ? 'Cancelar' : 'Limpar'}
              </AdminHeaderActionButton>
            </div>
          }
          toastProps={{ show: showToast, message: toastMessage, type: toastType, onClose: hideToast }}
        >
          {/* Form */}
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="grid gap-6 lg:grid-cols-12">
              <div className="space-y-6 lg:col-span-8">
                {/* Author identification */}
                <AdminSectionCard badge="Identificação" title={editingAuthorId ? 'Editando Autor' : 'Novo Autor'}>
                  <div className="grid gap-4 lg:grid-cols-2">
                    <label className="lg:col-span-1 block">
                      <span className={adminLabelClass}>Nome do autor <span className="ml-1 text-ds-accent">*</span></span>
                      <input type="text" name="nome" value={formData.nome || ''} onChange={handleInputChange} placeholder="Ex: Robson Svicero" required className={adminInputClass} />
                    </label>
                    <label className="lg:col-span-1 block">
                      <span className={adminLabelClass}>Cargo <span className="ml-1 text-ds-accent">*</span></span>
                      <input type="text" name="cargo" value={formData.cargo || ''} onChange={handleInputChange} placeholder="Ex: Diretor de Arte & Design" required className={adminInputClass} />
                    </label>
                    <label className="lg:col-span-2 block">
                      <span className={adminLabelClass}>Email de contato</span>
                      <input type="email" name="email" value={formData.email || ''} onChange={handleInputChange} placeholder="contato@svicero.com" className={adminInputClass} />
                    </label>
                    <label className="lg:col-span-2 block">
                      <span className={adminLabelClass}>Slug (URL amigável)</span>
                      <input type="text" name="slug" value={formData.slug || ''} onChange={handleInputChange} placeholder="Ex: robson-svicero" className={adminInputClass} />
                    </label>
                  </div>
                </AdminSectionCard>

                {/* Bio */}
                <AdminSectionCard badge="Conteúdo" title="Biografia">
                  <label>
                    <span className={adminLabelClass}>Bio</span>
                    <textarea name="bio" value={formData.bio} onChange={handleInputChange} placeholder="Escreva uma biografia curta..." rows={4} className={`${adminInputClass} resize-y leading-6`} />
                  </label>
                </AdminSectionCard>

                {/* Photo */}
                <AdminSectionCard badge="Mídia" title="Foto de Perfil">
                  <ImageUploadSlot title="Foto de perfil do autor" description="Arraste ou clique para enviar (Recomendado: 400x400px)" currentImageUrl={formData.foto_url} onUpload={handleImageUpload} isUploading={isUploading} useTechText={true} />
                </AdminSectionCard>
              </div>

              {/* Sidebar */}
              <aside className="space-y-6 lg:col-span-4">
                <AdminSectionCard badge="Configurações" paddingClassName="p-5">
                  <label className="flex items-center justify-between rounded-lg border border-white/5 bg-ds-bg px-4 py-3.5 cursor-pointer hover:border-white/10 transition-colors">
                    <span className="text-sm text-ds-text">Perfil público</span>
                    <input type="checkbox" name="publicado" checked={formData.publicado} onChange={handleInputChange} className="sr-only" />
                    <span className={`flex h-6 w-11 items-center rounded-full border border-ds-accent/20 px-0.5 transition-colors ${formData.publicado ? 'bg-ds-accent/40' : 'bg-white/5'}`}>
                      <span className={`h-5 w-5 rounded-full bg-ds-accent transition-all ${formData.publicado ? 'ml-auto' : 'ml-0'}`} />
                    </span>
                  </label>
                  <Button type="submit" className="uppercase mt-4 w-full rounded-full bg-ds-accent px-5 py-3 text-sm font-semibold text-white hover:bg-ds-accent-hover hover:scale-110transition" disabled={isSaving || isUploading}>
                    {isSaving ? 'Salvando...' : editingAuthorId ? 'Atualizar Autor' : 'Publicar Autor'}
                  </Button>
                </AdminSectionCard>
              </aside>
            </div>
          </form>

          {/* List */}
          <AdminListCard
            title="Autores Cadastrados"
            count={autores.length}
            loading={isLoading}
            loadingText="Carregando..."
            emptyText="Nenhum autor encontrado."
          >
            <ul className="divide-y divide-white/5">
              {autores.map(author => (
                  <li key={author.id} className="flex items-center px-6 py-4 gap-4 hover:bg-white/[.02] transition-colors">
                    <img src={author.foto_url || getAvatarPlaceholder(author.nome.charAt(0), '141414', 150)} alt={author.nome} className="w-10 h-10 object-cover rounded-full flex-shrink-0 bg-ds-bg" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ds-text truncate flex items-center gap-2">
                        {author.nome}
                        <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${author.publicado ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                          {author.publicado ? 'Público' : 'Privado'}
                        </span>
                      </p>
                      <p className="text-xs text-ds-muted truncate">{author.cargo}</p>
                      {author.slug && <p className="text-xs text-ds-muted/60 truncate">/{author.slug}</p>}
                    </div>
                    <AdminRowActions
                      onEdit={() => handleEditAuthor(author)}
                      onDelete={() => handleDeleteAuthor(author.id)}
                      editClassName="uppercase rounded-full border-2 border-ds-text bg-ds-surface px-3 py-1.5 text-xs font-medium text-ds-text hover:text-ds-surface hover:bg-ds-tech hover:border-ds-tech transition"
                      deleteClassName="uppercase rounded-full border-2 border-red-500 bg-red-500 px-3 py-1.5 text-xs font-medium text-ds-surface hover:bg-red-700 hover:border-red-700 transition"
                    />
                  </li>
              ))}
            </ul>
          </AdminListCard>
        </AdminLayout>
    );
};

export default AdminAutores;

