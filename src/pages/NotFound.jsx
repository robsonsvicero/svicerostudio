
import React from 'react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import SEOHelmet from '../components/SEOHelmet';
import Button from '../components/UI/Button';

const NotFound = () => {
  return (
    <>
      <SEOHelmet title="Página não encontrada" description="A página que você procura não existe ou foi movida." />
      <div className="bg-dark-bg min-h-screen flex flex-col">
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-24 text-center">
          <div className="flex justify-center mb-8">
            <dotlottie-player
              src="https://lottie.host/c5c7d9c3-2055-48a0-8b03-074d8fd2cca7/gpseOTw4K0.lottie"
              background="transparent"
              speed="1"
              style={{ width: '260px', height: '260px' }}
              loop
              autoplay
            ></dotlottie-player>
          </div>
          <h1 className="font-title text-3xl md:text-4xl font-extrabold text-white mb-4">404 – Página não encontrada</h1>
          <p className="text-[#B2B8C6] text-lg md:text-xl mb-8 max-w-xl mx-auto">
            O endereço acessado não existe ou foi movido.<br />
            Se precisar de ajuda, entre em contato ou volte para a página inicial.
          </p>
          <Button
            href="/"
            variant="secondary"
            className="w-full max-w-xs text-center"
          >
            Voltar para a página inicial
          </Button>
        </main>
      </div>
    </>
  );
};

export default NotFound;
