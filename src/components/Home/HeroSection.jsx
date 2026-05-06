import Button from "../UI/Button.jsx";
import { useState, useEffect, useRef } from "react";

import heroBg1 from "../../assets/hero-bg1.png";
import heroBg2 from "../../assets/hero-bg2.png";
import heroBg3 from "../../assets/hero-bg3.png";
import heroBg4 from "../../assets/hero-bg4.png";

const backgroundImages = [heroBg1, heroBg2, heroBg3, heroBg4];

const Hero = () => {
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const intervalRef = useRef(null);

  const startInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentBgIndex((prevIndex) =>
        (prevIndex + 1) % backgroundImages.length
      );
    }, 5000);
  };

  useEffect(() => {
    // Preload de todas as imagens
    backgroundImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    // Inicia o carrossel
    startInterval();

    return () => clearInterval(intervalRef.current);
  }, []);

  const handleDotClick = (index) => {
    setCurrentBgIndex(index);
    startInterval();
  };

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pt-16 md:pt-0 font-body">

      {/* Carrossel de Background */}
      <div className="absolute inset-0">
        {backgroundImages.map((bg, index) => (
          <img
            key={index}
            src={bg}
            alt=""
            role="presentation"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              index === currentBgIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 via-[#1A1A1A]/40 to-transparent" />
      </div>

      {/* Conteúdo do Hero */}
      <div className="relative z-10 container text-center pt-14 sm:pt-16 md:pt-20 pb-24 sm:pb-28 md:pb-32 px-4 sm:px-6 md:px-0">

        {/* Badge */}
        <div className="reveal flex justify-start max-w-5xl mx-auto mb-4 sm:mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#F8F7F2]/70 text-[#F8F7F2] text-xs font-medium tracking-wider uppercase bg-[#F8F7F2]/10 backdrop-blur-sm">
            <span className="w-2 h-2 bg-[#F8F7F2] -rotate-45" />
            Branding
          </span>
        </div>

        {/* Título */}
        <h1 className="reveal stagger-1 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.1] max-w-5xl mx-auto mt-12 sm:mt-16 md:mt-24 lg:mt-28 text-white text-balance">
          Ajudamos empresas que já vendem a sair da guerra de preços.
        </h1>

        {/* Subtítulo */}
        <p className="reveal stagger-2 mt-5 sm:mt-6 text-white/90 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Usamos estratégia de marca e design para reposicionar o seu negócio,
          justificar preços mais altos e atrair clientes dispostos a pagar o que você vale.
        </p>

        {/* Texto de transição */}
        <p className="reveal stagger-3 mt-8 text-white/70 text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-medium">
          Uma conversa estratégica para entender por que sua marca ainda não
          sustenta o preço que você merece cobrar – e o que precisa mudar para isso.
        </p>

        {/* CTA */}
        <div className="reveal stagger-4 mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Button variant="secondary" size="lg" href="/diagnostico">
            Agendar Diagnóstico
          </Button>
        </div>
      </div>

      {/* Paginação */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3 sm:gap-4 w-full max-w-4xl px-4 sm:px-6">
        {backgroundImages.map((_, index) => (
          <div
            key={index}
            onClick={() => handleDotClick(index)}
            className={`flex-1 h-[2px] rounded-full transition-colors duration-300 cursor-pointer ${
              index === currentBgIndex
                ? "bg-white"
                : "bg-white/50 hover:bg-white/70"
            }`}
            role="button"
            aria-label={`Mudar para imagem ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-16 sm:bottom-24 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
          <div className="w-1 h-2 bg-white/50 rounded-full" />
        </div>
      </div>

    </section>
  );
};

export default Hero;