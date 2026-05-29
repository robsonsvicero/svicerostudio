import React from 'react';
import simbolo from '../assets/simbolo0.png';
import SEOHelmet from '../components/SEOHelmet';

const BusinessCard = () => {
  const baseButtonClass =
    'w-full inline-flex items-center justify-center rounded-full border px-6 py-4 text-sm font-bold tracking-[0.15em] uppercase transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-copper';
  const primaryButtonClass = `${baseButtonClass} border-ds-accent bg-ds-accent text-white hover:border-ds-accent-hover hover:bg-ds-accent-hover`;
  const outlineButtonClass = `${baseButtonClass} border-ds-border bg-ds-outline text-ds-text hover:bg-ds-outline-hover`;

  return (
    <>
      <SEOHelmet 
        title="Links Oficiais — Svicero Studio" 
        description="Acesse nossos canais oficiais. Estratégia que eleva, design que posiciona."
      />
      
      <div className="min-h-screen bg-ds-surface font-body flex flex-col items-center justify-center py-12 px-4 sm:px-6 relative overflow-hidden">
        
        {/* Glow Effects (Luzes de fundo) */}
        <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-ds-accent/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-ds-accent/5 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
        
        {/* Main Card (Glassmorphism) */}
        <div className="w-full max-w-[420px] bg-ds-bg backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl relative z-10 flex flex-col items-center text-center hover:border-white/10 transition-colors duration-500">
          
          {/* Logo Container com animação no hover */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-white/10 bg-ds-surface flex items-center justify-center mb-6 shadow-xl relative group cursor-default">
            <div className="absolute inset-0 rounded-full bg-ds-accent/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <img 
              src={simbolo} 
              alt="Svicero Studio" 
              className="w-full h-full object-contain relative z-10 transition-transform duration-700 group-hover:scale-110" 
              loading="lazy" 
            />
          </div>

          {/* Título & Tagline */}
          <h1 className="text-2xl sm:text-[1.75rem] font-medium tracking-tight text-ds-text mb-2">
            Svicero Studio
          </h1>
          <p className="text-[10px] sm:text-[11px] font-mono text-ds-accent uppercase tracking-widest mb-6">
            Sofisticação começa na clareza
          </p>

          {/* Descrição Curta */}
          <p className="text-sm sm:text-[15px] text-ds-muted leading-[1.6] mb-10 border-b border-white/5 pb-8">
            Estratégia de marca e posicionamento para clínicas e negócios de saúde que precisam alinhar percepção, confiança e presença digital ao nível do seu trabalho.
          </p>

          {/* Botões/Links (Usando o Design System) */}
          <div className="flex flex-col w-full gap-4">
            <button
              type="button"
              onClick={() => window.open('https://wa.me/5511964932007?text=Ol%C3%A1%20Robson%2C%20gostaria%20de%20falar%20sobre%20a%20minha%20marca.', '_blank', 'noopener,noreferrer')}
              className={primaryButtonClass}
            >
              Falar pelo WhatsApp
            </button>

            <button
              type="button"
              onClick={() => {
                window.location.href = '/';
              }}
              className={outlineButtonClass}
            >
              VER SITE DO ESTÚDIO
            </button>

            <button
              type="button"
              onClick={() => window.open('https://www.instagram.com/svicerostudio', '_blank', 'noopener,noreferrer')}
              className={outlineButtonClass}
            >
              INSTAGRAM DO ESTÚDIO
            </button>

            <button
              type="button"
              onClick={() => {
                window.location.href = 'mailto:hello@svicerostudio.com.br';
              }}
              className={outlineButtonClass}
            >
              E-mail de Contato
            </button>
          </div>

          {/* Rodapé Minimalista */}
          <div className="mt-10 flex items-center justify-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-ds-accent shadow-[0_0_10px_rgba(184,115,51,0.5)] animate-pulse"></span>
            <p className="text-[10px] font-mono text-ds-muted uppercase tracking-[0.2em] opacity-50">
              © {new Date().getFullYear()} Svicero Studio
            </p>
          </div>
        </div>

      </div>
    </>
  );
};

export default BusinessCard;
