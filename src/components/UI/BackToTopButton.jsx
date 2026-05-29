import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const ENABLED_PATHS = new Set([
  '/',
  '/blog',
  '/contato',
  '/diagnostico',
  '/faq',
  '/formulario-interesse',
  '/lp-dentistas',
  '/pacote-marca',
  '/projetos',
  '/processos',
]);

const BackToTopButton = () => {
  const { pathname } = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 420);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!ENABLED_PATHS.has(pathname)) {
    return null;
  }

  return (
    <button
      type="button"
      aria-label="Voltar ao topo da página"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed bottom-6 right-6 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full border border-ds-accent/25 bg-ds-text text-ds-accent shadow-[0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-ds-text-hover hover:bg-ds-text-hover hover:text-ds-accent focus:outline-none focus:ring-2 focus:ring-ds-text-hover/40 ${isVisible ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'}`}
    >
      <ArrowUp size={24} strokeWidth={2.5} />
    </button>
  );
};

export default BackToTopButton;