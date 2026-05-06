import React from 'react';
import Button from '../UI/Button';

const FAQSection = ({ faqs }) => {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="py-24 px-4 md:px-16 bg-dark-bg font-body">
      <div className="max-w-screen-xl mx-auto">
        <div className="mb-16 text-left">
          <span className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-secondary/5 text-xs font-semibold text-secondary tracking-widest shadow-sm border border-secondary/30">
            <span className="w-2 h-2 -rotate-45 bg-secondary" />
            FAQ
          </span>
          <h2 className="reveal stagger-1 text-4xl md:text-5xl font-bold text-text-primary text-left max-w-2xl leading-tight">
            Dúvidas que costumam surgir antes do diagnóstico
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((item, idx) => (
            <div 
              key={item.id || item._id} 
              className="reveal stagger-2 rounded-[30px] border border-white/5 bg-[#1A1A1A] p-8 hover:border-secondary/30 transition-colors group"
            >
              <h3 className="text-xl font-bold text-[#E9BF84] mb-4 flex items-start gap-3">
                <span className="text-secondary/50 font-title text-2xl leading-none">?</span>
                {item.pergunta}
              </h3>
              <p className="text-white/70 text-base leading-relaxed pl-6 border-l border-white/5 group-hover:border-secondary/20 transition-colors">
                {item.resposta}
              </p>
            </div>
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
