import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { API_URL } from '../../lib/api.js';
import AdminLayout from '../../components/Admin/AdminLayout';

// Redesign dashboard: SaaS-style overview with metric cards + navigation grid

const Admin = () => {
  const { user, token } = useAuth();

  // --- State (preserved from original) ---
  const [lastAccess, setLastAccess] = React.useState('');
  const [projectCount, setProjectCount] = React.useState(null);
  const [postCount, setPostCount] = React.useState(null);
  const [testimonialCount, setTestimonialCount] = React.useState(null);
  const [authorCount, setAuthorCount] = React.useState(null);
  const [pendingCount, setPendingCount] = React.useState(null);
  const [faqCount, setFaqCount] = React.useState(null);

  // --- Data fetching (100% preserved) ---
  React.useEffect(() => {
    if (!token) { setProjectCount(0); return; }
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${API_URL}/api/db/projetos/query`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ operation: 'select', limit: 100, filters: [{ column: 'status', operator: 'eq', value: 'published' }] }),
        });
        const payload = await res.json();
        setProjectCount(Array.isArray(payload.data) ? payload.data.length : 0);
      } catch (e) { console.error('Erro ao buscar projetos:', e); setProjectCount(0); }
    };
    fetchProjects();
  }, [token, API_URL]);

  React.useEffect(() => {
    if (!token) { setTestimonialCount(0); return; }
    const fetchTestimonials = async () => {
      try {
        const res = await fetch(`${API_URL}/api/db/depoimentos/query`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ operation: 'select', limit: 100 }),
        });
        const payload = await res.json();
        setTestimonialCount(Array.isArray(payload.data) ? payload.data.length : 0);
      } catch (e) { console.error('Erro ao buscar depoimentos:', e); setTestimonialCount(0); }
    };
    fetchTestimonials();
  }, [token, API_URL]);

  React.useEffect(() => {
    if (!token) { setAuthorCount(0); return; }
    const fetchAuthors = async () => {
      try {
        const res = await fetch(`${API_URL}/api/db/autores/query`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ operation: 'select', limit: 100 }),
        });
        const payload = await res.json();
        setAuthorCount(Array.isArray(payload.data) ? payload.data.length : 0);
      } catch (e) { console.error('Erro ao buscar autores:', e); setAuthorCount(0); }
    };
    fetchAuthors();
  }, [token, API_URL]);

  React.useEffect(() => {
    if (!token) { setPostCount(0); return; }
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/db/posts/query`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ operation: 'select', limit: 100 }),
        });
        const payload = await res.json();
        setPostCount(Array.isArray(payload.data) ? payload.data.length : 0);
      } catch (e) { console.error('Erro ao buscar posts:', e); setPostCount(0); }
    };
    fetchPosts();
  }, [token, API_URL]);

  React.useEffect(() => {
    if (!token) { setPendingCount(0); return; }
    const fetchPending = async () => {
      try {
        const res = await fetch(`${API_URL}/api/comments?approved=false`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const payload = await res.json();
        setPendingCount(Array.isArray(payload) ? payload.length : 0);
      } catch (e) { console.error('Erro ao buscar comentários:', e); setPendingCount(0); }
    };
    fetchPending();
  }, [token, API_URL]);

  React.useEffect(() => {
    if (!token) { setFaqCount(0); return; }
    const fetchFaqs = async () => {
      try {
        const res = await fetch(`${API_URL}/api/faq`);
        const data = await res.json();
        setFaqCount(Array.isArray(data) ? data.length : 0);
      } catch (e) { console.error('Erro ao buscar FAQs:', e); setFaqCount(0); }
    };
    fetchFaqs();
  }, [token, API_URL]);

  React.useEffect(() => {
    const now = new Date();
    const formatted = now.toLocaleString('pt-BR', {
      hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric'
    });
    localStorage.setItem('adminLastAccess', formatted);
    setLastAccess(formatted);
  }, []);

  React.useEffect(() => {
    const stored = localStorage.getItem('adminLastAccess');
    if (stored) setLastAccess(stored);
  }, []);

  // --- Metric cards data ---
  const metrics = [
    { label: 'Projetos', value: projectCount, suffix: 'ativos', icon: 'fa-solid fa-folder-open', color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Posts', value: postCount, suffix: 'artigos', icon: 'fa-solid fa-newspaper', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Depoimentos', value: testimonialCount, suffix: 'publicados', icon: 'fa-solid fa-comment-dots', color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { label: 'Pendentes', value: pendingCount, suffix: 'comentários', icon: 'fa-solid fa-clock', color: 'text-rose-400', bg: 'bg-rose-400/10' },
  ];

  const sections = [
    { title: 'Projetos', desc: 'Cases, capas e destaques do portfólio', icon: 'fa-solid fa-folder-open', link: '/admin/projetos', count: projectCount, countLabel: 'ativos' },
    { title: 'Blog', desc: 'Artigos, rascunhos e conteúdo editorial', icon: 'fa-solid fa-newspaper', link: '/admin/blog', count: postCount, countLabel: 'artigos' },
    { title: 'Depoimentos', desc: 'Provas sociais e feedbacks', icon: 'fa-solid fa-comment-dots', link: '/admin/depoimentos', count: testimonialCount, countLabel: 'publicados' },
    { title: 'Autores', desc: 'Perfis, bios e assinaturas', icon: 'fa-solid fa-user-tie', link: '/admin/autores', count: authorCount, countLabel: 'perfis' },
    { title: 'Comentários', desc: 'Moderação de comentários do blog', icon: 'fa-solid fa-comments', link: '/admin/comentarios', count: pendingCount, countLabel: 'pendentes' },
    { title: 'FAQ', desc: 'Perguntas frequentes exibidas no site', icon: 'fa-solid fa-circle-question', link: '/admin/faq', count: faqCount, countLabel: 'perguntas' },
  ];

  return (
    <AdminLayout title="Visão Geral">
      {/* Welcome */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-cream tracking-tight">
          Bem-vindo, {user?.email?.split('@')[0] || 'Admin'}
        </h2>
        <p className="mt-1 text-sm text-muted">
          Último acesso: {lastAccess || '---'}
        </p>
      </div>

      {/* Metric cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-xl border border-white/5 bg-surface p-5 hover:border-white/10 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-widest text-muted">{m.label}</span>
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${m.bg}`}>
                <i className={`${m.icon} text-sm ${m.color}`}></i>
              </div>
            </div>
            <div className="text-3xl font-semibold text-cream tracking-tight">
              {m.value !== null ? m.value : '—'}
            </div>
            <p className="mt-1 text-xs text-muted">{m.suffix}</p>
          </div>
        ))}
      </div>

      {/* Section navigation grid */}
      <div className="mb-4">
        <h3 className="text-sm font-mono uppercase tracking-widest text-muted mb-4">Gerenciar</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((s) => (
          <Link
            key={s.title}
            to={s.link}
            className="group rounded-xl border border-white/5 bg-surface p-5 hover:border-copper/30 hover:bg-card transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-copper/10 border border-copper/20 group-hover:bg-copper/20 transition-colors">
                <i className={`${s.icon} text-copper text-base`}></i>
              </div>
              <span className="text-xs text-muted tabular-nums">
                {s.count !== null ? s.count : '—'} {s.countLabel}
              </span>
            </div>
            <h4 className="text-base font-semibold text-cream mb-1 group-hover:text-copper-light transition-colors">
              {s.title}
            </h4>
            <p className="text-sm text-muted leading-relaxed">{s.desc}</p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-copper opacity-0 group-hover:opacity-100 transition-opacity">
              Acessar <i className="fa-solid fa-arrow-right text-[10px]"></i>
            </div>
          </Link>
        ))}
      </div>
    </AdminLayout>
  );
};

export default Admin;
