import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEOHelmet = ({ 
  title = 'Engenharia Visual & Design Estratégico',
  description = 'Svicero Studio: Projetamos a infraestrutura visual e a engenharia de percepção que sustentam o faturamento de marcas de elite. Consultoria estratégica de design focada em maturidade e performance.',
  keywords = 'Design Estratégico para High-Ticket, Engenharia Visual, Consultoria de Branding de Luxo, Posicionamento de Marcas de Elite, UI/UX para Marcas Premium, Svicero Studio',
  ogImage = '/images/og-image.jpg',
  ogType = 'website'
}) => {
  const siteUrl = 'https://svicerostudio.com.br';
  const BRAND_NAME = 'Svicero Studio';
  const TITLE_LIMIT = 60;

  const safeTrim = (value) => value.replace(/\s+/g, ' ').trim();

  const trimToLength = (value, maxLength) => {
    if (value.length <= maxLength) return value;
    return safeTrim(value.slice(0, maxLength).replace(/[\s|:;,-]+$/, ''));
  };

  const withBrand = (baseTitle) => {
    if (baseTitle.includes(BRAND_NAME)) {
      return trimToLength(baseTitle, TITLE_LIMIT);
    }

    const suffix = ` | ${BRAND_NAME}`;
    const maxBaseLength = TITLE_LIMIT - suffix.length;
    const normalizedBase = trimToLength(baseTitle, maxBaseLength);
    return `${normalizedBase}${suffix}`;
  };

  const fullTitle = withBrand(safeTrim(title));

  return (
    <Helmet>
      {/* Meta Tags Básicas */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:site_name" content="Svicero Studio" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />
      
      {/* Robots */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
    </Helmet>
  );
};

export default SEOHelmet;
