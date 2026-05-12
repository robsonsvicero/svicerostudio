import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Toast from '../UI/Toast';
import Button from '../UI/Button';

// Redesign dashboard: Full SaaS-style layout with sidebar + topbar

const navItems = [
  { label: 'Visão Geral', path: '/admin', icon: 'fa-solid fa-gauge-high' },
  { label: 'Projetos', path: '/admin/projetos', icon: 'fa-solid fa-folder-open' },
  { label: 'Blog', path: '/admin/blog', icon: 'fa-solid fa-newspaper' },
  { label: 'Depoimentos', path: '/admin/depoimentos', icon: 'fa-solid fa-comment-dots' },
  { label: 'Autores', path: '/admin/autores', icon: 'fa-solid fa-user-tie' },
  { label: 'Comentários', path: '/admin/comentarios', icon: 'fa-solid fa-comments' },
  { label: 'FAQ', path: '/admin/faq', icon: 'fa-solid fa-circle-question' },
];

const externalLinks = [
  { label: 'Ver site', href: '/', icon: 'fa-solid fa-arrow-up-right-from-square' },
  { label: 'Analytics', href: 'https://analytics.google.com', icon: 'fa-solid fa-chart-line' },
];

const AdminLayout = ({ children, title, actions, toastProps }) => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-charcoal font-body">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-surface border-r border-white/5
          transform transition-transform duration-200 ease-in-out
          lg:static lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        role="navigation"
        aria-label="Admin Navigation"
      >
        {/* Sidebar header */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-white/5">
          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-copper/15 border border-copper/25">
              <span className="text-copper font-mono text-xs font-bold">SV</span>
            </div>
            <span className="text-sm font-semibold text-cream tracking-wide">Svicero Studio</span>
          </Link>
          <Button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-muted hover:text-cream hover:bg-white/5 transition-colors"
            aria-label="Fechar menu"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </Button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <p className="px-3 mb-2 text-[10px] font-mono uppercase tracking-widest text-muted">Menu</p>
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all
                  ${active
                    ? 'bg-copper/10 text-copper border border-copper/20'
                    : 'text-muted hover:text-cream hover:bg-white/5 border border-transparent'
                  }
                `}
              >
                <i className={`${item.icon} w-5 text-center text-sm ${active ? 'text-copper' : 'text-muted group-hover:text-cream'}`}></i>
                {item.label}
              </Link>
            );
          })}

          {/* Separator */}
          <div className="my-4 border-t border-white/5" />

          <p className="px-3 mb-2 text-[10px] font-mono uppercase tracking-widest text-muted">Links</p>
          {externalLinks.map((item) => {
            const isExternal = item.href.startsWith('http');
            const linkProps = isExternal
              ? { href: item.href, target: '_blank', rel: 'noopener noreferrer' }
              : { href: item.href };
            const Tag = isExternal ? 'a' : Link;
            const toOrHref = isExternal ? {} : { to: item.href };

            return (
              <Tag
                key={item.label}
                {...(isExternal ? linkProps : toOrHref)}
                className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted hover:text-cream hover:bg-white/5 border border-transparent transition-all"
              >
                <i className={`${item.icon} w-5 text-center text-sm text-muted group-hover:text-cream`}></i>
                {item.label}
              </Tag>
            );
          })}
        </nav>

        {/* Sidebar footer - user */}
        <div className="border-t border-white/5 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-copper/15 border border-copper/25 flex-shrink-0">
              <span className="text-copper text-xs font-bold">
                {user?.email?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-cream truncate">{user?.email || 'Admin'}</p>
              <p className="text-xs text-muted">Administrador</p>
            </div>
            <Button
              onClick={signOut}
              className="p-2 rounded-lg text-muted hover:text-red-400 hover:bg-red-400/10 transition-colors"
              aria-label="Sair"
              title="Sair"
            >
              <i className="fa-solid fa-right-from-bracket text-sm"></i>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-16 items-center justify-between border-b border-white/5 bg-surface px-4 lg:px-8 flex-shrink-0">
          <div className="flex items-center gap-4">
            {/* Mobile hamburger */}
            <Button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-muted hover:text-cream hover:bg-white/5 transition-colors"
              aria-label="Abrir menu"
            >
              <i className="fa-solid fa-bars text-lg"></i>
            </Button>

            {/* Page title */}
            {title && (
              <h1 className="text-lg font-semibold text-cream tracking-tight">{title}</h1>
            )}
          </div>

          {/* Topbar right: actions */}
          <div className="flex items-center gap-3">
            {actions}
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>

      {/* Toast */}
      {toastProps && (
        <Toast
          show={toastProps.show}
          message={toastProps.message}
          type={toastProps.type}
          onClose={toastProps.onClose}
        />
      )}
    </div>
  );
};

export default AdminLayout;
