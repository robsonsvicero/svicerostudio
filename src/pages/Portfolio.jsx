import React, { useEffect, useState, useRef } from 'react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import Button from '../components/UI/Button';
import SEOHelmet from '../components/SEOHelmet';
import ProjectModal from '../components/ProjectModal';
import ScrollReveal from '../components/UI/ScrollReveal';
import DepoimentosSection from '../components/DepoimentosSection';
import CTAFinal from '../components/CTAFinal';
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
  const isFeatured = index === 0; // Apenas o primeiro card do nicho odonto no tamanho maior
  const shortDescription = (project.descricao || '').trim();
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
      className={`relative group cursor-pointer overflow-hidden shadow-xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-ds-border hover:border-ds-accent/40 bg-ds-surface rounded-3xl flex flex-col ${isFeatured ? "md:col-span-2 md:flex-row min-h-[400px] lg:min-h-[500px] z-10 hover:z-20" : "min-h-[420px] sm:aspect-square"
        }`}
      style={{ transition: 'transform 0.5s ease-out, box-shadow 0.3s ease-out, border-color 0.3s ease-out', transformStyle: 'preserve-3d' }}
    >
      {/* Container da Imagem */}
      <div className={`relative overflow-hidden ${isFeatured ? "md:w-3/5 order-1 md:order-1" : "w-full h-52 sm:h-1/2 flex-none order-1"}`} style={{ transform: 'translateZ(20px)' }}>
        <div className="absolute inset-0 bg-ds-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 mix-blend-overlay"></div>
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
      <div className={`relative z-20 flex flex-col justify-center p-8 lg:p-12 ${isFeatured ? "md:w-2/5 order-2 border-t md:border-t-0 md:border-l border-ds-border bg-ds-surface" : "flex-1 sm:h-1/2 order-2 border-t border-ds-border bg-ds-surface"}`} style={{ transform: 'translateZ(30px)' }}>
        <div className="flex items-center justify-between mb-6">
          <span className="text-[10px] font-mono text-ds-accent uppercase tracking-widest bg-ds-accent/10 px-4 py-1.5 rounded-full border border-ds-accent/20">
            {project.categoria || "Case Study"}
          </span>
          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-ds-accent group-hover:border-ds-accent transition-all duration-300 shadow-[0_0_15px_rgba(184,115,51,0)] group-hover:shadow-[0_0_15px_rgba(184,115,51,0.5)]">
            <i className="fa-solid fa-arrow-right text-ds-muted text-xs group-hover:text-white transition-colors -rotate-45 group-hover:rotate-0 duration-300"></i>
          </div>
        </div>

        <h3 className={`text-ds-text font-medium tracking-tight leading-[1.1] mb-4 ${isFeatured ? "text-3xl md:text-[2.5rem]" : "text-2xl"}`}>
          {project.titulo}
        </h3>

        {shortDescription && (
          <p className="text-sm leading-relaxed text-ds-muted mb-4">
            {shortDescription}
          </p>
        )}

        <div className="mt-auto pt-6 flex items-center gap-3 text-sm font-bold uppercase tracking-[.15em] text-ds-muted group-hover:text-ds-accent transition-colors duration-300">
          Estudo de caso
        </div>
      </div>
    </div>
  );
};

