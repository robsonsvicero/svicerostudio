import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/formatDate';
import Button from '../UI/Button';
import ScrollReveal from '../UI/ScrollReveal';
import SectionHeader from '../UI/SectionHeader';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const BlogSection = ({ blogPosts }) => {
  return (
    <section id="blog" className="bg-ds-bg py-16 sm:py-24 px-4 sm:px-6 md:px-16 font-body">
      <div className="max-w-screen-xl mx-auto">
        <ScrollReveal direction="up" delay={0.1}>
          <SectionHeader
            badge="NEWS"
            title="Conteúdos sobre percepção, posicionamento e crescimento de marca"
            className="mb-12"
          />
        </ScrollReveal>

        <Swiper
          modules={[Pagination]}
          loop={true}
          spaceBetween={24}
          breakpoints={{
            1024: { slidesPerView: 3 }, // web
            768: { slidesPerView: 2 }, // tablet
            0: { slidesPerView: 1 }, // mobile
          }}
          pagination={{ clickable: true }}
          className="blog-swiper mb-12"
        >
          {[...blogPosts]
            .sort((a, b) => new Date(b.data_publicacao) - new Date(a.data_publicacao))
            .slice(0, 3)
            .map((post, idx) => (
              <SwiperSlide key={post.id}>
                <ScrollReveal direction="up" delay={0.1 + idx * 0.15} className="h-full">
                  <Link
                    to={`/blog/${post.slug}`}
                    className="mt-12 group rounded-3xl overflow-hidden bg-white/5 border border-black/5 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 shadow-sm flex flex-col h-full min-h-[360px] sm:min-h-[420px]"
                  >
                    {/* Imagem do artigo */}
                    {post.imagem_destaque && (
                      <div className="w-full aspect-video overflow-hidden bg-ds-surface">
                        <img
                          src={post.imagem_destaque}
                          alt={post.titulo}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                    )}
                    <div className="flex flex-col px-8 py-8">
                      <div className='flex flex-row gap-6 items-center justify-between'>
                      <span className="tinline-flex rounded-full border border-ds-accent/20 bg-ds-accent/5 px-3 py-1 text-ds-accent font-mono text-[10px] uppercase tracking-widest">
                        {post.categoria}
                      </span>

                      <span className="text-[10px] text-ds-accent font-mono uppercase tracking-widest">
                        {post.data_publicacao ? formatDate(post.data_publicacao) : ''}
                      </span>
                      </div>

                      <h3 className="text-xl font-medium text-ds-text/80 mt-3 leading-snug line-clamp-2">
                        {post.titulo}
                      </h3>
                      <div className="mt-6">
                        <span className="text-sm font-bold uppercase tracking-[.15em] text-ds-text/60 group-hover:text-ds-accent transition-colors">Ler mais →</span>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
      <div className="flex justify-center">
        <Button 
        href="/blog"
        variant='secondary'>Ver todos os artigos</Button>
      </div>
    </section>
  );
};

export default BlogSection;
