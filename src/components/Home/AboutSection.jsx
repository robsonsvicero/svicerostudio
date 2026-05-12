import React from 'react';
import aboutPhoto from '../../assets/about-photo.png';
import Button from '../UI/Button';

const AboutSection = () => {
  return (
    <section
      id="sobre"
      className="bg-charcoal py-16 sm:py-24 px-4 sm:px-6 md:px-16 font-body"
    >
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Imagem com badge */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative w-full max-w-lg">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={aboutPhoto}
                  alt="Robson Svicero"
                  loading="lazy"
                  className="w-full rounded-2xl shadow-xl"
                  style={{ objectFit: 'contain', maxHeight: '600px' }}
                />
                {/* Badge laranja */}
                <div className="absolute bottom-[-40px] left-6">
                  <div className="bg-copper text-white rounded-xl px-6 py-4 shadow-lg text-left">
                    <span className="block text-3xl font-bold leading-tight mb-1">
                      10+
                    </span>
                    <span className="block text-xs tracking-widest font-semibold">
                      ANOS DE EXPERIÊNCIA
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Texto e indicadores */}
          <div className="flex flex-col justify-center h-full">
            <span className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-copper/25 bg-copper/5 text-[11px] font-mono uppercase tracking-[.2em] text-copper w-auto max-w-max">
              <span className="w-1.5 h-1.5 rounded-full bg-copper shadow-[0_0_10px_rgba(184,115,51,0.5)]"></span>
              SOBRE O ESTÚDIO
            </span>

            <h2 className="text-4xl md:text-[3.75rem] font-medium tracking-[-0.02em] leading-[1.1] text-cream text-left mb-6">
              Quem está por trás do Svicero Studio?
            </h2>

            <p className="text-xl font-normal leading-[1.6] text-muted max-w-2xl mb-6">
              Sou o Robson Svicero, estrategista de marca com background em
              design e produto digital. Já atuei como designer de identidade
              visual, webdesigner, UX, UI e programador — e hoje uso toda essa
              bagagem para uma única finalidade:{' '}
              <span className="text-cream font-medium">
                ajudar empresas a saírem da guerra de preço usando marca e
                estratégia como vantagem competitiva.
              </span>
            </p>

            <p className="text-xl font-normal leading-[1.6] text-muted max-w-2xl mb-6">
              Antes de abrir qualquer ferramenta de design, entro na realidade
              do negócio do cliente: objetivos, mercado, concorrência e onde
              a marca está perdendo valor hoje.
            </p>

            <ul className="space-y-3 mb-8 max-w-2xl">
              {[
                'Falamos a língua do empresário, não do designer.',
                'Começamos pela estratégia, não pelo estilo.',
                'Entregamos marca como ativo de negócio, não como peça gráfica.',
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-1.5 flex-shrink-0 w-5 h-5 rounded-full bg-copper/10 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-copper rounded-full inline-block" />
                  </span>
                  <span className="text-lg md:text-xl text-muted">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            {/* Indicadores */}
            <div className="flex flex-wrap gap-6 sm:gap-8 mt-4 pb-10 border-b border-white/5">
              <div>
                <span className="block text-3xl font-semibold text-cream mb-1">
                  150+
                </span>
                <span className="block text-[10px] font-mono text-muted uppercase tracking-widest">
                  Projetos Entregues
                </span>
              </div>
              <div>
                <span className="block text-3xl font-semibold text-cream mb-1">
                  10+
                </span>
                <span className="block text-[10px] font-mono text-muted uppercase tracking-widest">
                  Anos no Mercado
                </span>
              </div>
              <div>
                <span className="block text-3xl font-semibold text-cream mb-1">
                  3x
                </span>
                <span className="block text-[10px] font-mono text-muted uppercase tracking-widest">
                  Ticket médio aumentado
                </span>
              </div>
            </div>

            <div className="flex flex-row justify-center">
              <Button
                variant='outline'
                href="https://wa.me/5511964932007"
                target="_blank"
                rel="noopener noreferrer"
              >
                Falar pelo WhatsApp
              </Button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;