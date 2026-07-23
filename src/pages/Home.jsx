import React, { useEffect, useState } from 'react';
import BlogSection from '../components/Home/BlogSection';
import ProjectsSection from '../components/Home/ProjectsSection';
import Header from '../components/Layout/Header';
import Preloader from '../components/Preloader';
import Footer from '../components/Layout/Footer';
import SEOHelmet from '../components/SEOHelmet';
import Toast from '../components/UI/Toast';
import { useToast } from '../hooks/useToast';
import { API_URL } from '../lib/api.js';
import HeroSection from '../components/Home/HeroSection';
import DiagnosisOverviewSection from '../components/Home/DiagnosisOverviewSection';
import AboutSection from '../components/Home/AboutSection';
import AudienceSection from '../components/Home/AudienceSection';
import ServicesSection from '../components/Home/ServicesSection';
import FAQSection from '../components/Home/FAQSection';
import DepoimentosSection from '../components/DepoimentosSection';
import CTAFinal from '../components/CTAFinal';

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const { showToast, toastMessage, toastType, hideToast } = useToast();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${API_URL}/api/db/projetos/query`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            operation: 'select',
            orderBy: { column: 'ordem', ascending: true },
            filters: [{ column: 'mostrar_home', operator: 'eq', value: true }],
            limit: 4,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || `Erro HTTP: ${res.status}`);
        }

        const payload = await res.json();
        setProjects(payload.data || []);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
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
            orderBy: { data_publicacao: -1 },
          }),
        });
        const payload = await res.json();
        setBlogPosts(payload.data || []);
      } catch (error) {
        console.error('Failed to fetch blog posts:', error);
      }
    };

    const fetchFaqs = async () => {
      try {
        const res = await fetch(`${API_URL}/api/faq`);
        const data = await res.json();
        const faqsData = (Array.isArray(data) ? data : [])
          .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));
        setFaqs(faqsData);
      } catch (error) {
        console.error('Failed to fetch FAQs:', error);
      }
    };

    fetchProjects();
    fetchBlogPosts();
    fetchFaqs();
  }, []);

  return (
    <>
      <Preloader />
      <SEOHelmet
        title="Svicero Studio | Consultoria de Estratégia & Design de Marcas"
        description="Unimos estratégia, tecnologia e design contemporâneo para transformar marcas em sistemas claros, consistentes e lucrativos. Menos ruído, mais resultado."
        canonical="https://svicerostudio.com.br"
      />

      <div className="bg-ds-bg text-ds-text min-h-screen font-body">
        <Header />
        <HeroSection />
        <AudienceSection />
        <AboutSection />
        <DiagnosisOverviewSection />
        <ProjectsSection projects={projects} />
        <ServicesSection />
        <DepoimentosSection />
        <BlogSection blogPosts={blogPosts} />
        <FAQSection faqs={faqs} endIndex={4} />
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
