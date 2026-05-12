import React, { useEffect, useState, useRef } from 'react';
import Header from '../components/Layout/Header';

import Footer from '../components/Layout/Footer';
import Button from '../components/UI/Button';
import SEOHelmet from '../components/SEOHelmet';
import ProjectModal from '../components/ProjectModal';
import ScrollReveal from '../components/UI/ScrollReveal';
import DepoimentosSection from '../components/DepoimentosSection';
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

const ProjectCard = ({ project, index, handleOpenModal }) => {
  const isFeatured = index === 0; // Apenas o primeiro card no tamanho maior
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!isFeatured || !cardRef.current || window.innerWidth < 1024) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;

    card.style.transition = 'transform 0.1s ease-out';
    card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    if (!isFeatured || !cardRef.current) return;
    const card = cardRef.current;
    card.style.transition = 'transform 0.5s ease-out';
    card.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  return (
    <div
      ref={cardRef}
      onClick={() => handleOpenModal(project)}
      onKeyDown={(e) => e.key === 'Enter' && handleOpenModal(project)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={0}
      aria-label={`Ver projeto ${project.titulo}`}
      className={`relative group cursor-pointer overflow-hidden shadow-xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/15 hover:border-copper/40 bg-[#141414]/80 backdrop-blur-md rounded-3xl flex flex-col ${isFeatured ? "md:col-span-2 md:flex-row min-h-[400px] lg:min-h-[500px] z-10 hover:z-20" : "aspect-square"
        }`}
      style={{ transition: 'transform 0.5s ease-out, box-shadow 0.3s ease-out, border-color 0.3s ease-out', transformStyle: 'preserve-3d' }}
    >
      {/* Container da Imagem */}
      <div className={`relative overflow-hidden ${isFeatured ? "md:w-3/5 order-1 md:order-1" : "w-full h-1/2 flex-none order-1"}`} style={{ transform: 'translateZ(20px)' }}>
        <div className="absolute inset-0 bg-copper/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 mix-blend-overlay"></div>
        {project.imagem_url ? (
          <img
            src={project.imagem_url}
            alt={project.titulo}
            className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-[#1A1A1A] flex items-center justify-center">
            <span className="text-white/20 font-mono text-sm tracking-widest">SVICERO</span>
          </div>
        )}
      </div>

      {/* Container do Conteúdo */}
      <div className={`relative z-20 flex flex-col justify-center p-8 lg:p-12 ${isFeatured ? "md:w-2/5 order-2 border-t md:border-t-0 md:border-l border-white/5 bg-[#141414]" : "h-1/2 flex-none order-2 border-t border-white/5 bg-[#141414]"}`} style={{ transform: 'translateZ(30px)' }}>
        <div className="flex items-center justify-between mb-6">
          <span className="text-[10px] font-mono text-copper uppercase tracking-widest bg-copper/10 px-4 py-1.5 rounded-full border border-copper/20">
            {project.categoria || "Case Study"}
          </span>
          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-copper group-hover:border-copper transition-all duration-300 shadow-[0_0_15px_rgba(184,115,51,0)] group-hover:shadow-[0_0_15px_rgba(184,115,51,0.5)]">
            <i className="fa-solid fa-arrow-right text-muted text-xs group-hover:text-white transition-colors -rotate-45 group-hover:rotate-0 duration-300"></i>
          </div>
        </div>

        <h3 className={`text-cream font-medium tracking-tight leading-[1.1] mb-4 ${isFeatured ? "text-3xl md:text-[2.5rem]" : "text-2xl"}`}>
          {project.titulo}
        </h3>

        <div className="mt-auto pt-6 flex items-center gap-3 text-sm font-bold uppercase tracking-[.15em] text-muted group-hover:text-copper transition-colors duration-300">
          Ver Projeto Completo
        </div>
      </div>
    </div>
  );
};

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchProjects().then(setProjects);
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
    <div className="bg-charcoal min-h-screen text-cream font-body">
      <SEOHelmet
        title="Projetos — Casos de Reposicionamento de Marca"
        description="Casos reais de negócios que reposicionamos. Cada projeto começa pelo diagnóstico e termina com uma marca capaz de justificar preços mais altos."
        canonical="/projetos"
      />
      <Header variant="solid" />

      {/* Hero Section */}
      <section className={`${container} py-14 sm:py-16 lg:py-24 text-center`}>
        <ScrollReveal direction="up" delay={0.1}>
          <span className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-copper/25 bg-copper/5 text-[11px] font-mono uppercase tracking-[.2em] text-copper">
            <span className="w-1.5 h-1.5 rounded-full bg-copper shadow-[0_0_10px_rgba(184,115,51,0.5)]"></span>
            CASES DE SUCESSO
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-[4rem] font-medium tracking-[-0.02em] leading-[1] text-cream mb-6 text-balance">
            Projetos que transformaram percepção em valor
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl font-normal leading-[1.6] text-muted">
            Casos reais de negócios que reposicionamos. Cada projeto começa pelo diagnóstico e termina com uma marca capaz de justificar preços mais altos e atrair clientes mais alinhados.
          </p>
        </ScrollReveal>
      </section>

      {/* Grid de Projetos */}
      {/* Grid de Projetos e Modal omitidos para limpeza nesta parte... Espere, tenho que manter as tags! */}
      <section className={`${container} pb-20 lg:pb-32`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ perspective: '1200px' }}>
          {projects.map((proj, index) => (
            <ScrollReveal
              key={proj.id}
              direction="up"
              delay={0.1 + index * 0.15}
              className={index === 0 ? "md:col-span-2" : ""}
            >
              <ProjectCard
                project={proj}
                index={index}
                handleOpenModal={handleOpenModal}
              />
            </ScrollReveal>
          ))}
        </div>

        {/* Modal do projeto */}
        <ProjectModal isOpen={modalOpen} onClose={handleCloseModal} project={selectedProject} />
      </section>

      <DepoimentosSection />

      {/* CTA final */}
      <section className="bg-charcoal py-24 px-4 sm:px-6 font-body">
        <ScrollReveal direction="up" delay={0.2} duration={0.8}>
          <div className="max-w-screen-xl w-full mx-auto bg-surface border border-white/5 text-cream rounded-[2rem] sm:rounded-[3rem] shadow-xl flex flex-col items-center justify-center px-5 sm:px-8 py-10 sm:py-16 relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-80 h-80 bg-copper/15 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-copper/5 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

            <h2 className="text-[1.875rem] md:text-[3.75rem] font-medium tracking-[-0.02em] leading-[1.1] mb-6 text-balance relative z-10">
              Sua marca pode sustentar o preço que você já merece cobrar
            </h2>

            <p className="text-lg md:text-xl font-normal leading-[1.6] text-white/60 mb-10 max-w-2xl mx-auto relative z-10">
              Se você sente que sua marca ainda não reflete o nível do que você entrega —
              ou que ela te força a competir por preço em vez de valor — o próximo passo
              é um diagnóstico honesto sobre o seu posicionamento.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <Button
                href="/formulario-interesse"
                variant="primary"
              >
                Agendar Diagnóstico
              </Button>
              <Button
                href="https://wa.me/5511964932007?text=Olá%20Robson%2C%20vi%20os%20projetos%20do%20Svicero%20Studio%20e%20gostaria%20de%20conversar%20sobre%20minha%20marca."
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
              >
                Falar pelo WhatsApp
              </Button>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <Footer />
    </div>
  );
};

export default Portfolio;
