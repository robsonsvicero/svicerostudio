import React, { useState, useRef } from 'react';
import ProjectModal from '../ProjectModal';

const ProjectCard = ({ project, index, handleOpenModal }) => {
  const isFeatured = index === 0;
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
      className={`relative group cursor-pointer overflow-hidden shadow-xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/15 hover:border-copper/40 backdrop-blur-md rounded-3xl flex flex-col ${
        isFeatured ? "md:col-span-2 md:flex-row min-h-[400px] lg:min-h-[500px] z-10 hover:z-20" : "min-h-[380px]"
      }`}
      style={{ transition: 'transform 0.5s ease-out, box-shadow 0.3s ease-out, border-color 0.3s ease-out', transformStyle: 'preserve-3d' }}
    >
      {/* Container da Imagem */}
      <div className={`relative overflow-hidden ${isFeatured ? "md:w-3/5 order-1 md:order-1" : "w-full flex-1 order-1"}`} style={{ transform: 'translateZ(20px)' }}>
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
      <div className={`relative z-20 flex flex-col justify-center p-8 lg:p-12 ${isFeatured ? "md:w-2/5 order-2 border-t md:border-t-0 md:border-l border-white/5" : "order-2 border-t border-white/5 bg-[#141414]"}`} style={{ transform: 'translateZ(30px)' }}>
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
        className="py-16 sm:py-24 px-4 sm:px-6 md:px-16 bg-surface font-body"
      >
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-copper/25 bg-copper/5 text-[11px] font-mono uppercase tracking-[.2em] text-copper">
                <span className="w-1.5 h-1.5 rounded-full bg-copper shadow-[0_0_10px_rgba(184,115,51,0.5)]"></span>
                PORTFÓLIO
              </span>

              <h2 className="text-4xl md:text-[3.75rem] font-medium tracking-[-0.02em] leading-[1.1] text-cream text-left mb-6">
                Projetos em Destaque
              </h2>

              <p className="text-xl font-normal leading-[1.6] text-muted max-w-2xl">
                Casos reais de negócios que reposicionamos — cada projeto começa
                pelo diagnóstico e termina com uma marca capaz de justificar
                preços mais altos.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-14" style={{ perspective: '1200px' }}>
            {projects.slice(0, 3).map((project, index) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                index={index} 
                handleOpenModal={handleOpenModal} 
              />
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