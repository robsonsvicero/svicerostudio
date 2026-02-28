// ...existing code...

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'https://svicerostudio-production.up.railway.app';

const AdminProjetos = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [token, setToken] = useState(localStorage.getItem('svicero_admin_token') || '');

  // Listar projetos
  const fetchProjects = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/db/projetos/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ operation: 'select', orderBy: { column: 'data_projeto', ascending: false } }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || 'Erro ao buscar projetos');
      setProjects(payload.data || []);
    } catch (err) {
      setError(err.message || 'Erro ao buscar projetos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [token]);

  // Formulário de projeto
  const [form, setForm] = useState({
    titulo: '', descricao: '', imagem_url: '', data_projeto: '', link: '', button_text: 'Ver Projeto',
    descricao_longa: '', descricao_longa_en: '', site_url: '', link2: '', button_text2: '', mostrar_home: true
  });
  const [gallery, setGallery] = useState([]); // [{ url, file }]

  // Log sempre que gallery mudar
  useEffect(() => {
    console.log('[DEBUG] Estado gallery atualizado:', gallery);
  }, [gallery]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState('');
  const [editing, setEditing] = useState(null);

  // Upload de imagens para galeria
  const handleGalleryUpload = async (files) => {
    setUploading(true);
    const uploaded = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'projetos');
      formData.append('key', `${Date.now()}_${file.name}`);
      const res = await fetch(`${API_URL}/api/storage/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const payload = await res.json();
      if (res.ok && payload.data?.path) {
        uploaded.push({ url: `${API_URL}/api/storage/public/projetos/${payload.data.path}` });
      }
    }
    setGallery((prev) => {
      const novo = [...prev, ...uploaded];
      console.log('Gallery após upload:', novo);
      return novo;
    });
    setUploading(false);
  };

  // (Removido useEffect duplicado e setUploading solto)

  // Excluir projeto
  const handleDeleteProject = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este projeto?')) return;
    setIsLoading(true);
    setError('');
    try {
      // 1. Excluir imagens da galeria
      await fetch(`${API_URL}/api/db/projeto_galeria/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ operation: 'delete', filters: [{ projeto_id: id }] }),
      });
      // 2. Excluir projeto
      await fetch(`${API_URL}/api/db/projetos/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ operation: 'delete', filters: [{ id }] }),
      });
      // 3. Atualizar lista
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError('Erro ao excluir projeto');
    } finally {
      setIsLoading(false);
    }
  };

  // Editar projeto
  const handleEditProject = async (proj) => {
    setEditing(proj.id);
    setForm({
      titulo: proj.titulo || '',
      descricao: proj.descricao || '',
      imagem_url: proj.imagem_url || '',
      data_projeto: proj.data_projeto ? proj.data_projeto.slice(0, 10) : '',
      link: proj.link || '',
      button_text: proj.button_text || 'Ver Projeto',
      descricao_longa: proj.descricao_longa || '',
      descricao_longa_en: proj.descricao_longa_en || '',
      site_url: proj.site_url || '',
      link2: proj.link2 || '',
      button_text2: proj.button_text2 || '',
      mostrar_home: proj.mostrar_home !== false,
    });
    // Buscar galeria do projeto
    try {
      const res = await fetch(`${API_URL}/api/db/projeto_galeria/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          operation: 'select',
          filters: [{ column: 'projeto_id', operator: 'eq', value: proj.id }]
        }),
      });
      const payload = await res.json();
      if (res.ok && Array.isArray(payload.data)) {
        setGallery(payload.data.map(img => ({ url: img.imagem_url, id: img.id })));
      }
    } catch {
      // Não sobrescreve o estado gallery se falhar
    }
  };

  // Salvar ou atualizar projeto
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setSubmitMsg('Salvando...');
    try {
      let projetoId = editing;
      if (!editing) {
        // Criação de novo projeto
        const res = await fetch(`${API_URL}/api/db/projetos/query`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ operation: 'insert', payload: form }),
        });
        const payload = await res.json();
        if (!res.ok) throw new Error(payload.error || 'Erro ao criar projeto');
        projetoId = Array.isArray(payload.data) ? payload.data[0]?.id : payload.data?.id;
      } else {
        // Edição de projeto existente
        const res = await fetch(`${API_URL}/api/db/projetos/query`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ operation: 'update', filters: [{ column: 'id', operator: 'eq', value: editing }], payload: form }),
        });
        const payload = await res.json();
        if (!res.ok) throw new Error(payload.error || 'Erro ao atualizar projeto');
        projetoId = editing;
      }
      // Salvar galeria
      for (const [idx, img] of gallery.entries()) {
        if (!img.id && img.url) {
          // Nova imagem
          await fetch(`${API_URL}/api/db/projeto_galeria/query`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ operation: 'insert', payload: { projeto_id: projetoId, imagem_url: img.url, ordem: idx } }),
          });
        } else if (img.id) {
          // Atualizar ordem
          await fetch(`${API_URL}/api/db/projeto_galeria/query`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ operation: 'update', filters: [{ column: 'id', operator: 'eq', value: img.id }], payload: { ordem: idx } }),
          });
        }
      }
      setEditing(null);
      setForm({
        titulo: '',
        descricao: '',
        imagem_url: '',
        data_projeto: '',
        link: '',
        button_text: 'Ver Projeto',
        descricao_longa: '',
        descricao_longa_en: '',
        site_url: '',
        link2: '',
        button_text2: '',
        mostrar_home: true,
      });
      setGallery([]); // Limpa galeria sempre após salvar
      setSubmitMsg('');
      setSubmitting(false);
      fetchProjects();
    } catch (err) {
      setSubmitMsg(err.message || 'Erro ao salvar');
      setSubmitting(false);
      console.error('Erro ao salvar projeto/galeria:', err);
    }
  };

  // Render
  return (
    <div className="bg-cream min-h-screen">
      <main className="pt-20 pb-20 px-4 md:px-16">
        <div className="max-w-6xl mx-auto">
          {/* Header padrão admin */}
          <div className="flex justify-between items-center mb-12">
            <div>
              <button
                onClick={() => navigate('/admin')}
                className="text-primary hover:underline font-medium mb-4 flex items-center gap-2"
              >
                <i className="fa-solid fa-arrow-left"></i>
                Voltar ao Painel
              </button>
              <h1 className="font-title text-4xl font-semibold text-low-dark">
                Gerenciar Projetos
              </h1>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('svicero_admin_token');
                navigate('/login');
              }}
              className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              <i className="fa-solid fa-right-from-bracket"></i>
              Sair
            </button>
          </div>
          {isLoading && <p>Carregando projetos...</p>}
          {error && <p className="text-red-500">{error}</p>}

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="bg-white rounded shadow p-8 mb-8 flex flex-col gap-4 w-full">
        <h2 className="text-xl font-semibold mb-2">{editing ? 'Editar Projeto' : 'Novo Projeto'}</h2>
        <input className="border p-2 rounded w-full" required placeholder="Título" value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} />
        <input className="border p-2 rounded w-full" required placeholder="Breve descrição" value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} />
        <textarea className="border p-2 rounded w-full" rows={3} placeholder="Descrição longa (pt-br)" value={form.descricao_longa} onChange={e => setForm(f => ({ ...f, descricao_longa: e.target.value }))} />
        <textarea className="border p-2 rounded w-full" rows={3} placeholder="Descrição longa (en)" value={form.descricao_longa_en} onChange={e => setForm(f => ({ ...f, descricao_longa_en: e.target.value }))} />
        <input className="border p-2 rounded w-full" required placeholder="Imagem da Capa (URL)" value={form.imagem_url} onChange={e => setForm(f => ({ ...f, imagem_url: e.target.value }))} />
        <input className="border p-2 rounded w-full" required placeholder="Link Behance (URL)" value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} />
        <input className="border p-2 rounded w-full" placeholder="Texto do botão do Link Behance" value={form.button_text} onChange={e => setForm(f => ({ ...f, button_text: e.target.value }))} />
        <input className="border p-2 rounded w-full" placeholder="Link do Site (URL, opcional)" value={form.site_url} onChange={e => setForm(f => ({ ...f, site_url: e.target.value }))} />
        <input className="border p-2 rounded w-full" placeholder="Texto do botão do Link do Site" value={form.button_text2} onChange={e => setForm(f => ({ ...f, button_text2: e.target.value }))} />
        <input className="border p-2 rounded w-full" type="date" required placeholder="Data de criação" value={form.data_projeto} onChange={e => setForm(f => ({ ...f, data_projeto: e.target.value }))} />
        <label className="block">Mostrar na Home?
          <select className="border p-2 rounded ml-2" value={form.mostrar_home ? 'sim' : 'nao'} onChange={e => setForm(f => ({ ...f, mostrar_home: e.target.value === 'sim' }))}>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
          </select>
        </label>
        <label className="block mt-2">Galeria de Imagens
          <input type="file" multiple accept="image/*" className="block mt-2" disabled={uploading} onChange={e => handleGalleryUpload(Array.from(e.target.files))} />
        </label>
        <div className="flex gap-4 flex-wrap mt-2">
          {gallery.map((img, i) => (
            <div
              key={img.id || i}
              className="relative group w-36 h-28 bg-white shadow-md flex items-center justify-center overflow-hidden border border-gray-200"
              style={{ borderRadius: 8 }}
            >
              <img src={img.url} alt="img" className="w-full h-full object-cover" />
              {/* Comandos só no hover */}
              <button
                type="button"
                className="absolute left-2 top-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg border-2 border-white opacity-0 group-hover:opacity-100 transition"
                style={{ zIndex: 2 }}
                onClick={async () => {
                  if (img.id) {
                    try {
                      await fetch(`${API_URL}/api/db/projeto_galeria/query`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                        body: JSON.stringify({ operation: 'delete', filters: [{ id: img.id }] }),
                      });
                    } catch {}
                  }
                  setGallery(g => g.filter((_, idx) => idx !== i));
                }}
                aria-label="Remover imagem"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {/* Setas para ordenar só no hover */}
              <button
                type="button"
                className="absolute right-2 top-2 bg-white/80 text-gray-700 rounded-full w-8 h-8 flex items-center justify-center shadow border border-gray-300 opacity-0 group-hover:opacity-100 transition"
                disabled={i === 0}
                onClick={() => {
                  if (i > 0) {
                    setGallery(g => {
                      const arr = [...g];
                      [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
                      return arr;
                    });
                  }
                }}
                aria-label="Mover para esquerda"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                className="absolute right-2 bottom-2 bg-white/80 text-gray-700 rounded-full w-8 h-8 flex items-center justify-center shadow border border-gray-300 opacity-0 group-hover:opacity-100 transition"
                disabled={i === gallery.length - 1}
                onClick={() => {
                  if (i < gallery.length - 1) {
                    setGallery(g => {
                      const arr = [...g];
                      [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                      return arr;
                    });
                  }
                }}
                aria-label="Mover para direita"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mt-6 w-full">
          <button
            type="submit"
            className={`w-full sm:w-auto px-4 py-3 rounded font-semibold text-lg shadow transition ${uploading ? 'bg-primary/60 text-white cursor-not-allowed' : 'bg-primary text-white hover:bg-primary-dark'}`}
            disabled={uploading || submitting}
          >
            {uploading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                Carregando imagens...
              </span>
            ) : submitting ? 'Salvando...' : 'Salvar Projeto'}
          </button>
          {editing && (
            <button
              type="button"
              className="w-full sm:w-auto px-4 py-3 rounded font-semibold text-lg shadow bg-gray-300 text-gray-800 hover:bg-gray-400 transition"
              onClick={() => {
                setEditing(null);
                setForm({
                  titulo: '', descricao: '', imagem_url: '', data_projeto: '', link: '', button_text: 'Ver Projeto',
                  descricao_longa: '', descricao_longa_en: '', site_url: '', link2: '', button_text2: '', mostrar_home: true
                });
                setGallery([]);
                setSubmitMsg('');
              }}
            >
              Cancelar
            </button>
          )}
        </div>
        {submitMsg && <p className="mt-2 text-blue-600 w-full">{submitMsg}</p>}
      </form>

      {/* Lista de projetos */}
      <div className="bg-white rounded shadow p-6 w-full">
        <h2 className="text-xl font-semibold mb-4">Projetos Cadastrados</h2>
        {projects.length === 0 ? (
          <p>Nenhum projeto cadastrado.</p>
        ) : (
          <ul className="space-y-4">
            {projects.map((proj) => (
              <li key={proj.id} className="border-b pb-2 flex items-center gap-4">
                <img src={proj.imagem_url} alt="Capa" className="w-20 h-16 object-cover rounded shadow border" />
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-medium truncate">{proj.titulo}</span>
                  <span className="text-sm text-gray-500">{proj.data_projeto}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
                    onClick={() => handleEditProject(proj)}
                  >Editar</button>
                  <button
                    className="px-2 py-1 bg-red-600 text-white rounded text-xs"
                    onClick={() => handleDeleteProject(proj.id)}
                  >Excluir</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

        </div>
      </main>
    </div>
  );
}
export default AdminProjetos;
