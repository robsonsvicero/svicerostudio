import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const ConsentBanner = () => {
  const [isVisible, setIsVisible] = useState(false)
  const CONSENT_KEY = 'svicero_consent'

  useEffect(() => {
    // Verificar se o usuário já deu consentimento
    const hasConsent = localStorage.getItem(CONSENT_KEY)
    if (!hasConsent) {
      setIsVisible(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, 'true')
    localStorage.setItem('consent_date', new Date().toISOString())
    setIsVisible(false)
    
    // Aqui você pode inicializar analytics ou outros serviços
    if (window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'granted',
        'ad_storage': 'granted'
      })
    }
  }

  const handleReject = () => {
    localStorage.setItem(CONSENT_KEY, 'false')
    localStorage.setItem('consent_date', new Date().toISOString())
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-low-dark/95 backdrop-blur-sm text-cream p-4 md:p-6 z-50 border-t border-primary/30">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-title text-lg font-semibold mb-2 text-cream">
              <i className="fa-solid fa-shield-halved text-primary mr-2"></i>
              Sua Privacidade é Importante
            </h3>
            <p className="text-cream/80 text-sm leading-relaxed mb-2">
              Nós utilizamos cookies e tecnologias similares para melhorar sua experiência, 
              analisar o uso do site e personalizar conteúdo. Ao continuar navegando, você aceita nossa 
              <Link to="/privacidade" className="text-primary hover:underline ml-1">Política de Privacidade</Link>.
            </p>
            <p className="text-cream/60 text-xs">
              Para exercer seus direitos de acesso, correção ou exclusão de dados, visite nossa 
              <Link to="/exclusao-dados" className="text-primary hover:underline ml-1">página de exclusão de dados</Link>.
            </p>
          </div>

          <div className="flex gap-3 flex-shrink-0 w-full md:w-auto">
            <button
              onClick={handleReject}
              className="flex-1 md:flex-none px-4 py-2 rounded-lg border border-cream/30 text-cream hover:bg-cream/10 transition-colors text-sm font-medium"
            >
              <i className="fa-solid fa-x mr-2"></i>
              Rejeitar
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 md:flex-none px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              <i className="fa-solid fa-check mr-2"></i>
              Aceitar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConsentBanner
