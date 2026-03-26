import React from 'react';
import aboutPhoto from '../../assets/about-photo.png';
import Button from '../UI/Button';

const AboutSection = () => {
  return (
    <section id="sobre" className="bg-dark-bg py-24 px-4 md:px-16 font-body">
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
                    <span className="block text-3xl font-bold leading-tight mb-1">10+</span>
                    <span className="block text-xs tracking-widest font-semibold">ANOS DE EXPERIÊNCIA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Texto e indicadores */}
          <div className="flex flex-col justify-center h-full">
            <span className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-secondary/5 text-xs font-semibold text-secondary tracking-widest shadow-sm border border-secondary/30 w-auto max-w-max">
              <span className="w-2 h-2 -rotate-45 bg-secondary flex-shrink-0 inline-block"></span>
              SOBRE O ESTÚDIO
            </span>
            <h2 className="font-title text-4xl md:text-5xl font-extrabold text-white mb-6">Quem está por trás do Svicero Studio?</h2>
            <p className="font-sans text-lg md:text-xl text-[#B2B8C6] max-w-2xl leading-relaxed mb-6">
              Eu sou o Robson Svicero e criei o Svicero Studio para ajudar autônomos e MEIs a terem uma imagem à altura do que entregam.</p>
            <p className="font-sans text-lg md:text-xl text-[#B2B8C6] max-w-2xl leading-relaxed mb-6">

              Não trabalho com “design só bonito”, eu uno estratégia, design e tecnologia para criar identidade visual e sites que:
            </p>
            <ul className="list-disc list-inside  text-lg md:text-xl text-[#B2B8C6] mb-6 max-w-2xl">
              <li className="mb-2">passam mais confiança,</li>
              <li className="mb-2">tiram a cara de amadorismo,</li>
              <li className="mb-2">e te dão base para cobrar melhor pelos seus serviços.</li>
            </ul>
            <p className="font-sans text-lg md:text-xl text-[#B2B8C6] max-w-2xl leading-relaxed mb-8">
              Minha missão com o Svicero Studio é simples: ajudar profissionais de serviços a terem uma marca que permita cobrar melhor e se posicionar com segurança.
            </p>
            {/* Indicadores */}
            <div className="flex gap-8 mt-4">
              <div>
                <span className="block text-3xl font-extrabold text-white mb-1">150+</span>
                <span className="block text-sm text-[#B2B8C6] font-semibold">Projetos Entregues</span>
              </div>
              <div>
                <span className="block text-3xl font-extrabold text-white mb-1">100%</span>
                <span className="block text-sm text-[#B2B8C6] font-semibold">Clientes Satisfeitos</span>
              </div>
            </div>
            <div
              className="flex flex-row it justify-center">
              <Button
                href="/formulario-interesse"
                variant="secondary"
                className="w-full mt-20 self-start shadow-lg transition">
                Ver se é para mim
              </Button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutSection;
