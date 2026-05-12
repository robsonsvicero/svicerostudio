import React from 'react';
import Button from '../UI/Button';
import ScrollReveal from '../UI/ScrollReveal';

const FAQSection = ({ faqs, title, subtitle, startIndex = 0, endIndex }) => {
  const displayedFaqs = endIndex ? faqs.slice(startIndex, endIndex) : faqs.slice(startIndex);

  if (!displayedFaqs || displayedFaqs.length === 0) return null;

  return (
    <section className="py-24 px-4 md:px-16 bg-surface font-body border-t border-white/5">
      <div className="max-w-screen-xl mx-auto">
        <ScrollReveal direction="up" delay={0.1}>
          <div className="mb-16 text-left">
            <span className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-copper/25 bg-copper/5 text-[11px] font-mono uppercase tracking-[.2em] text-copper">
              <span className="w-1.5 h-1.5 rounded-full bg-copper shadow-[0_0_10px_rgba(184,115,51,0.5)]"></span>
              {subtitle || "FAQ"}
            </span>
            <h2 className="text-4xl md:text-[3.75rem] font-medium tracking-[-0.02em] leading-[1.1] text-cream text-left mb-6">
              {title || "Dúvidas que costumam surgir antes do diagnóstico"}
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedFaqs.map((item, idx) => (
            <ScrollReveal key={item.id || item._id || idx} direction="up" delay={0.1 + idx * 0.1}>
              <div 
                className="rounded-3xl border border-white/5 bg-[#141414]/60 backdrop-blur-xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 group hover:border-white/10 h-full"
              >
                <h3 className="text-[1.125rem] font-medium text-cream mb-4 flex items-start gap-3">
                  <span className="text-copper font-mono text-xl leading-none font-bold">?</span>
                  {item.pergunta}
                </h3>
                <p className="text-muted text-base leading-[1.6] pl-6 border-l border-white/5 group-hover:border-copper/40 transition-colors">
                  {item.resposta}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <Button href="/faq" variant="outline">
            Ver todas as dúvidas
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
