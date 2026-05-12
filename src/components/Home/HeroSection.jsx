import Button from "../UI/Button.jsx";
import ScrollReveal from "../UI/ScrollReveal.jsx";
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
    <section id="hero" className="max-w-7xl mx-auto px-6 pt-32 pb-24 lg:pt-48 lg:pb-32 grid lg:grid-cols-12 gap-12 lg:gap-8 items-center border-b border-white/5 font-body">
      <ScrollReveal direction="right" delay={0.1} className="lg:col-span-6 flex flex-col items-start text-left order-2 lg:order-1 relative z-10">
        <span className="reveal text-copper text-[11px] font-mono uppercase tracking-[0.2em] mb-6 flex items-center gap-2 px-4 py-1.5 border border-copper/20 bg-copper/10 rounded-full backdrop-blur-sm shadow-[0_0_15px_rgba(184,115,51,0.15)]">
          <span className="w-1.5 h-1.5 rounded-full bg-copper shadow-[0_0_10px_rgba(184,115,51,0.8)]" />
          Branding
        </span>

        <h1 className="reveal stagger-1 text-4xl sm:text-5xl lg:text-[4rem] font-bold tracking-tight text-white leading-[1.05] mb-8">
          Ajudamos empresas que já vendem a sair da <span className="text-copper italic font-normal">guerra de preços.</span>
        </h1>

        <p className="reveal stagger-2 text-lg md:text-xl text-white/80 mb-6 max-w-lg leading-[1.6]">
          Usamos estratégia de marca e design para reposicionar o seu negócio, justificar preços mais altos e atrair clientes dispostos a pagar o que você vale.
        </p>

        <p className="reveal stagger-3 text-white/60 text-base max-w-lg leading-relaxed mb-10">
          Uma conversa estratégica para entender por que sua marca ainda não sustenta o preço que você merece cobrar – e o que precisa mudar para isso.
        </p>

        <div className="reveal stagger-4 flex flex-row gap-6 items-center w-full sm:w-auto">
          <Button variant="primary" href="/formulario-interesse" className="w-full" >
            Agendar Diagnóstico
          </Button>
        </div>
      </ScrollReveal>

      <ScrollReveal direction="left" delay={0.3} className="lg:col-span-6 relative order-1 lg:order-2 [perspective:1000px] reveal stagger-2">
        <div className="absolute inset-0 bg-[#1E2023] rounded-[2rem] transform rotate-3 scale-[0.98] translate-x-3 translate-y-6 -z-10 border border-white/5 shadow-2xl"></div>
        <div className="w-full h-[450px] lg:h-[600px] bg-[#141414] rounded-[2rem] border border-white/10 overflow-hidden relative shadow-2xl group">
          {/* Carousel Track */}
          <div className="flex w-full h-full relative">
            {backgroundImages.map((bg, index) => (
              <img
                key={index}
                src={bg}
                alt=""
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === currentBgIndex ? "opacity-100" : "opacity-0"
                  }`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
            {backgroundImages.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentBgIndex ? "bg-copper w-6" : "bg-white/40 hover:bg-white/80"
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