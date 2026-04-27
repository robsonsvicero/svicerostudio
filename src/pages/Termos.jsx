import React from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import SEOHelmet from '../components/SEOHelmet'

const Termos = () => {
  return (
    <>
      <SEOHelmet
        title="Termos de Uso — Svicero Studio"
        description="Conheça os termos e condições de uso dos serviços do Svicero Studio: design estratégico, identidade visual e desenvolvimento web para profissionals e pequenos negócios."
      />
      <div className="min-h-screen bg-[#141414] font-body">
        <Header variant="solid" />

        <div className="pt-28 sm:pt-36 md:pt-[200px] pb-16 sm:pb-24 px-4 sm:px-6 md:px-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-title text-4xl md:text-5xl font-semibold text-low-dark mb-8">
              Termos de Uso
            </h1>

            <div className="bg-gelo/10 rounded-xl p-8 md:p-12 space-y-8">

              <section>
                <h2 className="font-title text-2xl font-semibold text-low-dark mb-4">
                  1. Aceitação dos Termos
                </h2>
                <p className="text-low-medium leading-relaxed">
                  Ao contratar os serviços do Svicero Studio ou utilizar este site, você declara ter lido,
                  compreendido e concordado com estes Termos de Uso. Caso não concorde com qualquer
                  disposição aqui prevista, pedimos que não prossiga com a contratação.
                </p>
              </section>

              <section>
                <h2 className="font-title text-2xl font-semibold text-low-dark mb-4">
                  2. Descrição dos Serviços
                </h2>
                <p className="text-low-medium leading-relaxed mb-4">
                  O Svicero Studio oferece serviços de design estratégico e tecnologia, incluindo, mas não
                  se limitando a:
                </p>
                <ul className="list-disc list-inside text-low-medium space-y-2 ml-4">
                  <li>Identidade visual e branding</li>
                  <li>Design de interfaces (UI/UX)</li>
                  <li>Desenvolvimento de sites e aplicações web (Front-end)</li>
                  <li>Pacotes integrados de presença digital</li>
                </ul>
                <p className="text-low-medium leading-relaxed mt-4">
                  O escopo detalhado de cada projeto é definido em proposta comercial enviada ao cliente
                  antes do início dos trabalhos.
                </p>
              </section>

              <section>
                <h2 className="font-title text-2xl font-semibold text-low-dark mb-4">
                  3. Orçamento e Contratação
                </h2>
                <p className="text-low-medium leading-relaxed">
                  Todos os projetos são iniciados mediante aprovação formal de orçamento pelo cliente.
                  O orçamento tem validade de 15 dias corridos a partir da data de envio. A aceitação pode
                  ser feita por e-mail, WhatsApp ou assinatura de contrato. Modificações no escopo
                  acordado poderão implicar ajuste de prazo e valor.
                </p>
              </section>

              <section>
                <h2 className="font-title text-2xl font-semibold text-low-dark mb-4">
                  4. Pagamentos
                </h2>
                <p className="text-low-medium leading-relaxed mb-4">
                  As condições de pagamento são definidas na proposta comercial de cada projeto.
                  Em geral, adotamos:
                </p>
                <ul className="list-disc list-inside text-low-medium space-y-2 ml-4">
                  <li>Entrada de 50% do valor total para início do projeto</li>
                  <li>Saldo restante na entrega dos arquivos finais ou ativação do site</li>
                  <li>Pagamento via PIX, transferência bancária ou boleto</li>
                </ul>
                <p className="text-low-medium leading-relaxed mt-4">
                  O não pagamento dentro do prazo acordado poderá suspender a entrega do projeto e sujeitar
                  o cliente a juros de mora de 1% ao mês e multa de 2% sobre o valor em aberto.
                </p>
              </section>

              <section>
                <h2 className="font-title text-2xl font-semibold text-low-dark mb-4">
                  5. Revisões e Alterações
                </h2>
                <p className="text-low-medium leading-relaxed">
                  Cada pacote inclui um número definido de rodadas de revisão, conforme especificado na
                  proposta. Revisões adicionais além do acordado serão cobradas separadamente. Solicitações
                  de alteração que modifiquem o escopo original do projeto serão tratadas como novo
                  orçamento.
                </p>
              </section>

              <section>
                <h2 className="font-title text-2xl font-semibold text-low-dark mb-4">
                  6. Prazos de Entrega
                </h2>
                <p className="text-low-medium leading-relaxed">
                  Os prazos de entrega são estimados a partir do recebimento integral do briefing, materiais
                  e informações necessárias fornecidas pelo cliente, além do pagamento da entrada. Atrasos
                  no envio de conteúdo, feedbacks ou aprovações por parte do cliente poderão impactar
                  o cronograma sem responsabilidade do Svicero Studio.
                </p>
              </section>

              <section>
                <h2 className="font-title text-2xl font-semibold text-low-dark mb-4">
                  7. Propriedade Intelectual
                </h2>
                <p className="text-low-medium leading-relaxed mb-4">
                  Após a quitação integral do projeto, todos os direitos sobre os arquivos entregues são
                  transferidos ao cliente. Até a quitação total, os materiais permanecem de propriedade
                  do Svicero Studio.
                </p>
                <p className="text-low-medium leading-relaxed">
                  O Svicero Studio reserva-se o direito de exibir o projeto em seu portfólio, redes sociais
                  e materiais de divulgação, salvo acordo de confidencialidade expresso por escrito.
                  Ferramentas, processos e metodologias utilizados na execução do projeto são e permanecem
                  propriedade exclusiva do Svicero Studio.
                </p>
              </section>

              <section>
                <h2 className="font-title text-2xl font-semibold text-low-dark mb-4">
                  8. Responsabilidades do Cliente
                </h2>
                <p className="text-low-medium leading-relaxed mb-4">
                  O cliente é responsável por:
                </p>
                <ul className="list-disc list-inside text-low-medium space-y-2 ml-4">
                  <li>Fornecer informações, textos e imagens com direitos de uso garantidos</li>
                  <li>Cumprir os prazos de feedback e aprovação acordados</li>
                  <li>Garantir que o conteúdo fornecido não infrinja direitos de terceiros</li>
                  <li>Legalidade do uso do material entregue após a conclusão do projeto</li>
                </ul>
                <p className="text-low-medium leading-relaxed mt-4">
                  O Svicero Studio não se responsabiliza por eventuais infrações cometidas com os materiais
                  entregues após a conclusão e entrega do projeto.
                </p>
              </section>

              <section>
                <h2 className="font-title text-2xl font-semibold text-low-dark mb-4">
                  9. Confidencialidade
                </h2>
                <p className="text-low-medium leading-relaxed">
                  Ambas as partes comprometem-se a tratar com sigilo todas as informações confidenciais
                  trocadas durante o projeto, incluindo dados estratégicos, financeiros e operacionais.
                  Esta obrigação permanece em vigor por 2 anos após o encerramento do projeto, salvo
                  disposição contratual em contrário.
                </p>
              </section>

              <section>
                <h2 className="font-title text-2xl font-semibold text-low-dark mb-4">
                  10. Rescisão
                </h2>
                <p className="text-low-medium leading-relaxed">
                  Qualquer das partes pode rescindir o contrato mediante comunicação formal por escrito
                  com antecedência mínima de 5 dias úteis. Em caso de rescisão pelo cliente após início
                  dos trabalhos, os valores pagos até a data não serão reembolsados, sendo devida a
                  remuneração proporcional ao trabalho já realizado. Em caso de rescisão por parte do
                  Svicero Studio sem justa causa, será reembolsada a quantia proporcional ao trabalho
                  não executado.
                </p>
              </section>

              <section>
                <h2 className="font-title text-2xl font-semibold text-low-dark mb-4">
                  11. Limitação de Responsabilidade
                </h2>
                <p className="text-low-medium leading-relaxed">
                  O Svicero Studio não se responsabiliza por danos indiretos, lucros cessantes ou
                  prejuízos decorrentes do uso ou impossibilidade de uso dos materiais entregues,
                  nem por resultados comerciais específicos esperados pelo cliente. A responsabilidade
                  máxima do Svicero Studio fica limitada ao valor total pago pelo cliente no projeto
                  em questão.
                </p>
              </section>

              <section>
                <h2 className="font-title text-2xl font-semibold text-low-dark mb-4">
                  12. Lei Aplicável e Foro
                </h2>
                <p className="text-low-medium leading-relaxed">
                  Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil. Fica
                  eleito o foro da Comarca de São Paulo — SP para dirimir quaisquer controvérsias
                  decorrentes deste instrumento, com renúncia expressa a qualquer outro, por mais
                  privilegiado que seja.
                </p>
              </section>

              <section>
                <h2 className="font-title text-2xl font-semibold text-low-dark mb-4">
                  13. Contato
                </h2>
                <p className="text-low-medium leading-relaxed">
                  Dúvidas sobre estes termos? Entre em contato:
                  <br />
                  <a href="mailto:contato@svicerostudio.com.br" className="text-secondary hover:underline">
                    contato@svicerostudio.com.br
                  </a>
                  <br />
                  Ou acesse nossa página de{' '}
                  <Link to="/contato" className="text-secondary hover:underline">
                    Contato
                  </Link>.
                </p>
              </section>

              <div className="mt-8 pt-8 border-t border-cream/40">
                <p className="text-sm text-low-medium">
                  Última atualização: 27 de março de 2026
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

export default Termos
