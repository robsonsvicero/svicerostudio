import React from 'react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import SEOHelmet from '../components/SEOHelmet';
import heroDiagnostico from '../images/hero_diagnostico.png';

const Diagnostico = () => {
  return (
    <>
      <SEOHelmet
        title="Diagnóstico Estratégico para Marcas Elite"
        description="Agende seu diagnóstico estratégico. Analisamos sua infraestrutura visual e estratégia de marca para identificar gargalos de percepção e oportunidades de lucro."
        keywords="Design Estratégico para High-Ticket, Engenharia Visual, Consultoria de Branding de Luxo, Posicionamento de Marcas de Elite, UI/UX para Marcas Premium, Svicero Studio"
      />
      <div className="bg-cream min-h-screen">
        <Header />
        <main>
        {/* Hero Section */}
        <section className="relative h-[600px] md:h-[700px] flex items-center justify-center text-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ backgroundImage: `url(${heroDiagnostico})` }}
          ></div>
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full w-full px-4 md:px-8">
            <h1 className="font-title font-semibold text-cream text-4xl lg:text-6xl tracking-wide mb-6 drop-shadow-lg max-w-6xl">
              Solicitação de Diagnóstico Estratégico
            </h1>
            <p className="font-body text-cream text-lg md:text-xl lg:text-2xl font-normal tracking-wide mb-10 max-w-4xl drop-shadow-md">
              Este não é um formulário de orçamento. É o início de uma análise técnica para identificar os ruídos que estão sabotando o seu valor de mercado. Selecionamos apenas 4 projetos por mês para garantir exclusividade.
            </p>
          </div>
        </section>

        {/* Formulário Section */}
        <section className="py-24 px-4 md:px-16">
          <div className="max-w-screen-xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="w-full">
                <iframe
                  id="JotFormIFrame-253516622262655"
                  title="Diagnóstico Svicero Studio"
                  onLoad={() => window.parent.scrollTo(0,0)}
                  allowTransparency="true"
                  allow="geolocation; microphone; camera; fullscreen; payment"
                  src="https://form.jotform.com/253516622262655"
                  frameBorder="0"
                  style={{minWidth: '100%', maxWidth: '100%', height: '539px', border: 'none'}}
                  scrolling="no"
                  className="rounded-xl shadow-lg"
                />
                <script src='https://cdn.jotfor.ms/s/umd/latest/for-form-embed-handler.js'></script>
                <script dangerouslySetInnerHTML={{
                  __html: `window.jotformEmbedHandler("iframe[id='JotFormIFrame-253516622262655']", "https://form.jotform.com/")`
                }} />
              </div>
            </div>
          </div>
        </section>

        {/* Seção de Autoridade: A Tríade Svicero */}
        <section className="bg-low-dark py-20 px-4 md:px-16">
          <div className="max-w-screen-xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-title text-4xl md:text-5xl font-light text-cream mb-4">
                A Tríade Svicero
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {/* Estratégia */}
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-low-medium/20 rounded-full flex items-center justify-center mb-6">
                  <i className="fa-solid fa-lightbulb text-4xl text-secondary"></i>
                </div>
                <h3 className="font-title text-2xl font-light text-cream mb-4">Estratégia</h3>
                <p className="text-cream/80 text-base leading-relaxed">
                  Alinhamento de promessa e público-alvo.
                </p>
              </div>

              {/* Design */}
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-low-medium/20 rounded-full flex items-center justify-center mb-6">
                  <i className="fa-solid fa-palette text-4xl text-secondary"></i>
                </div>
                <h3 className="font-title text-2xl font-light text-cream mb-4">Design</h3>
                <p className="text-cream/80 text-base leading-relaxed">
                  Construção de percepção de alto valor.
                </p>
              </div>

              {/* Tecnologia */}
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-low-medium/20 rounded-full flex items-center justify-center mb-6">
                  <i className="fa-solid fa-code text-4xl text-secondary"></i>
                </div>
                <h3 className="font-title text-2xl font-light text-cream mb-4">Tecnologia</h3>
                <p className="text-cream/80 text-base leading-relaxed">
                  Interfaces de alta performance e conversão.
                </p>
              </div>
            </div>
          </div>
        </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Diagnostico;
