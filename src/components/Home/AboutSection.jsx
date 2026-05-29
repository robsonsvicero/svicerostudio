import React from 'react';
import aboutPhoto from '../../assets/about-photo.png';
import Button from '../UI/Button';
import ScrollReveal from '../UI/ScrollReveal';
import SectionHeader from '../UI/SectionHeader';

const AboutSection = () => {
  return (
    <section
      id="sobre"
      className="bg-ds-bg py-16 sm:py-24 px-4 sm:px-6 md:px-16 font-body"
    >
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Imagem com badge */}
          <ScrollReveal direction="right" delay={0.1} className="flex justify-center lg:justify-start">
            <div className="relative w-full max-w-xl">
              <div className="aspect-[4/5] sm:aspect-[5/6] rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={aboutPhoto}
                  alt="Robson Svicero"
                  loading="lazy"
                  className="w-full h-full rounded-2xl shadow-xl"
                  style={{ objectFit: 'contain', maxHeight: '680px' }}
                />
                {/* Badge laranja */}
                <div className="absolute bottom-[-40px] left-6">
                  <div className="relative overflow-hidden bg-ds-accent/55 backdrop-blur-2xl backdrop-saturate-150 border border-white/60 ring-1 ring-white/35 text-white rounded-xl px-6 py-4 shadow-[0_18px_45px_rgba(255,122,89,0.35)] text-left">
                    <div className="pointer-events-none absolute -top-10 -left-8 h-16 w-40 rotate-[-18deg] bg-white/30 blur-md" />
                    <span className="relative z-10 block text-3xl font-bold leading-tight mb-1">
                      10+
                    </span>
                    <span className="relative z-10 block text-xs tracking-widest font-semibold">
                      ANOS DE EXPERIÊNCIA
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Texto e indicadores */}
          <ScrollReveal direction="left" delay={0.2} className="flex flex-col justify-center h-full">
            <SectionHeader
              badge="SOBRE O ESTÚDIO"
              title="Estratégia, percepção e clareza para marcas que cresceram, mas ainda não comunicam isso"
              description="O Svicero Studio nasceu da interseção entre estratégia, design e percepção."
              className="mb-0"
              descriptionClassName="mb-6"
            />
            <p className="text-xl font-normal leading-[1.6] text-ds-muted max-w-2xl mb-6">
              Mais do que criar identidades visuais, nosso trabalho busca entender como uma marca é interpretada e como pequenas decisões de comunicação impactam confiança, clareza e valor percebido.
            </p>
            <p className="text-xl font-normal leading-[1.6] text-ds-muted max-w-2xl mb-6">
              Acreditamos que marcas fortes não precisam exagerar para serem lembradas, elas precisam transmitir coerência. Foi dessa visão que o estúdio surgiu, da percepção de que muitos negócios evoluem tecnicamente antes que a comunicação possa acompanhar esse crescimento.
            </p>

            <p className="text-xl font-normal leading-[1.6] text-ds-muted max-w-2xl mb-6">
              A clínica amadurece, a experiência melhora, o nível de entrega aumenta, mas a percepção da marca continua transmitindo uma fase anterior do negócio. E é exatamente nesse desalinhamento que começamos a atuar.
            </p>

            <p className="text-xl font-normal leading-[1.6] text-ds-muted max-w-2xl mb-6">
              Hoje, o Svicero Studio é liderado por Robson Svicero, estrategista e designer especializado em percepção de marca, posicionamento e sistemas visuais contemporâneos. Seu trabalho combina:
            </p>

            <ul className="space-y-3 mb-8 max-w-2xl">
              {[
                'direção estratégica',
                'pensamento sistêmico',
                'design editorial',
                'tecnologia',
                'e clareza de comunicação',
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-1.5 flex-shrink-0 w-5 h-5 rounded-full bg-ds-accent/10 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-ds-accent rounded-full inline-block" />
                  </span>
                  <span className="text-lg md:text-xl text-ds-muted">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <p className="text-xl font-normal leading-[1.6] text-ds-muted max-w-2xl mb-8">
              Sempre com uma premissa simples, design não existe para decorar, ele existe para organizar percepção.
            </p>
            <p className="text-xl font-normal leading-[1.6] text-ds-muted max-w-2xl mb-6">
              A estética que construímos não busca parecer inacessível. Ela busca parecer lúcida, mais clara, com menos excesso, com mais confiança deixando o "performático" de lado. Porque acreditamos que sofisticação não está em parecer mais caro, está em transmitir maturidade, coerência e intenção.
            </p>

            {/* Indicadores */}
            <div className="flex flex-wrap gap-6 sm:gap-8 mt-4 pb-10 border-b border-white/5">
              <div className="relative overflow-hidden rounded-2xl px-5 py-4 bg-white/35 backdrop-blur-2xl backdrop-saturate-150 border border-white/80 ring-1 ring-white/55 shadow-[0_14px_34px_rgba(34,34,34,0.12)]">
                <div className="pointer-events-none absolute -top-8 -left-10 h-14 w-36 rotate-[-18deg] bg-white/35 blur-md" />
                <span className="relative z-10 block text-3xl font-semibold text-ds-text mb-1">
                  150+
                </span>
                <span className="relative z-10 block text-[10px] font-mono text-ds-muted uppercase tracking-widest">
                  Projetos Entregues
                </span>
              </div>
              <div className="relative overflow-hidden rounded-2xl px-5 py-4 bg-white/35 backdrop-blur-2xl backdrop-saturate-150 border border-white/80 ring-1 ring-white/55 shadow-[0_14px_34px_rgba(34,34,34,0.12)]">
                <div className="pointer-events-none absolute -top-8 -left-10 h-14 w-36 rotate-[-18deg] bg-white/35 blur-md" />
                <span className="relative z-10 block text-3xl font-semibold text-ds-text mb-1">
                  10+
                </span>
                <span className="relative z-10 block text-[10px] font-mono text-ds-muted uppercase tracking-widest">
                  Anos no Mercado
                </span>
              </div>
              <div className="relative overflow-hidden rounded-2xl px-5 py-4 bg-white/35 backdrop-blur-2xl backdrop-saturate-150 border border-white/80 ring-1 ring-white/55 shadow-[0_14px_34px_rgba(34,34,34,0.12)]">
                <div className="pointer-events-none absolute -top-8 -left-10 h-14 w-36 rotate-[-18deg] bg-white/35 blur-md" />
                <span className="relative z-10 block text-3xl font-semibold text-ds-text mb-1">
                  3x
                </span>
                <span className="relative z-10 block text-[10px] font-mono text-ds-muted uppercase tracking-widest">
                  Ticket médio aumentado
                </span>
              </div>
            </div>

            <div className="flex flex-row justify-center pt-10">
              <Button
                variant='secondary'
                href="https://wa.me/5511964932007"
                target="_blank"
                rel="noopener noreferrer"
              >
                Falar pelo WhatsApp
              </Button>
            </div>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;