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
import ClientsMarquee from '../components/Home/ClientsMarquee';
import ServicesSection from '../components/Home/ServicesSection';
import sviceroCta from '../images/Svicero_CTA.png';
import AboutSection from '../components/Home/AboutSection';
import FAQSection from '../components/Home/FAQSection';
import DepoimentosSection from '../components/DepoimentosSection';
import CTAFinal from '../components/CTAFinal';
import ScrollReveal from '../components/UI/ScrollReveal';

const Home = () => {
  const servicos = [
    {
      img: idvDesigner,
      alt: 'Card Designer',
      badge: { text: 'Branding & Identidade', className: 'designer text-[15px] font-medium text-[#FF9BAA] bg-[#FF9BAA]/20' },
      title: 'Arquitetura de marca para ampliar percepção de valor e desejo.',
      link: '/portfolio'
    },
    {
      img: uiDesigner,
      alt: 'Card UI designer',
      badge: { text: 'UI & UX', className: 'ui-ux text-[15px] font-medium text-[#7EC8E3] bg-[#7EC8E3]/20' },
      title: 'Experiências digitais que reduzem fricção e elevam conversão qualificada.',
      link: '/portfolio'
    },
    {
      img: developer,
      alt: 'Card Web Design',
      badge: { text: 'Web Design', className: 'developer text-[15px] font-medium text-[#6FCF97] bg-[#6FCF97]/20' },
      title: 'Infraestrutura web de alta performance para operações premium.',
      link: '/portfolio'
    },
  ];

  const [whatsappVisible, setWhatsappVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projects, setProjects] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const { showToast, toastMessage, toastType, hideToast, showToastMessage } = useToast();

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_URL}/api/db/projetos/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operation: 'select',
          orderBy: { column: 'ordem', ascending: true }, // Ordena por 'ordem' crescente
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

  const fetchBlogPosts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/db/posts/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operation: 'select',
          filters: [{ column: 'publicado', operator: 'eq', value: true }],
          orderBy: { data_publicacao: -1 }
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
      setFaqs(faqsData); // Estado guarda tudo, o componente recorta na hora
    } catch (error) {
      console.error("Failed to fetch FAQs:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchBlogPosts();
    fetchFaqs();
  }, []);

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
        title="Svicero Studio | Estratégia de Marca e Design para Sair da Guerra de Preços"
        description="Estúdio de estratégia de marca e design que ajuda empresas que já vendem a reposicionar a marca, justificar preços mais altos e atrair clientes melhores."
        canonical="https://svicerostudio.com.br"
      />
      <div className="bg-ds-bg text-ds-text min-h-screen font-body">
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

        {/* Triade Section */}
        <section id="triade" className="py-24 px-4 md:px-16 bg-ds-surface font-body border-t border-white/5">
          <div className="max-w-screen-xl mx-auto">

            {/* CABEÇALHO DA SEÇÃO */}
            <ScrollReveal direction="up" delay={0.1}>
              <div className="container max-w-5xl text-left mb-16">
                <span className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-ds-accent/25 bg-ds-accent/5 text-[11px] font-mono uppercase tracking-[.2em] text-ds-accent">
                  <span className="w-1.5 h-1.5 rounded-full bg-ds-accent" />
                  METODOLOGIA
                </span>
                <h2 className="text-4xl md:text-[3.75rem] font-medium tracking-[-0.02em] leading-[1.1] text-ds-text text-left">
                  Como o Svicero Studio trabalha
                </h2>
                <p className="mt-6 text-xl font-normal leading-[1.6] text-ds-muted text-left">
                  Começamos pelo seu <span className="font-semibold text-ds-text">modelo de negócios</span>, passamos pela <span className="font-semibold text-ds-text">estratégia de posicionamento</span> e só então chegamos ao <span className="font-semibold text-ds-text">design de grife</span>. Nessa ordem, sempre.
                </p>
              </div>
            </ScrollReveal>

            {/* OS 3 PILARES (GRID) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">

              {/* PILAR 01 */}
              <ScrollReveal direction="up" delay={0.1}>
                <div className="flex flex-col items-center text-center p-8 bg-[#f4f4f4]/10 backdrop-blur-xl border border-ds-border/50 rounded-3xl hover:shadow-xl hover:border-ds-border/50 transition-all duration-500 h-full">
                  <span className="text-5xl md:text-6xl text-ds-accent/30 mb-4 block">01</span>
                  <h3 className="text-[1.875rem] font-medium tracking-tight leading-[1.25] text-ds-text mt-2">
                    Diagnóstico de Percepção
                  </h3>
                  <p className="text-base font-normal leading-[1.6] text-ds-muted mt-4">
                    Antes de qualquer decisão visual, analisamos os pontos cegos da sua imagem atual: onde a sua comunicação está fazendo você perder lucros e atrair pacientes focados apenas em descontos.
                  </p>
                </div>
              </ScrollReveal>

              {/* PILAR 02 */}
              <ScrollReveal direction="up" delay={0.2}>
                <div className="flex flex-col items-center text-center p-8 bg-[#f4f4f4]/10 backdrop-blur-xl border border-ds-border/50 rounded-3xl hover:shadow-xl hover:border-ds-border/50 transition-all duration-500 h-full">
                  <span className="text-5xl md:text-6xl text-ds-accent/30 mb-4 block">02</span>
                  <h3 className="text-[1.875rem] font-medium tracking-tight leading-[1.25] text-ds-text mt-2">
                    Engenharia de Marca
                  </h3>
                  <p className="text-base font-normal leading-[1.6] text-ds-muted mt-4">
                    Definimos as regras de valor da sua clínica. Alinhamos os códigos visuais e verbais necessários para atrair o público particular premium e blindar a sua tabela de preços contra o mercado popular.
                  </p>
                </div>
              </ScrollReveal>

              {/* PILAR 03 */}
              <ScrollReveal direction="up" delay={0.3}>
                <div className="flex flex-col items-center text-center p-8 bg-[#f4f4f4]/10 backdrop-blur-xl border border-ds-border/50 rounded-3xl hover:shadow-xl hover:border-ds-border/50 transition-all duration-500 h-full">
                  <span className="text-5xl md:text-6xl text-ds-accent/30 mb-4 block">03</span>
                  <h3 className="text-[1.875rem] font-medium tracking-tight leading-[1.25] text-ds-text mt-2">
                    Presença Comercial Blindada
                  </h3>
                  <p className="text-base font-normal leading-[1.6] text-ds-muted mt-4">
                    Com a estratégia consolidada, criamos a sua nova identidade visual moderna e os materiais digitais de suporte que servem como ferramenta de fechamento para orçamentos de alto ticket.
                  </p>
                </div>
              </ScrollReveal>
            </div>

            {/* CARD "PARA QUEM É" */}
            <ScrollReveal direction="up" delay={0.2} duration={0.8}>
              <div className="bg-[#f4f4f4]/10 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 md:p-10 mt-32 mb-8 max-w-4xl mx-auto flex flex-col shadow-xl">
                <h2 className="text-[1.875rem] font-medium tracking-tight text-ds-text mb-3">
                  Para quem é
                </h2>
                <div className="text-xl font-normal leading-[1.6] text-ds-muted mb-10">
                  Trabalhamos exclusivamente com donos de clínicas odontológicas e ortodontistas que já possuem excelência clínica, mas entendem que um posicionamento fraco custa caro para o faturamento do negócio.
                </div>

                <h3 className="text-base font-semibold text-ds-text mb-6 uppercase tracking-wider">
                  Faz sentido conversarmos se:
                </h3>

                <ul className="text-base font-normal leading-[1.6] text-ds-muted mb-10 space-y-4">
                  <li className="flex items-start gap-4">
                    <span className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-ds-accent/10 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-ds-accent" />
                    </span>
                    Sua entrega técnica e infraestrutura são excelentes, mas a sua marca atual não reflete o nível e o rigor dos seus tratamentos.
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-ds-accent/10 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-ds-accent" />
                    </span>
                    Pacientes em potencial aparecem, mas costumam questionar seus preços ou comparar seu orçamento com clínicas populares da região.
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-ds-accent/10 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-ds-accent" />
                    </span>
                    A comunicação visual da sua clínica parece genérica ou dependente de templates prontos, sem um diferencial óbvio de autoridade.
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-ds-accent/10 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-ds-accent" />
                    </span>
                    Você deseja construir uma barreira estética de valor que pré-eduque o paciente particular sobre os seus preços antes mesmo de sentar na cadeira.
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-ds-accent/10 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-ds-accent" />
                    </span>
                    Você procura um parceiro estratégico que entenda de percepção de negócios, e não um mero executor de logotipos genéricos.
                  </li>
                </ul>

                <div className="border-t border-white/5 pt-8 mb-8 text-ds-muted">
                  Se você se identificou em dois ou mais pontos, a sua clínica está sofrendo com ruído de valor. Vale a pena conversarmos.
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <Button variant="primary" href="/formulario-interesse" className="w-full">
                    Agendar Diagnóstico
                  </Button>
                  <Button variant="outline" href="/processos" className="w-full">
                    Ver Casos de Estudo
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

        <DepoimentosSection />

        <BlogSection blogPosts={blogPosts} />

        <FAQSection faqs={faqs} endIndex={4} />

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