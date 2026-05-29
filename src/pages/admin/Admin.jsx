import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { API_URL } from '../../lib/api.js';
import AdminLayout from '../../components/Admin/AdminLayout';
import AdminMetricCard from '../../components/Admin/AdminMetricCard';
import AdminSectionLinkCard from '../../components/Admin/AdminSectionLinkCard';

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
    { title: 'Projetos', desc: 'Cases, capas e destaques dos projetos', icon: 'fa-solid fa-folder-open', link: '/admin/projetos', count: projectCount, countLabel: 'ativos' },
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
        <h2 className="text-2xl font-semibold text-ds-text tracking-tight">
          Bem-vindo, {user?.email?.split('@')[0] || 'Admin'}
        </h2>
        <p className="mt-1 text-sm text-ds-muted">
          Último acesso: {lastAccess || '---'}
        </p>
      </div>

      {/* Metric cards row */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <AdminMetricCard
            key={m.label}
            label={m.label}
            value={m.value}
            suffix={m.suffix}
            icon={m.icon}
            iconColor={m.color}
            iconBg={m.bg}
          />
        ))}
      </div>

      {/* Section navigation grid */}
      <div className="mb-4">
        <h3 className="text-sm font-mono uppercase tracking-widest text-ds-muted mb-4">Gerenciar</h3>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((s) => (
          <AdminSectionLinkCard
            key={s.title}
            title={s.title}
            desc={s.desc}
            icon={s.icon}
            link={s.link}
            count={s.count}
            countLabel={s.countLabel}
          />
        ))}
      </div>
    </AdminLayout>
  );
};

export default Admin;
