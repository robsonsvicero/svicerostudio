import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../UI/Button';
import { useAuth } from '../../contexts/AuthContext';

import logoBranco from '../../images/simbolo 3.png';
import logoAzul from '../../images/simbolo 1.png';

const Header = ({ variant = 'transparent' }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleNavigation = (e, sectionId) => {
    e.preventDefault();
    closeMenu();

    // Se já estiver na home, apenas rola até a seção
    if (location.pathname === '/') {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Se estiver em outra página, navega para home e depois rola
      navigate('/');
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleAdminClick = () => {
    closeMenu();
    navigate(user ? '/admin' : '/login');
  };

  return (
    <header
      className={`w-full py-5 fixed top-0 left-0 z-50 transition-all duration-300
        ${scrolled || variant === 'solid' ? 'bg-[#fff8f0cc] shadow-lg' : 'bg-transparent'}
        `}
    >
      <div className="max-w-screen-xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/#inicio" onClick={(e) => handleNavigation(e, 'inicio')}>
              <img
                src={scrolled || variant === 'solid' ? logoAzul : logoBranco}
                alt="Logo Svicero Studio"
                className="h-14 sm:h-16 md:h-20 w-auto transition-all duration-300"
              />
            </a>
          </div>

          {/* Navegação Desktop */}
          <nav className="hidden lg:flex items-center gap-6">
            {[
              { label: 'Início', section: 'inicio' },
              { label: 'Tríade', section: 'triade' },
              { label: 'Projetos', section: 'projetos' },
              { label: 'Serviços', section: 'servicos' },
              { label: 'Sobre', section: 'sobre' },
            ].map((item) => (
              <a
                key={item.section}
                href={`/#${item.section}`}
                onClick={(e) => handleNavigation(e, item.section)}
                className={`font-title text-base xl:text-lg transition-colors duration-200 px-3 py-2
                  ${scrolled || variant === 'solid' ? 'text-primary' : 'text-cream'}
                  hover:bg-secondary hover:text-cream hover:rounded-lg`}
              >
                {item.label}
              </a>
            ))}
            <a
              href="/blog"
              onClick={closeMenu}
              className={`font-title text-base xl:text-lg transition-colors duration-200 px-3 py-2
                ${scrolled || variant === 'solid' ? 'text-primary' : 'text-cream'}
                hover:bg-secondary hover:text-cream hover:rounded-lg`}
            >
              Blog
            </a>
            <Button
                href="/diagnostico"
                variant="secondary"
                className="inline-block"
              >Solicitar Diagnóstico Estratégico
              </Button>
            <button
              onClick={handleAdminClick}
              className={`p-2 rounded-lg transition-colors duration-200 ml-2
                ${scrolled || variant === 'solid' ? 'text-primary hover:bg-secondary hover:text-cream' : 'text-cream hover:bg-secondary'}`}
              aria-label="Acessar área administrativa"
              title={user ? 'Acessar Admin' : 'Fazer Login'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </nav>

          {/* Menu Mobile */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              className="flex flex-col justify-center items-center w-12 h-12 group"
              onClick={toggleMenu}
              aria-label="Menu de navegação"
              aria-expanded={menuOpen}
            >
              <span className={`block w-7 h-0.5 bg-primary mb-1 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`block w-7 h-0.5 bg-primary mb-1 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-7 h-0.5 bg-primary transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <nav
          role="navigation"
          aria-label="Menu principal mobile"
          className={`lg:hidden fixed top-0 left-0 w-full h-screen bg-cream/95 backdrop-blur-sm z-40 flex flex-col items-center justify-center transition-all duration-300
            ${menuOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none'}`}
        >
          {[
            { label: 'Início', section: 'inicio' },
            { label: 'Tríade', section: 'triade' },
            { label: 'Projetos', section: 'projetos' },
            { label: 'Serviços', section: 'servicos' },
            { label: 'Sobre', section: 'sobre' },
          ].map((item) => (
            <a
              key={item.section}
              href={`/#${item.section}`}
              onClick={(e) => handleNavigation(e, item.section)}
              className={`font-title text-2xl mb-6 transition-colors duration-200 px-4 py-2
                text-primary hover:bg-secondary hover:text-cream hover:rounded-lg`}
            >
              {item.label}
            </a>
          ))}
          <a
            href="/blog"
            onClick={closeMenu}
            className={`font-title text-2xl mb-6 transition-colors duration-200 px-4 py-2
              text-primary hover:bg-secondary hover:text-cream hover:rounded-lg`}
          >
            Blog
          </a>
          <button
            onClick={handleAdminClick}
            className="text-primary hover:text-secondary transition-colors p-2 mt-4"
            aria-label="Acessar área administrativa"
            title={user ? 'Acessar Admin' : 'Fazer Login'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <Button
                href="/diagnostico"
                variant="secondary"
                className="inline-block mb-6"
              >Solicitar Diagnóstico Estratégico
              </Button>
          
        </nav>
      </div>
    </header>
  );
};

export default Header;
