import { Helmet } from 'react-helmet-async';

const DEFAULT_OG_IMAGE = 'https://svicerostudio.com.br/og-image.webp';

const SEOHelmet = ({
  title = 'Estratégia de Marca e Design para Sair da Guerra de Preços',
  description = 'O Svicero Studio é um estúdio de estratégia de marca e design que ajuda empresas que já vendem a sair da guerra de preços — reposicionando a marca para justificar preços mais altos e atrair clientes mais alinhados.',
  keywords = 'estratégia de marca, posicionamento de marca, identidade visual estratégica, branding para empresas, sair da guerra de preços, reposicionamento de marca, diagnóstico de posicionamento, Svicero Studio, Robson Svicero, design estratégico',
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  canonical,
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

  const normalizeOgImage = (imageUrl) => {
    if (!imageUrl) return DEFAULT_OG_IMAGE;
    if (
      /^https?:\/\//i.test(imageUrl) ||
      imageUrl.startsWith('data:') ||
      imageUrl.startsWith('//')
    ) {
      return imageUrl;
    }
    return `${siteUrl}${imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`}`;
  };

  const fullOgImage = normalizeOgImage(ogImage);
  const fullCanonical = canonical
    ? canonical.startsWith('http')
      ? canonical
      : `${siteUrl}${canonical.startsWith('/') ? canonical : `/${canonical}`}`
    : null;

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
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Svicero Studio" />
      {fullCanonical && <meta property="og:url" content={fullCanonical} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />

      {/* Robots */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
    </Helmet>
  );
};

export default SEOHelmet;