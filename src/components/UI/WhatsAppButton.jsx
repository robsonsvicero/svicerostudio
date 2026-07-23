import React from 'react';
import { useLocation } from 'react-router-dom';

const WHATSAPP_URL = 'https://wa.me/5511964932007?text=Ol%C3%A1!%20Venho%20pelo%20site%20do%20est%C3%BAdio%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es';

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
  '/sobre',
]);

const WhatsAppButton = () => {
  const { pathname } = useLocation();

  if (!ENABLED_PATHS.has(pathname) && !pathname.startsWith('/blog/')) {
    return null;
  }

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Conversar com o Svicero Studio pelo WhatsApp"
      className="fixed bottom-6 right-6 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-[#25D366] text-white shadow-[0_18px_40px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#20bd5a] focus:outline-none focus:ring-2 focus:ring-[#25D366]/50"
    >
      <i className="fa-brands fa-whatsapp text-3xl" aria-hidden="true" />
    </a>
  );
};

export default WhatsAppButton;
