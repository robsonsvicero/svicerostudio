import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API_URL } from '../lib/api.js';

const Admin = () => {
  const { user, signOut } = useAuth();

  // Estado para horário de acesso
  const [lastAccess, setLastAccess] = React.useState('');
  const [projectCount, setProjectCount] = React.useState(null);
  const [postCount, setPostCount] = React.useState(null);
  const [testimonialCount, setTestimonialCount] = React.useState(null);
  const [authorCount, setAuthorCount] = React.useState(null);
  const [pendingCount, setPendingCount] = React.useState(null);
    // Buscar número de projetos
    React.useEffect(() => {
      const fetchProjects = async () => {
        try {
          const res = await fetch(`${API_URL}/api/db/projetos/query`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ operation: 'select', limit: 100 }),
          });
          const payload = await res.json();
          setProjectCount(Array.isArray(payload.data) ? payload.data.length : 0);
        } catch (e) { setProjectCount(0); }
      };
      fetchProjects();
    }, []);

    // Buscar número de depoimentos
    React.useEffect(() => {
      const fetchTestimonials = async () => {
        try {
          const res = await fetch(`${API_URL}/api/db/depoimentos/query`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ operation: 'select', limit: 100 }),
          });
          const payload = await res.json();
          setTestimonialCount(Array.isArray(payload.data) ? payload.data.length : 0);
        } catch (e) { setTestimonialCount(0); }
      };
      fetchTestimonials();
    }, []);

    // Buscar número de autores
    React.useEffect(() => {
      const fetchAuthors = async () => {
        try {
          const res = await fetch(`${API_URL}/api/db/autores/query`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ operation: 'select', limit: 100 }),
          });
          const payload = await res.json();
          setAuthorCount(Array.isArray(payload.data) ? payload.data.length : 0);
        } catch (e) { setAuthorCount(0); }
      };
      fetchAuthors();
    }, []);
  // Buscar número de posts
  React.useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/db/posts/query`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operation: 'select', limit: 100 }),
        });
        const payload = await res.json();
        setPostCount(Array.isArray(payload.data) ? payload.data.length : 0);
      } catch (e) { setPostCount(0); }
    };
    fetchPosts();
  }, []);

  // Buscar número de comentários pendentes
  React.useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await fetch(`${API_URL}/api/comments?approved=false`, {
          method: 'GET',
        });
        const payload = await res.json();
        setPendingCount(Array.isArray(payload) ? payload.length : 0);
      } catch (e) { setPendingCount(0); }
    };
    fetchPending();
  }, []);

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

  // Cards do painel
  const adminPages = [
    {
      title: 'Projetos', badge: 'PORTFÓLIO', description: 'Organize cases, capas, categorias e destaques do portfólio.', icon: 'fa-solid fa-folder-open', link: '/admin/projetos', color: 'bg-gradient-to-br from-[#3A220C] via-[#6B4B2B] to-[#1A1207]', stats: '24 ativos',
    },
    {
      title: 'Blog', badge: 'ARTIGOS', description: 'Gerencie artigos, rascunhos e conteúdos editoriais do studio.', icon: 'fa-solid fa-newspaper', link: '/admin/blog', color: 'bg-gradient-to-br from-[#1B2A3A] via-[#2C4A6B] to-[#0C1A2A]', stats: '8 rascunhos',
    },
    {
      title: 'Depoimentos', badge: 'SOCIAL PROOF', description: 'Atualize provas sociais e destaque feedbacks estratégicos.', icon: 'fa-solid fa-comment-dots', link: '/admin/depoimentos', color: 'bg-gradient-to-br from-[#181818] via-[#2B2B2B] to-[#1A1A1A]', stats: '12 publicados',
    },
    {
      title: 'Autores', badge: 'EQUIPE', description: 'Edite perfis, biografias e assinaturas dos conteúdos.', icon: 'fa-solid fa-user-tie', link: '/admin/autores', color: 'bg-gradient-to-br from-[#3A2C1A] via-[#6B5B2B] to-[#1A1A07]', stats: '4 perfis',
    },
    {
      title: 'Comentários', badge: 'MODERAÇÃO', description: 'Faça a moderação com mais clareza, filtros e contexto.', icon: 'fa-solid fa-comments', link: '/admin/comentarios', color: 'bg-gradient-to-br from-[#0C2A1A] via-[#2B6B4A] to-[#1A3A2A]', stats: '5 pendentes',
    },
  ];

  // Atalhos
  const quickLinks = [
    { label: 'Ver site', href: '/', external: false },
    { label: 'MongoDB Atlas', href: 'https://cloud.mongodb.com', external: true },
    { label: 'Railway', href: 'https://railway.app/dashboard', external: true },
    { label: 'Analytics', href: 'https://analytics.google.com', external: true },
  ];

  return (
    <div className="bg-dark-bg min-h-screen flex items-center justify-center px-4 md:px-36">
      <div className="w-full bg-gradient-to-br from-[#181818] via-[#232323] to-[#1A1207] rounded-3xl shadow-2xl p-8 md:p-12 lg:p-16 mx-auto mt-12 mb-12">
        {/* Header superior: badge acima do título, título centralizado, subtítulo abaixo, botão sair à direita */}
        <div className="mb-8">
          <div className="flex flex-col items-center">
            {/* Badge acima do título */}
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#3A220C]/20 text-xs font-semibold text-[#C89B5C] tracking-widest shadow-sm border border-[#C89B5C]/30 w-fit mb-4 self-start">SVICERO STUDIO ADMIN</span>
            <div className="flex items-center w-full justify-center relative">
              <h1 className="font-title text-4xl md:text-5xl font-extrabold text-white leading-tight text-left w-full">
                Painel Administrativo
              </h1>
              {/* Botão sair ao lado direito do título */}
              <button
                onClick={signOut}
                className="absolute right-0 top-1/2 -translate-y-1/2 px-6 py-2 rounded-lg bg-[#C89B5C] text-black font-semibold shadow-md hover:bg-[#A67C3C] transition"
              >
                Sair
              </button>
            </div>
            <p className="text-low-medium text-lg mt-2 text-left w-full">
              Um centro de controle refinado, limpo e contemporâneo para administrar o site sem ruído visual.
            </p>
          </div>
        </div>

        {/* Cards de status em linha, igual ao anexo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-black/20 rounded-xl p-5 text-xs text-white/80 font-semibold flex flex-col gap-1 border border-white/10 min-w-[180px]">
            <span className="text-white/60 tracking-widest">SESSÃO ATIVA</span>
            <span className="text-white text-sm font-bold">{user?.email}</span>
          </div>
          <div className="bg-black/20 rounded-xl p-5 text-xs text-white/80 font-semibold flex flex-col gap-1 border border-white/10 min-w-[180px]">
            <span className="text-white/60 tracking-widest">ÚLTIMA ATUALIZAÇÃO</span>
            <span className="text-white text-sm font-bold">{lastAccess || '---'}</span>
          </div>
          <div className="bg-black/20 rounded-xl p-5 text-xs text-white/80 font-semibold flex flex-col gap-1 border border-white/10 min-w-[180px]">
            <span className="text-white/60 tracking-widest">PUBLICAÇÕES</span>
            <span className="text-white text-sm font-bold">{postCount !== null ? `${postCount} no ar` : '---'}</span>
          </div>
          <div className="bg-black/20 rounded-xl p-5 text-xs text-white/80 font-semibold flex flex-col gap-1 border border-white/10 min-w-[180px]">
            <span className="text-white/60 tracking-widest">PENDÊNCIAS</span>
            <span className="text-white text-sm font-bold">{pendingCount !== null ? `${pendingCount} itens` : '---'}</span>
          </div>
        </div>

        {/* Painel principal: cards e atalhos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cards de acesso */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cards do painel com stats reais */}
            <div key="projetos" className={`relative rounded-2xl shadow-xl border border-white/10 p-8 flex flex-col h-full min-h-[220px] ${adminPages[0].color} transition-all`}>
              <div className="absolute top-6 left-6">
                <div className="w-10 h-10 bg-black/20 rounded-lg flex items-center justify-center">
                  <i className={`${adminPages[0].icon} text-2xl text-white`}></i>
                </div>
              </div>
              <div className="absolute top-6 right-6">
                <span className="text-xs font-semibold bg-white/10 text-white px-3 py-1 rounded-full tracking-widest border border-white/20">{adminPages[0].badge}</span>
              </div>
              <div className="flex flex-col flex-1 justify-between mt-10">
                <div>
                  <h2 className="font-title text-2xl font-bold text-white mb-2">{adminPages[0].title}</h2>
                  <p className="text-white/80 text-sm mb-4">{adminPages[0].description}</p>
                </div>
                <div className="flex items-end justify-between mt-auto">
                  <span className="text-white/70 text-xs">{projectCount !== null ? `${projectCount} ativos` : '---'}</span>
                  <Link to={adminPages[0].link} className="bg-black/30 border border-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-white/80 hover:text-black transition">
                    Acessar
                    <i className="fa-solid fa-arrow-right text-xs"></i>
                  </Link>
                </div>
              </div>
            </div>
            <div key="blog" className={`relative rounded-2xl shadow-xl border border-white/10 p-8 flex flex-col h-full min-h-[220px] ${adminPages[1].color} transition-all`}>
              <div className="absolute top-6 left-6">
                <div className="w-10 h-10 bg-black/20 rounded-lg flex items-center justify-center">
                  <i className={`${adminPages[1].icon} text-2xl text-white`}></i>
                </div>
              </div>
              <div className="absolute top-6 right-6">
                <span className="text-xs font-semibold bg-white/10 text-white px-3 py-1 rounded-full tracking-widest border border-white/20">{adminPages[1].badge}</span>
              </div>
              <div className="flex flex-col flex-1 justify-between mt-10">
                <div>
                  <h2 className="font-title text-2xl font-bold text-white mb-2">{adminPages[1].title}</h2>
                  <p className="text-white/80 text-sm mb-4">{adminPages[1].description}</p>
                </div>
                <div className="flex items-end justify-between mt-auto">
                  <span className="text-white/70 text-xs">{postCount !== null ? `${postCount} artigos` : '---'}</span>
                  <Link to={adminPages[1].link} className="bg-black/30 border border-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-white/80 hover:text-black transition">
                    Acessar
                    <i className="fa-solid fa-arrow-right text-xs"></i>
                  </Link>
                </div>
              </div>
            </div>
            <div key="depoimentos" className={`relative rounded-2xl shadow-xl border border-white/10 p-8 flex flex-col h-full min-h-[220px] ${adminPages[2].color} transition-all`}>
              <div className="absolute top-6 left-6">
                <div className="w-10 h-10 bg-black/20 rounded-lg flex items-center justify-center">
                  <i className={`${adminPages[2].icon} text-2xl text-white`}></i>
                </div>
              </div>
              <div className="absolute top-6 right-6">
                <span className="text-xs font-semibold bg-white/10 text-white px-3 py-1 rounded-full tracking-widest border border-white/20">{adminPages[2].badge}</span>
              </div>
              <div className="flex flex-col flex-1 justify-between mt-10">
                <div>
                  <h2 className="font-title text-2xl font-bold text-white mb-2">{adminPages[2].title}</h2>
                  <p className="text-white/80 text-sm mb-4">{adminPages[2].description}</p>
                </div>
                <div className="flex items-end justify-between mt-auto">
                  <span className="text-white/70 text-xs">{testimonialCount !== null ? `${testimonialCount} publicados` : '---'}</span>
                  <Link to={adminPages[2].link} className="bg-black/30 border border-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-white/80 hover:text-black transition">
                    Acessar
                    <i className="fa-solid fa-arrow-right text-xs"></i>
                  </Link>
                </div>
              </div>
            </div>
            <div key="autores" className={`relative rounded-2xl shadow-xl border border-white/10 p-8 flex flex-col h-full min-h-[220px] ${adminPages[3].color} transition-all`}>
              <div className="absolute top-6 left-6">
                <div className="w-10 h-10 bg-black/20 rounded-lg flex items-center justify-center">
                  <i className={`${adminPages[3].icon} text-2xl text-white`}></i>
                </div>
              </div>
              <div className="absolute top-6 right-6">
                <span className="text-xs font-semibold bg-white/10 text-white px-3 py-1 rounded-full tracking-widest border border-white/20">{adminPages[3].badge}</span>
              </div>
              <div className="flex flex-col flex-1 justify-between mt-10">
                <div>
                  <h2 className="font-title text-2xl font-bold text-white mb-2">{adminPages[3].title}</h2>
                  <p className="text-white/80 text-sm mb-4">{adminPages[3].description}</p>
                </div>
                <div className="flex items-end justify-between mt-auto">
                  <span className="text-white/70 text-xs">{authorCount !== null ? `${authorCount} perfis` : '---'}</span>
                  <Link to={adminPages[3].link} className="bg-black/30 border border-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-white/80 hover:text-black transition">
                    Acessar
                    <i className="fa-solid fa-arrow-right text-xs"></i>
                  </Link>
                </div>
              </div>
            </div>
            <div key="comentarios" className={`relative rounded-2xl shadow-xl border border-white/10 p-8 flex flex-col h-full min-h-[220px] ${adminPages[4].color} transition-all`}>
              <div className="absolute top-6 left-6">
                <div className="w-10 h-10 bg-black/20 rounded-lg flex items-center justify-center">
                  <i className={`${adminPages[4].icon} text-2xl text-white`}></i>
                </div>
              </div>
              <div className="absolute top-6 right-6">
                <span className="text-xs font-semibold bg-white/10 text-white px-3 py-1 rounded-full tracking-widest border border-white/20">{adminPages[4].badge}</span>
              </div>
              <div className="flex flex-col flex-1 justify-between mt-10">
                <div>
                  <h2 className="font-title text-2xl font-bold text-white mb-2">{adminPages[4].title}</h2>
                  <p className="text-white/80 text-sm mb-4">{adminPages[4].description}</p>
                </div>
                <div className="flex items-end justify-between mt-auto">
                  <span className="text-white/70 text-xs">{pendingCount !== null ? `${pendingCount} pendentes` : '---'}</span>
                  <Link to={adminPages[4].link} className="bg-black/30 border border-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-white/80 hover:text-black transition">
                    Acessar
                    <i className="fa-solid fa-arrow-right text-xs"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          {/* Atalhos */}
          <div className="flex flex-col gap-4">
            <div className="relative bg-[#181818] rounded-2xl shadow-xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-title text-lg font-bold text-white">Atalhos</h3>
                <span className="text-xs font-semibold bg-white/10 text-white px-3 py-1 rounded-full tracking-widest border border-white/20">QUICK ACCESS</span>
              </div>
              <div className="flex flex-col gap-2">
                {quickLinks.map((link) => (
                  link.external ? (
                    <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="bg-black/30 border border-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center justify-between hover:bg-white/80 hover:text-black transition">
                      <span>{link.label}</span>
                      <i className="fa-solid fa-arrow-up-right-from-square text-xs text-white/60"></i>
                    </a>
                  ) : (
                    <Link key={link.label} to={link.href} className="bg-black/30 border border-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center justify-between hover:bg-white/80 hover:text-black transition">
                      <span>{link.label}</span>
                      <i className="fa-solid fa-arrow-right text-xs text-white/60"></i>
                    </Link>
                  )
                ))}
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};



export default Admin;
