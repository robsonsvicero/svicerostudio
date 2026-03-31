import React, { useEffect, useState, useRef } from 'react';
import Swiper from 'swiper/bundle';
import { Pagination } from 'swiper/modules';
Swiper.use([Pagination]);
import 'swiper/css/bundle';
import 'swiper/css/pagination';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import Button from '../components/UI/Button';
import { API_URL } from '../lib/api.js';

// Buscar todos os projetos cadastrados
const fetchProjects = async () => {
  const res = await fetch(`${API_URL}/api/db/projetos/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      operation: 'select',
      orderBy: { column: 'data_projeto', ascending: false }
    })
  });
  const payload = await res.json();
  return payload.data || [];
};

const fetchDepoimentos = async () => {
  const res = await fetch(`${API_URL}/api/db/depoimentos/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ operation: 'select', orderBy: { column: 'ordem', ascending: true } })
  });
  const payload = await res.json();
  return payload.data || [];
};

import ProjectModal from '../components/ProjectModal';
import CTAFinal from '../components/CTAFinal';

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [depoimentos, setDepoimentos] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const swipersRef = useRef([]);

  useEffect(() => {
    fetchProjects().then(setProjects);
    fetchDepoimentos().then(setDepoimentos);
  }, []);

  useEffect(() => {
    if (depoimentos.length === 0) return;

    const timeoutId = setTimeout(() => {
      const depoimentosSwiper = document.querySelector('.depoimentos-swiper');
      if (depoimentosSwiper) {
        const depoimentosSwiperInstance = new Swiper('.depoimentos-swiper', {
          loop: true,
          slidesPerView: 1,
          spaceBetween: 24,
          grabCursor: true,
          centeredSlides: false,
          watchOverflow: true,
          watchSlidesProgress: true,
          observer: true,
          observeParents: true,
          slidesPerGroup: 1,
          resistanceRatio: 0.85,
          slidesOffsetBefore: 0,
          slidesOffsetAfter: 0,
          pagination: {
            el: '.depoimentos-swiper .swiper-pagination',
            clickable: true,
            dynamicBullets: true,
          },
          navigation: {
            nextEl: '.depoimentos-swiper .swiper-button-next',
            prevEl: '.depoimentos-swiper .swiper-button-prev',
          },
          breakpoints: {
            640: { slidesPerView: 1, spaceBetween: 24 },
            768: { slidesPerView: 2, spaceBetween: 32 },
            1024: { slidesPerView: 3, spaceBetween: 32 }
          }
        });
        swipersRef.current.push(depoimentosSwiperInstance);
      } else {
        console.error('Elemento .depoimentos-swiper não encontrado');
      }
    }, 200);

    return () => {
      clearTimeout(timeoutId);
      swipersRef.current.forEach(swiper => {
        if (swiper && swiper.destroy && typeof swiper.destroy === 'function') {
          try { swiper.destroy(true, true); } catch (e) { /* ignora */ }
        }
      });
      swipersRef.current = [];
    };
  }, [depoimentos]);

  const handleOpenModal = (project) => {
    setSelectedProject(project);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <div className="bg-dark-bg min-h-screen text-[#EFEFEF] font-body">
      <Header variant="solid" />

      {/* Intro curta */}
      <section className="mx-auto max-w-7xl px-6 mt-20 lg:mt-36 py-16 lg:px-10 lg:py-20 text-center">

        <h1 className="font-title text-4xl lg:text-6xl font-semibold tracking-[-0.05em] text-white mb-6">
          Alguns trabalhos que ajudam a contar essa história
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-white/70">
          Cada projeto aqui nasceu da mesma missão: tirar a marca da cara de amadora e dar base para cobrar melhor e vender com mais confiança.
        </p>
      </section>

      {/* Todos os projetos */}
      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-10 lg:py-12">
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {projects.map((proj) => (
            <button
              key={proj.id}
              className="group overflow-hidden rounded-[30px] border border-white/8 bg-[#181818] shadow-lg transition duration-300 hover:-translate-y-1 hover:border-white/14 focus:outline-none focus:ring-2 focus:ring-[#B87333]"
              onClick={() => handleOpenModal(proj)}
              aria-label={proj.titulo}
            >
              <div className="aspect-[4/4.8] w-full relative bg-[linear-gradient(135deg,#2F353B_0%,#844219_100%)]">
                {proj.imagem_url && (
                  <img
                    src={proj.imagem_url}
                    alt={proj.titulo}
                    className="absolute inset-0 h-full w-full object-cover z-0 transition-all duration-500 grayscale group-hover:grayscale-0"
                    loading="lazy"
                  />
                )}
                {/* Overlay degradê escuro só no hover */}
                <div className="absolute inset-0 z-10 pointer-events-none transition-all duration-500 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                {/* Título só no hover */}
                <div className="absolute bottom-0 left-0 w-full flex items-end justify-center p-6 z-20 transition-all duration-500 opacity-0 group-hover:opacity-100">
                  <h3 className="font-[DM Sans] text-2xl font-semibold tracking-[-0.04em] text-white text-center drop-shadow-lg">
                    {proj.titulo}
                  </h3>
                </div>
                {/* Desafio e resultado permanecem ocultos no hover, se quiser mostrar algo mais, pode ajustar aqui */}
              </div>
            </button>
          ))}
        </div>
        {/* Modal do projeto */}
        <ProjectModal isOpen={modalOpen} onClose={handleCloseModal} project={selectedProject} />
      </section>

      {/* Depoimentos */}
      {depoimentos.length > 0 && (
        <section className="bg-primary py-24 px-4 md:px-16">
          <div className="max-w-screen-xl mx-auto">
            <div className="mb-12 text-left">
              <span className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-secondary/5 text-xs font-semibold text-secondary tracking-widest shadow-sm border border-secondary/30">
                <span className="w-2 h-2 rounded-full bg-secondary flex-shrink-0 inline-block"></span>
                DEPOIMENTOS
              </span>
              <h2 className="font-title text-4xl md:text-5xl font-extrabold text-white mb-6">O que dizem os nossos clientes</h2>
            </div>
            <div className="relative">
              <div className="swiper depoimentos-swiper">
                <div className="swiper-wrapper">
                  {[...depoimentos].sort((a, b) => Number(a.ordem) - Number(b.ordem)).map((depoimento) => (
                    <div key={depoimento.id} className="swiper-slide">
                      <div className="bg-white/5 rounded-2xl border border-secondary700 p-8 flex flex-col h-full shadow-md">
                        {/* Estrelas */}
                        <div className="mb-4">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <i key={i} className={`fa-solid fa-star text-secondary text-xl mr-1 ${i >= (depoimento.estrelas || 5) ? 'opacity-30' : ''}`}></i>
                          ))}
                        </div>
                        {/* Texto */}
                        <p className="text-[#B2B8C6] text-base font-normal leading-relaxed mb-6 italic flex-1">"{depoimento.texto}"</p>
                        {/* Avatar, nome e cargo */}
                        <div className="flex items-center gap-4 mt-auto">
                          {depoimento.foto_url ? (
                            <img src={depoimento.foto_url} alt={depoimento.nome} className="h-12 w-12 rounded-full object-cover" />
                          ) : (
                            <div className="w-12 h-12 flex-shrink-0 rounded-full bg-[#E5E5E5] flex items-center justify-center">
                              <span className="font-semibold text-lg text-secondary700">{depoimento.iniciais || depoimento.nome?.substring(0, 2).toUpperCase()}</span>
                            </div>
                          )}
                          <div>
                            <p className="text-white font-bold text-base">{depoimento.nome}</p>
                            <p className="text-[#B2B8C6] text-sm font-normal">{depoimento.cargo}{depoimento.empresa ? `, ${depoimento.empresa}` : ''}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="swiper-button-prev"></div>
                <div className="swiper-button-next"></div>
                <div className="swiper-pagination mt-12 flex justify-center"></div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA final */}
      <div className='pt-24'>
        <CTAFinal />
      </div>

      <Footer />
    </div>
  );
};

export default Portfolio;
