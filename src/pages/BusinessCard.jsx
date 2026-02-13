import React from 'react';
import '../styles/BusinessCard.css';
import simbolo from '../images/simbolo.png';

const BusinessCard = () => {
  return (
    <div className="business-card-container">
      <div className="business-card">
        {/* Logo */}
        <div className="business-card-logo bg-white">
          <img src={simbolo} alt="Svicero Studio" className="logo-image" loading="lazy" />
        </div>

        {/* Título e Tagline */}
        <div className="business-card-title">
          <h1>SVICERO STUDIO</h1>
          <p className="tagline">Simplicidade que posiciona</p>
        </div>

        {/* Descrição */}
        <div className="business-card-description">
          <p>
            Criamos a fundação digital da sua marca, integrando 
            Identidade Visual, UX/UI e Front-end para performance e 
            autoridade.
          </p>
        </div>

        {/* Botões de Ação */}
        <div className="business-card-buttons">
          <a 
            href="/diagnostico" 
            className="business-card-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            Falar com um Estrategista
          </a>

          <a 
            href="https://www.svicerostudio.com.br" 
            className="business-card-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            Nosso Website Oficial
          </a>

          <a 
            href="https://www.instagram.com/svicerostudio" 
            className="business-card-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            Acompanhe o Studio
          </a>

          <a 
            href="mailto:hello@svicerostudio.com.br" 
            className="business-card-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            E-mail de contato
          </a>
        </div>

        {/* Rodapé */}
        <div className="business-card-footer">
          <div className="footer-dot"></div>
          <p>@2026 | Svicero Studio</p>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;
