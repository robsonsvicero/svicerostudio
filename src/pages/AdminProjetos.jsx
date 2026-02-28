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
  useEffect(() => {
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
      } else {
        setGallery([]);
      }
    } catch {
      setGallery([]);
    }
  };

  // Salvar ou atualizar projeto
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setSubmitMsg('Salvando...');
    try {
      // 1. Salvar projeto
      const res = await fetch(`${API_URL}/api/db/projetos/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          operation: editing ? 'update' : 'insert',
          filters: editing ? [{ column: '_id', operator: 'eq', value: editing }] : undefined,
          payload: form,
          returning: true
        }),
      });
      const payload = await res.json();
      console.log('[DEBUG] Resposta do backend ao salvar projeto:', payload);
      if (!res.ok) throw new Error(payload.error || 'Erro ao salvar projeto');
      let projetoId = null;
      if (editing) {
        projetoId = editing;
      } else if (payload.data && Array.isArray(payload.data) && payload.data[0]?.id) {
        projetoId = payload.data[0].id;
      } else if (payload.data && payload.data.id) {
        projetoId = payload.data.id;
      }
      if (!projetoId) {
        console.error('[ERRO] payload.data retornado:', payload.data);
        if (Array.isArray(payload.data)) {
          payload.data.forEach((item, idx) => {
            console.error(`[ERRO] payload.data[${idx}]:`, item);
          });
        }
        throw new Error('ID do projeto não encontrado após salvar.');
      }
      // 2. Salvar galeria
      console.log('Salvando galeria:', gallery, 'projetoId:', projetoId);
      if (gallery.length > 0) {
        // Ao editar, remove todas as imagens antigas antes de inserir as novas
        if (editing) {
          const delRes = await fetch(`${API_URL}/api/db/projeto_galeria/query`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({
              operation: 'delete',
              filters: [{ column: 'projeto_id', operator: 'eq', value: projetoId }]
            }),
          });
          const delPayload = await delRes.json();
          console.log('Delete galeria:', delPayload);
        }
        const insertRes = await fetch(`${API_URL}/api/db/projeto_galeria/query`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            operation: 'insert',
            payload: gallery.map((img, i) => ({ projeto_id: projetoId, imagem_url: img.url, ordem: i }))
          }),
        });
        const insertPayload = await insertRes.json();
        console.log('Insert galeria:', insertPayload);
      }
      setSubmitMsg('Projeto salvo!');
      setForm({ titulo: '', descricao: '', imagem_url: '', data_projeto: '', link: '', button_text: 'Ver Projeto', descricao_longa: '', descricao_longa_en: '', site_url: '', link2: '', button_text2: '', mostrar_home: true });
      setEditing(null);
      setSubmitting(false);
      // Atualizar lista de projetos
      const refresh = await fetch(`${API_URL}/api/db/projetos/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ operation: 'select', orderBy: { column: 'data_projeto', ascending: false } }),
      });
      const refreshPayload = await refresh.json();
      setProjects(refreshPayload.data || []);
      // Buscar galeria do backend após salvar
      if (projetoId) {
        try {
          const galRes = await fetch(`${API_URL}/api/db/projeto_galeria/query`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({
              operation: 'select',
              filters: [{ column: 'projeto_id', operator: 'eq', value: projetoId }],
              orderBy: { column: 'ordem', ascending: true }
            }),
          });
          const galPayload = await galRes.json();
          if (galRes.ok && Array.isArray(galPayload.data)) {
            setGallery(galPayload.data.map(img => ({ url: img.imagem_url, id: img.id })));
          } else {
            setGallery([]);
          }
        } catch {
          setGallery([]);
        }
      } else {
        setGallery([]);
      }
    } catch (err) {
      setSubmitMsg(err.message || 'Erro ao salvar');
      setSubmitting(false);
      console.error('Erro ao salvar projeto/galeria:', err);
    }
  };

  // Render
  return (
    <div className="min-h-screen bg-cream p-8">
      <h1 className="text-3xl font-bold mb-6">Administração de Projetos</h1>
      {isLoading && <p>Carregando projetos...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <button className="mb-4 px-4 py-2 bg-primary text-white rounded" onClick={() => navigate('/admin')}>Voltar ao Admin</button>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6 mb-8 flex flex-col gap-4 max-w-2xl">
        <h2 className="text-xl font-semibold mb-2">{editing ? 'Editar Projeto' : 'Novo Projeto'}</h2>
        <input className="border p-2 rounded" required placeholder="Título" value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} />
        <textarea className="border p-2 rounded" required placeholder="Descrição" value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} />
        <input className="border p-2 rounded" type="date" required placeholder="Data" value={form.data_projeto} onChange={e => setForm(f => ({ ...f, data_projeto: e.target.value }))} />
        <input className="border p-2 rounded" placeholder="Link Behance" value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} />
        <input className="border p-2 rounded" placeholder="URL da Capa (opcional)" value={form.imagem_url} onChange={e => setForm(f => ({ ...f, imagem_url: e.target.value }))} />
        {/* Upload de imagens */}
        <label className="block">Galeria de Imagens
          <input type="file" multiple accept="image/*" className="block mt-2" disabled={uploading} onChange={e => handleGalleryUpload(Array.from(e.target.files))} />
        </label>
        {/* Visualização das imagens */}
        <div className="flex gap-4 flex-wrap mt-2">
          {gallery.map((img, i) => (
            <div key={img.id || i} className="relative w-28 h-28 bg-gray-100 border rounded shadow flex items-center justify-center overflow-hidden">
              <img src={img.url} alt="img" className="w-full h-full object-cover" />
              <button
                type="button"
                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-lg border-2 border-white hover:bg-red-700 transition"
                style={{ zIndex: 2 }}
                onClick={async () => {
                  if (img.id) {
                    // Imagem persistida: remover do backend
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
                <span className="text-lg font-bold">×</span>
              </button>
            </div>
          ))}
        </div>
        <button type="submit" className="mt-6 w-full px-4 py-3 bg-green-600 text-white rounded font-semibold text-lg shadow hover:bg-green-700 transition" disabled={uploading || submitting}>
          {uploading ? 'Aguarde, enviando imagens...' : submitting ? 'Salvando...' : 'Salvar Projeto'}
        </button>
        {uploading && <p className="text-yellow-600">Aguarde o envio das imagens antes de salvar.</p>}
        {submitMsg && <p className="mt-2 text-blue-600">{submitMsg}</p>}
      </form>

      {/* Lista de projetos */}
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Projetos Cadastrados</h2>
        {projects.length === 0 ? (
          <p>Nenhum projeto cadastrado.</p>
        ) : (
          <ul className="space-y-4">
            {projects.map((proj) => (
              <li key={proj.id} className="border-b pb-2 flex justify-between items-center gap-2">
                <div className="flex flex-col">
                  <span className="font-medium">{proj.titulo}</span>
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
  );
}
export default AdminProjetos;
