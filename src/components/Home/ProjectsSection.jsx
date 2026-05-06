import React, { useState } from 'react';
import ProjectModal from '../ProjectModal';

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
        className="py-16 sm:py-24 px-4 sm:px-6 md:px-16 bg-primary font-body"
      >
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-secondary/5 text-xs font-semibold text-secondary tracking-widest shadow-sm border border-secondary/30">
                <span className="w-2 h-2 -rotate-45 bg-secondary inline-block" />
                PORTFÓLIO
              </span>

              <h2 className="font-title text-3xl sm:text-4xl md:text-5xl font-extrabold text-white text-balance">
                Projetos em Destaque
              </h2>

              <p className="font-sans text-lg md:text-xl text-[#B2B8C6] max-w-2xl leading-relaxed mb-8">
                Casos reais de negócios que reposicionamos — cada projeto começa
                pelo diagnóstico e termina com uma marca capaz de justificar
                preços mais altos.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-14">
            {projects.slice(0, 4).map((project) => (
              <div
                key={project.id}
                onClick={() => handleOpenModal(project)}
                onKeyDown={(e) => e.key === 'Enter' && handleOpenModal(project)}
                role="button"
                tabIndex={0}
                aria-label={`Ver projeto ${project.titulo}`}
                className="relative group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 min-h-[280px]"
                style={{ background: project.bg || '#E5E5E5' }}
              >
                {project.imagem_url && (
                  <img
                    src={project.imagem_url}
                    alt={project.titulo}
                    className="w-full h-full object-cover rounded-2xl transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                )}

                {/* Gradiente fixo + título sempre visível */}
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent p-6">
                  <h3 className="text-cream uppercase text-2xl font-bold mb-2 drop-shadow-lg text-left">
                    {project.titulo}
                  </h3>
                </div>
              </div>
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