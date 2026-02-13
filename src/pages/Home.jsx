import React, { useEffect, useState, useRef } from 'react';
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import { supabase } from '../lib/supabase';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import Button from '../components/UI/Button';
import ProjectModal from '../components/ProjectModal';
import SEOHelmet from '../components/SEOHelmet';
import Toast from '../components/UI/Toast';
import { useToast } from '../hooks/useToast';
import { useBlogPosts, useDepoimentos } from '../hooks/useSupabaseData';
import { formatDate } from '../utils/formatDate';

import idvDesigner from '../images/idv-deigner.webp';
import uiDesigner from '../images/ui-designer.webp';
import developer from '../images/developer.webp';

import aboutPhoto from '../images/aboutphoto.png';
import sviceroCta from '../images/Svicero_CTA.png';


const Home = () => {
  // Dados dos serviços principais
  const servicos = [
    {
      img: idvDesigner,
      alt: 'Card Designer',
      badge: { text: 'Branding & Identidade', className: 'designer text-[15px] font-medium text-[#800020] bg-[#F8CDC6]' },
      title: 'Construção de ativos que geram reconhecimento e desejo.',
      link: '/servico-identidade-visual'
    },
    {
      img: uiDesigner,
      alt: 'Card UI designer',
      badge: { text: 'UI & UX', className: 'ui-ux text-[15px] font-medium text-[#094C7E] bg-[#EAF4F6]' },
      title: 'Experiências fluidas que removem as barreiras entre você e seu cliente.',
      link: '/servico-ui-design'
    },
    {
      img: developer,
      alt: 'Card Web Design',
      badge: { text: 'Web Design', className: 'developer text-[15px] font-medium text-[#205C20] bg-[#D6F8D6]' },
      title: 'Sites de alta performance com design minimalista.',
      link: '/servico-front-end'
    },
  ];
  
  const [whatsappVisible, setWhatsappVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  
  // Usar hooks personalizados
  const { showToast, toastMessage, toastType, showToastMessage, hideToast } = useToast();
  const { data: blogPosts = [] } = useBlogPosts(3);
  const { data: depoimentos = [] } = useDepoimentos();

  useEffect(() => {
    const handleScroll = () => {
      setWhatsappVisible(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Inicializar Swiper - separado em useEffect próprio
  const swipersRef = useRef([]);
  const [swipersInitialized, setSwipersInitialized] = useState(false);

  useEffect(() => {
    // Aguarda depoimentos carregarem antes de inicializar Swiper
    if (depoimentos.length === 0) return;

    // Destruir swipers anteriores
    swipersRef.current.forEach(swiper => {
      if (swiper && swiper.destroy) {
        try { swiper.destroy(true, true); } catch (e) { /* ignora */ }
      }
    });
    swipersRef.current = [];

    const timeoutId = setTimeout(() => {
      const depoimentosSwiper = document.querySelector('.depoimentos-swiper');
      if (depoimentosSwiper) {
        const depoimentosSwiperInstance = new Swiper('.depoimentos-swiper', {
          slidesPerView: 1,
          spaceBetween: 24,
          loop: true,
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
            640: {
              slidesPerView: 1,
              spaceBetween: 24
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 32
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 32
            }
          }
        });
        swipersRef.current.push(depoimentosSwiperInstance);
        setSwipersInitialized(true);
      } else {
        console.error('Elemento .depoimentos-swiper não encontrado');
      }
    }, 200);
    
    return () => {
      clearTimeout(timeoutId);
      swipersRef.current.forEach(swiper => {
        if (swiper && swiper.destroy && typeof swiper.destroy === 'function') {
          try { swiper.destroy(true, true); } catch (e) { /* ignora */ }
        }
      });
    };
  }, [depoimentos.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.target;
    const formData = new FormData(form);

    try {
      const response = await fetch('https://formspree.io/f/xdkegzaw', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
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

  // Buscar projetos do Supabase (últimos 5 marcados para exibir na home)
  useEffect(() => {
    const fetchProjetos = async () => {
      try {
        const { data, error } = await supabase
          .from('projetos')
          .select('*')
          .eq('mostrar_home', true)
          .order('data_projeto', { ascending: false })
          .limit(6);

        if (error) throw error;

        // Mapear dados do banco para o formato esperado (incluindo novos campos para modal)
        const projetosFormatados = data.map(projeto => ({
          id: projeto.id,
          image: projeto.imagem_url,
          title: projeto.titulo,
          description: projeto.descricao,
          descricao_longa: projeto.descricao_longa,
          descricao_longa_en: projeto.descricao_longa_en,
          site_url: projeto.site_url,
          link: projeto.link,
          buttonText: projeto.button_text,
          link2: projeto.link2,
          buttonText2: projeto.button_text2,
          data_projeto: projeto.data_projeto
        }));

        setProjects(projetosFormatados);
      } catch (error) {
        // Erro ao buscar projetos - usando fallback
        setProjects([]);
      }
    };

    fetchProjetos();
  }, []);

  const handleOpenProject = (project) => {
    setSelectedProject(project);
    setIsProjectModalOpen(true);
  };

  const handleCloseProject = () => {
    setIsProjectModalOpen(false);
    setTimeout(() => setSelectedProject(null), 200);
  };

  // Função para obter a classe de cor do avatar
  const getAvatarColorClass = (cor) => {
    const cores = {
      orange: 'bg-orange-500/20 text-orange-500',
      gold: 'bg-amber-500/20 text-amber-500',
      blue: 'bg-blue-600/20 text-blue-600',
      silver: 'bg-gray-400/20 text-gray-400',
      // Cores legadas para compatibilidade
      primary: 'bg-orange-500/20 text-orange-500',
      secondary: 'bg-amber-500/20 text-amber-500',
      accent: 'bg-blue-600/20 text-blue-600',
    };
    return cores[cor] || cores.orange;
  };

  return (
    <>
      <SEOHelmet 
        title="Engenharia Visual & Design Estratégico"
        description="Svicero Studio: Projetamos a infraestrutura visual e a engenharia de percepção que sustentam o faturamento de marcas de elite. Consultoria estratégica de design focada em maturidade e performance."
        keywords="Design Estratégico para High-Ticket, Engenharia Visual, Consultoria de Branding de Luxo, Posicionamento de Marcas de Elite, UI/UX para Marcas Premium, Svicero Studio"
      />
      <div className="bg-cream min-h-screen">
        <Header />

        {/* Botão flutuante WhatsApp */}
        <a
          href="https://wa.me/5511964932007"
          target="_blank"
          rel="noopener noreferrer"
          className={`fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 bg-green-500 text-white rounded-full shadow-lg transition-opacity duration-300 ${whatsappVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          aria-label="Fale pelo WhatsApp"
        >
          <i className="fa-brands fa-whatsapp text-3xl"></i>
        </a>

        {/* Hero Section */}
        <section id="inicio" className="w-full min-h-[72vh] flex items-center justify-center text-center px-4 md:px-8 pt-32 pb-20 bg-bg-primary border-b border-text-primary/10">
          <div className="flex flex-col items-center justify-center w-full max-w-5xl">
            <h1 className="font-serif font-semibold text-text-primary text-4xl md:text-5xl lg:text-6xl tracking-tight mb-8">Engenharia de Percepção para Marcas de Elite.</h1>
            <p className="font-sans text-text-primary/80 text-lg md:text-xl font-normal mb-10 max-w-4xl leading-relaxed">Projetamos a infraestrutura visual e a estratégia de experiência que sustentam a autoridade e o faturamento de marcas que exigem maturidade digital.</p>
            <Button
              href="/diagnostico"
              variant="secondary"
            >Falar com um Estrategista</Button>
          </div>
        </section>

        {/* Tríade Integrada */}
        <section id="triade" className="bg-cream py-24 px-4 md:px-16">
          <div className="max-w-screen-xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-title text-4xl md:text-5xl font-light text-low-dark mb-4">A Tríade Integrada: Simplicidade que posiciona.</h2>

              <p className="font-sans text-xl text-low-medium max-w-3xl mx-auto leading-relaxed">
                Eliminamos o abismo entre estratégia e execução. Oferecemos uma solução completa que conecta a força da sua marca à performance tecnológica.
              </p>
            </div>

            <div className="flex flex-col md:flex-row md:justify-center md:items-stretch gap-8 md:gap-10 mb-12">
              {/* Identidade Visual */}
              <div className="bg-white rounded-2xl p-6 md:p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300 border-t-4 border-primary flex-1 flex flex-col justify-between md:max-w-[400px] w-full mx-auto">
                <div className="h-full flex flex-col">
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                      <i className="fa-solid fa-palette text-4xl text-primary"></i>
                    </div>
                  </div>
                  <h3 className="font-title text-2xl font-light text-center text-low-dark mb-4">Branding & Identidade</h3>
                  <p className="text-lg text-low-medium text-center leading-relaxed mb-4 break-words">
                    A fundação da sua autoridade. Criamos a base estratégica e visual que posiciona sua marca no mercado, garantindo que ela seja percebida como líder desde o primeiro contato.
                  </p>
                </div>
                <div className="text-center mt-auto">
                  <span className="inline-block text-sm font-medium text-primary bg-primary/10 px-4 py-2 rounded-full">
                    O que somos
                  </span>
                </div>
              </div>

              {/* Seta conectora (oculta em mobile) */}
              <div className="hidden md:flex items-center justify-center">
                <i className="fa-solid fa-arrow-right text-4xl text-primary/40"></i>
              </div>

              {/* UX/UI Design */}
              <div className="bg-white rounded-2xl p-6 md:p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300 border-t-4 border-primary flex-1 flex flex-col justify-between md:max-w-[400px] w-full mx-auto">
                <div className="h-full flex flex-col">
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                      <i className="fa-solid fa-pen-ruler text-4xl text-primary"></i>
                    </div>
                  </div>
                  <h3 className="font-title text-2xl font-light text-center text-low-dark mb-4">UX/UI Design</h3>
                  <p className="text-lg text-low-medium text-center leading-relaxed mb-4 break-words">
                    Onde a estética encontra a conversão. Projetamos interfaces intuitivas que guiam o olhar do seu cliente, transformando a navegação em uma jornada de confiança e desejo de compra.
                  </p>
                </div>
                <div className="text-center mt-auto">
                  <span className="inline-block text-sm font-medium text-primary bg-primary/10 px-4 py-2 rounded-full">
                    Como pensamos
                  </span>
                </div>
              </div>

              {/* Seta conectora (oculta em mobile) */}
              <div className="hidden md:flex items-center justify-center">
                <i className="fa-solid fa-arrow-right text-4xl text-primary/40"></i>
              </div>

              {/* Front-end */}
              <div className="bg-white rounded-2xl p-6 md:p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300 border-t-4 border-primary flex-1 flex flex-col justify-between md:max-w-[400px] w-full mx-auto">
                <div className="h-full flex flex-col">
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                      <i className="fa-solid fa-code text-4xl text-primary"></i>
                    </div>
                  </div>
                  <h3 className="font-title text-2xl font-light text-center text-low-dark mb-4">Desenvolvimento Front-end</h3>
                  <p className="text-lg text-low-medium text-center leading-relaxed mb-4 break-words">
                    Fidelidade técnica e performance. Entregamos plataformas rápidas, responsivas e visualmente impecáveis, garantindo que a tecnologia trabalhe a favor do seu faturamento.
                  </p>
                </div>
                <div className="text-center mt-auto">
                  <span className="inline-block text-sm font-medium text-primary bg-primary/10 px-4 py-2 rounded-full">
                    Como entregamos
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center pt-8">
              <Button
                href="/diagnostico"
                variant="secondary"
                className="inline-block mt-8"
              >
                Falar com um Estrategista
              </Button>
              <p className="font-sans text-lg text-low-medium max-w-2xl mx-auto leading-relaxed mt-8">
                Analisamos o seu posicionamento atual e identificamos as oportunidades de crescimento para o seu negócio.
              </p>
            </div>
          </div>
        </section>

        {/* Projetos Selecionados / Works */}
        <section id="projetos" className="bg-bg-primary py-24 px-4 md:px-16 border-y border-text-primary/10">
          <div className="max-w-screen-xl mx-auto">
            <div className="mb-12 text-center">
              <h2 className="font-title text-4xl md:text-5xl font-light text-text-primary mb-4">Projetos Selecionados</h2>
              <p className="text-text-primary/70 text-lg">Casos entregues com foco em resultado e estética.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.slice(0, 6).map((project, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleOpenProject(project)}
                  className="text-left rounded-2xl border border-text-primary/10 bg-white p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-copper/60"
                >
                  <div className="w-full aspect-[16/10] rounded-xl overflow-hidden bg-footer-bg">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-4">
                    <h3 className="font-title text-xl text-text-primary mb-2">{project.title}</h3>
                    <p className="text-sm text-low-medium leading-relaxed line-clamp-3">
                      {project.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <ProjectModal
          isOpen={isProjectModalOpen}
          onClose={handleCloseProject}
          project={selectedProject}
        />

        {/* Principais Serviços / Expertise */}
        <section id="servicos" className="bg-cream py-24 px-4 md:px-16">
          <div className="max-w-screen-xl mx-auto">
            <div className="mb-12 text-center">
              <h2 className="font-title text-4xl md:text-5xl font-light text-low-dark mb-4">Principais Serviços</h2>
              <p className="font-sans text-lg text-low-medium max-w-2xl mx-auto leading-relaxed">
                Soluções completas em design e desenvolvimento web para fortalecer sua presença digital
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {servicos.map((servico, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow-md border border-cream/20 p-6 transition-all duration-300 hover:shadow-xl">
                  <div className="flex flex-col h-full">
                    <div className="w-full aspect-[16/9] overflow-hidden rounded-xl mb-4">
                      <img 
                        src={servico.img} 
                        alt={servico.alt} 
                        className="w-full h-full object-cover" 
                        loading="lazy" 
                      />
                    </div>
                    <span className={"inline-block w-fit px-4 py-2 mb-4 rounded-full text-sm font-medium " + (servico.badge.className || "")}>
                      {servico.badge.text}
                    </span>
                    <div className="flex-1">
                      <p className="text-base text-low-dark leading-relaxed mb-4">{servico.title}</p>
                    </div>
                    <a 
                      href={servico.link} 
                      className="mt-auto inline-block px-6 py-2 rounded-full border border-low-medium/30 text-low-dark bg-cream hover:bg-low-light transition-all duration-200 text-sm font-medium"
                    >
                      Saiba mais...
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sobre / About */}
        <section id="sobre" className="bg-footer-bg py-24 px-4 md:px-16 border-y border-text-primary/10">
          <div className="max-w-screen-xl mx-auto">
            <div className="mb-12 text-center">
              <h2 className="font-title text-4xl md:text-5xl font-light text-text-primary mb-4">A mente por trás da estratégia</h2>

            </div>
            <div className="flex flex-col lg:flex-row-reverse gap-12 items-center mb-8">
              <div className="w-full lg:w-2/5 flex justify-center mb-8 lg:mb-0">
                <img src={aboutPhoto} alt="Robson Svicero - Fundador do Svicero Studio" className="w-full h-auto rounded-2xl shadow-lg" loading="lazy" />
              </div>
              <div className="w-full lg:w-3/5 text-text-primary">
                <div className="text-about">
                  <p className="text-lg leading-relaxed mb-6">Eu sou Robson Svicero, e não acredito em design como decoração. No Svicero Studio, minha missão é eliminar o abismo entre a excelência do seu serviço e a forma como o mercado o percebe.</p>
                  <p className="text-lg leading-relaxed mb-6">Com uma trajetória que integra o rigor do Design Gráfico, a precisão do UX e a robustez da Tecnologia, desenvolvi uma visão sistêmica que a maioria das agências ignora. Eu não entrego apenas layouts; eu construo ativos digitais de alta performance que servem como o alicerce para a escala de negócios que buscam o público premium.</p>
                  <p className="text-lg leading-relaxed mb-6">Minha atuação se baseia na Tríade:</p>
                  <ul className="list-disc list-inside mb-6 text-lg leading-relaxed">
                    <li className="mb-2"><strong>Estratégia:</strong> Onde definimos seu domínio de mercado.</li>
                    <li className="mb-2"><strong>Design:</strong> Onde construímos sua percepção de autoridade.</li>
                    <li className="mb-2"><strong>Tecnologia:</strong> Onde garantimos que sua estrutura seja rápida, fluida e impecável.</li>
                  </ul>
                  <p className="text-lg leading-relaxed mb-6">Quando não estou redesenhando o posicionamento de nossos parceiros, foco no que realmente importa: a construção de um legado para minha família e a busca constante por referências que transcendem o digital.</p>
                  <br />
                  <p className="text-xl leading-relaxed mb-6 font-semibold italic">Não estamos aqui para fazer "mais um site". Estamos aqui para posicionar sua marca onde ela merece estar.</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-8">
              <Button
                href="/diagnostico"
                variant="secondary"
                className="inline-block mt-8"
              >Falar com um Estrategista
              </Button>
            </div>
          </div>
        </section>

        {/* Depoimentos */}
        {depoimentos.length > 0 && (
          <section className="bg-cream py-24 px-4 md:px-16">
            <div className="max-w-screen-xl mx-auto">
              <div className="mb-12 text-center">
                <h2 className="font-title text-4xl md:text-5xl font-light text-low-dark mb-4">Depoimentos</h2>
                <p className="text-lg text-low-dark/80 font-light max-w-2xl mx-auto leading-relaxed">
                  Palavras de quem valoriza a excelência
                </p>
              </div>
              <div className="swiper depoimentos-swiper pb-16 relative">
                <ul className="swiper-wrapper">
                  {depoimentos.map((depoimento) => (
                    <li key={depoimento.id} className="swiper-slide">
                      <div className="bg-white rounded-2xl p-8 border border-text-primary/10 h-full flex flex-col">
                        <p className="text-text-primary/90 text-base leading-relaxed mb-6 italic flex-1">"{depoimento.texto}"</p>
                        <div className="flex items-center gap-4 mt-auto">
                          <div className={`w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center ${getAvatarColorClass(depoimento.cor_avatar)}`}>
                            <span className="font-semibold text-lg">{depoimento.iniciais || depoimento.nome?.substring(0, 2).toUpperCase()}</span>
                          </div>
                          <div>
                            <p className="text-text-primary font-medium">{depoimento.nome}</p>
                            <p className="text-text-primary/60 text-sm">{depoimento.cargo}{depoimento.empresa ? `, ${depoimento.empresa}` : ''}</p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="swiper-pagination mt-8"></div>
                <div className="swiper-button-prev"></div>
                <div className="swiper-button-next"></div>
              </div>
            </div>
          </section>
        )}


        {/* Blog - Últimas Publicações */}
        <section className="bg-bg-primary py-24 px-4 md:px-16">
          <div className="max-w-screen-xl mx-auto">
            <div className="mb-16 text-center">
              <h2 className="font-title text-4xl md:text-5xl font-light text-text-primary mb-4">Crônicas de Design</h2>

              <p className="text-lg text-text-primary/80 font-light max-w-2xl mx-auto leading-relaxed">
                Insights, tutoriais e reflexões sobre design e desenvolvimento
              </p>
            </div>

            {blogPosts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  {blogPosts.map((post) => {
                    return (
                      <a
                        key={post.id}
                        href={`/blog/${post.slug}`}
                        className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-cream/20"
                      >
                        {post.imagem_destaque && (
                          <div className="aspect-video overflow-hidden bg-cream">
                            <img
                              src={post.imagem_destaque}
                              alt={post.titulo}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <div className="p-6">
                          {post.categoria && (
                            <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-3">
                              {post.categoria}
                            </span>
                          )}
                          <h3 className="font-title text-xl font-light text-low-dark mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {post.titulo}
                          </h3>
                          {post.resumo && (
                            <p className="text-low-medium text-sm mb-3 line-clamp-2 leading-relaxed">
                              {post.resumo}
                            </p>
                          )}
                          <span className="text-sm text-low-medium flex items-center gap-2">
                            <i className="fa-regular fa-calendar"></i>
                            {formatDate(post.data_publicacao)}
                          </span>
                        </div>
                      </a>
                    );
                  })}
                </div>

                <div className="text-center">
                  <Button
                    href="/blog"
                    variant="secondary"
                    icon={<i className="fa-solid fa-arrow-right"></i>}
                    className="px-8 py-4 text-lg"
                  >
                    Ver Todos os Posts
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <i className="fa-regular fa-newspaper text-5xl text-low-light mb-4"></i>
                <p className="text-lg text-low-medium">Em breve novos conteúdos por aqui!</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Final */}
        <section className="w-full bg-secondary overflow-hidden">
          <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-stretch">
            {/* Imagem - aparece primeiro em mobile */}
            <div className="w-full md:w-1/2 order-1 md:order-2">
              <img
                src={sviceroCta}
                alt="Svicero Studio CTA"
                className="w-full h-64 md:h-full object-cover rounded-bl-[60px] rounded-tr-[60px]"
              />
            </div>
            {/* Texto - aparece segundo em mobile */}
            <div className="w-full md:w-1/2 order-2 md:order-1 flex flex-col items-center md:items-start max-w-screen-xl mx-auto justify-center text-cream text-center md:text-left py-12 md:py-20 px-4 md:px-16">
              <h2 className="font-title text-4xl md:text-5xl font-light text-cream mb-4">Pronto para o próximo nível?</h2>
              <p className="text-lg md:text-xl mb-8 text-cream/75">Deixe a complexidade para trás. Vamos construir o posicionamento que o seu negócio merece.</p>
              <Button
                href="/diagnostico"
                variant="custom"
                className="border-2 border-cream text-cream hover:text-secondary transition-colors inline-block mt-8"
              >Falar com um Estrategista
              </Button>
            </div>
          </div>
        </section>


        <Footer />





        {/* Toast Notification */}
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
