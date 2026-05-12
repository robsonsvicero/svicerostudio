
import React from 'react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import SEOHelmet from '../components/SEOHelmet';
import Button from '../components/UI/Button';

const NotFound = () => {
  return (
    <>
      <SEOHelmet title="Página não encontrada" description="A página que você procura não existe ou foi movida." />
      <div className="bg-charcoal min-h-screen flex flex-col font-body relative overflow-hidden">
        {/* Background lighting effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-copper/5 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-copper/5 rounded-full blur-[80px] pointer-events-none -translate-x-1/3 translate-y-1/3" />
        
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-24 text-center relative z-10">
          <div className="flex justify-center mb-8 opacity-80">
            <dotlottie-player
              src="https://lottie.host/c5c7d9c3-2055-48a0-8b03-074d8fd2cca7/gpseOTw4K0.lottie"
              background="transparent"
              speed="1"
              style={{ width: '260px', height: '260px' }}
              loop
              autoplay
            ></dotlottie-player>
          </div>
          <h1 className="text-3xl md:text-5xl font-medium tracking-tight text-cream mb-4 text-balance">404 – Página não encontrada</h1>
          <p className="text-muted text-lg leading-[1.6] mb-8 max-w-xl mx-auto">
            O endereço acessado não existe ou foi movido.<br />
            Se precisar de ajuda, entre em contato ou volte para a página inicial.
          </p>
          <Button
            href="/"
            variant="primary"
            className="w-full max-w-xl text-center"
          >
            Voltar para a página inicial
          </Button>
        </main>
      </div>
    </>
  );
};

export default NotFound;
