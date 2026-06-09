import React from 'react'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import SEOHelmet from '../components/SEOHelmet'

const Privacidade = () => {
  return (
    <>
      <SEOHelmet
        title="Política de Privacidade | Svicero Studio"
        description="Transparência no tratamento dos seus dados em todos os pontos de contato. Conheça a política de privacidade e proteção de dados do Svicero Studio, em conformidade com a LGPD."
      />
      <div className="min-h-screen bg-ds-bg font-body relative overflow-hidden">
        {/* Background lighting effects */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-ds-accent/5 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-ds-accent/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/4 translate-y-1/4" />

        <Header variant="solid" />

        <main className="pt-28 sm:pt-36 md:pt-[200px] pb-16 sm:pb-24 px-4 sm:px-6 md:px-16 relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-[3.75rem] font-medium tracking-tight text-ds-text mb-8 text-balance">
              Política de Privacidade
            </h1>

            <div className="bg-[#141414]/60 backdrop-blur-xl border border-white/5 shadow-2xl rounded-[2rem] p-8 md:p-12 space-y-8">
              <section>
                <h2 className="text-2xl font-medium tracking-tight text-ds-text mb-4">
                  1. Informações que Coletamos
                </h2>
                <p className="text-ds-muted leading-[1.6]">
                  Coletamos informações que você nos fornece diretamente, como nome, e-mail e mensagens
                  através dos formulários de contato. Também coletamos dados de navegação através de cookies
                  e ferramentas de análise para melhorar sua experiênca.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-medium tracking-tight text-ds-text mb-4">
                  2. Como Usamos Suas Informações
                </h2>
                <p className="text-ds-muted leading-[1.6] mb-4">
                  Utilizamos suas informações para:
                </p>
                <ul className="list-disc list-inside text-ds-muted space-y-2 ml-4">
                  <li>Responder suas solicitações e mensagens</li>
                  <li>Enviar informações sobre nossos serviços</li>
                  <li>Melhorar nosso site e serviços</li>
                  <li>Análise de uso e comportamento no site</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-medium tracking-tight text-ds-text mb-4">
                  3. Comentários do Facebook
                </h2>
                <p className="text-ds-muted leading-[1.6]">
                  Utilizamos o plugin de comentários do Facebook em nosso blog. Ao comentar, você compartilha
                  informações com o Facebook conforme a{' '}
                  <a
                    href="https://www.facebook.com/privacy/explanation"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ds-accent font-medium hover:text-ds-accent/80 hover:underline"
                  >
                    Política de Privacidade do Facebook
                  </a>.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-medium tracking-tight text-ds-text mb-4">
                  4. Cookies
                </h2>
                <p className="text-ds-muted leading-[1.6]">
                  Utilizamos cookies para melhorar a experiência de navegação, analisar o tráfego do site
                  e personalizar conteúdo. Você pode desabilitar cookies nas configurações do seu navegador.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-medium tracking-tight text-ds-text mb-4">
                  5. Compartilhamento de Dados
                </h2>
                <p className="text-ds-muted leading-[1.6]">
                  Não vendemos ou compartilhamos suas informações pessoais com terceiros, exceto quando
                  necessário para fornecer nossos serviços ou quando exigido por lei.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-medium tracking-tight text-ds-text mb-4">
                  6. Segurança
                </h2>
                <p className="text-ds-muted leading-[1.6]">
                  Implementamos medidas de segurança para proteger suas informações contra acesso não autorizado,
                  alteração, divulgação ou destruição.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-medium tracking-tight text-ds-text mb-4">
                  7. Seus Direitos
                </h2>
                <p className="text-ds-muted leading-[1.6] mb-4">
                  Você tem direito a:
                </p>
                <ul className="list-disc list-inside text-ds-muted space-y-2 ml-4">
                  <li>Acessar suas informações pessoais</li>
                  <li>Corrigir dados incorretos</li>
                  <li>Solicitar a exclusão de seus dados</li>
                  <li>Retirar seu consentimento a qualquer momento</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-medium tracking-tight text-ds-text mb-4">
                  8. Contato
                </h2>
                <p className="text-ds-muted leading-[1.6]">
                  Para questões sobre privacidade ou para exercer seus direitos, entre em contato:
                  <br />
                  <a href="mailto:contato@svicerostudio.com.br" className="text-ds-accent font-medium hover:text-ds-accent/80 hover:underline">
                    contato@svicerostudio.com.br
                  </a>
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-medium tracking-tight text-ds-text mb-4">
                  9. Alterações
                </h2>
                <p className="text-ds-muted leading-[1.6]">
                  Esta política pode ser atualizada periodicamente. Recomendamos revisar esta página regularmente
                  para se manter informado sobre nossas práticas de privacidade.
                </p>
              </section>

              <div className="mt-8 pt-8 border-t border-white/5">
                <p className="text-[10px] uppercase font-mono tracking-widest text-ds-muted">
                  Última atualização: 05 de fevereiro de 2026
                </p>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}

export default Privacidade
