import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../UI/Button';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="w-full flex flex-col items-center justify-center bg-footer-bg text-text-primary py-16 px-4 sm:px-8 md:px-16 lg:px-24 border-t border-accent-copper/40">
      <div className="w-full flex flex-col items-center max-w-screen-xl">
        <div className="mb-10 text-center max-w-3xl">
          <p className="font-serif text-2xl md:text-3xl text-text-primary mb-3">Engenharia de Percepção e Estratégia</p>
          <p className="supporting-text text-text-primary/80">Direção visual, posicionamento e experiência para marcas que exigem precisão técnica e estética de alto padrão.</p>
        </div>

        <nav className="w-full flex justify-center mb-12">
          <ul className="flex flex-row gap-6 sm:gap-8 md:gap-12">
            <li>
              <a href="https://wa.me/5511964932007" rel="noopener noreferrer" target="_blank" aria-label="WhatsApp">
                <i className="fa-brands fa-whatsapp text-3xl sm:text-4xl text-text-primary hover:text-accent-copper transition-colors" />
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/robsonsvicero.dsgr/" rel="noopener noreferrer" target="_blank" aria-label="Instagram">
                <i className="fa-brands fa-instagram text-3xl sm:text-4xl text-text-primary hover:text-accent-copper transition-colors" />
              </a>
            </li>
            
            <li>
              <a href="https://github.com/robsonsvicero" rel="noopener noreferrer" target="_blank" aria-label="GitHub">
                <i className="fa-brands fa-github-alt text-3xl sm:text-4xl text-text-primary hover:text-accent-copper transition-colors" />
              </a>
            </li>
            <li>
              <a href="https://www.behance.net/robsonsvicero" rel="noopener noreferrer" target="_blank" aria-label="Behance">
                <i className="fa-brands fa-behance text-3xl sm:text-4xl text-text-primary hover:text-accent-copper transition-colors" />
              </a>
            </li>
          </ul>
        </nav>

        <div className="mb-16">
          <Button
            onClick={scrollToTop}
            variant="custom"
            icon={<i className="fa-brands fa-space-awesome" />}
            className="border-2 border-text-primary/20 text-text-primary hover:border-accent-copper hover:text-accent-copper px-6 py-2 rounded-full transition"
          >
            Voltar ao topo
          </Button>
        </div>

        <div className="mb-20 px-6 py-2 bg-white/60 rounded text-center italic border border-text-primary/10">
          <p>
            Feito com <span>☕</span> em Sampa.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center text-xs sm:text-sm text-text-primary gap-3 sm:gap-4 flex-wrap text-center">
          <p>© 2026</p>
          <span className="hidden sm:inline text-accent-copper">•</span>
          <p className="text-text-primary/80 italic">Svicero Studio — Engenharia de Percepção e Estratégia</p>
          <span className="hidden sm:inline text-accent-copper">•</span>
          <Link to="/privacidade" className="text-text-primary/80 hover:text-accent-copper transition-colors">
            Privacidade
          </Link>
          <span className="hidden sm:inline text-accent-copper">•</span>
          <Link to="/exclusao-dados" className="text-text-primary/80 hover:text-accent-copper transition-colors">
            Exclusão de Dados
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
