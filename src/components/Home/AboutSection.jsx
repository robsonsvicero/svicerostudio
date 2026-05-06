import React from 'react';
import aboutPhoto from '../../assets/about-photo.png';
import Button from '../UI/Button';

const AboutSection = () => {
  return (
    <section
      id="sobre"
      className="bg-dark-bg py-16 sm:py-24 px-4 sm:px-6 md:px-16 font-body"
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
                  <div className="bg-secondary text-white rounded-xl px-6 py-4 shadow-lg text-left">
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
            <span className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-secondary/5 text-xs font-semibold text-secondary tracking-widest shadow-sm border border-secondary/30 w-auto max-w-max">
              <span className="w-2 h-2 -rotate-45 bg-secondary flex-shrink-0 inline-block" />
              SOBRE O ESTÚDIO
            </span>

            <h2 className="font-title text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6 text-balance">
              Quem está por trás do Svicero Studio?
            </h2>

            <p className="font-sans text-lg md:text-xl text-[#B2B8C6] max-w-2xl leading-relaxed mb-6">
              Sou o Robson Svicero, estrategista de marca com background em
              design e produto digital. Já atuei como designer de identidade
              visual, webdesigner, UX, UI e programador — e hoje uso toda essa
              bagagem para uma única finalidade:{' '}
              <span className="text-white font-medium">
                ajudar empresas a saírem da guerra de preço usando marca e
                estratégia como vantagem competitiva.
              </span>
            </p>

            <p className="font-sans text-lg md:text-xl text-[#B2B8C6] max-w-2xl leading-relaxed mb-6">
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
                  <span className="mt-1.5 flex-shrink-0 w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center">
                    <span className="w-2 h-2 bg-secondary -rotate-45 inline-block" />
                  </span>
                  <span className="text-lg md:text-xl text-[#B2B8C6]">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            {/* Indicadores */}
            <div className="flex flex-wrap gap-6 sm:gap-8 mt-4 pb-10 border-b border-white/10">
              <div>
                <span className="block text-3xl font-extrabold text-white mb-1">
                  150+
                </span>
                <span className="block text-sm text-[#B2B8C6] font-semibold">
                  Projetos Entregues
                </span>
              </div>
              <div>
                <span className="block text-3xl font-extrabold text-white mb-1">
                  10+
                </span>
                <span className="block text-sm text-[#B2B8C6] font-semibold">
                  Anos no Mercado
                </span>
              </div>
              <div>
                <span className="block text-3xl font-extrabold text-white mb-1">
                  3x
                </span>
                <span className="block text-sm text-[#B2B8C6] font-semibold">
                  Ticket médio aumentado em casos recentes
                </span>
              </div>
            </div>

            <div className="flex flex-row justify-center">
              <Button
                href="/diagnostico"
                variant="secondary"
                className="w-full mt-10 sm:mt-12 self-start shadow-lg transition"
              >
                Agendar Diagnóstico
              </Button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;