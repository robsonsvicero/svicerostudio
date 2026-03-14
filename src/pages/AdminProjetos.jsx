import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/UI/Button';

import { API_URL } from '../lib/api.js';

import ImageUploadSlot from '../components/UI/ImageUploadSlot';


const AdminProjetos = () => {
  const navigate = useNavigate();
  const { token, signOut } = useAuth();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const initialFormState = {
    titulo: '',
    slug: '',
    categoria: '',
    cliente: '',
    data_projeto: '',
    status: 'published',
    descricao: '', // Short summary
    descricao_longa: '', // PT-BR description
    descricao_longa_en: '', // EN description
    imagem_url: '', // Cover image
    mostrar_home: false,
    permitir_navegacao: true,
    link: '',
    button_text: 'Ver Projeto',
    site_url: '',
    link2: '',
    button_text2: '',
  };

  const [form, setForm] = useState(initialFormState);
  const [gallery, setGallery] = useState([]); // {id?, url}
  const [isUploading, setIsUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(null);

  const handleFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSingleImageUpload = useCallback(async (file, fieldName) => {
    if (!file) {
        setForm(prev => ({...prev, [fieldName]: ''}));
        return;
    }
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', 'projetos');
    formData.append('key', `${Date.now()}_${file.name}`);

    try {
      const res = await fetch(`${API_URL}/api/storage/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const payload = await res.json();
      if (res.ok && payload.data?.path) {
        const imageUrl = `${API_URL}/api/storage/public/projetos/${payload.data.path}`;
        setForm(prev => ({ ...prev, [fieldName]: imageUrl }));
      }
    } catch (err) {
      console.error(`Falha no upload para o campo ${fieldName}:`, err);
    } finally {
      setIsUploading(false);
    }
  }, [token]);

  const handleGalleryUpload = useCallback(async (files) => {
    setIsUploading(true);
    const uploadedUrls = [];
    for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('bucket', 'projetos');
        formData.append('key', `${Date.now()}_${file.name}`);
        try {
            const res = await fetch(`${API_URL}/api/storage/upload`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            const payload = await res.json();
            if (res.ok && payload.data?.path) {
                const imageUrl = `${API_URL}/api/storage/public/projetos/${payload.data.path}`;
                uploadedUrls.push({ url: imageUrl });
            }
        } catch (err) {
            console.error(`Falha no upload da imagem da galeria: ${file.name}`, err);
        }
    }
    setGallery(prev => [...prev, ...uploadedUrls]);
    setIsUploading(false);
  }, [token]);
  
  const handleRemoveFromGallery = (indexToRemove) => {
    setGallery(prev => prev.filter((_, index) => index !== indexToRemove));
  };
  
  const fetchProjects = useCallback(async () => {
    if (!token) {
        setIsLoading(false);
        return;
    }
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/db/projetos/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ operation: 'select', orderBy: { column: 'data_projeto', ascending: false } }),
      });
      const payload = await res.json();
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
            signOut();
            navigate('/login');
            return;
        }
        throw new Error(payload.error || 'Erro ao buscar projetos');
      }
      setProjects(payload.data || []);
    } catch (err) {
      setError(err.message || 'Erro ao buscar projetos');
    } finally {
      setIsLoading(false);
    }
  }, [token, navigate, signOut]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    const formPayload = { ...form };
    const op = editing ? 'update' : 'insert';
    const filters = editing ? [{ column: 'id', operator: 'eq', value: editing }] : [];

    try {
        const res = await fetch(`${API_URL}/api/db/projetos/query`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ operation: op, filters, payload: formPayload }),
        });
        const resData = await res.json();
        if (!res.ok) throw new Error(resData.error || 'Erro ao salvar projeto');
        
        const projetoId = editing || (resData.data && resData.data[0]?.id);
        if (!projetoId) throw new Error('Não foi possível obter o ID do projeto.');

        // Sync Gallery
        // First, remove all existing gallery images for this project from the DB
        await fetch(`${API_URL}/api/db/projeto_galeria/query`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ operation: 'delete', filters: [{ column: 'projeto_id', operator: 'eq', value: projetoId }] }),
        });

        // Then, add the current gallery images
        for (const [index, img] of gallery.entries()) {
          await fetch(`${API_URL}/api/db/projeto_galeria/query`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ operation: 'insert', payload: { projeto_id: projetoId, imagem_url: img.url, ordem: index } }),
          });
        }

        // Reset form and fetch updated list
        setForm(initialFormState);
        setGallery([]);
        setEditing(null);
        await fetchProjects();
    } catch (err) {
        setError(err.message);
    } finally {
        setSubmitting(false);
    }
  };

  const handleEditProject = useCallback(async (proj) => {
    setEditing(proj.id);
    setForm({ ...initialFormState, ...proj });

    // Fetch gallery for the project
    try {
        const res = await fetch(`${API_URL}/api/db/projeto_galeria/query`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ operation: 'select', filters: [{ column: 'projeto_id', operator: 'eq', value: proj.id }], orderBy: { column: 'ordem', ascending: true } }),
        });
        const galleryData = await res.json();
        if (res.ok && Array.isArray(galleryData.data)) {
            setGallery(galleryData.data);
        } else {
            setGallery([]);
        }
    } catch {
        setGallery([]);
    }

    window.scrollTo(0, 0);
  }, [token]);

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Tem certeza? Esta ação removerá o projeto e sua galeria.')) {
        try {
            // It might be better to use a dedicated backend endpoint that deletes the project and its gallery in a transaction.
            await fetch(`${API_URL}/api/db/projeto_galeria/query`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ operation: 'delete', filters: [{ column: 'projeto_id', operator: 'eq', value: projectId }]}),
            });
            await fetch(`${API_URL}/api/db/projetos/query`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ operation: 'delete', filters: [{ column: 'id', operator: 'eq', value: projectId }]}),
            });
            await fetchProjects();
        } catch (err) {
            setError(err.message);
        }
    }
  };

  const fields = [
    { name: 'titulo', label: 'Título do projeto', placeholder: 'Ex: Plataforma de investimento institucional', type: 'text', required: true, col: 'lg:col-span-2' },
    { name: 'slug', label: 'Slug', placeholder: 'plataforma-de-investimento-institucional', type: 'text', required: true, col: 'lg:col-span-1' },
    { name: 'categoria', label: 'Categoria', placeholder: 'Selecione uma categoria', type: 'select', required: true, options: ['UI/UX Design', 'Web Development', 'Branding'], col: 'lg:col-span-1' },
    { name: 'cliente', label: 'Cliente', placeholder: 'Nome do cliente ou marca', type: 'text', required: false, col: 'lg:col-span-1' },
    { name: 'data_projeto', label: 'Data do projeto', placeholder: 'YYYY-MM-DD', type: 'date', required: false, col: 'lg:col-span-1' },
    { name: 'status', label: 'Status', placeholder: 'Publicado', type: 'select', required: true, options: ['published', 'draft', 'archived'], col: 'lg:col-span-1' },
  ];

  return (
    <div className="min-h-screen bg-dark-bg text-[#EFEFEF] font-sans">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10 lg:py-10">
        <Link to="/admin" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-white/60 transition hover:text-white">
            <span aria-hidden="true">‹</span>
            Voltar ao painel
        </Link>
        <form onSubmit={handleSubmit} className="relative overflow-hidden rounded-[32px] border border-white/8 bg-[#181818] shadow-2xl shadow-black/30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(184,115,51,0.14),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(95,178,216,0.10),_transparent_22%)]" />

          <div className="relative border-b border-white/8 px-6 py-6 lg:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="inline-flex items-center rounded-full border border-[#B87333]/25 bg-[#B87333]/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-[#E9BF84]">
                  {editing ? 'Edição de Projeto' : 'Cadastro de Projeto'}
                </div>
                <h1 className="mt-4 font-[Manrope] text-3xl font-semibold tracking-[-0.04em] text-white lg:text-5xl">
                  {editing ? 'Refinando detalhes com precisão' : 'Novo projeto com menos ruído, mais direção.'}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60 lg:text-base">
                  Uma página de cadastro com aparência mais premium, blocos bem definidos e uma experiência de preenchimento mais limpa, focada em clareza editorial.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={() => { setForm(initialFormState); setGallery([]); setEditing(null); }} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white/80 transition hover:bg-white/8">
                  {editing ? 'Cancelar Edição' : 'Limpar Campos'}
                </button>
                <button type="submit" className="rounded-2xl bg-[#B87333] px-5 py-3 text-sm font-semibold text-[#141414] transition hover:brightness-110" disabled={submitting || isUploading}>
                  {submitting ? 'Salvando...' : (editing ? 'Atualizar Projeto' : 'Publicar Projeto')}
                </button>
              </div>
            </div>
          </div>

          <div className="relative grid gap-6 px-6 py-6 lg:grid-cols-12 lg:px-8 lg:py-8">
            <div className="space-y-6 lg:col-span-8">
              {/* Main Info Section */}
              <section className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5 backdrop-blur lg:p-6">
                 <div className="mb-6 flex items-center justify-between">
                   <div>
                     <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">Base do projeto</p>
                     <h2 className="mt-2 font-[Manrope] text-2xl font-semibold text-white">Informações principais</h2>
                   </div>
                 </div>
                 <div className="grid gap-4 lg:grid-cols-2">
                   {fields.map((field) => (
                     <label key={field.name} className={`${field.col} block`}>
                       <span className="mb-2 block text-sm font-medium text-white/82">
                         {field.label}
                         {field.required && <span className="ml-1 text-[#E9BF84]">*</span>}
                       </span>
                        {field.type === 'select' ? (
                            <select name={field.name} value={form[field.name]} onChange={handleFieldChange} className="w-full rounded-2xl border border-white/10 bg-dark-bg/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40">
                                <option value="" disabled>{field.placeholder}</option>
                                {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        ) : (
                           <input
                             type={field.type}
                             name={field.name}
                             value={form[field.name] || ''}
                             onChange={handleFieldChange}
                             placeholder={field.placeholder}
                             className="w-full rounded-2xl border border-white/10 bg-dark-bg/70 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40"
                           />
                        )}
                     </label>
                   ))}
                 </div>
              </section>

              {/* Description Section */}
              <section className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5 backdrop-blur lg:p-6">
                <div className="mb-6">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">Narrativa</p>
                  <h2 className="mt-2 font-[Manrope] text-2xl font-semibold text-white">Descrição e contexto</h2>
                </div>
                <div className="grid gap-4">
                  <label>
                    <span className="mb-2 block text-sm font-medium text-white/82">Resumo curto (para cards)</span>
                    <textarea name="descricao" value={form.descricao} onChange={handleFieldChange} placeholder="Uma síntese elegante do projeto para listagens e destaques." rows={3} className="w-full resize-none rounded-2xl border border-white/10 bg-dark-bg/70 px-4 py-4 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40" />
                  </label>
                  <label>
                    <span className="mb-2 block text-sm font-medium text-white/82">Descrição em Português (PT-BR)</span>
                    <textarea name="descricao_longa" value={form.descricao_longa} onChange={handleFieldChange} placeholder="Descreva o contexto, desafio, solução e resultado do projeto em Português-BR." rows={6} className="w-full resize-none rounded-2xl border border-white/10 bg-dark-bg/70 px-4 py-4 text-sm leading-6 text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40" />
                  </label>
                   <label>
                     <span className="mb-2 block text-sm font-medium text-white/82">Descrição em Inglês</span>
                     <textarea name="descricao_longa_en" value={form.descricao_longa_en} onChange={handleFieldChange} placeholder="Describe the project's context, challenge, solution, and outcome in English." rows={8} className="w-full resize-none rounded-2xl border border-white/10 bg-dark-bg/70 px-4 py-4 text-sm leading-6 text-white placeholder:text-white/35 outline-none transition focus:border-[#B87333]/40" />
                   </label>
                </div>
              </section>

              {/* Media Section */}
              <section className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5 backdrop-blur lg:p-6">
                 <div className="mb-6">
                   <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">Mídia</p>
                   <h2 className="mt-2 font-[Manrope] text-2xl font-semibold text-white">Galeria visual</h2>
                 </div>
                 <div className="grid gap-4">
                    <ImageUploadSlot title="Imagem de capa" description="Arraste ou clique para enviar" currentImageUrl={form.imagem_url} onUpload={(file) => handleSingleImageUpload(file, 'imagem_url')} isUploading={isUploading} />
                 </div>

                 {/* Gallery Upload Section */}
                 <div className="mt-6 rounded-[24px] border border-white/8 bg-dark-bg/45 p-5">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <h3 className="font-[Manrope] text-xl font-semibold text-white">Imagens de Destaque da Galeria</h3>
                        <p className="mt-2 text-sm leading-6 text-white/55">Arraste ou clique para adicionar múltiplas imagens.</p>
                      </div>
                      <label className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white/80 transition hover:bg-white/8 cursor-pointer">
                        Adicionar Imagens
                        <input type="file" multiple className="sr-only" accept="image/*" disabled={isUploading} onChange={(e) => handleGalleryUpload(Array.from(e.target.files))} />
                      </label>
                    </div>
                    {gallery.length > 0 && (
                        <div className="mt-5 grid gap-3 md:grid-cols-3 xl:grid-cols-4">
                            {gallery.map((img, index) => (
                                <div key={index} className="relative group aspect-square">
                                    <img src={img.url} alt={`Galeria ${index + 1}`} className="w-full h-full object-cover rounded-xl" />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveFromGallery(index)}
                                        className="absolute top-1 right-1 bg-red-600/80 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                        aria-label="Remover imagem"
                                    >
                                        &#x2715;
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                 </div>
              </section>
              
               {/* Settings Section */}
              <section className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5 backdrop-blur lg:p-6">
                <div className="mb-6">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">Configurações</p>
                  <h2 className="mt-2 font-[Manrope] text-2xl font-semibold text-white">Exibição e comportamento</h2>
                </div>
                <div className="grid gap-3">
                    <label className="flex items-center justify-between rounded-2xl border border-white/8 bg-dark-bg/55 px-4 py-4">
                      <span className="text-sm text-white/82">Mostrar no portfólio (público)</span>
                      <input type="checkbox" name="status" checked={form.status === 'published'} onChange={(e) => handleFieldChange({ target: { name: 'status', value: e.target.checked ? 'published' : 'draft' }})} className="sr-only" />
                      <span className={`flex h-7 w-12 items-center rounded-full border border-[#B87333]/20  px-1 ${form.status === 'published' ? 'bg-[#B87333]/50' : 'bg-white/5'}`}>
                        <span className={`h-5 w-5 rounded-full bg-[#B87333] transition-all ${form.status === 'published' ? 'ml-auto' : 'ml-0'}`} />
                      </span>
                    </label>
                    <label className="flex items-center justify-between rounded-2xl border border-white/8 bg-dark-bg/55 px-4 py-4">
                      <span className="text-sm text-white/82">Destacar na home</span>
                       <input type="checkbox" name="mostrar_home" checked={form.mostrar_home} onChange={handleFieldChange} className="sr-only" />
                       <span className={`flex h-7 w-12 items-center rounded-full border border-[#B87333]/20  px-1 ${form.mostrar_home ? 'bg-[#B87333]/50' : 'bg-white/5'}`}>
                         <span className={`h-5 w-5 rounded-full bg-[#B87333] transition-all ${form.mostrar_home ? 'ml-auto' : 'ml-0'}`} />
                       </span>
                    </label>
                </div>
              </section>
            </div>
            {/* Sidebar */}
            <aside className="space-y-6 lg:col-span-4">
              <section className="rounded-[28px] border border-white/8 bg-[#2F353B]/30 p-5 shadow-lg shadow-black/20">
                <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">Status do cadastro</p>
                <div className="mt-5 space-y-3">
                    <div className="rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-white/35">Status Atual</p>
                      <p className="mt-2 text-sm font-medium text-white/88 capitalize">{form.status}</p>
                    </div>
                </div>
              </section>
            </aside>
          </div>
        </form>

        {/* Display existing projects */}
        <div className="mt-16">
            <h2 className="text-2xl font-semibold text-white mb-6">Projetos Cadastrados</h2>
            {isLoading && <p>Carregando...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <div className="bg-[#181818] rounded-2xl border border-white/8">
                {projects.length > 0 ? (
                    <ul className="divide-y divide-white/8">
                        {projects.map(proj => (
                            <li key={proj.id} className="flex items-center justify-between p-4 gap-4">
                               <img src={proj.imagem_url} alt={proj.titulo} className="w-16 h-10 object-cover rounded-lg flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-white truncate">{proj.titulo}</p>
                                    <p className="text-sm text-white/60 truncate">{proj.categoria || 'Sem categoria'}</p>
                                </div>
                                <div className="flex items-center gap-3 flex-shrink-0">
                                    <Button variant="outline" onClick={() => handleEditProject(proj)}>Editar</Button>
                                    <Button variant="danger" onClick={() => handleDeleteProject(proj.id)}>Excluir</Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="p-6 text-white/60">Nenhum projeto encontrado.</p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProjetos;
