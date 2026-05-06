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
          loop: depoimentos.length > 3,
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

        <section id="triade" className="py-24 px-4 md:px-16 bg-dark-bg font-body">
          <div className="max-w-screen-xl mx-auto">
            <div className="container max-w-5xl text-left mb-16">
              <span className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-secondary/5 text-xs font-semibold text-secondary tracking-widest shadow-sm border border-secondary/30">
                <span className="w-2 h-2 -rotate-45 bg-secondary" />
                METODOLOGIA
              </span>
              <h2 className="reveal stagger-1 text-4xl md:text-5xl font-bold text-text-primary text-left">
                Como o Svicero Studio trabalha
              </h2>
              <p className="mt-4 text-low-medium text-left text-lg md:text-xl leading-relaxed">
                Começamos pelo seu{" "}
                <span className="font-bold">negócio</span>, passamos pela{" "}
                <span className="font-bold">estratégia de marca</span> e só então
                chegamos ao <span className="font-bold">design</span>. Nessa ordem,
                sempre.
              </p>
            </div>

            {/* Cards de serviço */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="flex flex-col items-center text-center">
                <span className="font-title text-[6rem] md:text-8xl font-normal text-secondary/30 leading-none mb-4">
                  01
                </span>
                <h3 className="text-g font-bold text-text-primary mt-4">
                  Diagnóstico de negócio
                </h3>
                <p className="text-low-medium mt-3 text-m leading-relaxed">
                  Antes de qualquer decisão visual, entendemos o seu negócio:
                  objetivos, público, concorrência e onde sua marca está perdendo
                  valor hoje.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <span className="font-title text-[6rem] md:text-8xl font-normal text-secondary/30 leading-none mb-4">
                  02
                </span>
                <h3 className="text-g font-bold text-text-primary mt-4">
                  Estratégia de posicionamento
                </h3>
                <p className="text-low-medium mt-3 text-m leading-relaxed">
                  Definimos como você deve ser percebido, que tipo de cliente quer
                  atrair e qual mensagem precisa ficar clara para justificar preços
                  mais altos.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <span className="font-title text-[6rem] md:text-8xl font-normal text-secondary/30 leading-none mb-4">
                  03
                </span>
                <h3 className="text-g font-bold text-text-primary mt-4">
                  Identidade e presença de marca
                </h3>
                <p className="text-low-medium mt-3 text-m leading-relaxed">
                  Com a estratégia definida, traduzimos tudo em identidade visual e
                  presença digital que comunicam seu posicionamento e apoiam suas
                  vendas.
                </p>
              </div>
            </div>

            {/* Card "Para quem é" */}
            <div className="bg-[#222] rounded-2xl p-8 md:p-12 mt-36 mb-8 max-w-3xl mx-auto flex flex-col items-center">
              <h2 className="font-title text-3xl md:text-4xl font-bold text-white mb-2 text-left w-full">
                Para quem é
              </h2>
              <div className="text-[#B2B8C6] text-base md:text-lg font-light mb-6 text-left w-full">
                Trabalhamos com negócios que já vendem ou estão chegando ao digital
                pela primeira vez — e que entendem que marca forte não é custo, é
                investimento.
              </div>

              <h3 className="font-title text-xl md:text-2xl font-semibold text-white mb-4 text-left w-full">
                Faz sentido conversar se:
              </h3>

              <ul className="text-[#B2B8C6] text-base md:text-lg font-light mb-8 w-full">
                <li className="flex items-start gap-2 mb-2">
                  <span className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center">
                    <Check size={12} className="text-secondary" />
                  </span>
                  Você entrega bem, mas sente que o valor percebido da sua marca não
                  acompanha o nível do que você entrega.
                </li>
                <li className="flex items-start gap-2 mb-2">
                  <span className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center">
                    <Check size={12} className="text-secondary" />
                  </span>
                  Clientes bons aparecem, mas ainda questionam o seu preço — e você
                  sente dificuldade de justificar o valor que cobra.
                </li>
                <li className="flex items-start gap-2 mb-2">
                  <span className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center">
                    <Check size={12} className="text-secondary" />
                  </span>
                  Sua comunicação parece genérica, parecida com a dos concorrentes,
                  sem um diferencial claro.
                </li>
                <li className="flex items-start gap-2 mb-2">
                  <span className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center">
                    <Check size={12} className="text-secondary" />
                  </span>
                  Você está chegando ao digital agora e quer construir sua presença
                  com posicionamento certo desde o início — sem retrabalho.
                </li>
                <li className="flex items-start gap-2 mb-2">
                  <span className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center">
                    <Check size={12} className="text-secondary" />
                  </span>
                  Você quer um parceiro que pense junto — não apenas alguém que
                  execute o que você pede.
                </li>
              </ul>

              <hr className="w-full border-t border-[#444] mb-6 mt-2" />

              <div className="text-[#B2B8C6] text-left w-full mb-6">
                Se você se viu em dois ou mais pontos, vale a pena a gente conversar.
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <Button href="/diagnostico" variant="secondary">
                  Agendar Diagnóstico
                </Button>
                <Button href="/processos" variant="outline">
                  Ver como trabalhamos
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Diagnostico Section */}
        <DiagnosticoSection />

        {/* Projetos Selecionados */}
        <ProjectsSection projects={projects} />

        <AboutSection />

        {depoimentos.length > 0 && (
          <section className="bg-primary py-24 px-4 md:px-16">
            <div className="max-w-screen-xl mx-auto">

              <div className="mb-12 text-left">
                <span className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-secondary/5 text-xs font-semibold text-secondary tracking-widest shadow-sm border border-secondary/30">
                  <span className="w-2 h-2 -rotate-45 bg-secondary inline-block" />
                  CLIENTES
                </span>
                <h2 className="font-title text-4xl md:text-5xl font-extrabold text-white mb-6">
                  O que diz quem passa pelo nosso processo
                </h2>
              </div>

              <div className="relative">
                <div className="swiper depoimentos-swiper" ref={swiperRef}>
                  <div className="swiper-wrapper">
                    {[...depoimentos]
                      .sort((a, b) => Number(a.ordem) - Number(b.ordem))
                      .map((depoimento) => (
                        <div key={depoimento.id} className="swiper-slide">
                          <div className="bg-white/5 rounded-2xl border border-secondary/20 p-8 flex flex-col h-full shadow-md">

                            {/* Estrelas */}
                            <div
                              className="mb-4"
                              role="img"
                              aria-label={`Avaliação: ${depoimento.estrelas || 5} de 5 estrelas`}
                            >
                              {Array.from({ length: 5 }).map((_, i) => (
                                <i
                                  key={i}
                                  className={`fa-solid fa-star text-secondary text-xl mr-1 ${i >= (depoimento.estrelas || 5) ? 'opacity-30' : ''
                                    }`}
                                />
                              ))}
                            </div>

                            {/* Texto do depoimento */}
                            <p className="text-[#B2B8C6] text-base font-normal leading-relaxed mb-6 italic flex-1">
                              "{depoimento.texto}"
                            </p>

                            {/* Autor */}
                            <div className="flex items-center gap-4 mt-auto">
                              <div className="w-12 h-12 flex-shrink-0 rounded-full bg-[#E5E5E5] flex items-center justify-center">
                                <span className="font-semibold text-lg text-secondary">
                                  {depoimento.iniciais || getNameInitials(depoimento.nome)}
                                </span>
                              </div>
                              <div>
                                <p className="text-white font-bold text-base">
                                  {depoimento.nome}
                                </p>
                                <p className="text-[#B2B8C6] text-sm font-normal">
                                  {depoimento.cargo}
                                  {depoimento.empresa ? `, ${depoimento.empresa}` : ''}
                                </p>
                              </div>
                            </div>

                          </div>
                        </div>
                      ))}
                  </div>

                  <div className="swiper-button-prev" />
                  <div className="swiper-button-next" />
                  <div className="swiper-pagination mt-12 flex justify-center" />
                </div>
              </div>

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