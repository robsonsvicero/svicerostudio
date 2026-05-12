import { Check } from "lucide-react";
import BlogSection from '../components/Home/BlogSection';
import ProjectsSection from '../components/Home/ProjectsSection';
import React, { useEffect, useState, useRef } from 'react';
import Swiper from 'swiper/bundle';
import { Pagination } from 'swiper/modules';
import 'swiper/css/bundle';
import 'swiper/css/pagination';
import Header from '../components/Layout/Header';
import Preloader from '../components/Preloader';
import Footer from '../components/Layout/Footer';
import Button from '../components/UI/Button.jsx';
import SEOHelmet from '../components/SEOHelmet';
import Toast from '../components/UI/Toast';
import { useToast } from '../hooks/useToast';
import { API_URL } from '../lib/api.js';
import { getNameInitials } from '../utils/placeholders';

import idvDesigner from '../images/idv-deigner.webp';
import uiDesigner from '../images/ui-designer.webp';
import developer from '../images/developer.webp';
import DiagnosticoSection from '../components/Home/DiagnosticoSection'; 

import HeroSection from '../components/Home/HeroSection';
import ServicesSection from '../components/Home/ServicesSection';
import sviceroCta from '../images/Svicero_CTA.png';
import AboutSection from '../components/Home/AboutSection';
import FAQSection from '../components/Home/FAQSection';
import CTAFinal from '../components/CTAFinal';
import ScrollReveal from '../components/UI/ScrollReveal';

