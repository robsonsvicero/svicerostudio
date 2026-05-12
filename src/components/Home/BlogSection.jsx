import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/formatDate';
import Button from '../UI/Button';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const BlogSection = ({ blogPosts }) => {
  return (
    <section id="blog" className="bg-charcoal py-16 sm:py-24 px-4 sm:px-6 md:px-16 font-body">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <span className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-copper/25 bg-copper/5 text-[11px] font-mono uppercase tracking-[.2em] text-copper">
              <span className="w-1.5 h-1.5 rounded-full bg-copper shadow-[0_0_10px_rgba(184,115,51,0.5)]"></span>
              BLOG
            </span>
            <h2 className="text-4xl md:text-[3.75rem] font-medium tracking-[-0.02em] leading-[1.1] text-cream text-left mb-6">
              Conteúdos para fortalecer sua marca</h2>
          </div>
          <div className="mt-4 md:mt-0">
            <a href="/blog" className="text-copper text-sm uppercase tracking-widest font-bold flex items-center gap-2 hover:text-copper/80 transition-colors">
              Ver todos os artigos
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
            </a>
            
          </div>
        </div>

        <Swiper
          modules={[Pagination]}
          loop={true}
          spaceBetween={24}
          breakpoints={{
            1024: { slidesPerView: 3 }, // web
            768: { slidesPerView: 2 }, // tablet
            0:   { slidesPerView: 1 }, // mobile
          }}
          pagination={{ clickable: true }}
          className="blog-swiper mb-12"
        >
          {[...blogPosts]
            .sort((a, b) => new Date(b.data_publicacao) - new Date(a.data_publicacao))
            .slice(0, 3)
            .map((post, idx) => (
            <SwiperSlide key={post.id}>
              <Link
                to={`/blog/${post.slug}`}
                className="group rounded-3xl overflow-hidden bg-white border border-black/5 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 shadow-sm flex flex-col h-full min-h-[360px] sm:min-h-[420px]"
              >
                {/* Imagem do artigo */}
                {post.imagem_destaque && (
                  <div className="w-full aspect-video overflow-hidden bg-surface">
                    <img
                      src={post.imagem_destaque}
                      alt={post.titulo}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                )}
                <div className="flex flex-col px-8 py-8">
                  <span className="text-[10px] text-copper font-mono uppercase tracking-widest">
                    {post.categoria}
                  </span>
                  <h3 className="text-xl font-medium text-primary mt-3 leading-snug line-clamp-2">
                    {post.titulo}
                  </h3>
                  <div className="mt-6">
                    <span className="text-sm font-bold uppercase tracking-[.15em] text-primary group-hover:text-copper transition-colors">Ler mais →</span>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default BlogSection;
