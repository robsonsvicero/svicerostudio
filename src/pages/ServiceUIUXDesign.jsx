import React from 'react';
import ServicePage from '../components/ServicePage';
import SEOHelmet from '../components/SEOHelmet';

// Importar imagens
import heroServiceUiux from '../images/hero_service-uiux-bg.webp';
import ctaUi from '../images/cta-uiux.webp';
import unm from '../images/cta-umusic.webp';
import crypto from '../images/cta-crypto.webp';
import jbimoveis from '../images/cta-jbimóveis.webp';

const ServiceUIUXDesign = () => {
  const serviceData = {
    heroImage: heroServiceUiux,
    title: 'UI & UX Design',
    subtitle: 'Crio interfaces visuais funcionais, modernas e esteticamente consistentes — focadas em experiência, usabilidade e conversão.',
    includes: [
      'Criação de layout responsivo (desktop e mobile)',
      'Componentes e telas em Figma',
      'Design System e guia de estilo',
      'Prototipagem navegável (quando solicitado)'
    ],
    process: [
      'Imersão: entendimento da proposta, público e objetivos',
      'Wireframes: definição da estrutura e fluxo de navegação',
      'Design Visual: aplicação da identidade visual e estética',
      'Prototipagem: criação de navegação interativa e apresentação final'
    ],
    examples: [
      { image: unm, alt: 'Projeto Universal Music Store', title: 'Universal Music', link: 'https://www.behance.net/gallery/174232557/Universal-Music' },
      { image: crypto, alt: 'Projeto Crypto', title: 'Crypto', link: 'https://www.behance.net/gallery/174980645/Crypto' },
      { image: jbimoveis, alt: 'Projeto JB Imóveis', title: 'JB Imóveis', link: 'https://www.behance.net/gallery/164899909/App-JB-Imoveis' }
    ],
    ctaImage: ctaUi,
    ctaTitle: 'Quer transformar sua interface em uma experiência memorável?',
    ctaDescription: 'Vamos criar juntos uma interface intuitiva, envolvente e alinhada à identidade da sua marca.',
    accentColor: 'primary'
  };

  return (
    <>
      <SEOHelmet 
        title="UI/UX para Marcas Premium e High-Ticket"
        description="Svicero Studio: Projetamos a infraestrutura visual e a engenharia de percepção que sustentam o faturamento de marcas de elite. Consultoria estratégica de design focada em maturidade e performance."
        keywords="Design Estratégico para High-Ticket, Engenharia Visual, Consultoria de Branding de Luxo, Posicionamento de Marcas de Elite, UI/UX para Marcas Premium, Svicero Studio"
      />
      <ServicePage {...serviceData} />
    </>
  );
};

export default ServiceUIUXDesign;
