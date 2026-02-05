import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../UI/Button';
import logoFooter from '../../images/logo_horizontal 4.png';
import heroImage from '../../images/hero.webp';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="w-full flex flex-col items-center justify-center bg-cover text-cream py-16 px-4 sm:px-8 md:px-16 lg:px-24" style={{ backgroundImage: `url(${heroImage})` }}>
      <div className="w-full flex flex-col items-center max-w-screen-xl">
        <nav className="w-full flex justify-center mb-12">
          <ul className="flex flex-row gap-6 sm:gap-8 md:gap-12">
            <li>
              <a href="https://wa.me/5511964932007" rel="noopener noreferrer" target="_blank" aria-label="WhatsApp">
                <i className="fa-brands fa-whatsapp text-3xl sm:text-4xl hover:rotate-[-10deg] hover:scale-110 hover:text-secondary transition" />
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/robsonsvicero.dsgr/" rel="noopener noreferrer" target="_blank" aria-label="Instagram">
                <i className="fa-brands fa-instagram text-3xl sm:text-4xl hover:rotate-[-10deg] hover:scale-110 hover:text-secondary transition" />
              </a>
            </li>
            
            <li>
              <a href="https://github.com/robsonsvicero" rel="noopener noreferrer" target="_blank" aria-label="GitHub">
                <i className="fa-brands fa-github-alt text-3xl sm:text-4xl hover:rotate-[-10deg] hover:scale-110 hover:text-secondary transition" />
              </a>
            </li>
            <li>
              <a href="https://www.behance.net/robsonsvicero" rel="noopener noreferrer" target="_blank" aria-label="Behance">
                <i className="fa-brands fa-behance text-3xl sm:text-4xl hover:rotate-[-10deg] hover:scale-110 hover:text-secondary transition" />
              </a>
            </li>
          </ul>
        </nav>

        <div className="mb-16">
          <Button
            onClick={scrollToTop}
            variant="custom"
            icon={<i className="fa-brands fa-space-awesome" />}
            className="border-2 border-cream text-cream hover:bg-cream hover:text-primary px-6 py-2 rounded-full transition"
          >
            Voltar ao topo
          </Button>
        </div>

        <div className="mb-20 px-6 py-2 bg-black/60 rounded text-center italic">
          <p>
            Feito com <span>💙</span> em Sampa.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center text-xs sm:text-sm text-cream gap-3 sm:gap-4 flex-wrap text-center">
          <p>© 2026</p>
          <span className="hidden sm:inline text-cream/60">•</span>
          <p className="text-cream/80 italic">Svicero Studio — Estratégia que eleva, design que posiciona</p>
          <span className="hidden sm:inline text-cream/60">•</span>
          <Link to="/privacidade" className="text-cream/80 hover:text-primary transition-colors">
            Privacidade
          </Link>
          <span className="hidden sm:inline text-cream/60">•</span>
          <Link to="/exclusao-dados" className="text-cream/80 hover:text-primary transition-colors">
            Exclusão de Dados
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
