import React from 'react';
import ScrollReveal from '../UI/ScrollReveal';

const audiences = [
  { label: 'Clínicas', href: null },
  { label: 'Escritórios', href: null },
  { label: 'Empresas B2B', href: null },
  { label: 'Empresas de serviços', href: null },
  { label: 'Indústrias', href: null },
  { label: 'Negócios em crescimento', href: null },
];

const AudienceItem = ({ item, index }) => {
  const content = (
    <>
      <span className="font-mono text-[10px] tracking-widest text-ds-accent/70">
        {String(index + 1).padStart(2, '0')}
      </span>
      <span className="text-xl md:text-2xl font-medium tracking-tight text-ds-text">
        {item.label}
      </span>
      {item.href && (
        <i
          className="fa-solid fa-arrow-up-right-from-square ml-auto text-sm text-ds-accent"
          aria-hidden="true"
        />
      )}
    </>
  );

  const className = 'flex min-h-28 items-center gap-5 border-b border-white/10 py-7 transition-colors hover:border-ds-accent/40';

  return item.href ? (
    <a href={item.href} className={className}>
      {content}
    </a>
  ) : (
    <div className={className}>
      {content}
    </div>
  );
};

const AudienceSection = () => {
  return (
    <section
      aria-labelledby="audience-title"
      className="bg-ds-bg px-4 py-20 font-body sm:px-6 sm:py-28 md:px-16"
    >
      <div className="mx-auto max-w-screen-xl">
        <ScrollReveal direction="up" delay={0.1}>
          <div className="grid gap-8 border-b border-white/10 pb-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
            <span className="flex h-fit w-fit items-center gap-2 rounded-full border border-ds-accent/20 bg-ds-accent/10 px-4 py-1.5 text-[11px] font-mono uppercase tracking-[0.2em] text-ds-accent shadow-[0_0_15px_rgba(255,122,89,0.15)] backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-ds-accent shadow-[0_0_10px_rgba(255,122,89,0.8)]" />
              Para quem é
            </span>
            <div>
              <h2
                id="audience-title"
                className="text-4xl font-medium leading-[1.08] tracking-[-0.02em] text-ds-text md:text-5xl"
              >
                Empresas chegam até nós quando a entrega evoluiu, mas a percepção não acompanhou
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-[1.7] text-ds-muted">
                Trabalhamos com organizações que amadureceram sua entrega e buscam uma marca mais clara, coerente e preparada para o próximo estágio.
              </p>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 md:gap-x-12 lg:gap-x-20">
          {audiences.map((item, index) => (
            <ScrollReveal
              key={item.label}
              direction="up"
              delay={0.05 + (index % 2) * 0.08}
            >
              <AudienceItem item={item} index={index} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AudienceSection;