const Home = () => {
  const servicos = [
    {
      img: idvDesigner,
      alt: 'Card Designer',
      badge: { text: 'Branding & Identidade', className: 'designer text-[15px] font-medium text-[#FF9BAA] bg-[#FF9BAA]/20' },
      title: 'Arquitetura de marca para ampliar percepção de valor e desejo.',
      link: '/planos-pacotes'
    },
    {
      img: uiDesigner,
      alt: 'Card UI designer',
      badge: { text: 'UI & UX', className: 'ui-ux text-[15px] font-medium text-[#7EC8E3] bg-[#7EC8E3]/20' },
      title: 'Experiências digitais que reduzem fricção e elevam conversão qualificada.',
      link: '/planos-pacotes'
    },
    {
      img: developer,
      alt: 'Card Web Design',
      badge: { text: 'Web Design', className: 'developer text-[15px] font-medium text-[#6FCF97] bg-[#6FCF97]/20' },
      title: 'Infraestrutura web de alta performance para operações premium.',
      link: '/planos-pacotes'
    },
  ];

  const [whatsappVisible, setWhatsappVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projects, setProjects] = useState([]);
  const [depoimentos, setDepoimentos] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const { showToast, toastMessage, toastType, hideToast, showToastMessage } = useToast();

  const swipersRef = useRef([]);
  const swiperRef = useRef(null);
  const [swipersInitialized, setSwipersInitialized] = useState(false);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_URL}/api/db/projetos/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operation: 'select',
          orderBy: { column: 'data_projeto', ascending: false }, // Ordena por 'data_projeto' em ordem decrescente
          filters: [{ column: 'mostrar_home', operator: 'eq', value: true }], // <--- FILTRO CORRIGIDO para 'mostrar_home'
          limit: 4 // Mantém o limite de 4 projetos, se for para a Home ou seção destacada
        })
      });

      // É uma boa prática verificar se a resposta da API foi bem-sucedida (status 2xx)
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Erro HTTP: ${res.status}`);
      }

      const payload = await res.json();
      setProjects(payload.data || []);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      // Você pode adicionar um estado para exibir o erro na UI, se desejar
      // setError(error.message);
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

  const fetchFaqs = async () => {
    try {
      const res = await fetch(`${API_URL}/api/faq`);
      const data = await res.json();
      let faqsData = Array.isArray(data) ? data : [];
      faqsData = faqsData.sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));
      setFaqs(faqsData.slice(0, 4)); // Pega apenas os 4 primeiros
    } catch (error) {
      console.error("Failed to fetch FAQs:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchDepoimentos();
    fetchBlogPosts();
    fetchFaqs();
  }, []);

  useEffect(() => {
    if (depoimentos.length === 0) return;

    const timeoutId = setTimeout(() => {
      if (swiperRef.current) {
        const depoimentosSwiperInstance = new Swiper(swiperRef.current, {
          loop: true,
          slidesPerView: 'auto',
          spaceBetween: 32,
          grabCursor: true,
          centeredSlides: false,
          watchOverflow: true,
          watchSlidesProgress: true,
          observer: true,
          observeParents: true,
          autoplay: {
            delay: 0,
            disableOnInteraction: false,
          },
          freeMode: {
            enabled: true,
            momentum: false,
          },
          speed: 8000,
          allowTouchMove: true,
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
      <div className="bg-charcoal text-cream min-h-screen font-body">
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

        <section id="triade" className="py-24 px-4 md:px-16 bg-surface font-body border-t border-white/5">
          <div className="max-w-screen-xl mx-auto">
            <ScrollReveal direction="up" delay={0.1}>
              <div className="container max-w-5xl text-left mb-16">
                <span className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-copper/25 bg-copper/5 text-[11px] font-mono uppercase tracking-[.2em] text-copper">
                  <span className="w-1.5 h-1.5 rounded-full bg-copper" />
                  METODOLOGIA
                </span>
                <h2 className="text-4xl md:text-[3.75rem] font-medium tracking-[-0.02em] leading-[1.1] text-cream text-left">
                  Como o Svicero Studio trabalha
                </h2>
                <p className="mt-6 text-xl font-normal leading-[1.6] text-muted text-left">
                  Começamos pelo seu <span className="font-semibold text-cream">negócio</span>, passamos pela <span className="font-semibold text-cream">estratégia de marca</span> e só então chegamos ao <span className="font-semibold text-cream">design</span>. Nessa ordem, sempre.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <ScrollReveal direction="up" delay={0.1}>
                <div className="flex flex-col items-center text-center p-8 bg-[#f4f4f4]/10 backdrop-blur-xl border border-white/5 rounded-3xl hover:shadow-xl hover:border-white/10 transition-all duration-500 h-full">
                  <span className="font-mono text-5xl md:text-6xl text-copper/30 mb-4 block">01</span>
                  <h3 className="text-[1.875rem] font-medium tracking-tight leading-[1.25] text-cream mt-2">
                    Diagnóstico de negócio
                  </h3>
                  <p className="text-base font-normal leading-[1.6] text-muted mt-4">
                    Antes de qualquer decisão visual, entendemos o seu negócio: objetivos, público, concorrência e onde sua marca está perdendo valor hoje.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.2}>
                <div className="flex flex-col items-center text-center p-8 bg-[#f4f4f4]/10 backdrop-blur-xl border border-white/5 rounded-3xl hover:shadow-xl hover:border-white/10 transition-all duration-500 h-full">
                  <span className="font-mono text-5xl md:text-6xl text-copper/30 mb-4 block">02</span>
                  <h3 className="text-[1.875rem] font-medium tracking-tight leading-[1.25] text-cream mt-2">
                    Estratégia de posicionamento
                  </h3>
                  <p className="text-base font-normal leading-[1.6] text-muted mt-4">
                    Definimos como você deve ser percebido, que tipo de cliente quer atrair e qual mensagem precisa ficar clara para justificar preços mais altos.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.3}>
                <div className="flex flex-col items-center text-center p-8 bg-[#f4f4f4]/10 backdrop-blur-xl border border-white/5 rounded-3xl hover:shadow-xl hover:border-white/10 transition-all duration-500 h-full">
                  <span className="font-mono text-5xl md:text-6xl text-copper/30 mb-4 block">03</span>
                  <h3 className="text-[1.875rem] font-medium tracking-tight leading-[1.25] text-cream mt-2">
                    Identidade e presença de marca
                  </h3>
                  <p className="text-base font-normal leading-[1.6] text-muted mt-4">
                  Com a estratégia definida, traduzimos tudo em identidade visual e presença digital que comunicam seu posicionamento e apoiam suas vendas.
                </p>
                </div>
              </ScrollReveal>
            </div>

            {/* Card "Para quem é" */}
            <ScrollReveal direction="up" delay={0.2} duration={0.8}>
              <div className="bg-[#f4f4f4]/10 backdrop-blur-xl border border-white/5 rounded-[2rem] p-10 md:p-16 mt-32 mb-8 max-w-4xl mx-auto flex flex-col shadow-xl">
                <h2 className="text-[1.875rem] font-medium tracking-tight text-cream mb-3">
                  Para quem é
                </h2>
                <div className="text-xl font-normal leading-[1.6] text-muted mb-10">
                  Trabalhamos com negócios que já vendem ou estão chegando ao digital
                  pela primeira vez — e que entendem que marca forte não é custo, é investimento.
                </div>

              <h3 className="text-base font-semibold text-cream mb-6 uppercase tracking-wider">
                Faz sentido conversar se:
              </h3>

              <ul className="text-base font-normal leading-[1.6] text-muted mb-10 space-y-4">
                <li className="flex items-start gap-4">
                  <span className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-copper/10 flex items-center justify-center">
                    <Check size={14} className="text-copper" />
                  </span>
                  Você entrega bem, mas sente que o valor percebido da sua marca não acompanha o nível do que você entrega.
                </li>
                <li className="flex items-start gap-4">
                  <span className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-copper/10 flex items-center justify-center">
                    <Check size={14} className="text-copper" />
                  </span>
                  Clientes bons aparecem, mas ainda questionam o seu preço — e você sente dificuldade de justificar o valor que cobra.
                </li>
                <li className="flex items-start gap-4">
                  <span className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-copper/10 flex items-center justify-center">
                    <Check size={14} className="text-copper" />
                  </span>
                  Sua comunicação parece genérica, parecida com a dos concorrentes, sem um diferencial claro.
                </li>
                <li className="flex items-start gap-4">
                  <span className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-copper/10 flex items-center justify-center">
                    <Check size={14} className="text-copper" />
                  </span>
                  Você está chegando ao digital agora e quer construir sua presença com posicionamento certo desde o início — sem retrabalho.
                </li>
                <li className="flex items-start gap-4">
                  <span className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-copper/10 flex items-center justify-center">
                    <Check size={14} className="text-copper" />
                  </span>
                  Você quer um parceiro que pense junto — não apenas alguém que execute o que você pede.
                </li>
              </ul>

              <div className="border-t border-white/5 pt-8 mb-8 text-muted">
                Se você se viu em dois ou mais pontos, vale a pena a gente conversar.
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <Button variant="primary" href="/formulario-interesse" className="w-full" >
                  Agendar Diagnóstico
                </Button>
                <Button variant="outline" href="/processos" className="w-full" >
                  Ver como trabalhamos
                </Button>
              </div>
            </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Diagnostico Section */}
        <DiagnosticoSection />

        {/* Projetos Selecionados */}
        <ProjectsSection projects={projects} />

        <AboutSection />

        {/* Depoimentos Section */}
        {depoimentos.length > 0 && (
          <section className="bg-surface py-24 px-4 md:px-16 border-t border-white/5">
            <div className="max-w-screen-xl mx-auto">
              <ScrollReveal direction="up" delay={0.1}>
                <div className="mb-12 text-center md:text-left flex flex-col items-center md:items-start">
                  <span className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-copper/25 bg-copper/5 text-[11px] font-mono uppercase tracking-[.2em] text-copper">
                    <span className="w-1.5 h-1.5 rounded-full bg-copper shadow-[0_0_10px_rgba(184,115,51,0.5)]"></span>
                    CLIENTES
                  </span>
                  <h2 className="text-4xl md:text-[3.75rem] font-medium tracking-[-0.02em] leading-[1.1] text-cream text-left">
                    O que diz quem passa pelo nosso processo
                  </h2>
                </div>
              </ScrollReveal>
                     <ScrollReveal direction="up" delay={0.2} duration={0.8}>
                <div className="relative group">
                  {/* Edges Fade Effect */}
                  <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-surface to-transparent z-10 pointer-events-none hidden md:block" />
                  <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-surface to-transparent z-10 pointer-events-none hidden md:block" />
                  
                  <div className="swiper depoimentos-swiper" ref={swiperRef}>
                    <div className="swiper-wrapper">
                      {[...depoimentos]
                        .sort((a, b) => Number(a.ordem) - Number(b.ordem))
                        .map((depoimento) => (
                          <div key={depoimento.id} className="swiper-slide h-full">
                            <div className="bg-[#141414]/60 backdrop-blur-xl rounded-[2rem] border border-white/5 p-8 md:p-10 flex flex-col h-full shadow-lg hover:shadow-2xl hover:border-copper/20 transition-all duration-500 group/card relative overflow-hidden">
                              {/* Efeito de brilho no hover */}
                              <div className="absolute inset-0 bg-gradient-to-br from-copper/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
                              
                              {/* Aspas decorativas */}
                              <div className="absolute top-6 right-8 text-copper/10 text-7xl font-serif select-none">
                                "
                              </div>

                              {/* Estrelas */}
                              <div
                                className="mb-6 flex gap-1"
                                role="img"
                                aria-label={`Avaliação: ${depoimento.estrelas || 5} de 5 estrelas`}
                              >
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <i
                                    key={i}
                                    className={`fa-solid fa-star text-copper text-sm ${i >= (depoimento.estrelas || 5) ? 'opacity-20' : ''
                                      }`}
                                  />
                                ))}
                              </div>

                              {/* Texto do depoimento */}
                              <p className="text-muted text-lg font-normal leading-[1.7] mb-10 italic flex-1 relative z-10">
                                "{depoimento.texto}"
                              </p>

                              {/* Autor */}
                              <div className="flex items-center gap-4 mt-auto pt-8 border-t border-white/5 relative z-10">
                                <div className="w-14 h-14 flex-shrink-0 rounded-full bg-copper/10 border border-copper/20 flex items-center justify-center overflow-hidden">
                                  {depoimento.avatar_url ? (
                                    <img src={depoimento.avatar_url} alt={depoimento.nome} className="w-full h-full object-cover" />
                                  ) : (
                                    <span className="font-semibold text-xl text-copper">
                                      {depoimento.iniciais || getNameInitials(depoimento.nome)}
                                    </span>
                                  )}
                                </div>
                                <div>
                                  <p className="text-cream font-medium text-lg tracking-tight">
                                    {depoimento.nome}
                                  </p>
                                  <p className="text-muted/60 font-mono text-[10px] uppercase tracking-[0.15em] mt-1">
                                    {depoimento.cargo}
                                    {depoimento.empresa ? <span className="text-copper/50 ml-1">@{depoimento.empresa}</span> : ''}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>

                    <div className="swiper-pagination !hidden" />
                  </div>
                </div>
              </ScrollReveal>

            </div>
          </section>
        )}

        <BlogSection blogPosts={blogPosts} />

        <FAQSection faqs={faqs} />

        {/* CTA Final */}
        <CTAFinal />

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