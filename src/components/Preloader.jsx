import React, { useState, useEffect } from 'react';
import logoPreloader from '../images/sviceroStudio.png';

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
    }, 2400);

    return () => clearTimeout(timer);
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-cream via-white to-cream transition-opacity duration-600 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="relative flex flex-col items-center">
        {/* Logo estático */}
        <div className="relative z-10">
          <img 
            src={logoPreloader} 
            alt="Svicero Studio" 
            className="w-64 md:w-80"
            style={{
              filter: 'drop-shadow(0 10px 30px rgba(9, 76, 126, 0.15))'
            }}
          />
        </div>

        {/* Barra de progresso */}
        <div className="relative z-10 mt-12 w-64 h-1 bg-primary/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary via-secondary to-primary rounded-full animate-progress"
            style={{
              backgroundSize: '200% 100%'
            }}
          ></div>
        </div>
      </div>

      <style>{`
        @keyframes progress {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-progress {
          animation: progress 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Preloader;
