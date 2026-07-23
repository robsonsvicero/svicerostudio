import React from 'react';
import ScrollReveal from '../UI/ScrollReveal';

const steps = [
  {
    number: '01',
    title: 'Leitura do cenário',
    description: 'Analisamos posicionamento, comunicação, presença digital, experiência e os sinais que influenciam a percepção de valor.',
  },
  {
    number: '02',
    title: 'Direção estratégica',
    description: 'Identificamos os desalinhamentos e definimos prioridades para tornar a marca mais clara, coerente e reconhecível.',
  },
  {
    number: '03',
    title: 'Aplicação prática',
    description: 'Traduzimos a direção em decisões de linguagem, identidade, site e pontos de contato que sustentam a percepção desejada.',
  },
];

const DiagnosisOverviewSection = () => {
  return (
    <section
      aria-labelledby="diagnosis-overview-title"
      className="border-y border-white/5 bg-ds-bg px-4 py-20 font-body sm:px-6 sm:py-28 md:px-16"
    >
      <div className="mx-auto max-w-screen-xl">
        <ScrollReveal direction="up" delay={0.1}>
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
            <div>
              <span className="mb-6 flex w-fit items-center gap-2 rounded-full border border-ds-accent/20 bg-ds-accent/10 px-4 py-1.5 text-[11px] font-mono uppercase tracking-[0.2em] text-ds-accent shadow-[0_0_15px_rgba(255,122,89,0.15)] backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-ds-accent shadow-[0_0_10px_rgba(255,122,89,0.8)]" />
                Diagnóstico
              </span>
              <h2
                id="diagnosis-overview-title"
                className="text-4xl font-medium leading-[1.08] tracking-[-0.02em] text-ds-text md:text-5xl"
              >
                Antes de mudar a marca, é preciso entender o que ela comunica hoje
              </h2>
            </div>

            <div className="lg:pt-12">
              <p className="max-w-2xl text-lg leading-[1.7] text-ds-muted md:text-xl">
                O Diagnóstico de Posicionamento identifica a distância entre a qualidade que o negócio entrega e a forma como ele é percebido. Mais do que avaliar estética, investigamos os sinais que geram confiança, comparação por preço ou dificuldade de diferenciação.
              </p>
              <a
                href="/diagnostico"
                className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-ds-accent transition-colors hover:text-ds-accent-hover"
              >
                Entenda o diagnóstico
                <i className="fa-solid fa-arrow-right text-xs" aria-hidden="true" />
              </a>
            </div>
          </div>
        </ScrollReveal>

        <div className="mt-14 border-t border-white/10">
          <ScrollReveal direction="up" delay={0.1}>
            <p className="py-6 text-[10px] font-mono uppercase tracking-[0.3em] text-ds-muted">
              Como funciona
            </p>
          </ScrollReveal>

          <div className="grid border-t border-white/10 lg:grid-cols-3">
            {steps.map((step, index) => (
              <ScrollReveal
                key={step.number}
                direction="up"
                delay={0.1 + index * 0.1}
                className="h-full"
              >
                <article className={`h-full py-8 lg:px-8 lg:py-10 ${index > 0 ? 'border-t border-white/10 lg:border-l lg:border-t-0' : ''} ${index === 0 ? 'lg:pl-0' : ''}`}>
                  <span className="font-mono text-xs tracking-widest text-ds-accent/70">
                    {step.number}
                  </span>
                  <h3 className="mt-5 text-2xl font-medium tracking-tight text-ds-text">
                    {step.title}
                  </h3>
                  <p className="mt-4 text-base leading-[1.7] text-ds-muted">
                    {step.description}
                  </p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiagnosisOverviewSection;
