import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '../lib/api.js';
import Button from './UI/Button';

const pad = (n) => String(n).padStart(2, '0');

const ProjectModal = ({ isOpen, onClose, project }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [galleryImages, setGalleryImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState('pt');

  useEffect(() => {
    if (isOpen && project?.id) {
      setCurrentImageIndex(0);
      fetchGalleryImages();
    }
  }, [isOpen, project]);

  const fetchGalleryImages = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_URL}/api/db/projeto_galeria/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operation: 'select',
          filters: [{ column: 'projeto_id', operator: 'eq', value: project.id }],
          orderBy: { column: 'ordem', ascending: true }
        })
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || 'Erro ao buscar galeria');
      setGalleryImages(payload.data || []);
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

  useEffect(() => {
    if (isOpen && galleryImages.length > 1) {
      const timer = setInterval(() => {
        setCurrentImageIndex((prev) =>
          prev === galleryImages.length - 1 ? 0 : prev + 1
        );
      }, 5000); // 5 segundos
      return () => clearInterval(timer);
    }
  }, [isOpen, galleryImages.length]);

  if (!isOpen || !project) return null;

  const description = language === 'pt'
    ? project.descricao_longa || project.descricao
    : project.descricao_longa_en || project.descricao;

  const formattedDate = project.data_projeto
    ? new Date(project.data_projeto).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    : null;

  const year = project.data_projeto
    ? new Date(project.data_projeto).getFullYear()
    : null;

  const meta = [
    project.cliente   && ['Cliente',   project.cliente],
    year              && ['Ano',        String(year)],
    project.categoria && ['Categoria',  project.categoria],
  ].filter(Boolean);

  const total = galleryImages.length;
  const currentImg = galleryImages[currentImageIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-y-auto bg-ds-bg/90 backdrop-blur-sm"
        onClick={onClose}
      >
        {/* wrapper min-h-full garante que items-center funcione sem cortar o topo */}
        <div className="flex min-h-full items-start justify-center p-4 lg:items-center">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative my-4 w-full max-w-7xl font-body text-ds-text"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative overflow-hidden rounded-[2rem] border border-white/5 bg-ds-surface shadow-2xl shadow-black/50">

            {/* Gradiente ambiente */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(184,115,51,0.12),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(95,178,216,0.08),_transparent_24%)]" />

            {/* Botão fechar */}
            <Button
              onClick={onClose}
              aria-label="Fechar modal"
              className="absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-ds-surface/80 text-xl text-ds-text/75 backdrop-blur transition hover:border-ds-accent/50 hover:text-ds-accent shadow-sm hover:shadow-copper/20"
            >
              ×
            </Button>

            <div className="relative flex flex-col">

              {/* ── TOPO: Galeria (Carrossel) ── */}
              <section className="relative w-full overflow-hidden bg-ds-surface">
                
                {/* Badge sobreposto */}
                <div className="absolute left-4 top-4 lg:left-8 lg:top-8 z-10">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-ds-accent/25 bg-ds-surface/80 backdrop-blur text-[11px] font-mono uppercase tracking-[.2em] text-ds-accent shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-ds-accent shadow-[0_0_10px_rgba(184,115,51,0.5)]"></span>
                    {project.categoria || 'Projeto selecionado'}
                  </div>
                </div>

                <div className="relative aspect-[16/9] lg:aspect-[21/9] w-full">
                  {/* Imagem ou placeholder */}
                  {!isLoading && currentImg ? (
                    <img
                      src={currentImg.imagem_url}
                      alt={`${project.titulo} – ${currentImageIndex + 1}`}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-ds-surface" />
                  )}

                  {/* Overlay escuro para legibilidade do texto e dos dots */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" />

                  {/* Spinner de carregamento */}
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-10 w-10 animate-spin rounded-full border-4 border-ds-accent border-t-transparent" />
                    </div>
                  )}

                  {/* Botões prev/next */}
                  {total > 1 && (
                    <div className="absolute left-6 top-1/2 flex -translate-y-1/2 gap-2 z-20">
                      <button
                        onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                        aria-label="Imagem anterior"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-ds-surface/80 text-xl text-ds-text backdrop-blur transition hover:bg-ds-accent hover:border-ds-accent shadow-sm hover:shadow-copper/30"
                      >
                        ‹
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                        aria-label="Próxima imagem"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-ds-surface/80 text-xl text-ds-text backdrop-blur transition hover:bg-ds-accent hover:border-ds-accent shadow-sm hover:shadow-copper/30"
                      >
                        ›
                      </button>
                    </div>
                  )}

                  {/* Dots (Paginação no rodapé do carrossel) */}
                  {total > 1 && (
                    <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full border border-white/10 bg-ds-surface/60 px-3 py-2 backdrop-blur shadow-sm z-20">
                      {galleryImages.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                          aria-label={`Ir para imagem ${idx + 1}`}
                          className={`h-1.5 rounded-full transition-all ${
                            idx === currentImageIndex
                              ? 'w-6 bg-ds-accent shadow-[0_0_8px_rgba(184,115,51,0.8)]'
                              : 'w-1.5 bg-cream/50 hover:bg-cream/90'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </section>

              {/* ── BASE: Informações ── */}
              <section className="flex flex-col p-6 lg:p-10 border-t border-white/5 bg-ds-surface">
                {/* Cabeçalho: título + seletor de idioma */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div>
                    <h1 className="text-[1.875rem] md:text-4xl font-medium tracking-tight text-ds-text">
                      {project.titulo}
                    </h1>
                    {formattedDate && (
                      <p className="mt-3 text-[10px] uppercase tracking-[0.22em] text-ds-muted font-mono">
                        {formattedDate}
                      </p>
                    )}
                  </div>

                  {/* Seletor de idioma */}
                  <div className="shrink-0 rounded-2xl border border-white/5 bg-ds-surface/50 px-4 py-3">
                    <p className="text-[10px] uppercase tracking-widest text-ds-muted font-mono text-center mb-2">Idioma</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setLanguage('pt')}
                        className={`inline-flex min-w-[84px] items-center justify-center rounded-full border px-5 py-2 text-sm font-bold uppercase leading-none tracking-[.14em] transition-colors ${
                          language === 'pt'
                            ? 'bg-ds-text text-ds-tech border-ds-tech'
                            : 'bg-ds-bg text-ds-text border-ds-border hover:border-ds-tech/40'
                        }`}
                      >
                        PT
                      </button>
                      <button
                        type="button"
                        onClick={() => setLanguage('en')}
                        className={`inline-flex min-w-[84px] items-center justify-center rounded-full border px-5 py-2 text-sm font-bold uppercase leading-none tracking-[.14em] transition-colors ${
                          language === 'en'
                            ? 'bg-ds-text text-ds-tech border-ds-tech'
                            : 'bg-ds-bg text-ds-text border-ds-border hover:border-ds-tech/40'
                        }`}
                      >
                        EN
                      </button>
                    </div>
                  </div>
                </div>

                {/* Grid principal da base (Meta + Descrição) */}
                <div className="mt-8 grid gap-8 lg:grid-cols-3">
                  
                  {/* Col 1: Meta infos (Cliente, Categoria, etc) */}
                  <div className="lg:col-span-1 space-y-4">
                    {meta.map(([label, value]) => (
                      <div
                        key={label}
                        className="rounded-2xl border border-white/5 bg-ds-surface/30 px-4 py-4"
                      >
                        <p className="text-[10px] uppercase tracking-widest font-mono text-ds-muted">{label}</p>
                        <p className="mt-2 text-sm font-medium text-ds-text">{value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Col 2 e 3: Descrição e Botões */}
                  <div className="lg:col-span-2 flex flex-col">
                    {description && (
                      <div
                        className="space-y-5 text-[15px] leading-8 text-ds-muted"
                        style={{ whiteSpace: 'pre-line' }}
                      >
                        {description}
                      </div>
                    )}
                    
                    {/* Rodapé com botões de ação */}
                    <div className="mt-10 flex flex-wrap gap-3">
                      {project.site_url && (
                        <a
                          href={project.site_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full border border-ds-accent/20 bg-ds-accent/5 px-6 py-3.5 text-xs font-bold tracking-[.15em] uppercase text-ds-accent transition hover:bg-ds-accent/10 hover:shadow-[0_0_15px_rgba(184,115,51,0.2)]"
                        >
                          {language === 'pt' ? 'Ver site' : 'Visit site'}
                        </a>
                      )}
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full bg-ds-accent px-6 py-3.5 text-xs font-bold tracking-[.15em] uppercase text-white shadow-sm transition hover:shadow-md hover:shadow-copper/30 hover:bg-ds-accent/90"
                        >
                          {project.button_text || (language === 'pt' ? 'Ver Projeto' : 'View Project')}
                        </a>
                      )}
                      {project.link2 && (
                        <a
                          href={project.link2}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full border border-white/10 bg-ds-surface px-6 py-3.5 text-xs font-bold tracking-[.15em] uppercase text-ds-text shadow-sm transition hover:shadow-md hover:bg-white/5"
                        >
                          {project.button_text2 || (language === 'pt' ? 'Ver mais' : 'See more')}
                        </a>
                      )}
                    </div>
                  </div>
                </div>

              </section>
            </div>
          </div>
        </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProjectModal;
