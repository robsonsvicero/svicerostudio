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
        className="fixed inset-0 z-50 overflow-y-auto bg-black/90"
        onClick={onClose}
      >
        {/* wrapper min-h-full garante que items-center funcione sem cortar o topo */}
        <div className="flex min-h-full items-start justify-center p-4 lg:items-center">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative my-4 w-full max-w-7xl font-body text-primary"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-2xl shadow-black/20">

            {/* Gradiente ambiente */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(184,115,51,0.12),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(95,178,216,0.08),_transparent_24%)]" />

            {/* Botão fechar */}
            <Button
              onClick={onClose}
              aria-label="Fechar modal"
              className="absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white/80 text-xl text-primary/75 backdrop-blur transition hover:border-copper/30 hover:text-copper shadow-sm"
            >
              ×
            </Button>

            <div className="relative grid lg:grid-cols-[1.2fr_0.8fr]">

              {/* ── ESQUERDA: Galeria ── */}
              <section className="border-b border-black/10 lg:border-b-0 lg:border-r lg:border-black/10">
                <div className="p-4 lg:p-5">

                  {/* Imagem principal */}
                  <div className="relative overflow-hidden rounded-[1.5rem] border border-black/10 bg-surface">
                    <div className="relative aspect-[16/10] w-full overflow-hidden">

                      {/* Imagem ou placeholder */}
                      {!isLoading && currentImg ? (
                        <img
                          src={currentImg.imagem_url}
                          alt={`${project.titulo} – ${currentImageIndex + 1}`}
                          className="absolute inset-0 h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-surface" />
                      )}

                      {/* Overlay escuro para legibilidade do texto */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />

                      {/* Spinner de carregamento */}
                      {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#B87333] border-t-transparent" />
                        </div>
                      )}
                    </div>

                    {/* Botões prev/next */}
                    {total > 1 && (
                      <>
                        <Button
                          onClick={handlePrevImage}
                          aria-label="Imagem anterior"
                          className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white/80 text-xl text-primary/75 backdrop-blur transition hover:border-copper hover:text-copper shadow-sm"
                        >
                          ‹
                        </Button>
                        <Button
                          onClick={handleNextImage}
                          aria-label="Próxima imagem"
                          className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white/80 text-xl text-primary/75 backdrop-blur transition hover:border-copper hover:text-copper shadow-sm"
                        >
                          ›
                        </Button>
                      </>
                    )}

                    {/* Dots */}
                    {total > 1 && (
                      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-full border border-black/10 bg-white/75 px-3 py-2 backdrop-blur shadow-sm">
                        {galleryImages.map((_, idx) => (
                          <Button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            aria-label={`Ir para imagem ${idx + 1}`}
                            className={`h-2 rounded-full transition-all ${
                              idx === currentImageIndex
                                ? 'w-8 bg-copper'
                                : 'w-2 bg-primary/30 hover:bg-primary/60'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Thumbnails */}
                  {total > 1 && (
                    <div className="mt-4 grid grid-cols-4 gap-3 lg:grid-cols-8">
                      {galleryImages.map((img, idx) => (
                        <Button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          aria-label={`Thumbnail ${idx + 1}`}
                          className={`overflow-hidden rounded-xl border transition ${
                            idx === currentImageIndex
                              ? 'border-copper shadow-md'
                              : 'border-black/5 hover:border-copper/50'
                          } bg-surface`}
                        >
                          <div className="aspect-[4/3] w-full overflow-hidden">
                            <img
                              src={img.imagem_url}
                              alt={`Thumbnail ${idx + 1}`}
                              className="h-full w-full object-cover opacity-80 transition hover:opacity-100"
                              loading="lazy"
                            />
                          </div>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </section>

              {/* ── DIREITA: Informações ── */}
              <aside className="flex flex-col">
                <div className="flex-1 overflow-y-auto p-6 lg:p-8">

                  {/* Cabeçalho: título + seletor de idioma */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-copper/25 bg-copper/5 text-[11px] font-mono uppercase tracking-[.2em] text-copper">
                        <span className="w-1.5 h-1.5 rounded-full bg-copper shadow-[0_0_10px_rgba(184,115,51,0.5)]"></span>
                        Projeto selecionado
                      </div>
                      <h1 className="mt-4 text-[1.875rem] md:text-4xl font-medium tracking-tight text-primary">
                        {project.titulo}
                      </h1>
                      {formattedDate && (
                        <p className="mt-3 text-[10px] uppercase tracking-[0.22em] text-muted font-mono">
                          {formattedDate}
                        </p>
                      )}
                    </div>

                    {/* Seletor de idioma */}
                    <div className="shrink-0 rounded-2xl border border-black/5 bg-surface px-4 py-3">
                      <p className="text-[10px] uppercase tracking-widest text-muted font-mono text-center mb-2">Idioma</p>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setLanguage('pt')}
                          className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest transition ${
                            language === 'pt'
                              ? 'bg-copper text-white'
                              : 'border border-black/10 text-dim hover:text-primary'
                          }`}
                        >
                          PT
                        </Button>
                        <Button
                          onClick={() => setLanguage('en')}
                          className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest transition ${
                            language === 'en'
                              ? 'bg-copper text-white'
                              : 'border border-black/10 text-dim hover:text-primary'
                          }`}
                        >
                          EN
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Meta grid (cliente, ano, categoria) */}
                  {meta.length > 0 && (
                    <div className="mt-8 grid gap-3 sm:grid-cols-2">
                      {meta.map(([label, value]) => (
                        <div
                          key={label}
                          className="rounded-2xl border border-black/5 bg-surface px-4 py-4"
                        >
                          <p className="text-[10px] uppercase tracking-widest font-mono text-muted">{label}</p>
                          <p className="mt-2 text-sm font-medium text-primary">{value}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Descrição / storytelling */}
                  {description && (
                    <div className="mt-8 space-y-5 text-[15px] leading-8 text-dim">
                      {description.split(/\n\n+/).map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </div>
                  )}
                </div>

                {/* Rodapé com botões de ação */}
                <div className="border-t border-black/5 bg-surface/60 p-6 backdrop-blur lg:p-8">
                  <div className="flex flex-wrap gap-3">
                    {project.site_url && (
                      <a
                        href={project.site_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border border-copper/20 bg-copper/5 px-6 py-3.5 text-xs font-bold tracking-[.15em] uppercase text-copper transition hover:bg-copper/10"
                      >
                        {language === 'pt' ? 'Ver site' : 'Visit site'}
                      </a>
                    )}
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full bg-copper px-6 py-3.5 text-xs font-bold tracking-[.15em] uppercase text-white shadow-sm transition hover:shadow-md hover:bg-copper/90"
                      >
                        {language === 'pt' ? 'Ver no Behance' : 'View on Behance'}
                      </a>
                    )}
                    {project.link2 && (
                      <a
                        href={project.link2}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border border-black/10 bg-white px-6 py-3.5 text-xs font-bold tracking-[.15em] uppercase text-primary shadow-sm transition hover:shadow-md hover:bg-surface"
                      >
                        {project.button_text2 || 'Ver mais'}
                      </a>
                    )}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProjectModal;
