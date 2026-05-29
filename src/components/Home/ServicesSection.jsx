import React from 'react';
import Button from '../UI/Button';
import ScrollReveal from '../UI/ScrollReveal';
import SectionHeader from '../UI/SectionHeader';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ServicesSection = ({ servicos }) => (
  <section id="servicos" className="py-16 sm:py-24 px-4 sm:px-6 md:px-16 bg-ds-bg font-body">
    <div className="max-w-screen-xl mx-auto">
      <ScrollReveal direction="up" delay={0.1}>
        <SectionHeader
          badge="ESPECIALIDADES"
          title="Nossos Serviços"
          description="Combinamos criatividade e precisão técnica para impulsionar seu negócio no mundo digital através de soluções sob medida."
        />
      </ScrollReveal>
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
            {/* TODO: revisar cor (sem equivalente claro no mapeamento) */}
            <div className="bg-white/5 rounded-2xl border border-secondary700 p-8 flex flex-col h-full shadow-lg">
              <div className="w-full aspect-[4/3] mb-6 overflow-hidden rounded-xl shadow-md">
                <img src={servico.img} alt={servico.alt} className="w-full h-full object-cover" loading="lazy" />
              </div>
              {/* TODO: revisar cor (sem equivalente claro no mapeamento) */}
              <span className={`inline-block px-4 py-2 rounded-full mb-3 text-sm font-semibold bg-cream/5`}>{servico.badge.text}</span>
              <p className="text-[#B2B8C6] text-base font-normal leading-relaxed mb-4">{servico.title}</p>
              <Button
                href={servico.link}
                variant="secondary"
                className="w-full mt-auto border border-[#E5E5E5] bg-[#F8F8F8] text-[#3A220C] hover:bg-[#FFE5E9] hover:text-ds-accent transition-colors"
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
