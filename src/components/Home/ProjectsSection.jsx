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
      <section id="projetos" className="bg-low-dark py-24 px-4 md:px-16">
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-12 text-center">
            <h2 className="font-title text-4xl md:text-5xl font-light text-cream mb-4">
              Projetos Selecionados
            </h2>
          </div>
          
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-8 min-h-[2000px]">
              {projects.map((project, index) => (
                <div key={index} onClick={() => handleOpenModal(project)} className="cursor-pointer">
                  <Card
                    image={project.image}
                    title={project.title}
                    description={project.description}
                    link={project.link}
                    buttonText="Ver Projeto"
                    link2={project.link2}
                    buttonText2={project.buttonText2}
                    isClickable={true}
                  />
                </div>
              ))}
            </div>
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
