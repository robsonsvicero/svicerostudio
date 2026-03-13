import React, { useState } from 'react';
import Card from '../UI/Card';
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
    setTimeout(() => setSelectedProject(null), 300); // Aguarda animação fechar
  };

  return (
    <>
      <section id="projetos" className="py-24 px-4 md:px-16 bg-primary">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-secondary/5 text-xs font-semibold text-secondary tracking-widest shadow-sm border border-secondary/30">
                <span className="w-2 h-2 rounded-full bg-secondary inline-block"></span>
                CASOS DE SUCESSO
              </span>
              <h2 className="font-title text-4xl md:text-5xl font-extrabold text-white">Projetos em Destaque</h2>
              <p className="font-sans text-lg md:text-xl text-[#B2B8C6] max-w-2xl leading-relaxed mb-8">Alguns trabalhos que ajudam a contar essa história.</p>
            </div>

          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.slice(0, 4).map((project, index) => (
              <div
                key={index}
                onClick={() => handleOpenModal(project)}
                className="relative group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 bg-white/0"
                style={{ minHeight: '280px', background: project.bg || '#E5E5E5' }}
              >
                {/* Imagem de fundo */}
                {project.image && (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover rounded-2xl transition-all duration-300 group-hover:scale-110"
                    style={{ minHeight: '280px', maxHeight: '340px' }}
                    loading="lazy"
                  />
                )}
                {/* Overlay no hover */}
                <div className="absolute inset-0 flex flex-col justify-end bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 p-6">
                  <h3 className="text-secondary text-2xl font-bold mb-2 drop-shadow-lg text-left">{project.title}</h3>
                  <p className="text-white text-base font-normal text-left max-w-xs drop-shadow-md">{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal de Projeto */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        project={selectedProject}
      />
    </>
  );
};

export default ProjectsSection;