const Portfolio = () => {
  const [activeProjects, setActiveProjects] = useState([]);
  const [archivedProjects, setArchivedProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchProjects().then((allProjects) => {
      // Lista de categorias oficiais do seu novo posicionamento
      const currentCategories = ['Conceptual case', 'Blindagem de percepção', 'Business design', 'Estratégia de marca'];

      // Filtra os projetos ativos do nicho atual
      const active = allProjects.filter(p => currentCategories.includes(p.categoria));

      // Aloca os projetos de outros nichos no arquivo histórico corporativo
      const archived = allProjects.filter(p => !currentCategories.includes(p.categoria));

      setActiveProjects(active);
      setArchivedProjects(archived);
    });
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
    <div className="bg-ds-bg min-h-screen text-ds-text font-body">
      <SEOHelmet
        title="Estudos de Caso — Estratégia de Posicionamento de Marca"
        description="Casos de clínicas e projetos que reposicionamos para atrair o público particular e justificar orçamentos de alto ticket."
        canonical="/projetos"
      />
      <Header variant="solid" />

      {/* Hero Section */}
      <section className={`${container} py-14 sm:py-16 lg:py-24 text-center`}>
        <ScrollReveal direction="up" delay={0.1}>
          <span className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-ds-accent/25 bg-ds-accent/5 text-[11px] font-mono uppercase tracking-[.2em] text-ds-accent">
            <span className="w-1.5 h-1.5 rounded-full bg-ds-accent shadow-[0_0_10px_rgba(184,115,51,0.5)]"></span>
            CASES E ESTUDOS DE POSICIONAMENTO
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-[4rem] font-medium tracking-[-0.02em] leading-[1] text-ds-text mb-6 text-balance">
            Projetos que transformam percepção em confiança e valor
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl font-normal leading-[1.6] text-ds-muted">
            Construímos marcas institucionais claras e consistentes, que justificam o valor dos tratamentos, fortalecem a confiança e atraem um público mais qualificado.
          </p>
        </ScrollReveal>
      </section>

      {/* Grid de Projetos do Nicho Principal */}
      <section className={`${container} pb-16 lg:pb-24`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ perspective: '1200px' }}>
          {activeProjects.map((proj, index) => (
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
      </section>

      {/* Seção Secundária: Arquivo Histórico Corporativo (Onde entram os outros nichos) */}
      {archivedProjects.length > 0 && (
        <section className="border-t border-white/5 bg-[#eeeeee] py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <ScrollReveal direction="up" delay={0.1}>
              <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-ds-text mb-4">
                Antes das clínicas, uma década traduzindo estratégia em marca
              </h2>
              <p className="text-base text-ds-muted max-w-2xl mx-auto mb-12 leading-relaxed">
                Antes de concentrar nossa atuação em clínicas e negócios de saúde, desenvolvemos marcas e projetos digitais para múltiplos setores empresariais. Essa experiência amplia nosso repertório, aprofunda nossa capacidade de análise e nos ajuda a ir além da estética em cada projeto de posicionamento.
              </p>

              {/* Links ou Miniaturas Discretas dos projetos arquivados */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-left">
                {archivedProjects.map((proj) => (
                  <div
                    key={proj.id}
                    onClick={() => handleOpenModal(proj)}
                    className="relative overflow-hidden p-5 rounded-2xl border border-white/5 bg-[#141414] hover:border-ds-accent/30 cursor-pointer transition-all duration-300 flex flex-col justify-between h-32 group"
                  >
                    {proj.imagem_url && (
                      <>
                        <img
                          src={proj.imagem_url}
                          alt={proj.titulo}
                          className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-all duration-500 group-hover:scale-105 z-0"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/40 to-[#141414]/10 z-10 pointer-events-none"></div>
                      </>
                    )}
                    <div className="relative z-20 flex flex-col h-full justify-between">
                      <span className="text-[10px] font-mono text-white/70 uppercase group-hover:text-ds-accent transition-colors drop-shadow-md">
                        {proj.categoria || "Corporativo"}
                      </span>
                      <h4 className="text-sm font-medium text-[#eeeeee] line-clamp-2 mt-2 drop-shadow-md">
                        {proj.titulo}
                      </h4>
                      
                      
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Modal do projeto */}
      <ProjectModal isOpen={modalOpen} onClose={handleCloseModal} project={selectedProject} />

      {/* Seção de Depoimentos */}
      <DepoimentosSection />

      {/* CTA final */}
      <CTAFinal />

      <Footer />
    </div>
  );
};

export default Portfolio;