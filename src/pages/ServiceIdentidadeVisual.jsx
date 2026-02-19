import React from 'react';
import ServicePage from '../components/ServicePage';
import SEOHelmet from '../components/SEOHelmet';

// Importar imagens
import heroServiceIdv from '../images/hero_service-idv-bg.webp';
import ctaIdv from '../images/cta-identidade.webp';
import alexandreIvo from '../images/cta-alexandreivo.webp';
import powerbrain from '../images/cta-powerbrain.webp';
import chimp from '../images/cta-chimp.webp';

const ServiceIdentidadeVisual = () => {
  const serviceData = {
    heroImage: heroServiceIdv,
    title: 'Identidade Visual',
    subtitle: 'Construo identidades visuais criativas, estratégicas e alinhadas à essência da sua marca para que ela se destaque e se posicione com autoridade.',
    includes: [
      'Criação de logotipo (símbolo e tipografia personalizada)',
      'Definição de paleta de cores e tipografia',
      'Manual de uso da marca (PDF)',
      'Apresentação da marca (PDF)',
      'Aplicações da marca (redes sociais, papelaria, etc)'
    ],
    process: [
      'Imersão: entendimento dos valores e propósito da marca',
      'Pesquisa de mercado: análise de concorrentes e tendências visuais',
      'Criação: desenvolvimento de logotipo, paleta de cores e tipografia',
      'Entrega: Manual de uso da marca e aplicações visuais'
    ],
    examples: [
      { image: alexandreIvo, alt: 'Alexandre Ivo - Identidade Visual', title: 'Alexandre Ivo', link: 'https://www.behance.net/gallery/236215677/Alexandre-Ivo-Professor-de-musica' },
      { image: powerbrain, alt: 'Powerbrain - Identidade Visual', title: 'Powerbrain', link: 'https://www.behance.net/gallery/221467317/PowerBrain' },
      { image: chimp, alt: 'Chimp - Identidade Visual', title: 'Chimp', link: 'https://www.behance.net/gallery/180857079/Chimp-Skatewear' }
    ],
    ctaImage: ctaIdv,
    ctaTitle: 'Quer uma identidade visual que destaque sua marca?',
    ctaDescription: 'Vamos criar uma marca visual que transmita confiança, profissionalismo e que se conecte com seu público.',
    accentColor: 'secondary'
  };

  return (
    <>
      <SEOHelmet 
        title="Branding de Luxo e Posicionamento Elite"
        description="Construa uma marca inesquecível. Identidade visual estratégica que comunica sofisticação e autoridade. Posicionamento de elite para marcas que lideram o mercado."
        keywords="Design Estratégico para High-Ticket, Engenharia Visual, Consultoria de Branding de Luxo, Posicionamento de Marcas de Elite, UI/UX para Marcas Premium, Svicero Studio"
      />
      <ServicePage {...serviceData} />
    </>
  );
};

export default ServiceIdentidadeVisual;
