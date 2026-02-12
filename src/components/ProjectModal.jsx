import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

const ProjectModal = ({ isOpen, onClose, project }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [galleryImages, setGalleryImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState('pt'); // 'pt' ou 'en'

  useEffect(() => {
    if (isOpen && project?.id) {
      fetchGalleryImages();
    }
  }, [isOpen, project]);

  const fetchGalleryImages = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('projeto_galeria')
        .select('*')
        .eq('projeto_id', project.id)
        .order('ordem', { ascending: true });

      if (error) throw error;
      setGalleryImages(data || []);
    } catch (error) {
      console.error('Erro ao carregar galeria:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === galleryImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') handlePrevImage();
    if (e.key === 'ArrowRight') handleNextImage();
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, currentImageIndex, galleryImages.length]);

  if (!isOpen || !project) return null;

  const description = language === 'pt' 
    ? project.descricao_longa || project.descricao 
    : project.descricao_longa_en || project.descricao;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-6xl max-h-[90vh] bg-cream rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Botão Fechar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-low-dark/80 hover:bg-low-dark text-cream rounded-full transition-colors"
            aria-label="Fechar modal"
          >
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>

          {/* Seletor de Idioma */}
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <button
              onClick={() => setLanguage('pt')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                language === 'pt'
                  ? 'bg-primary text-white'
                  : 'bg-white/80 text-low-dark hover:bg-white'
              }`}
            >
              PT
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                language === 'en'
                  ? 'bg-primary text-white'
                  : 'bg-white/80 text-low-dark hover:bg-white'
              }`}
            >
              EN
            </button>
          </div>

          <div className="overflow-y-auto max-h-[90vh]">
            {/* Galeria de Imagens */}
            {galleryImages.length > 0 && (
              <div className="relative w-full h-[400px] md:h-[500px] bg-low-dark">
                {isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-cream border-t-transparent"></div>
                  </div>
                ) : (
                  <>
                    <img
                      src={galleryImages[currentImageIndex]?.imagem_url}
                      alt={`${project.titulo} - Imagem ${currentImageIndex + 1}`}
                      className="w-full h-full object-contain"
                    />

                    {/* Navegação de Imagens */}
                    {galleryImages.length > 1 && (
                      <>
                        <button
                          onClick={handlePrevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-cream/90 hover:bg-cream text-low-dark rounded-full transition-colors shadow-lg"
                          aria-label="Imagem anterior"
                        >
                          <i className="fa-solid fa-chevron-left"></i>
                        </button>
                        <button
                          onClick={handleNextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-cream/90 hover:bg-cream text-low-dark rounded-full transition-colors shadow-lg"
                          aria-label="Próxima imagem"
                        >
                          <i className="fa-solid fa-chevron-right"></i>
                        </button>

                        {/* Indicador de Imagens */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                          {galleryImages.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`w-2 h-2 rounded-full transition-all ${
                                index === currentImageIndex
                                  ? 'bg-cream w-8'
                                  : 'bg-cream/50 hover:bg-cream/80'
                              }`}
                              aria-label={`Ir para imagem ${index + 1}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Conteúdo do Projeto */}
            <div className="p-6 md:p-8">
              {/* Título */}
              <h2 className="font-title text-3xl md:text-4xl font-semibold text-low-dark mb-4">
                {project.titulo}
              </h2>

              {/* Data do Projeto */}
              {project.data_projeto && (
                <p className="text-low-medium text-sm mb-6">
                  {new Date(project.data_projeto).toLocaleDateString('pt-BR', {
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              )}

              {/* Descrição/Storytelling */}
              <div className="prose prose-lg max-w-none mb-8">
                <p className="text-low-dark whitespace-pre-wrap leading-relaxed">
                  {description}
                </p>
              </div>

              {/* Botões de Ação */}
              <div className="flex flex-wrap gap-4">
                {/* Botão do Site */}
                {project.site_url && (
                  <a
                    href={project.site_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors font-medium"
                  >
                    <i className="fa-solid fa-globe"></i>
                    <span>{language === 'pt' ? 'Visitar Site' : 'Visit Website'}</span>
                  </a>
                )}

                {/* Botão Behance */}
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-low-dark hover:bg-low-medium text-cream rounded-lg transition-colors font-medium"
                  >
                    <i className="fa-brands fa-behance"></i>
                    <span>{language === 'pt' ? 'Ver no Behance' : 'View on Behance'}</span>
                  </a>
                )}

                {/* Botão Adicional (se existir) */}
                {project.link2 && (
                  <a
                    href={project.link2}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 border-2 border-low-dark text-low-dark hover:bg-low-dark hover:text-cream rounded-lg transition-colors font-medium"
                  >
                    <i className="fa-solid fa-link"></i>
                    <span>{project.button_text2 || 'Ver Mais'}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProjectModal;
