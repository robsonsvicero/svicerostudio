import React from 'react';
import Button from '../UI/Button';
import ScrollReveal from '../UI/ScrollReveal';
import SectionHeader from '../UI/SectionHeader';

const FAQSection = ({ faqs, title, subtitle, startIndex = 0, endIndex }) => {
  const displayedFaqs = endIndex ? faqs.slice(startIndex, endIndex) : faqs.slice(startIndex);

  if (!displayedFaqs || displayedFaqs.length === 0) return null;

  return (
    <section className="py-24 px-4 md:px-16 bg-ds-surface font-body border-t border-white/5">
      <div className="max-w-screen-xl mx-auto">
        <ScrollReveal direction="up" delay={0.1}>
          <SectionHeader
            badge={subtitle || 'FAQ'}
            title={title || 'Dúvidas comuns antes do diagnóstico estratégico'}
            className="mb-16"
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedFaqs.map((item, idx) => (
            <ScrollReveal key={item.id || item._id || idx} direction="up" delay={0.1 + idx * 0.1}>
              <div 
                className="rounded-3xl border border-white/5 bg-ds-bg backdrop-blur-xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 group hover:border-white/10 h-full"
              >
                <h3 className="text-[1.125rem] font-medium text-ds-text mb-4 flex items-start gap-3">
                  <span className="text-ds-accent font-mono text-xl leading-none font-bold">?</span>
                  {item.pergunta}
                </h3>
                <p className="text-ds-muted text-base leading-[1.6] pl-6 border-l border-white/5 group-hover:border-ds-accent/40 transition-colors">
                  {item.resposta}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <Button href="/faq" variant="secondary">
            Ver todas as dúvidas
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
