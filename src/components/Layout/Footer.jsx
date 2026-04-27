import React from 'react';
import { Link } from 'react-router-dom';

import logoBranco from '../../images/logo_alternativo 4.png';

const Footer = () => {
  return (
    <footer className="w-full bg-footer-bg text-[#B2B8C6] pt-14 sm:pt-16 pb-8 px-4 sm:px-6 md:px-12 lg:px-20 font-body">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row gap-12 md:gap-20">
        {/* Coluna esquerda: logo, texto, redes */}
        <div className="flex-1 min-w-0 flex flex-col gap-6">
          <div className="mb-2">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a href="/#inicio" onClick={(e) => handleNavigation(e, 'inicio')}>
                <img
                  src={logoBranco}
                  alt="Logo Svicero Studio"
                  className="h-12 sm:h-14 md:h-16 w-auto mb-4 md:mb-6 transition-all duration-300"
                />
              </a>
            </div>
            <p className="text-base leading-relaxed mb-6">Design estratégico e tecnologia para profissionalizar a presença digital de autônomos e pequenos negócios.
              Svicero Studio, sediado em São Paulo (Brasil), atendendo clientes no Brasil e no exterior.</p>
          </div>
          <div className="flex flex-row items-center justify-between mt-2">
            <a href="https://wa.me/5511964932007" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <i className="fa-brands fa-whatsapp text-3xl text-[#B2B8C6] hover:text-secondary transition-colors" />
            </a>
            <a href="https://www.instagram.com/robsonsvicero.dsgr/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <i className="fa-brands fa-instagram text-3xl text-[#B2B8C6] hover:text-secondary transition-colors" />
            </a>
            <a href="https://github.com/robsonsvicero" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <i className="fa-brands fa-github-alt text-3xl text-[#B2B8C6] hover:text-secondary transition-colors" />
            </a>
            <a href="https://www.behance.net/robsonsvicero" target="_blank" rel="noopener noreferrer" aria-label="Behance">
              <i className="fa-brands fa-behance text-3xl text-[#B2B8C6] hover:text-secondary transition-colors" />
            </a>
          </div>
        </div>
        {/* Coluna menus */}
        <div className="flex-[2] flex flex-col sm:flex-row gap-10 sm:gap-12 md:gap-24 justify-start md:justify-end">
          <div>
            <h4 className="text-white font-bold text-lg mb-4">Estúdio</h4>
            <ul className="flex flex-col gap-2">
              <li><Link to="/portfolio" className="hover:text-secondary transition-colors">Portfólio</Link></li>
              <li><Link to="/planos-pacotes" className="hover:text-secondary transition-colors">Planos & Pacotes</Link></li>
              <li><Link to="/processos" className="hover:text-secondary transition-colors">Processos</Link></li>
              <li><Link to="/blog" className="hover:text-secondary transition-colors">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-lg mb-4">Suporte</h4>
            <ul className="flex flex-col gap-2">
              <li><Link to="/contato" className="hover:text-secondary transition-colors">Contato</Link></li>
              <li><Link to="/faq" className="hover:text-secondary transition-colors">FAQ</Link></li>
              <li><Link to="/privacidade" className="hover:text-secondary transition-colors">Privacidade</Link></li>
              <li><Link to="/termos" className="hover:text-secondary transition-colors">Termos</Link></li>
            </ul>
          </div>
        </div>
      </div>
      {/* Linha divisória */}
      <hr className="my-10 border-cream/10" />
      {/* Rodapé final */}
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-4 text-sm text-[#B2B8C6]/80">
        <div className="flex flex-row items-center gap-2">
          <span>© 2026 Svicero Studio. Todos os direitos reservados.</span>
        </div>
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 sm:gap-4">
          <Link to="/privacidade" className="hover:text-secondary transition-colors">Privacidade</Link>
          <span className="text-secondary text-lg">•</span>
          <Link to="/exclusao-dados" className="hover:text-secondary transition-colors">Exclusão de Dados</Link>
          <span className="text-secondary text-lg">•</span>
          <span className="flex items-center gap-1"><i className="fa-solid fa-location-dot text-[#B2B8C6]" /> São Paulo, Brasil</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
