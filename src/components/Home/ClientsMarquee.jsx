import React from 'react';

import logo1 from '../../assets/1-cia-odontologica.png';
import logo2 from '../../assets/2-robtech.png';
import logo3 from '../../assets/3-renata-careaga.png';
import logo4 from '../../assets/4-marcia-moraes.png';
import logo5 from '../../assets/5-koru-studio.png';
import logo6 from '../../assets/6-chimp-skatwear.png';
import logo7 from '../../assets/7-isaque-moveis.png';
import logo8 from '../../assets/8-powerbrain.png';
import logo9 from '../../assets/9-sacadas-classz.png';
import logo10 from '../../assets/10-alexandre-ivo.png';
import logo11 from '../../assets/11-instituto-sublim.png';
import logo12 from '../../assets/12-amanda-store.png';
import logo13 from '../../assets/13-andre-barbosa.png';

const ClientsMarquee = () => {
  const logos = [
    logo1, logo2, logo3, logo4, logo5, logo6, logo7, 
    logo8, logo9, logo10, logo11, logo12, logo13
  ];

  return (
    <section className="py-12 bg-charcoal/50 border-y border-white/5 overflow-hidden relative w-full">
      <style>
        {`
          .marquee-container {
            display: flex;
            width: max-content;
            animation: scroll 45s linear infinite;
          }

          .marquee-container:hover {
            /* Se quiser que pause ao passar o mouse, basta descomentar a linha abaixo */
            /* animation-play-state: paused; */ 
          }

          @keyframes scroll {
            to {
              transform: translate3d(-50%, 0, 0); /* Move 50% left */
            }
          }
        `}
      </style>

      {/* O container interno da rolagem */}
      <div className="marquee-container items-center gap-12 pl-12 pointer-events-auto">
        {[...logos, ...logos].map((logo, index) => (
          <React.Fragment key={index}>
            <div className="flex-shrink-0 flex items-center justify-center">
              <img 
                src={logo} 
                alt={`Cliente ${index + 1}`} 
                className="h-10 md:h-16 w-auto object-contain opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500"
                draggable="false"
              />
            </div>
            {/* O SEPARADOR DA LISTA */}
            <div className="flex-shrink-0 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-copper flex-shrink-0"></div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

export default ClientsMarquee;
