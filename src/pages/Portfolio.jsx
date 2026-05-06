import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import Button from '../components/UI/Button';
import SEOHelmet from '../components/SEOHelmet';
import ProjectModal from '../components/ProjectModal';
import { API_URL } from '../lib/api.js';

// Estilos padronizados
const container = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-10";

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

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [depoimentos, setDepoimentos] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchProjects().then(setProjects);
    fetchDepoimentos().then(setDepoimentos);
  }, []);

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
      <SEOHelmet
        title="Projetos — Svicero Studio"
        description="Marcas que transformaram percepção em valor. Conheça nossos projetos de branding e design estratégico."
      />
      <Header variant="solid" />

      {/* Hero Section */}
      <section className={`${container} mt-20 lg:mt-36 py-14 sm:py-16 lg:py-24 text-center`}>
        <span className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-secondary/10 text-xs font-semibold text-secondary tracking-widest border border-secondary/30">
          <span className="w-2 h-2 -rotate-45 bg-secondary inline-block" />
          CASES DE SUCESSO
        </span>
        <h1 className="font-title text-3xl sm:text-4xl lg:text-7xl font-semibold tracking-[-0.04em] text-white mb-6 text-balance">
          Projetos que transformaram percepção em valor
        </h1>
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-white/70 leading-relaxed">
          Casos reais de negócios que reposicionamos. Cada projeto começa pelo diagnóstico e termina com uma marca capaz de justificar preços mais altos e atrair clientes mais alinhados.
        </p>
      </section>

      {/* Grid de Projetos */}
      <section className={`${container} pb-20 lg:pb-32`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:auto-rows-[380px]">
          {projects.map((proj, index) => (
            <button
              key={proj.id}
              className={`relative group cursor-pointer rounded-2xl overflow-hidden transition-all duration-500 bg-[#181818] border border-white/5 focus:outline-none focus:ring-2 focus:ring-secondary/50 ${index === 0 || index === 3 ? 'md:col-span-2 md:row-span-1' : ''}`}
              onClick={() => handleOpenModal(proj)}
              aria-label={proj.titulo}
            >
              {/* Background/Image */}
              <div
                className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-110"
                style={{ background: proj.bg || '#181818' }}
              >
                {proj.imagem_url && (
                  <img
                    src={proj.imagem_url}
                    alt={proj.titulo}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                    loading="lazy"
                  />
                )}
              </div>

              {/* Overlay Gradient Default */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-0" />

              {/* Title Default (Visible when not hovered) */}
              <div className="absolute bottom-0 left-0 right-0 p-8 transition-all duration-500 group-hover:opacity-0 group-hover:translate-y-4">
                <h3 className="text-white text-xl font-bold uppercase tracking-wider">
                  {proj.titulo}
                </h3>
              </div>

              {/* Hover Content */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-[6px] flex flex-col justify-center items-center p-8 text-center">
                <span className="text-secondary text-xs font-bold tracking-[0.2em] uppercase mb-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  {proj.categoria || 'Estratégia & Design'}
                </span>
                <h3 className="text-white text-3xl md:text-4xl font-bold mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                  {proj.titulo}
                </h3>
                <div className="w-12 h-[1px] bg-secondary/50 mb-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-150" />
                <span className="px-6 py-2 rounded-full border border-white/20 text-white/80 text-sm font-medium translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-200 hover:bg-white hover:text-black transition-colors">
                  Ver Projeto
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Modal do projeto */}
        <ProjectModal isOpen={modalOpen} onClose={handleCloseModal} project={selectedProject} />
      </section>

      {/* Clientes */}
      {depoimentos.length > 0 && (
        <section className="bg-[#111] py-20 sm:py-32 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
            <div className="mb-16 text-center md:text-left">
              <span className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-secondary/10 text-xs font-semibold text-secondary tracking-widest border border-secondary/30">
                <span className="w-2 h-2 rounded-full bg-secondary flex-shrink-0 inline-block"></span>
                CLIENTES
              </span>
              <h2 className="font-title text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6 text-balance">
                O que dizem as marcas que transformamos
              </h2>
            </div>

            <Swiper
              modules={[Pagination, Navigation]}
              spaceBetween={30}
              slidesPerView={1}
              loop={depoimentos.length > 3}
              pagination={{ clickable: true, dynamicBullets: true }}
              navigation={true}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="depoimentos-swiper pb-16"
            >
              {[...depoimentos]
                .sort((a, b) => Number(a.ordem) - Number(b.ordem))
                .map((depoimento) => (
                  <SwiperSlide key={depoimento.id}>
                    <div className="bg-white/[0.03] rounded-3xl border border-white/10 p-8 md:p-10 flex flex-col h-full shadow-2xl transition-all duration-300 hover:border-secondary/30 group">
                      {/* Estrelas */}
                      <div className="mb-6 flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <i 
                            key={i} 
                            className={`fa-solid fa-star text-secondary text-sm ${i >= (depoimento.estrelas || 5) ? 'opacity-20' : ''}`}
                          />
                        ))}
                      </div>
                      
                      {/* Texto */}
                      <p className="text-white/80 text-lg font-light leading-relaxed mb-8 italic flex-1">
                        "{depoimento.texto}"
                      </p>
                      
                      {/* Avatar, nome e cargo */}
                      <div className="flex items-center gap-4 mt-auto border-t border-white/10 pt-6">
                        {depoimento.foto_url ? (
                          <img 
                            src={depoimento.foto_url} 
                            alt={depoimento.nome} 
                            className="h-14 w-14 rounded-full object-cover ring-2 ring-white/10" 
                          />
                        ) : (
                          <div className="w-14 h-14 flex-shrink-0 rounded-full bg-secondary/20 flex items-center justify-center border border-secondary/30">
                            <span className="font-semibold text-lg text-secondary">
                              {depoimento.iniciais || depoimento.nome?.substring(0, 2).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="text-white font-bold text-lg">{depoimento.nome}</p>
                          <p className="text-white/50 text-sm font-medium uppercase tracking-wider">
                            {depoimento.cargo}{depoimento.empresa ? ` @ ${depoimento.empresa}` : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
            </Swiper>
          </div>
        </section>
      )}

      {/* CTA final */}
      <section className="bg-dark-bg py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-secondary via-secondary to-secondary700 rounded-[40px] p-10 md:p-20 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />

          <h2 className="font-title text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6 text-balance relative z-10">
            Sua marca pode sustentar o preço que você já merece cobrar
          </h2>

          <p className="text-white/90 text-lg md:text-xl font-light mb-10 max-w-2xl mx-auto relative z-10">
            Se você sente que sua marca ainda não reflete o nível do que você entrega — 
            ou que ela te força a competir por preço em vez de valor — o próximo passo 
            é um diagnóstico honesto sobre o seu posicionamento.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Button
              href="/diagnostico"
              variant="primary"
              className="px-10 py-4 shadow-xl"
            >
              Agendar Diagnóstico
            </Button>
            <Button
              href="https://wa.me/5511964932007?text=Olá%20Robson%2C%20vi%20os%20projetos%20do%20Svicero%20Studio%20e%20gostaria%20de%20conversar%20sobre%20minha%20marca."
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              className="px-10 py-4"
            >
              Falar pelo WhatsApp
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Portfolio;
