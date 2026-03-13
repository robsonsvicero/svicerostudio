import React from 'react';
import Button from '../UI/Button';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ServicesSection = ({ servicos }) => (
  <section id="servicos" className="py-24 px-4 md:px-16 bg-dark-bg">
    <div className="max-w-screen-xl mx-auto">
      <div className="mb-12 text-left">
        <span className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-secondary/5 text-xs font-semibold text-secondary tracking-widest shadow-sm border border-secondary/30">
                <span className="w-2 h-2 rounded-full bg-secondary inline-block"></span>
                ESPECIALIDADES
              </span>
        <h2 className="font-title text-4xl md:text-5xl font-extrabold text-white mb-4">Nossos Serviços</h2>
        <p className="font-sans text-lg md:text-xl text-[#B2B8C6] max-w-2xl leading-relaxed mb-8">
          Combinamos criatividade e precisão técnica para impulsionar seu negócio no mundo digital através de soluções sob medida.
        </p>
      </div>
      <Swiper
        modules={[Navigation, Pagination]}
        loop={true}
        spaceBetween={24}
        breakpoints={{
          1024: { slidesPerView: 3, navigation: false, pagination: false }, // web
          768: { slidesPerView: 2, navigation: false, pagination: { clickable: true } }, // tablet
          0:   { slidesPerView: 1, navigation: false, pagination: { clickable: true } }, // mobile
        }}
        pagination={{ clickable: true }}
        className="services-swiper"
      >
        {servicos.map((servico, idx) => (
          <SwiperSlide key={idx}>
            <div className="bg-white/5 rounded-2xl border border-secondary700 p-8 flex flex-col h-full shadow-lg">
              <div className="w-full aspect-[4/3] mb-6 overflow-hidden rounded-xl shadow-md">
                <img src={servico.img} alt={servico.alt} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <span className={`inline-block px-4 py-2 rounded-full mb-3 text-sm font-semibold bg-cream/5`}>{servico.badge.text}</span>
              <p className="text-[#B2B8C6] text-base font-normal leading-relaxed mb-4">{servico.title}</p>
              <Button
                href={servico.link}
                variant="secondary"
                className="w-full mt-auto border border-[#E5E5E5] bg-[#F8F8F8] text-[#3A220C] hover:bg-[#FFE5E9] hover:text-secondary transition-colors"
              >Ver mais ...
              </Button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  </section>
);

export default ServicesSection;
