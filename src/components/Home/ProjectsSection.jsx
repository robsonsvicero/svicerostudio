import React, { useState, useRef } from 'react';
import ProjectModal from '../ProjectModal';
import ScrollReveal from '../UI/ScrollReveal';
import SectionHeader from '../UI/SectionHeader';

const ProjectCard = ({ project, index, handleOpenModal }) => {
  const isFeatured = index === 0;
  const isSecondCard = index === 1;
  const shortDescription = (project.descricao || '').trim();
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    // Efeito apenas no card em destaque e em telas maiores
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
      className={`relative group cursor-pointer overflow-hidden shadow-xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/15 hover:border-ds-accent/40 backdrop-blur-md rounded-3xl flex flex-col h-full ${isFeatured ? "md:col-span-2 md:flex-row min-h-[400px] lg:min-h-[500px] z-10 hover:z-20" : "min-h-[380px]"
        }`}
      style={{ transition: 'transform 0.5s ease-out, box-shadow 0.3s ease-out, border-color 0.3s ease-out', transformStyle: 'preserve-3d' }}
    >
      {/* Container da Imagem */}
      <div className={`relative overflow-hidden ${isFeatured ? "md:w-3/5 order-1 md:order-1" : "w-full h-52 sm:h-auto sm:flex-1 flex-none order-1"}`} style={{ transform: 'translateZ(20px)' }}>
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
      <div className={`relative z-20 flex flex-col justify-center p-8 lg:p-12 ${isFeatured ? "md:w-2/5 order-2 border-t md:border-t-0 md:border-l border-white/5" : "order-2 flex-1 border-t border-white/5 bg-ds-surface"}`} style={{ transform: 'translateZ(30px)' }}>
        <div className="flex items-center justify-between mb-6">
          <span className="text-[10px] font-mono text-ds-accent uppercase tracking-widest bg-ds-accent/10 px-4 py-1.5 rounded-full border border-ds-accent/20">
            {project.categoria || "Case Study"}
          </span>
          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-ds-accent group-hover:border-ds-accent transition-all duration-300 shadow-[0_0_15px_rgba(184,115,51,0)] group-hover:shadow-[0_0_15px_rgba(184,115,51,0.5)]">
            <i className={`fa-solid fa-arrow-right ${isSecondCard ? "text-surface" : "text-ds-muted"} text-xs group-hover:text-white transition-colors -rotate-45 group-hover:rotate-0 duration-300`}></i>
          </div>
        </div>

        <h3 className={`${isSecondCard ? "text-surface" : "text-ds-text"} font-medium tracking-tight leading-[1.1] mb-4 ${isFeatured ? "text-3xl md:text-[2.5rem]" : "text-2xl"}`}>
          {project.titulo}
        </h3>

        {shortDescription && (
          <p className={`text-sm leading-relaxed ${isSecondCard ? "text-surface/80" : "text-ds-muted"} mb-4`}>
            {shortDescription}
          </p>
        )}

        <div className={`mt-auto pt-6 flex items-center gap-3 text-sm font-bold uppercase tracking-[.15em] ${isSecondCard ? "text-surface" : "text-ds-muted"} group-hover:text-ds-accent transition-colors duration-300`}>
          Ver Projeto Completo
        </div>
      </div>
    </div>
  );
};

const ProjectsSection = ({ projects }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
  };

  return (
    <>
      <section
        id="projetos"
        className="py-16 sm:py-24 px-4 sm:px-6 md:px-16 bg-ds-bg/50 font-body"
      >
        <div className="max-w-screen-xl mx-auto">
          <ScrollReveal direction="up" delay={0.1} className="mb-10">
            <SectionHeader
              badge="ESTUDOS DE CASO"
              title="Estratégia aplicada a desafios reais de marca"
              description="Cada projeto nasce de um diagnóstico estratégico. Nosso foco não é apenas estética, é construir marcas mais coerentes, confiáveis e memoráveis."
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-14" style={{ perspective: '1200px' }}>
            {projects.slice(0, 3).map((project, index) => (
              <ScrollReveal
                key={project.id}
                direction="up"
                delay={0.1 + index * 0.15}
                className={index === 0 ? "md:col-span-2" : "h-full"}
              >
                <ProjectCard
                  project={project}
                  index={index}
                  handleOpenModal={handleOpenModal}
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <ProjectModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        project={selectedProject}
      />
    </>
  );
};

export default ProjectsSection;
