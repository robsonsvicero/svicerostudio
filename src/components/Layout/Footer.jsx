import React from 'react';
import { Link } from 'react-router-dom';

import logoBranco from '../../assets/logo-vertical1.png';

const Footer = () => {
  return (
    <footer className="w-full bg-ds-text text-ds-bg pt-14 sm:pt-16 pb-8 px-4 sm:px-6 md:px-12 lg:px-20 font-body relative overflow-hidden border-t border-white/5">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-ds-accent/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row gap-12 md:gap-20">
        {/* Coluna esquerda: logo, texto, redes */}
        <div className="flex-1 min-w-0 flex flex-col gap-6">
          <div className="mb-2">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a href="/#inicio" onClick={(e) => handleNavigation(e, 'inicio')} className="flex justify-center items-center lg:justify-start">
                <img
                  src={logoBranco}
                  alt="Logo Svicero Studio"
                  className="h-28 md:h-36 w-auto mb-4 md:mb-6 transition-all duration-300"
                />
              </a>
            </div>
            <p className="text-base leading-relaxed mb-6">Estratégia, percepção e posicionamento para clínicas que cresceram tecnicamente e desejam transmitir isso com mais clareza, confiança e coerência. O Svicero Studio atua no alinhamento entre marca, experiência e comunicação para negócios da área odontológica no Brasil e no exterior.</p>
          </div>
          <div className="flex flex-row items-center justify-between mt-2">
            <a href="https://wa.me/5511964932007" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <i className="fa-brands fa-whatsapp text-3xl text-white/60 hover:text-ds-accent transition-colors" />
            </a>
            <a href="https://www.instagram.com/svicerostudio/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <i className="fa-brands fa-instagram text-3xl text-white/60 hover:text-ds-accent transition-colors" />
            </a>
            <a href="https://github.com/robsonsvicero" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <i className="fa-brands fa-github-alt text-3xl text-white/60 hover:text-ds-accent transition-colors" />
            </a>
            <a href="https://www.behance.net/robsonsvicero" target="_blank" rel="noopener noreferrer" aria-label="Behance">
              <i className="fa-brands fa-behance text-3xl text-white/60 hover:text-ds-accent transition-colors" />
            </a>
          </div>
        </div>
        {/* Coluna menus */}
        <div className="flex-[2] flex flex-col sm:flex-row gap-10 sm:gap-12 md:gap-24 justify-start md:justify-end">
          <div>
            <h4 className="text-ds-white font-medium text-lg mb-4">Estúdio</h4>
            <ul className="flex flex-col gap-2 text-ds-muted">
              <li><Link to="/projetos" className="hover:text-ds-accent transition-colors">Projetos</Link></li>
              <li><Link to="/processos" className="hover:text-ds-accent transition-colors">Processos</Link></li>
              <li><Link to="/blog" className="hover:text-ds-accent transition-colors">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-ds-white/90 font-medium text-lg mb-4">Suporte</h4>
            <ul className="flex flex-col gap-2 text-ds-muted">
              <li><Link to="/contato" className="hover:text-ds-accent transition-colors">Contato</Link></li>
              <li><Link to="/faq" className="hover:text-ds-accent transition-colors">FAQ</Link></li>
              <li><Link to="/privacidade" className="hover:text-ds-accent transition-colors">Privacidade</Link></li>
              <li><Link to="/termos" className="hover:text-ds-accent transition-colors">Termos</Link></li>
            </ul>
          </div>
        </div>
      </div>
      {/* Linha divisória */}
      <hr className="my-10 border-white/5 relative z-10" />
      {/* Rodapé final */}
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-4 text-sm text-ds-muted/80 relative z-10">
        <div className="flex flex-row items-center gap-2">
          <span>© 2026 Svicero Studio. Todos os direitos reservados.</span>
        </div>
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 sm:gap-4">
          <Link to="/privacidade" className="hover:text-ds-accent transition-colors">Privacidade</Link>
          <span className="text-ds-accent/50 text-lg">•</span>
          <Link to="/exclusao-dados" className="hover:text-ds-accent transition-colors">Exclusão de Dados</Link>
          <span className="text-ds-accent/50 text-lg">•</span>
          <span className="flex items-center gap-1"><i className="fa-solid fa-location-dot text-ds-muted/80" /> São Paulo, Brasil</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
