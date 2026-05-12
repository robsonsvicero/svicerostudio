import React, { useEffect, useRef } from 'react';
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

import logo1 from '../../assets/1-cia-odontologica.png';
import logo2 from '../../assets/2-robtech.png';
import logo3 from '../../assets/3-renata-careaga.png';
import logo4 from '../../assets/4-marcia-moraes.png';
import logo5 from '../../assets/5-koru-studio.png';
import logo6 from '../../assets/6-chimp-skatwear.png';
import logo7 from '../../assets/7-isaque-moveis.png';
import logo8 from '../../assets/8-powerbrain.png';
import logo9 from '../../assets/9-sacadas-classz.png';
import logo10 from '../../assets/10-lancamentossp.png';
import logo11 from '../../assets/11-alexandre-ivo.png';
import logo12 from '../../assets/12-instituto-sublim.png';
import logo13 from '../../assets/13-amanda-store.png';
import logo14 from '../../assets/14-andre-barbosa.png';

const ClientsMarquee = () => {
  const swiperRef = useRef(null);
  const logos = [
    logo1, logo2, logo3, logo4, logo5, logo6, logo7, 
    logo8, logo9, logo10, logo11, logo12, logo13, logo14
  ];

  useEffect(() => {
    if (swiperRef.current) {
      const swiper = new Swiper(swiperRef.current, {
        loop: true,
        slidesPerView: 'auto',
        spaceBetween: 50,
        speed: 2000,
        autoplay: {
          delay: 0,
          disableOnInteraction: false,
        },
        freeMode: {
          enabled: true,
          momentum: false,
        },
        allowTouchMove: false,
        observer: true,
        observeParents: true,
      });

      return () => {
        if (swiper) swiper.destroy();
      };
    }
  }, []);

  return (
    <section className="py-12 bg-charcoal/50 border-y border-white/5 overflow-hidden">
      <div className="swiper clients-marquee-swiper" ref={swiperRef}>
        <div className="swiper-wrapper !ease-linear items-center">
          {[...logos, ...logos].map((logo, index) => (
            <React.Fragment key={index}>
              <div className="swiper-slide !w-auto flex items-center justify-center">
                <img 
                  src={logo} 
                  alt={`Cliente ${index + 1}`} 
                  className="h-10 md:h-16 w-auto object-contain opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <div className="swiper-slide !w-auto flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-copper flex-shrink-0"></div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientsMarquee;
