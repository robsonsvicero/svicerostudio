import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../UI/Button';
import heroBkg from '../../images/hero_bkg.png';
import imageHero from '../../images/image_hero.png';

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section
      className="relative flex items-center justify-center px-0 md:px-0 pt-20 lg:pt-32 pb-20 overflow-hidden"
      style={{ fontFamily: 'Manrope, Inter, sans-serif' }}
    >
      {/* Background com overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(35,35,35,1) 0%, rgba(35,35,35,0.85) 50%, rgba(35,35,35,0.1) 100%), url(${heroBkg})`
        }}
      ></div>
      {/* Conteúdo principal */}
      <div className="relative z-20 w-full max-w-[1280px] mx-auto flex flex-col lg:flex-row items-stretch justify-between py-16 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Coluna esquerda: badge, título, texto, botões */}
        <div className="flex-1 flex flex-col justify-center lg:items-start items-center text-left lg:text-left">
          <span className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-secondary/5 text-xs font-semibold text-secondary tracking-widest shadow-sm border border-secondary/30">
            <span className="w-2 h-2 rounded-full bg-secondary inline-block"></span>
            INOVAÇÃO DIGITAL
          </span>
          <h1 className="font-extrabold text-cream text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.08] mb-6 drop-shadow-xl" style={{ letterSpacing: '-0.02em' }}>
            Marca e site à altura de quem você é
            {/* Design,<br />
            Tecnologia e um <br />
            <span>pouco de <span className="text-secondary font-" style={{ fontWeight: 800, letterSpacing: '-0.03em' }}>mágica</span></span> */}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/85 mb-10 leading-relaxed max-w-lg" style={{ fontWeight: 500 }}>
            Criamos, com você, uma presença digital que combina estratégia, estética e um pouco de magia, para o seu trabalho ser reconhecido antes mesmo do primeiro contato.
          </p>
          <div className="flex flex-col md:flex-row gap-4 mt-2">
            <Button
              variant="secondary"
              className="shadow-lg transition w-full sm:w-full md:w-auto"
              style={{ boxShadow: '0 4px 24px 0 rgba(249,162,91,0.33)' }}
              onClick={() => navigate('/formulario-interesse')}
            >
              Revisar presença digital
            </Button>
            <Button
              variant="outline"
              className="hover:text-primary transition w-full sm:w-full md:w-auto"
              onClick={() => navigate('/processos')}
            >
              Ver como funciona
            </Button>
          </div>
        </div>
        {/* Coluna direita: apenas imagem */}
        {/* Coluna direita: apenas imagem (web), tablet imagem abaixo do texto, mobile sem imagem) */}
        <div className="flex-1 flex items-center justify-center w-full relative z-30 px-6 md:px-0 mt-10 md:mt-8 lg:mt-0">
          <img
            src={imageHero}
            alt="Notebook com site Aura Studio"
            className="hidden md:block lg:block max-w-[500px] w-[480px] rounded-3xl shadow-2xl mx-auto"
            style={{ boxShadow: '0 16px 64px 0 rgba(0,0,0,0.45)' }}
            loading="lazy"
          />
        </div>
      </div>
      {/* Scroll Indicator Mouse */}
      <div className="absolute left-1/2 bottom-8 -translate-x-1/2 z-30 flex flex-col items-center">
        <svg width="28" height="44" viewBox="0 0 28 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-[pulse_2s_infinite]">
          <rect x="2" y="2" width="24" height="40" rx="12" stroke="white" strokeWidth="2.5" fill="none" />
          <circle cx="14" cy="12" r="3" fill="white" />
        </svg>
        <style>{`
          @keyframes pulse {
            0% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.25); }
            100% { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>
    </section>
  );
};

export default HeroSection;
