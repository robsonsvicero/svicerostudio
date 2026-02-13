import React, { useEffect, useState } from 'react';
import Header from './Layout/Header';
import Footer from './Layout/Footer';
import Button from './UI/Button';

const ServicePage = ({ 
  heroImage, 
  title, 
  subtitle, 
  includes, 
  process, 
  examples, 
  ctaImage, 
  ctaTitle, 
  ctaDescription,
  accentColor = 'secondary' 
}) => {
  const [whatsappVisible, setWhatsappVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setWhatsappVisible(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const colorClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary'
  };

  return (
    <div className="bg-cream">
      <Header variant="solid" />

      {/* Botão flutuante WhatsApp */}
      <a
        href="https://wa.me/5511964932007"
        target="_blank"
        rel="noopener noreferrer"
        className={`fixed bottom-8 right-8 z-50 w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center text-white text-3xl shadow-2xl hover:scale-110 transition-transform duration-300 ${whatsappVisible ? 'flex' : 'hidden'}`}
        aria-label="Fale pelo WhatsApp"
      >
        <i className="fa-brands fa-whatsapp"></i>
      </a>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 md:px-16 py-24" id="inicio">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroImage})` }}></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="font-title font-semibold text-cream text-4xl lg:text-6xl tracking-wide mb-6 drop-shadow-lg max-w-6xl">{title}</h1>
          <p className="font-body text-cream text-lg md:text-xl lg:text-2xl font-normal tracking-wide mb-10 max-w-4xl drop-shadow-md mx-auto">
            {subtitle}
          </p>
          <Button href="/diagnostico" variant="secondary">
            Falar com um Estrategista
          </Button>
        </div>
      </section>

      {/* Service Description */}
      <section className="bg-dark-bg py-24 px-4 md:px-16">
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-neutral-900 rounded-2xl p-8 border border-cream/10">
            <h2 className="font-title text-4xl md:text-5xl font-light text-cream mb-4">O que inclui</h2>
            <ul className="space-y-4 text-cream/80 text-lg">
              {includes.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className={`${colorClasses[accentColor]} mt-1`}>•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-neutral-900 rounded-2xl p-8 border border-cream/10">
            <h2 className="font-title text-4xl md:text-5xl font-light text-cream mb-4">Processo de criação</h2>
            <ul className="space-y-4 text-cream/80 text-lg">
              {process.map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className={`${colorClasses[accentColor]} font-bold mt-1`}>{index + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Examples Grid */}
      <section className="bg-cream py-24 px-4 md:px-16">
        <div className="max-w-screen-xl mx-auto">
          <h2 className="font-title text-4xl md:text-5xl font-light text-primary text-center mb-16">Projetos entregues</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {examples.map((example, index) => (
              <a
                key={index}
                href={example.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <img src={example.image} alt={example.alt} className="w-full h-auto group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <p className="text-cream font-title text-xl">{example.title}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-24 px-4 md:px-16">
        <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="w-full lg:w-1/2">
            <h2 className="font-title text-4xl md:text-5xl font-light text-cream mb-4">{ctaTitle}</h2>
            <p className="font-sans text-lg text-cream/80 mb-8 leading-relaxed">{ctaDescription}</p>
            <Button href="/diagnostico" variant="secondary">
              Falar com um Estrategista
            </Button>
          </div>
          <div className="w-full lg:w-1/2">
            <img src={ctaImage} alt={title} className="w-full h-auto rounded-2xl shadow-2xl" loading="lazy" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServicePage;
