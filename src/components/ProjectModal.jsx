import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '../lib/api.js';

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
          className="relative my-4 w-full max-w-7xl font-sans text-[#EFEFEF]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative overflow-hidden rounded-[34px] border border-white/[0.08] bg-[#181818] shadow-2xl shadow-black/40">

            {/* Gradiente ambiente */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(184,115,51,0.12),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(95,178,216,0.08),_transparent_24%)]" />

            {/* Botão fechar */}
            <button
              onClick={onClose}
              aria-label="Fechar modal"
              className="absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-dark-bg/80 text-xl text-white/75 backdrop-blur transition hover:border-[#B87333]/30 hover:text-white"
            >
              ×
            </button>

            <div className="relative grid lg:grid-cols-[1.2fr_0.8fr]">

              {/* ── ESQUERDA: Galeria ── */}
              <section className="border-b border-white/[0.08] lg:border-b-0 lg:border-r lg:border-white/[0.08]">
                <div className="p-4 lg:p-5">

                  {/* Imagem principal */}
                  <div className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0D0D0D]">
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
                        <div className="absolute inset-0 bg-[linear-gradient(135deg,#2F353B_0%,#171F2A_45%,#844219_140%)]" />
                      )}

                      {/* Overlay escuro para legibilidade do texto */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

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
                        <button
                          onClick={handlePrevImage}
                          aria-label="Imagem anterior"
                          className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-dark-bg/80 text-xl text-white/75 backdrop-blur transition hover:border-[#B87333]/30 hover:text-white"
                        >
                          ‹
                        </button>
                        <button
                          onClick={handleNextImage}
                          aria-label="Próxima imagem"
                          className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-dark-bg/80 text-xl text-white/75 backdrop-blur transition hover:border-[#B87333]/30 hover:text-white"
                        >
                          ›
                        </button>
                      </>
                    )}

                    {/* Dots */}
                    {total > 1 && (
                      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-full border border-white/10 bg-dark-bg/75 px-3 py-2 backdrop-blur">
                        {galleryImages.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            aria-label={`Ir para imagem ${idx + 1}`}
                            className={`h-2 rounded-full transition-all ${
                              idx === currentImageIndex
                                ? 'w-8 bg-[#B87333]'
                                : 'w-2 bg-white/30 hover:bg-white/60'
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
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          aria-label={`Thumbnail ${idx + 1}`}
                          className={`overflow-hidden rounded-2xl border transition ${
                            idx === currentImageIndex
                              ? 'border-[#B87333]/60'
                              : 'border-white/[0.08] hover:border-white/20'
                          } bg-[#0D0D0D]`}
                        >
                          <div className="aspect-[4/3] w-full overflow-hidden">
                            <img
                              src={img.imagem_url}
                              alt={`Thumbnail ${idx + 1}`}
                              className="h-full w-full object-cover opacity-80 transition hover:opacity-100"
                              loading="lazy"
                            />
                          </div>
                        </button>
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
                      <div className="inline-flex items-center rounded-full border border-[#B87333]/20 bg-[#B87333]/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[#E9BF84]">
                        Projeto selecionado
                      </div>
                      <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-white lg:text-5xl">
                        {project.titulo}
                      </h1>
                      {formattedDate && (
                        <p className="mt-3 text-sm uppercase tracking-[0.22em] text-white/40">
                          {formattedDate}
                        </p>
                      )}
                    </div>

                    {/* Seletor de idioma */}
                    <div className="shrink-0 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-white/35">Idioma</p>
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => setLanguage('pt')}
                          className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                            language === 'pt'
                              ? 'bg-[#B87333] text-[#141414]'
                              : 'border border-white/10 text-white/65 hover:text-white'
                          }`}
                        >
                          PT
                        </button>
                        <button
                          onClick={() => setLanguage('en')}
                          className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                            language === 'en'
                              ? 'bg-[#B87333] text-[#141414]'
                              : 'border border-white/10 text-white/65 hover:text-white'
                          }`}
                        >
                          EN
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Meta grid (cliente, ano, categoria) */}
                  {meta.length > 0 && (
                    <div className="mt-8 grid gap-3 sm:grid-cols-2">
                      {meta.map(([label, value]) => (
                        <div
                          key={label}
                          className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-4"
                        >
                          <p className="text-[11px] uppercase tracking-[0.18em] text-white/35">{label}</p>
                          <p className="mt-2 text-sm font-medium text-white/90">{value}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Descrição / storytelling */}
                  {description && (
                    <div className="mt-8 space-y-5 text-[15px] leading-8 text-white/70">
                      {description.split(/\n\n+/).map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </div>
                  )}
                </div>

                {/* Rodapé com botões de ação */}
                <div className="border-t border-white/[0.08] bg-dark-bg/60 p-6 backdrop-blur lg:p-8">
                  <div className="flex flex-wrap gap-3">
                    {project.site_url && (
                      <a
                        href={project.site_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-2xl border border-[#B87333]/20 bg-[#B87333]/10 px-5 py-3 text-sm font-medium text-[#F8F7F2] transition hover:bg-[#B87333]/20"
                      >
                        {language === 'pt' ? 'Ver site' : 'Visit site'}
                      </a>
                    )}
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-2xl bg-[#B87333] px-5 py-3 text-sm font-semibold text-[#141414] transition hover:brightness-110"
                      >
                        {language === 'pt' ? 'Ver no Behance' : 'View on Behance'}
                      </a>
                    )}
                    {project.link2 && (
                      <a
                        href={project.link2}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white/80 transition hover:bg-white/[0.08]"
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
