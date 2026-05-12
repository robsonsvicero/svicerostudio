import React, { useEffect, useState, useRef } from 'react';
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import ScrollReveal from './UI/ScrollReveal';
import { API_URL } from '../lib/api.js';
import { getNameInitials } from '../utils/placeholders';

const DepoimentosSection = () => {
  const [depoimentos, setDepoimentos] = useState([]);
  const swiperRef = useRef(null);
  const swipersRef = useRef([]);

  const fetchDepoimentos = async () => {
    try {
      const res = await fetch(`${API_URL}/api/db/depoimentos/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation: 'select', orderBy: { column: 'ordem', ascending: true } })
      });
      const payload = await res.json();
      setDepoimentos(payload.data || []);
    } catch (error) {
      console.error("Failed to fetch testimonials:", error);
    }
  };

  useEffect(() => {
    fetchDepoimentos();
  }, []);

  useEffect(() => {
    if (depoimentos.length === 0) return;

    const timeoutId = setTimeout(() => {
      if (swiperRef.current) {
        const depoimentosSwiperInstance = new Swiper(swiperRef.current, {
          loop: true,
          slidesPerView: 'auto',
          spaceBetween: 32,
          grabCursor: true,
          centeredSlides: false,
          speed: 6000,
          autoplay: {
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
          },
          freeMode: {
            enabled: true,
            momentum: false,
            sticky: false,
          },
          watchSlidesProgress: true,
          preloadImages: false,
          lazy: false,
          observer: true,
          observeParents: true,
        });
        swipersRef.current.push(depoimentosSwiperInstance);
      }
    }, 200);

    return () => {
      clearTimeout(timeoutId);
      swipersRef.current.forEach(swiper => {
        if (swiper && swiper.destroy && typeof swiper.destroy === 'function') {
          try { swiper.destroy(true, true); } catch (e) { }
        }
      });
      swipersRef.current = [];
    };
  }, [depoimentos]);

  if (depoimentos.length === 0) return null;

  return (
    <section className="bg-surface py-24 px-4 md:px-16 border-t border-white/5">
      <div className="max-w-screen-xl mx-auto">
        <ScrollReveal direction="up" delay={0.1}>
          <div className="mb-12 text-center md:text-left flex flex-col items-center md:items-start">
            <span className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-copper/25 bg-copper/5 text-[11px] font-mono uppercase tracking-[.2em] text-copper">
              <span className="w-1.5 h-1.5 rounded-full bg-copper shadow-[0_0_10px_rgba(184,115,51,0.5)]"></span>
              CLIENTES
            </span>
            <h2 className="text-4xl md:text-[3.75rem] font-medium tracking-[-0.02em] leading-[1.1] text-cream text-left">
              O que diz quem passa pelo nosso processo
            </h2>
          </div>
        </ScrollReveal>
        <ScrollReveal direction="up" delay={0.2} duration={0.8}>
          <div className="relative group">
            {/* Edges Fade Effect */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-surface to-transparent z-10 pointer-events-none hidden md:block" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-surface to-transparent z-10 pointer-events-none hidden md:block" />
            
            <div className="swiper depoimentos-swiper" ref={swiperRef}>
              <div className="swiper-wrapper !ease-linear">
                {[...depoimentos, ...depoimentos, ...depoimentos]
                  .map((depoimento, idx) => (
                    <div key={`${depoimento.id}-${idx}`} className="swiper-slide h-full">
                      <div className="bg-[#141414]/60 backdrop-blur-xl rounded-[2rem] border border-white/5 p-8 md:p-10 flex flex-col h-full shadow-lg hover:shadow-2xl hover:border-copper/20 transition-all duration-500 group/card relative overflow-hidden">
                        {/* Efeito de brilho no hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-copper/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
                        
                        {/* Aspas decorativas */}
                        <div className="absolute top-6 right-8 text-copper/10 text-7xl font-serif select-none">
                          "
                        </div>

                        {/* Estrelas */}
                        <div
                          className="mb-6 flex gap-1"
                          role="img"
                          aria-label={`Avaliação: ${depoimento.estrelas || 5} de 5 estrelas`}
                        >
                          {Array.from({ length: 5 }).map((_, i) => (
                            <i
                              key={i}
                              className={`fa-solid fa-star text-copper text-sm ${i >= (depoimento.estrelas || 5) ? 'opacity-20' : ''}`}
                            />
                          ))}
                        </div>

                        {/* Texto do depoimento */}
                        <p className="text-muted text-lg font-normal leading-[1.7] mb-10 italic flex-1 relative z-10">
                          "{depoimento.texto}"
                        </p>

                        {/* Autor */}
                        <div className="flex items-center gap-4 mt-auto pt-8 border-t border-white/5 relative z-10">
                          <div className="w-14 h-14 flex-shrink-0 rounded-full bg-copper/10 border border-copper/20 flex items-center justify-center overflow-hidden">
                            {depoimento.avatar_url ? (
                              <img src={depoimento.avatar_url} alt={depoimento.nome} className="w-full h-full object-cover" />
                            ) : (
                              <span className="font-semibold text-xl text-copper">
                                {depoimento.iniciais || getNameInitials(depoimento.nome)}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="text-cream font-medium text-lg tracking-tight">
                              {depoimento.nome}
                            </p>
                            <p className="text-muted/60 font-mono text-[10px] uppercase tracking-[0.15em] mt-1">
                              {depoimento.cargo}
                              {depoimento.empresa ? <span className="text-copper/50 ml-1">@{depoimento.empresa}</span> : ''}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="swiper-pagination !hidden" />
            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};

export default DepoimentosSection;