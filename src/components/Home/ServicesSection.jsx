import React from 'react';
import ScrollReveal from '../UI/ScrollReveal';
import idvDesigner from '../../images/idv-deigner.webp';
import uiDesigner from '../../images/ui-designer.webp';
import developer from '../../images/developer.webp';

const services = [
  {
    number: '01',
    title: 'Estratégia e posicionamento',
    description: 'Diagnóstico, proposta de valor, narrativa e direcionamento para construir uma percepção mais clara e relevante.',
    image: idvDesigner,
    alt: 'Estratégia e posicionamento de marca',
  },
  {
    number: '02',
    title: 'Identidade e sistemas visuais',
    description: 'Identidades que organizam reconhecimento, consistência e diferenciação em todos os pontos de contato.',
    image: uiDesigner,
    alt: 'Identidade e sistemas visuais',
  },
  {
    number: '03',
    title: 'Sites e experiências digitais',
    description: 'Estruturas digitais que transformam estratégia em clareza, confiança e uma experiência coerente com a marca.',
    image: developer,
    alt: 'Sites e experiências digitais',
  },
];

const ServicesSection = () => (
  <section id="servicos" aria-labelledby="services-title" className="bg-ds-bg px-4 py-20 font-body sm:px-6 sm:py-28 md:px-16">
    <div className="mx-auto max-w-screen-xl">
      <ScrollReveal direction="up" delay={0.1}>
        <div className="grid gap-8 border-b border-white/10 pb-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          <span className="flex h-fit w-fit items-center gap-2 rounded-full border border-ds-accent/20 bg-ds-accent/10 px-4 py-1.5 text-[11px] font-mono uppercase tracking-[0.2em] text-ds-accent shadow-[0_0_15px_rgba(255,122,89,0.15)] backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-ds-accent shadow-[0_0_10px_rgba(255,122,89,0.8)]" />
            Serviços
          </span>
          <div>
            <h2 id="services-title" className="text-4xl font-medium leading-[1.08] tracking-[-0.02em] text-ds-text md:text-5xl">
              O que entregamos
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-[1.7] text-ds-muted">
              Estratégia, identidade e experiência digital desenvolvidas como partes do mesmo sistema de marca.
            </p>
          </div>
        </div>
      </ScrollReveal>

      <div className="grid gap-6 pt-10 lg:grid-cols-3">
        {services.map((service, index) => (
          <ScrollReveal key={service.number} direction="up" delay={0.1 + index * 0.1} className="h-full">
            <article className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-ds-surface transition-all duration-300 hover:-translate-y-1 hover:border-ds-accent/30">
              <div className="aspect-[16/10] overflow-hidden">
                <img src={service.image} alt={service.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="flex flex-1 flex-col p-7">
                <span className="font-mono text-xs tracking-widest text-ds-accent/70">{service.number}</span>
                <h3 className="mt-5 text-2xl font-medium tracking-tight text-ds-text">{service.title}</h3>
                <p className="mt-4 text-base leading-[1.7] text-ds-muted">{service.description}</p>
              </div>
            </article>
          </ScrollReveal>
        ))}
      </div>

      <a href="/processos" className="mt-9 inline-flex items-center gap-2 text-sm font-semibold text-ds-accent transition-colors hover:text-ds-accent-hover">
        Conheça nosso processo
        <i className="fa-solid fa-arrow-right text-xs" aria-hidden="true" />
      </a>
    </div>
  </section>
);

export default ServicesSection;
