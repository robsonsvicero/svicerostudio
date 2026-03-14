import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/formatDate';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const BlogSection = ({ blogPosts }) => {
  return (
    <section id="blog" className="bg-dark-bg py-24 px-4 md:px-16">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <span className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-secondary/5 text-xs font-semibold text-secondary tracking-widest shadow-sm border border-secondary/30">
                <span className="w-2 h-2 rounded-full bg-secondary flex-shrink-0 inline-block"></span>
                BLOG
              </span>
            <h2 className="font-title text-4xl md:text-5xl font-extrabold text-white mb-4">Conteúdos para fortalecer sua marca</h2>
          </div>
          <div className="mt-4 md:mt-0">
            <a href="/blog" className="text-secondary text-base font-normal flex items-center gap-2 hover:text-white transition-colors">
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
                className="group rounded-2xl overflow-hidden bg-cream transition-all duration-300 hover:-translate-y-2 shadow-lg flex flex-col h-full min-h-[420px] max-h-[420px]"
              >
                {/* Imagem do artigo */}
                {post.imagem_destaque && (
                  <div className="w-full aspect-video overflow-hidden bg-[#E5E5E5]">
                    <img
                      src={post.imagem_destaque}
                      alt={post.titulo}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="flex flex-col px-6 py-6">
                  
                  <h3 className="font-title text-l font-semibold text-secondary mb-2 leading-snug">
                    {post.titulo}
                  </h3>
                  {post.resumo && (
                      <p className="text-low-light text-body text-sm mb-5 line-clamp-3 leading-relaxed">
                        {post.resumo}
                      </p>
                    )}
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
