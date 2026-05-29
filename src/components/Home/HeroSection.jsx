import Button from "../UI/Button.jsx";
import ScrollReveal from "../UI/ScrollReveal.jsx";
import { useState, useEffect, useRef } from "react";

import heroBg1 from "../../assets/hero01.png"; 
import heroBg2 from "../../assets/hero02.png";
import heroBg3 from "../../assets/hero03.png";
import heroBg4 from "../../assets/hero04.png";

const backgroundImages = [heroBg1, heroBg2, heroBg3, heroBg4];

const Hero = () => {
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const intervalRef = useRef(null);

  const startInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000);
  };

  useEffect(() => {
    // Preload de todas as imagens
    backgroundImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    startInterval();
    return () => clearInterval(intervalRef.current);
  }, []);

  const handleDotClick = (index) => {
    setCurrentBgIndex(index);
    startInterval();
  };

  return (
    <section id="hero" className="max-w-7xl mx-auto px-6 py-16 sm:py-24 grid lg:grid-cols-12 gap-12 lg:gap-8 items-center border-b border-white/5 font-body">
      
      {/* TEXT SIDE (LEFT) */}
      <ScrollReveal direction="right" delay={0.1} className="lg:col-span-6 flex flex-col items-start text-left order-1 relative z-10">
        
        <span className="reveal text-ds-accent text-[11px] font-mono uppercase tracking-[0.2em] mb-6 flex items-center gap-2 px-4 py-1.5 border border-ds-accent/20 bg-ds-accent/10 rounded-full backdrop-blur-sm shadow-[0_0_15px_rgba(255,122,89,0.15)]">
          <span className="w-1.5 h-1.5 rounded-full bg-ds-accent shadow-[0_0_10px_rgba(255,122,89,0.8)]" />
          ESTRATÉGIA, PERCEPÇÃO & POSICIONAMENTO
        </span>

        <h1 className="reveal stagger-1 text-4xl sm:text-5xl lg:text-[3.8rem] font-bold tracking-tight text-ds-text leading-[1.1] mb-8">
          Existe uma diferença entre entregar qualidade e ser <span className="text-ds-accent italic font-normal">percebido como referência.</span>
        </h1>

        <p className="reveal stagger-2 text-lg md:text-xl text-ds-text/60 mb-6 max-w-lg leading-[1.6]">
          Construímos sistemas de marca que tornam percepção, comunicação e experiência mais coerentes com o nível da sua clínica.
        </p>
        
        <div className="reveal stagger-4 flex flex-row gap-6 items-center w-full sm:w-auto">
          <Button variant="primary" href="/formulario-interesse" className="w-full">
            Agendar Diagnóstico
          </Button>
        </div>
      </ScrollReveal>

      {/* VISUAL SIDE (RIGHT) */}
      <ScrollReveal direction="left" delay={0.3} className="lg:col-span-6 relative order-2 [perspective:1000px] reveal stagger-2">
        <div className="absolute inset-0 bg-[#1E2023] rounded-[2rem] transform rotate-3 scale-[0.98] translate-x-3 translate-y-6 -z-10 border border-white/5 shadow-2xl"></div>
        <div className="w-full h-[450px] lg:h-[600px] bg-[#141414] rounded-[2rem] border border-white/10 overflow-hidden relative shadow-2xl group">
          
          {/* Carousel Track */}
          <div className="flex w-full h-full relative">
            {backgroundImages.map((bg, index) => (
              <img
                key={index}
                src={bg}
                alt="Projetos Svicero Studio"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                  index === currentBgIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          </div>

          {/* Carousel Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
            {backgroundImages.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentBgIndex ? "bg-ds-accent w-6" : "bg-white/40 hover:bg-white/80"
                }`}
                aria-label={`Ir para imagem ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
};

export default Hero;