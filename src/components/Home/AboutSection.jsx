import React from 'react';
import aboutPhoto from '../../assets/about-photo.png';
import ScrollReveal from '../UI/ScrollReveal';

const fundamentos = [
  {
    numero: '01',
    titulo: 'Engenharia de Percepção',
    texto: 'Toda marca emite sinais. Organizamos linguagem, identidade e experiência para que esses sinais transmitam com clareza o nível real da entrega.',
  },
  {
    numero: '02',
    titulo: 'Posicionamento',
    texto: 'Posicionar não é escolher uma frase de efeito. É definir o espaço que a marca pode ocupar, para quem ela é relevante e por que merece ser escolhida.',
  },
  {
    numero: '03',
    titulo: 'Construção de valor',
    texto: 'Valor percebido nasce da coerência entre promessa, comunicação e experiência. Quando essas camadas se confirmam, confiança deixa de depender de convencimento.',
  },
  {
    numero: '04',
    titulo: 'Diferenciação',
    texto: 'Diferenciação consistente não vem do excesso. Ela surge de decisões próprias, repetidas com intenção e reconhecidas em cada ponto de contato.',
  },
];

const AboutSection = () => {
  return (
    <section
      id="sobre"
      aria-labelledby="visao-marca-title"
      className="bg-ds-bg/50 py-20 sm:py-28 px-4 sm:px-6 md:px-16 font-body border-y border-white/5"
    >
      <div className="max-w-screen-xl mx-auto">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 items-start">
          <ScrollReveal direction="right" delay={0.1}>
            <div className="lg:sticky lg:top-8">
              <span className="mb-6 flex w-fit items-center gap-2 rounded-full border border-ds-accent/20 bg-ds-accent/10 px-4 py-1.5 text-[11px] font-mono uppercase tracking-[0.2em] text-ds-accent shadow-[0_0_15px_rgba(255,122,89,0.15)] backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-ds-accent shadow-[0_0_10px_rgba(255,122,89,0.8)]" />
                Sobre o estúdio
              </span>
              <h2
                id="visao-marca-title"
                className="text-4xl md:text-5xl font-medium tracking-[-0.02em] leading-[1.1] text-ds-text"
              >
                Quem é o Svicero Studio e nossa visão sobre estratégia
              </h2>
              <p className="mt-6 text-lg leading-[1.7] text-ds-muted">
                Marca não é apenas identidade visual. É o sistema de percepções que se forma antes, durante e depois de cada contato com um negócio.
              </p>

              <div className="mt-9 flex items-center gap-4 border-t border-white/10 pt-6">
                <img
                  src={aboutPhoto}
                  alt="Robson Svicero, estrategista de marca e fundador do Svicero Studio"
                  loading="lazy"
                  className="h-16 w-16 rounded-full object-cover object-top border border-white/10"
                />
                <div>
                  <p className="font-medium text-ds-text">Robson Svicero</p>
                  <p className="mt-1 text-sm leading-relaxed text-ds-muted">
                    Estrategista e designer, fundador do Svicero Studio, com mais de 10 anos de experiência.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <div className="border-t border-white/10">
            {fundamentos.map((item, index) => (
              <ScrollReveal
                key={item.numero}
                direction="up"
                delay={0.1 + index * 0.08}
              >
                <article className="grid gap-4 border-b border-white/10 py-8 sm:grid-cols-[4rem_1fr] sm:gap-6 md:py-10">
                  <span className="font-mono text-xs tracking-widest text-ds-accent/70">
                    {item.numero}
                  </span>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-ds-text">
                      {item.titulo}
                    </h3>
                    <p className="mt-4 max-w-2xl text-base md:text-lg leading-[1.7] text-ds-muted">
                      {item.texto}
                    </p>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
