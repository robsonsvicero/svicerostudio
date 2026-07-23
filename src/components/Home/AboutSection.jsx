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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <ScrollReveal direction="right" delay={0.1} className="flex justify-center lg:justify-start">
            <div className="relative w-full max-w-xl">
              <div className="aspect-[4/5] sm:aspect-[5/6] rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={aboutPhoto}
                  alt="Robson Svicero, estrategista e designer à frente do Svicero Studio"
                  loading="lazy"
                  className="w-full h-full object-contain rounded-2xl"
                />
              </div>
              <div className="absolute -bottom-6 left-6 overflow-hidden bg-ds-accent/55 backdrop-blur-2xl border border-white/60 text-white rounded-xl px-6 py-4 shadow-[0_18px_45px_rgba(255,122,89,0.35)]">
                <span className="block text-3xl font-bold leading-tight mb-1">10+</span>
                <span className="block text-xs tracking-widest font-semibold">ANOS DE EXPERIÊNCIA</span>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="left" delay={0.2}>
            <SectionHeader
              badge="SOBRE O ESTÚDIO"
              title="Estratégia e design para alinhar percepção à qualidade real do seu negócio"
              description="O Svicero Studio ajuda marcas que evoluíram tecnicamente, mas ainda comunicam uma fase anterior."
              className="mb-0"
              descriptionClassName="mb-6"
            />
            <p className="text-lg md:text-xl font-normal leading-[1.6] text-ds-muted max-w-2xl mb-8">
              Liderado por Robson Svicero, o estúdio combina estratégia, sistemas visuais e clareza de comunicação para construir marcas mais maduras, coerentes e confiáveis.
            </p>
            <Button variant="secondary" href="/sobre">
              Conheça o estúdio
            </Button>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
