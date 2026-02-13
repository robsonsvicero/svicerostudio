import React from 'react'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import SEOHelmet from '../components/SEOHelmet'

const Privacidade = () => {
  return (
    <>
      <SEOHelmet 
        title="Política de Privacidade e Proteção de Dados"
        description="Política de Privacidade do Svicero Studio - Como tratamos seus dados e informações."
      />
      <div className="min-h-screen bg-cream">
        <Header variant="solid" />
        
        <div className="pt-[200px] pb-24 px-4 md:px-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-title text-4xl md:text-5xl font-semibold text-low-dark mb-8">
              Política de Privacidade
            </h1>

            <div className="bg-white rounded-xl shadow-md p-8 md:p-12 space-y-8">
              <section>
                <h2 className="font-title text-2xl font-semibold text-low-dark mb-4">
                  1. Informações que Coletamos
                </h2>
                <p className="text-low-medium leading-relaxed">
                  Coletamos informações que você nos fornece diretamente, como nome, e-mail e mensagens 
                  através dos formulários de contato. Também coletamos dados de navegação através de cookies 
                  e ferramentas de análise para melhorar sua experiência.
                </p>
              </section>

              <section>
                <h2 className="font-title text-2xl font-semibold text-low-dark mb-4">
                  2. Como Usamos Suas Informações
                </h2>
                <p className="text-low-medium leading-relaxed mb-4">
                  Utilizamos suas informações para:
                </p>
                <ul className="list-disc list-inside text-low-medium space-y-2 ml-4">
                  <li>Responder suas solicitações e mensagens</li>
                  <li>Enviar informações sobre nossos serviços</li>
                  <li>Melhorar nosso site e serviços</li>
                  <li>Análise de uso e comportamento no site</li>
                </ul>
              </section>

              <section>
                <h2 className="font-title text-2xl font-semibold text-low-dark mb-4">
                  3. Comentários do Facebook
                </h2>
                <p className="text-low-medium leading-relaxed">
                  Utilizamos o plugin de comentários do Facebook em nosso blog. Ao comentar, você compartilha 
                  informações com o Facebook conforme a{' '}
                  <a 
                    href="https://www.facebook.com/privacy/explanation" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Política de Privacidade do Facebook
                  </a>.
                </p>
              </section>

              <section>
                <h2 className="font-title text-2xl font-semibold text-low-dark mb-4">
                  4. Cookies
                </h2>
                <p className="text-low-medium leading-relaxed">
                  Utilizamos cookies para melhorar a experiência de navegação, analisar o tráfego do site 
                  e personalizar conteúdo. Você pode desabilitar cookies nas configurações do seu navegador.
                </p>
              </section>

              <section>
                <h2 className="font-title text-2xl font-semibold text-low-dark mb-4">
                  5. Compartilhamento de Dados
                </h2>
                <p className="text-low-medium leading-relaxed">
                  Não vendemos ou compartilhamos suas informações pessoais com terceiros, exceto quando 
                  necessário para fornecer nossos serviços ou quando exigido por lei.
                </p>
              </section>

              <section>
                <h2 className="font-title text-2xl font-semibold text-low-dark mb-4">
                  6. Segurança
                </h2>
                <p className="text-low-medium leading-relaxed">
                  Implementamos medidas de segurança para proteger suas informações contra acesso não autorizado, 
                  alteração, divulgação ou destruição.
                </p>
              </section>

              <section>
                <h2 className="font-title text-2xl font-semibold text-low-dark mb-4">
                  7. Seus Direitos
                </h2>
                <p className="text-low-medium leading-relaxed mb-4">
                  Você tem direito a:
                </p>
                <ul className="list-disc list-inside text-low-medium space-y-2 ml-4">
                  <li>Acessar suas informações pessoais</li>
                  <li>Corrigir dados incorretos</li>
                  <li>Solicitar a exclusão de seus dados</li>
                  <li>Retirar seu consentimento a qualquer momento</li>
                </ul>
              </section>

              <section>
                <h2 className="font-title text-2xl font-semibold text-low-dark mb-4">
                  8. Contato
                </h2>
                <p className="text-low-medium leading-relaxed">
                  Para questões sobre privacidade ou para exercer seus direitos, entre em contato:
                  <br />
                  <a href="mailto:contato@svicerostudio.com.br" className="text-primary hover:underline">
                    contato@svicerostudio.com.br
                  </a>
                </p>
              </section>

              <section>
                <h2 className="font-title text-2xl font-semibold text-low-dark mb-4">
                  9. Alterações
                </h2>
                <p className="text-low-medium leading-relaxed">
                  Esta política pode ser atualizada periodicamente. Recomendamos revisar esta página regularmente 
                  para se manter informado sobre nossas práticas de privacidade.
                </p>
              </section>

              <div className="mt-8 pt-8 border-t border-cream/40">
                <p className="text-sm text-low-medium">
                  Última atualização: 05 de fevereiro de 2026
                </p>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  )
}

export default Privacidade
