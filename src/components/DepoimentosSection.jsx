import React, { useEffect, useState } from 'react';
import ScrollReveal from './UI/ScrollReveal';
import { API_URL } from '../lib/api.js';

const DepoimentosSection = () => {
  const [depoimentos, setDepoimentos] = useState([]);

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

  if (depoimentos.length === 0) return null;

  return (
    <section className="bg-ds-surface py-24 px-4 md:px-16 border-t border-white/5 overflow-hidden">
      <div className="max-w-screen-xl mx-auto">
        <ScrollReveal direction="up" delay={0.1}>
          <div className="mb-12 text-center md:text-left flex flex-col items-center md:items-start">
            <span className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-ds-accent/25 bg-ds-accent/5 text-[11px] font-mono uppercase tracking-[.2em] text-ds-accent">
              <span className="w-1.5 h-1.5 rounded-full bg-ds-accent shadow-[0_0_10px_rgba(184,115,51,0.5)]"></span>
              CLIENTES
            </span>
            <h2 className="text-4xl md:text-[3.75rem] font-medium tracking-[-0.02em] leading-[1.1] text-ds-text text-left">
              O que diz quem passa pelo nosso processo
            </h2>
          </div>
        </ScrollReveal>
        
        <ScrollReveal direction="up" delay={0.2} duration={0.8}>
          <div className="relative group">
            {/* Edges Fade Effect */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-surface to-transparent z-10 pointer-events-none hidden md:block" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-surface to-transparent z-10 pointer-events-none hidden md:block" />
            
            {/* Infinite Marquee Container */}
            <div className="flex overflow-hidden gap-8">
              {/* Box 1 */}
              <div className="flex gap-8 shrink-0 animate-infinite-scroll">
                {depoimentos.map((depoimento, idx) => (
                  <div key={`box1-${depoimento.id}-${idx}`} className="depoimentos-marquee-slide">
                    <div className="bg-[#141414]/60 backdrop-blur-xl rounded-[2rem] border border-white/5 p-8 md:p-10 flex flex-col w-full h-full shadow-lg hover:shadow-2xl hover:border-ds-accent/20 transition-all duration-500 group/card relative overflow-hidden cursor-pointer">
                      <div className="absolute inset-0 bg-gradient-to-br from-copper/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
                      
                      <div className="absolute top-6 right-8 text-ds-accent/10 text-7xl font-serif select-none">
                        "
                      </div>

                      <div
                        className="mb-6 flex gap-1"
                        role="img"
                        aria-label={`Avaliação: ${depoimento.estrelas || 5} de 5 estrelas`}
                      >
                        {Array.from({ length: 5 }).map((_, i) => (
                          <i
                            key={i}
                            className={`fa-solid fa-star text-ds-accent text-sm ${i >= (depoimento.estrelas || 5) ? 'opacity-20' : ''}`}
                          />
                        ))}
                      </div>

                      <p className="text-ds-muted text-lg font-normal leading-[1.7] mb-10 italic flex-1 relative z-10">
                        "{depoimento.texto}"
                      </p>

                      <div className="mt-auto pt-6 border-t border-white/5 relative z-10 text-right">
                        <p className="text-ds-muted/60 font-mono text-[10px] uppercase tracking-[0.15em] mt-1">
                          {depoimento.cargo}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Box 2 (Clone identical for infinite loop effect) */}
              <div aria-hidden="true" className="flex gap-8 shrink-0 animate-infinite-scroll">
                {depoimentos.map((depoimento, idx) => (
                  <div key={`box2-${depoimento.id}-${idx}`} className="depoimentos-marquee-slide">
                    <div className="bg-[#141414]/60 backdrop-blur-xl rounded-[2rem] border border-white/5 p-8 md:p-10 flex flex-col w-full h-full shadow-lg hover:shadow-2xl hover:border-ds-accent/20 transition-all duration-500 group/card relative overflow-hidden cursor-pointer">
                      <div className="absolute inset-0 bg-gradient-to-br from-copper/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
                      
                      <div className="absolute top-6 right-8 text-ds-accent/10 text-7xl font-serif select-none">
                        "
                      </div>

                      <div
                        className="mb-6 flex gap-1"
                        role="img"
                        aria-label={`Avaliação: ${depoimento.estrelas || 5} de 5 estrelas`}
                      >
                        {Array.from({ length: 5 }).map((_, i) => (
                          <i
                            key={i}
                            className={`fa-solid fa-star text-ds-accent text-sm ${i >= (depoimento.estrelas || 5) ? 'opacity-20' : ''}`}
                          />
                        ))}
                      </div>

                      <p className="text-ds-muted text-lg font-normal leading-[1.7] mb-10 italic flex-1 relative z-10">
                        "{depoimento.texto}"
                      </p>

                      <div className="mt-auto pt-6 border-t border-white/5 relative z-10 text-right">
                        <p className="text-ds-muted/60 font-mono text-[10px] uppercase tracking-[0.15em] mt-1">
                          {depoimento.cargo}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};

export default DepoimentosSection;