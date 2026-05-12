import React from 'react';
import Button from '../components/UI/Button';
import simbolo from '../assets/simbolo1.png';
import SEOHelmet from '../components/SEOHelmet';

const BusinessCard = () => {
  return (
    <>
      <SEOHelmet 
        title="Links Oficiais — Svicero Studio" 
        description="Acesse nossos canais oficiais. Estratégia que eleva, design que posiciona."
      />
      
      <div className="min-h-screen bg-charcoal font-body flex flex-col items-center justify-center py-12 px-4 sm:px-6 relative overflow-hidden">
        
        {/* Glow Effects (Luzes de fundo) */}
        <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-copper/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-copper/5 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
        
        {/* Main Card (Glassmorphism) */}
        <div className="w-full max-w-[420px] bg-[#141414]/80 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl relative z-10 flex flex-col items-center text-center hover:border-white/10 transition-colors duration-500">
          
          {/* Logo Container com animação no hover */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-white/10 bg-surface flex items-center justify-center mb-6 shadow-xl relative group cursor-default">
            <div className="absolute inset-0 rounded-full bg-copper/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <img 
              src={simbolo} 
              alt="Svicero Studio" 
              className="w-12 h-12 sm:w-14 sm:h-14 object-contain relative z-10 transition-transform duration-700 group-hover:scale-110" 
              loading="lazy" 
            />
          </div>

          {/* Título & Tagline */}
          <h1 className="text-2xl sm:text-[1.75rem] font-medium tracking-tight text-cream mb-2">
            Svicero Studio
          </h1>
          <p className="text-[10px] sm:text-[11px] font-mono text-copper uppercase tracking-widest mb-6">
            Estratégia que eleva, design que posiciona
          </p>

          {/* Descrição Curta */}
          <p className="text-sm sm:text-[15px] text-muted leading-[1.6] mb-10 border-b border-white/5 pb-8">
            Criamos a fundação digital da sua marca, integrando Identidade Visual, UX/UI e Desenvolvimento para performance e autoridade.
          </p>

          {/* Botões/Links (Usando o Design System) */}
          <div className="flex flex-col w-full gap-4">
            <Button
              href="https://wa.me/5511964932007?text=Ol%C3%A1%20Robson%2C%20gostaria%20de%20falar%20sobre%20a%20minha%20marca."
              variant="primary"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center"
            >
              Falar pelo WhatsApp
            </Button>

            <Button
              href="/"
              variant="outline"
              className="w-full flex items-center justify-center"
            >
              Nosso Website Oficial
            </Button>

            <Button
              href="https://www.instagram.com/svicerostudio"
              variant="outline"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center"
            >
              Acompanhe o Studio
            </Button>

            <Button
              href="mailto:hello@svicerostudio.com.br"
              variant="outline"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center"
            >
              E-mail de Contato
            </Button>
          </div>

          {/* Rodapé Minimalista */}
          <div className="mt-10 flex items-center justify-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-copper shadow-[0_0_10px_rgba(184,115,51,0.5)] animate-pulse"></span>
            <p className="text-[10px] font-mono text-muted uppercase tracking-[0.2em] opacity-50">
              © {new Date().getFullYear()} Svicero Studio
            </p>
          </div>
        </div>

      </div>
    </>
  );
};

export default BusinessCard;
