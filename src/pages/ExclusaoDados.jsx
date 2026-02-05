import React from 'react'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import SEOHelmet from '../components/SEOHelmet'

const ExclusaoDados = () => {
  return (
    <>
      <SEOHelmet 
        title="Exclusão de Dados"
        description="Instruções para solicitar a exclusão de seus dados do Svicero Studio."
      />
      <div className="min-h-screen bg-cream">
        <Header variant="solid" />
        
        <div className="pt-[200px] pb-24 px-4 md:px-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-title text-4xl md:text-5xl font-semibold text-low-dark mb-8">
              Exclusão de Dados
            </h1>

            <div className="bg-white rounded-xl shadow-md p-8 md:p-12 space-y-8">
              <section>
                <h2 className="font-title text-2xl font-semibold text-low-dark mb-4">
                  Como Solicitar a Exclusão dos Seus Dados
                </h2>
                <p className="text-low-medium leading-relaxed mb-4">
                  Respeitamos sua privacidade e seu direito de controlar suas informações pessoais. 
                  Se você deseja que seus dados sejam removidos de nossos sistemas, siga as instruções abaixo.
                </p>
              </section>

              <section>
                <h2 className="font-title text-2xl font-semibold text-low-dark mb-4">
                  Dados Armazenados
                </h2>
                <p className="text-low-medium leading-relaxed mb-4">
                  Armazenamos as seguintes informações quando você interage com nosso site:
                </p>
                <ul className="list-disc list-inside text-low-medium space-y-2 ml-4">
                  <li>Nome e e-mail fornecidos em formulários de contato</li>
                  <li>Mensagens enviadas através dos formulários</li>
                  <li>Dados de navegação coletados via cookies</li>
                  <li>Comentários feitos através do Facebook (gerenciados pelo Facebook)</li>
                </ul>
              </section>

              <section>
                <h2 className="font-title text-2xl font-semibold text-low-dark mb-4">
                  Processo de Exclusão
                </h2>
                <div className="bg-primary/5 rounded-lg p-6 mb-4">
                  <h3 className="font-title text-lg font-semibold text-low-dark mb-3">
                    Passo 1: Entre em Contato
                  </h3>
                  <p className="text-low-medium mb-4">
                    Envie um e-mail para:
                  </p>
                  <a 
                    href="mailto:hello@svicerostudio.com.br?subject=Solicitação de Exclusão de Dados"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
                  >
                    <i className="fa-solid fa-envelope"></i>
                    hello@svicerostudio.com.br
                  </a>
                </div>

                <div className="bg-primary/5 rounded-lg p-6 mb-4">
                  <h3 className="font-title text-lg font-semibold text-low-dark mb-3">
                    Passo 2: Informações Necessárias
                  </h3>
                  <p className="text-low-medium mb-3">
                    No e-mail, inclua:
                  </p>
                  <ul className="list-disc list-inside text-low-medium space-y-2 ml-4">
                    <li>Seu nome completo</li>
                    <li>E-mail usado nos formulários ou cadastros</li>
                    <li>Descrição dos dados que deseja excluir</li>
                    <li>Confirmação de que você é o titular dos dados</li>
                  </ul>
                </div>

                <div className="bg-primary/5 rounded-lg p-6">
                  <h3 className="font-title text-lg font-semibold text-low-dark mb-3">
                    Passo 3: Processamento
                  </h3>
                  <p className="text-low-medium">
                    Processaremos sua solicitação em até <strong>7 dias úteis</strong> e enviaremos 
                    uma confirmação por e-mail assim que a exclusão for concluída.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="font-title text-2xl font-semibold text-low-dark mb-4">
                  Comentários do Facebook
                </h2>
                <p className="text-low-medium leading-relaxed mb-4">
                  Para excluir comentários feitos através do plugin do Facebook:
                </p>
                <ol className="list-decimal list-inside text-low-medium space-y-3 ml-4">
                  <li>Acesse a página onde você comentou</li>
                  <li>Clique nos três pontos (⋯) no seu comentário</li>
                  <li>Selecione "Excluir"</li>
                  <li>
                    Ou gerencie através das{' '}
                    <a 
                      href="https://www.facebook.com/help/contact/260749603972907" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      configurações de privacidade do Facebook
                    </a>
                  </li>
                </ol>
              </section>

              <section>
                <h2 className="font-title text-2xl font-semibold text-low-dark mb-4">
                  Dados Retidos por Obrigação Legal
                </h2>
                <p className="text-low-medium leading-relaxed">
                  Alguns dados podem ser retidos por períodos específicos quando exigido por lei ou 
                  para fins de auditoria, segurança ou prevenção de fraudes. Nesses casos, informaremos 
                  o motivo da retenção.
                </p>
              </section>

              <section>
                <h2 className="font-title text-2xl font-semibold text-low-dark mb-4">
                  Dúvidas
                </h2>
                <p className="text-low-medium leading-relaxed">
                  Se tiver dúvidas sobre o processo de exclusão de dados, entre em contato:
                  <br />
                  <a href="mailto:hello@svicerostudio.com.br" className="text-primary hover:underline">
                    hello@svicerostudio.com.br
                  </a>
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

export default ExclusaoDados
