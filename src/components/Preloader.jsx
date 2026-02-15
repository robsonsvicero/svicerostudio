import React, { useState, useEffect } from 'react';
import logoPreloader from '../images/simbolo 3.png';


const Preloader = () => {
  const [isLoading, setIsLoading] = useState(() => {
    // Verifica se o preloader já foi exibido nesta sessão
    if (typeof window !== 'undefined') {
      const hasShown = sessionStorage.getItem('preloaderShownHome');
      return !hasShown;
    }
    return false;
  });
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!isLoading) return;

    // Marca que o preloader foi exibido nesta sessão
    sessionStorage.setItem('preloaderShownHome', 'true');

    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setIsLoading(false), 600);
    }, 1500);

    return () => clearTimeout(timer);
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#393d41] transition-opacity duration-600 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center">
        {/* Logo centralizado */}
        <img
          src={logoPreloader}
          alt="Logo Svicero Studio"
          className="w-[140px] h-auto mb-8"
          style={{ filter: 'drop-shadow(0 10px 30px rgba(9,76,126,0.15))' }}
        />
        {/* Barra de progressão animada */}
        <div className="w-[120px] h-[3px] relative overflow-hidden mt-2">
          <div className="absolute left-0 top-0 h-full bg-[#fff8f2] rounded w-full"></div>
          <div className="absolute left-0 top-0 h-full bg-[#B87333] rounded animate-preloader-fill" style={{ width: '0%' }}></div>
        </div>
      </div>
      <style>{`
        @keyframes preloader-fill {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-preloader-fill {
          animation: preloader-fill 1.5s linear forwards;
        }
      `}</style>
    </div>
  );
};

export default Preloader;
