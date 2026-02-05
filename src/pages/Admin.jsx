import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Admin = () => {
  const { user, signOut } = useAuth();

  const adminPages = [
    {
      title: 'Projetos',
      description: 'Gerencie os projetos exibidos no portfólio',
      icon: 'fa-solid fa-folder-open',
      link: '/admin/projetos',
      color: 'bg-primary',
      hoverColor: 'hover:bg-primary/90'
    },
    {
      title: 'Blog',
      description: 'Crie e edite publicações do blog',
      icon: 'fa-solid fa-newspaper',
      link: '/admin/blog',
      color: 'bg-secondary',
      hoverColor: 'hover:bg-secondary/90'
    },
    {
      title: 'Depoimentos',
      description: 'Gerencie os depoimentos de clientes',
      icon: 'fa-solid fa-comment-dots',
      link: '/admin/depoimentos',
      color: 'bg-low-dark',
      hoverColor: 'hover:bg-low-dark/90'
    },
    {
      title: 'Autores',
      description: 'Gerencie os autores dos artigos do blog',
      icon: 'fa-solid fa-user-tie',
      link: '/admin/autores',
      color: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-800/90'
    }
  ];

  const quickLinks = [
    { label: 'Ver Site', icon: 'fa-solid fa-globe', href: '/', external: false },
    { label: 'Supabase', icon: 'fa-solid fa-database', href: 'https://supabase.com/dashboard', external: true },
    { label: 'Vercel', icon: 'fa-solid fa-cloud', href: 'https://vercel.com/dashboard', external: true },
  ];

  return (
    <div className="bg-cream min-h-screen">
      <main className="pt-20 pb-20 px-4 md:px-16">
        <div className="max-w-screen-xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <h1 className="font-title text-4xl md:text-5xl font-semibold text-low-dark mb-2">
                Painel Administrativo
              </h1>
              <p className="text-low-medium text-lg">
                Bem-vindo, <span className="text-primary font-medium">{user?.email}</span>
              </p>
            </div>
            <button
              onClick={signOut}
              className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              <i className="fa-solid fa-right-from-bracket"></i>
              Sair
            </button>
          </div>

          {/* Cards de Admin */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {adminPages.map((page) => (
              <Link
                key={page.link}
                to={page.link}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className={`${page.color} ${page.hoverColor} p-8 transition-colors`}>
                  <i className={`${page.icon} text-5xl text-white`}></i>
                </div>
                <div className="p-6">
                  <h2 className="font-title text-2xl font-light text-low-dark mb-2 group-hover:text-primary transition-colors">
                    {page.title}
                  </h2>
                  <p className="text-low-medium">
                    {page.description}
                  </p>
                  <div className="mt-4 flex items-center text-primary font-medium">
                    <span>Acessar</span>
                    <i className="fa-solid fa-arrow-right ml-2 group-hover:translate-x-2 transition-transform"></i>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Links Rápidos */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="font-title text-2xl font-light text-low-dark mb-6">
              Links Rápidos
            </h3>
            <div className="flex flex-wrap gap-4">
              {quickLinks.map((link) => (
                link.external ? (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-low-dark"
                  >
                    <i className={`${link.icon} text-lg`}></i>
                    <span>{link.label}</span>
                    <i className="fa-solid fa-arrow-up-right-from-square text-xs text-gray-400"></i>
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="flex items-center gap-3 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-low-dark"
                  >
                    <i className={`${link.icon} text-lg`}></i>
                    <span>{link.label}</span>
                  </Link>
                )
              ))}
            </div>
          </div>

          {/* Info Card */}
          <div className="mt-8 bg-gradient-to-r from-low-dark to-low-medium rounded-2xl p-8 text-cream">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="fa-solid fa-lightbulb text-primary text-2xl"></i>
              </div>
              <div>
                <h4 className="font-title text-xl font-light mb-2">Dica</h4>
                <p className="text-cream/80">
                  Todas as alterações feitas no painel são salvas automaticamente no banco de dados Supabase 
                  e refletidas imediatamente no site. Lembre-se de manter os dados atualizados para uma melhor 
                  experiência dos visitantes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
