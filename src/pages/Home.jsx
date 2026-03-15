import BlogSection from '../components/Home/BlogSection';
import ProjectsSection from '../components/Home/ProjectsSection';
import React, { useEffect, useState, useRef } from 'react';
import Swiper from 'swiper/bundle';
import { Pagination } from 'swiper/modules';
Swiper.use([Pagination]);
import 'swiper/css/bundle';
import 'swiper/css/pagination';
import Header from '../components/Layout/Header';
import Preloader from '../components/Preloader';
import Footer from '../components/Layout/Footer';
import Button from '../components/UI/Button';
import SEOHelmet from '../components/SEOHelmet';
import Toast from '../components/UI/Toast';
import { useToast } from '../hooks/useToast';
import { API_URL } from '../lib/api.js';

import idvDesigner from '../images/idv-deigner.webp';
import uiDesigner from '../images/ui-designer.webp';
import developer from '../images/developer.webp';

import HeroSection from '../components/Home/HeroSection';
import ServicesSection from '../components/Home/ServicesSection';
import sviceroCta from '../images/Svicero_CTA.png';
import AboutSection from '../components/Home/AboutSection';


const Home = () => {
  const servicos = [
    {
      img: idvDesigner,
      alt: 'Card Designer',
      badge: { text: 'Branding & Identidade', className: 'designer text-[15px] font-medium text-[#FF9BAA] bg-[#FF9BAA]/20' },
      title: 'Arquitetura de marca para ampliar percepção de valor e desejo.',
      link: '/servico-identidade-visual'
    },
    {
      img: uiDesigner,
      alt: 'Card UI designer',
      badge: { text: 'UI & UX', className: 'ui-ux text-[15px] font-medium text-[#7EC8E3] bg-[#7EC8E3]/20' },
      title: 'Experiências digitais que reduzem fricção e elevam conversão qualificada.',
      link: '/servico-ui-design'
    },
    {
      img: developer,
      alt: 'Card Web Design',
      badge: { text: 'Web Design', className: 'developer text-[15px] font-medium text-[#6FCF97] bg-[#6FCF97]/20' },
      title: 'Infraestrutura web de alta performance para operações premium.',
      link: '/servico-front-end'
    },
  ];

  const [whatsappVisible, setWhatsappVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projects, setProjects] = useState([]);
  const [depoimentos, setDepoimentos] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const { showToast, toastMessage, toastType, hideToast, showToastMessage } = useToast();

  const swipersRef = useRef([]);
  const [swipersInitialized, setSwipersInitialized] = useState(false);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_URL}/api/db/projetos/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operation: 'select',
          orderBy: { column: 'created_at', ascending: false },
          limit: 4
        })
      });
      const payload = await res.json();
      setProjects(payload.data || []);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  };

  const fetchDepoimentos = async () => {
    try {
      const res = await fetch(`${API_URL}/api/db/depoimentos/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation: 'select', orderBy: { column: 'ordem', ascending: true } })
      });
      const payload = await res.json();
      setDepoimentos(payload.data || []);
    } catch (error) {
      console.error("Failed to fetch testimonials:", error);
    }
  };

  const fetchBlogPosts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/db/posts/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operation: 'select',
          filters: [{ column: 'publicado', operator: 'eq', value: true }],
          limit: 3,
          orderBy: { column: 'data_publicacao', ascending: false }
        })
      });
      const payload = await res.json();
      setBlogPosts(payload.data || []);
    } catch (error) {
      console.error("Failed to fetch blog posts:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchDepoimentos();
    fetchBlogPosts();
  }, []);

  useEffect(() => {
    if (depoimentos.length === 0) return;

    const timeoutId = setTimeout(() => {
      const depoimentosSwiper = document.querySelector('.depoimentos-swiper');
      if (depoimentosSwiper) {
        const depoimentosSwiperInstance = new Swiper('.depoimentos-swiper', {
          loop: true,
          slidesPerView: 1,
          spaceBetween: 24,
          grabCursor: true,
          centeredSlides: false,
          watchOverflow: true,
          watchSlidesProgress: true,
          observer: true,
          observeParents: true,
          slidesPerGroup: 1,
          resistanceRatio: 0.85,
          slidesOffsetBefore: 0,
          slidesOffsetAfter: 0,
          pagination: {
            el: '.depoimentos-swiper .swiper-pagination',
            clickable: true,
            dynamicBullets: true,
          },
          navigation: {
            nextEl: '.depoimentos-swiper .swiper-button-next',
            prevEl: '.depoimentos-swiper .swiper-button-prev',
          },
          breakpoints: {
            640: { slidesPerView: 1, spaceBetween: 24 },
            768: { slidesPerView: 2, spaceBetween: 32 },
            1024: { slidesPerView: 3, spaceBetween: 32 }
          }
        });
        swipersRef.current.push(depoimentosSwiperInstance);
        setSwipersInitialized(true);
      }
    }, 200);

    return () => {
      clearTimeout(timeoutId);
      swipersRef.current.forEach(swiper => {
        if (swiper && swiper.destroy && typeof swiper.destroy === 'function') {
          try { swiper.destroy(true, true); } catch (e) { }
        }
      });
      swipersRef.current = [];
    };
  }, [depoimentos]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = e.target;
    const formData = new FormData(form);
    try {
      const response = await fetch('https://formspree.io/f/xdkegzaw', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        showToastMessage('Mensagem enviada com sucesso! Entrarei em contato em breve.', 'success', 5000);
        form.reset();
      } else {
        showToastMessage('Erro ao enviar mensagem. Tente novamente.', 'error', 5000);
      }
    } catch (error) {
      showToastMessage('Erro ao enviar mensagem. Verifique sua conexão.', 'error', 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAvatarColorClass = (cor) => {
    const cores = {
      orange: 'bg-orange-500/20 text-orange-500',
      gold: 'bg-amber-500/20 text-amber-500',
      blue: 'bg-blue-600/20 text-blue-600',
      silver: 'bg-gray-400/20 text-gray-400',
      primary: 'bg-orange-500/20 text-orange-500',
      secondary: 'bg-amber-500/20 text-amber-500',
      accent: 'bg-blue-600/20 text-blue-600',
    };
    return cores[cor] || cores.orange;
  };

  return (
    <>
      <Preloader />
      <SEOHelmet
        title="Engenharia Visual & Design Estratégico"
        description="Projete a infraestrutura visual que sustenta o faturamento de marcas de elite. Conheça a Engenharia de Percepção do Svicero Studio. Design e estratégia de alto padrão."
        keywords="Design Estratégico para High-Ticket, Engenharia Visual, Consultoria de Branding de Luxo, Posicionamento de Marcas de Elite, UI/UX para Marcas Premium, Svicero Studio"
      />
      <div className="bg-dark-bg min-h-screen">
        <Header />

        <a
          href="https://wa.me/5511964932007"
          target="_blank"
          rel="noopener noreferrer"
          className={`fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 bg-green-500 text-white rounded-full shadow-lg transition-opacity duration-300 ${whatsappVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          aria-label="Falar com um Estrategista no WhatsApp"
        >
          <i className="fa-brands fa-whatsapp text-3xl"></i>
        </a>

        <HeroSection />

        <section id="triade" className="py-24 px-4 md:px-16 bg-dark-bg">
          <div className="max-w-screen-xl mx-auto">
            <div className="text-left mb-16">
              <span className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-secondary/5 text-xs font-semibold text-secondary tracking-widest shadow-sm border border-secondary/30">
                <span className="w-2 h-2 rounded-full bg-secondary inline-block"></span>
                METODOLOGIA
              </span>
              <h2 className="font-title text-4xl md:text-5xl font-extrabold text-white mb-6">O que o Svicero Studio faz por você</h2>
              <p className="font-sans text-lg md:text-xl text-[#B2B8C6] max-w-3xl leading-relaxed">
                Unimos <span className='font-semibold'>estratégia de marca</span>, <span className='font-semibold'>design</span> e <span className='font-semibold'>tecnologia</span> para tirar sua marca da cara de amadora e dar base para você se posicionar com mais segurança.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 mb-8">
              <div className="flex flex-col items-center text-center">
                <span className="font-title text-7xl md:text-8xl font-extrabold text-secondary/40 leading-none mb-3">01</span>
                <h3 className="font-title text-2xl font-bold text-white mb-4">Estratégia de marca</h3>
                <p className="text-[#B2B8C6] leading-relaxed max-w-xs">
                  Definimos como você quer ser visto, quem quer atrair e o espaço que quer ocupar no mercado. Isso guia todas as decisões de design e site.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <span className="font-title text-7xl md:text-8xl font-extrabold text-secondary/40 leading-none mb-3">02</span>
                <h3 className="font-title text-2xl font-bold text-white mb-4">Identidade visual</h3>
                <p className="text-[#B2B8C6] leading-relaxed max-w-xs">
                  Criamos uma identidade visual completa que tira a cara de amador e passa o nível de profissionalismo que você já entrega.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <span className="font-title text-7xl md:text-8xl font-extrabold text-secondary/40 leading-none mb-3">03</span>
                <h3 className="font-title text-2xl font-bold text-white mb-4">Presença digital</h3>
                <p className="text-[#B2B8C6] leading-relaxed max-w-xs">
                  Construímos um site e materiais digitais que facilitam o contato e ajudam a transformar visitas em clientes.
                </p>
              </div>
            </div>

            <div className="bg-[#222] rounded-2xl p-8 md:p-12 mt-36 mb-8 max-w-3xl mx-auto flex flex-col items-center">
              <h2 className="font-title text-3xl md:text-4xl font-extrabold text-white mb-2 text-left w-full">Para quem é</h2>
              <div className="text-[#B2B8C6] text-base md:text-lg font-light mb-6 text-left w-full">Especialmente para psicopedagogas, personal trainers e pequenos negócios que prestam serviços.</div>
              <h3 className="font-title text-xl md:text-2xl font-bold text-white mb-4 text-left w-full">É para você se:</h3>
              <ul className="text-[#B2B8C6] text-base md:text-lg font-light mb-8 w-full">
                <li className="flex items-start gap-2 mb-2"><span className="text-white text-lg mt-1">✓</span>Você atende bem, mas sente que sua imagem não acompanha o nível do seu trabalho.</li>
                <li className="flex items-start gap-2 mb-2"><span className="text-white text-lg mt-1">✓</span>Tem vergonha de indicar seu site ou perfil quando alguém pede "o link para te conhecer melhor".</li>
                <li className="flex items-start gap-2 mb-2"><span className="text-white text-lg mt-1">✓</span>Quer cobrar melhor pelos seus serviços, mas sente que a aparência da sua marca ainda puxa para baixo.</li>
                <li className="flex items-start gap-2 mb-2"><span className="text-white text-lg mt-1">✓</span>Se perde tentando fazer "arte" no Canva e sente que cada peça parece de um lugar diferente.</li>
                <li className="flex items-start gap-2 mb-2"><span className="text-white text-lg mt-1">✓</span>Quer um processo organizado, sem precisar entender de design ou tecnologia.</li>
                <li className="flex items-start gap-2 mb-2"><span className="text-white text-lg mt-1">✓</span>Você for, especialmente, MEI, autônomo ou negócios locais.</li>
              </ul>
              <hr className="w-full border-t border-[#444] mb-6 mt-2" />
              <div className="text-[#B2B8C6] text-left w-full mb-6">Se você se viu em 2 ou mais pontos, vale a pena conversar com o estúdio.</div>
              <div className="flex flex-col md:flex-row gap-4">
                <Button href="/formulario-interesse" variant="secondary">
                  Quero falar sobre minha marca
                </Button>
                <Button href="/processos" variant="outline">
                  Ver como trabalhamos
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Projetos Selecionados */}
        <ProjectsSection projects={projects} />

        <AboutSection />

        {depoimentos.length > 0 && (
          <section className="bg-primary py-24 px-4 md:px-16">
            <div className="max-w-screen-xl mx-auto">
              <div className="mb-12 text-left">
                <span className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-secondary/5 text-xs font-semibold text-secondary tracking-widest shadow-sm border border-secondary/30">
                  <span className="w-2 h-2 rounded-full bg-secondary inline-block"></span>
                  FEEDBACK
                </span>
                <h2 className="font-title text-4xl md:text-5xl font-extrabold text-white mb-6">O que diz quem passa pelo nosso processo</h2>
              </div>
              <div className="relative">
                <div className="swiper depoimentos-swiper">
                  <div className="swiper-wrapper">
                    {[...depoimentos].sort((a, b) => Number(a.ordem) - Number(b.ordem)).map((depoimento) => (
                      <div key={depoimento.id} className="swiper-slide">
                        <div className="bg-white/5 rounded-2xl border border-secondary700 p-8 flex flex-col h-full shadow-md">
                          <div className="mb-4">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <i key={i} className={`fa-solid fa-star text-secondary text-xl mr-1 ${i >= (depoimento.estrelas || 5) ? 'opacity-30' : ''}`}></i>
                            ))}
                          </div>
                          <p className="text-[#B2B8C6] text-base font-normal leading-relaxed mb-6 italic flex-1">"{depoimento.texto}"</p>
                          <div className="flex items-center gap-4 mt-auto">
                            <div className="w-12 h-12 flex-shrink-0 rounded-full bg-[#E5E5E5] flex items-center justify-center">
                              <span className="font-semibold text-lg text-secondary700">{depoimento.iniciais || depoimento.nome?.substring(0, 2).toUpperCase()}</span>
                            </div>
                            <div>
                              <p className="text-white font-bold text-base">{depoimento.nome}</p>
                              <p className="text-[#B2B8C6] text-sm font-normal">{depoimento.cargo}{depoimento.empresa ? `, ${depoimento.empresa}` : ''}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="swiper-button-prev"></div>
                  <div className="swiper-button-next"></div>
                  <div className="swiper-pagination mt-12 flex justify-center"></div>
                </div>
              </div>
            </div>
          </section>
        )}

        <BlogSection blogPosts={blogPosts} />

        <section className="w-full bg-dark-bg pb-24 px-4 flex justify-center items-center min-h-[420px]">
          <div className="max-w-screen-xl w-full mx-auto bg-gradient-to-br from-secondary via-secondary to-secondary700 rounded-[48px] shadow-xl flex flex-col items-center justify-center px-8 py-16">
            <h2 className="font-title text-4xl md:text-5xl font-extrabold text-white text-center mb-6">Pronto para dar o próximo passo com sua marca?</h2>
            <p className="text-lg md:text-xl text-white/80 font-light text-center mb-10">Se você sente que já passou da hora da sua marca acompanhar o nível do seu trabalho, o próximo passo é simples. Conte um pouco sobre seu momento para que o Svicero Studio possa te orientar com clareza.</p>
            <div className="flex flex-col md:flex-row gap-6 mt-2">
              <Button href="/formulario-interesse" variant="primary" className="transition-colors">
                Preencher formulário de interesse
              </Button>
              <Button href="https://wa.me/5511964932007" target="_blank" rel="noopener noreferrer" variant="outline" className="transition-colors">
                Falar pelo WhatsApp
              </Button>
            </div>
          </div>
        </section>

        <Footer />

        <Toast
          show={showToast}
          message={toastMessage}
          type={toastType}
          onClose={hideToast}
        />
      </div>
    </>
  );
};

export default Home;