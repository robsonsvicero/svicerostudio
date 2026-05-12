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
      <div className="min-h-screen bg-charcoal font-body relative overflow-hidden">
        {/* Background lighting effects */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-copper/5 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-copper/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/4 translate-y-1/4" />

        <Header variant="solid" />

        <main className="pt-28 sm:pt-36 md:pt-[200px] pb-16 sm:pb-24 px-4 sm:px-6 md:px-16 relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-[3.75rem] font-medium tracking-[-0.02em] leading-[1.1] text-cream text-left mb-6">
              Termos de Uso e Responsabilidades
            </h1>

            <div className="bg-[#141414]/60 backdrop-blur-xl border border-white/5 shadow-2xl rounded-[2rem] p-8 md:p-12 space-y-8">
              
              <section>
                <p className="text-muted leading-[1.6] mb-4">
                  Bem-vindo ao site do Svicero Studio.<br />
                  Ao acessar e utilizar este site, você concorda com os termos e condições abaixo. Caso não concorde com algum deles, recomendamos que não utilize este site.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-medium tracking-tight text-cream mb-4">
                  1. Informações Gerais
                </h2>
                <div className="space-y-4 text-muted leading-[1.6]">
                  <p>1.1. O site Svicero Studio é mantido por Svicero Studio (doravante denominado simplesmente “Estúdio”), um estúdio de estratégia de marca e design focado em posicionamento e percepção de valor.</p>
                  <p>1.2. Estes Termos de Uso regulam o acesso e uso do site, bem como a forma de utilização das informações e conteúdos disponibilizados, incluindo textos, imagens, cases, portfólio, materiais educativos e demais conteúdos relacionados a branding e design.</p>
                  <p>1.3. Ao utilizar o site, o usuário declara ter lido, compreendido e aceito integralmente estes Termos.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-medium tracking-tight text-cream mb-4">
                  2. Uso do Site
                </h2>
                <div className="space-y-4 text-muted leading-[1.6]">
                  <p>2.1. O usuário compromete-se a utilizar o site de forma ética, responsável e em conformidade com a legislação vigente.</p>
                  <p>2.2. É proibido ao usuário:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Utilizar o site para qualquer finalidade ilegal, ofensiva, difamatória, abusiva, discriminatória ou que viole direitos do Estúdio ou de terceiros;</li>
                    <li>Tentar burlar, invadir, testar vulnerabilidades ou prejudicar o funcionamento do site ou de seus sistemas;</li>
                    <li>Copiar, reproduzir, distribuir, modificar, traduzir, vender ou explorar comercialmente qualquer conteúdo do site sem autorização prévia e por escrito do Estúdio.</li>
                  </ul>
                  <p>2.3. O uso de qualquer informação, insight, orientação ou material obtido neste site é de inteira responsabilidade do usuário, que deve avaliar se tais informações são adequadas à sua realidade e objetivos.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-medium tracking-tight text-cream mb-4">
                  3. Conteúdos e Propriedade Intelectual
                </h2>
                <div className="space-y-4 text-muted leading-[1.6]">
                  <p>3.1. Todos os conteúdos disponibilizados neste site, incluindo, mas não se limitando a textos, imagens, marcas, logos, elementos gráficos, projetos, cases, portfólios, apresentações, vídeos, áudios, layouts e demais materiais relacionados à estratégia de marca e design, são de propriedade exclusiva do Estúdio ou de terceiros licenciantes, protegidos pelas leis de direitos autorais, marcas e propriedade intelectual.</p>
                  <p>3.2. É vedada qualquer reprodução, distribuição, exibição, transmissão, publicação, criação de obras derivadas ou qualquer outra forma de utilização dos conteúdos deste site sem autorização expressa e por escrito do Estúdio, exceto nos casos permitidos pela legislação (uso estritamente pessoal, sem fins comerciais, e desde que mantida a integridade e a autoria dos conteúdos).</p>
                  <p>3.3. O uso indevido de qualquer conteúdo poderá acarretar medidas administrativas, civis e criminais cabíveis.</p>
                  <p>3.4. Cases e projetos apresentados no site podem ter informações suprimidas ou adaptadas por questões de confidencialidade e estratégia, não representando necessariamente todas as etapas ou entregas envolvidas em cada projeto real.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-medium tracking-tight text-cream mb-4">
                  4. Serviços Oferecidos
                </h2>
                <div className="space-y-4 text-muted leading-[1.6]">
                  <p>4.1. As informações sobre serviços, metodologias, entregas, prazos, valores e condições apresentadas neste site têm caráter informativo e podem ser alteradas a qualquer momento, sem aviso prévio.</p>
                  <p>4.2. A contratação de serviços do Estúdio não ocorre diretamente por meio destes Termos, mas sim por instrumentos específicos (propostas comerciais, contratos, termos de aceite, e-mails formais, etc.), que prevalecerão sobre as informações gerais do site.</p>
                  <p>4.3. O Estúdio reserva-se o direito de:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Avaliar previamente a aderência de cada projeto ao posicionamento, agenda e disponibilidade do Estúdio;</li>
                    <li>Recusar atendimentos ou serviços em situações que violem a legislação, a ética profissional, a integridade da equipe ou estes Termos.</li>
                  </ul>
                  <p>4.4. Eventuais resultados mencionados em cases, depoimentos, métricas ou exemplos não constituem garantia de resultados futuros, pois dependem de variáveis externas e do contexto específico de cada negócio.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-medium tracking-tight text-cream mb-4">
                  5. Responsabilidades do Usuário
                </h2>
                <div className="space-y-4 text-muted leading-[1.6]">
                  <p>5.1. Ao utilizar o site, o usuário declara que:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Possui capacidade legal para utilizar este site, ou que está devidamente autorizado por seus responsáveis legais;</li>
                    <li>Não fará uso do site para fins ilegais, abusivos ou que violem direitos do Estúdio ou de terceiros;</li>
                    <li>Fornecerá informações verdadeiras, completas e atualizadas sempre que solicitado (por exemplo, em formulários de contato ou orçamento).</li>
                  </ul>
                  <p>5.2. O usuário é integralmente responsável por:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Qualquer conteúdo, informação ou mensagem que enviar ao Estúdio por meio dos canais de contato disponíveis no site (formulários, e-mails, WhatsApp, etc.);</li>
                    <li>Danos de qualquer natureza causados ao Estúdio, a outros usuários ou a terceiros, decorrentes de seu uso indevido do site ou de violação destes Termos.</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-medium tracking-tight text-cream mb-4">
                  6. Limitação de Responsabilidade do Estúdio
                </h2>
                <div className="space-y-4 text-muted leading-[1.6]">
                  <p>6.1. O Estúdio empenha-se para manter as informações do site atualizadas, corretas e relevantes, mas não garante que todo o conteúdo esteja livre de erros, falhas de atualização, imprecisões ou interrupções de disponibilidade.</p>
                  <p>6.2. O Estúdio não se responsabiliza por:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Indisponibilidade temporária do site, falhas técnicas, problemas de servidor, manutenção, atualizações ou falhas de conexão de internet do usuário;</li>
                    <li>Eventuais danos diretos ou indiretos, materiais ou morais, lucros cessantes ou outras perdas decorrentes do uso ou da incapacidade de uso do site;</li>
                    <li>Decisões tomadas pelo usuário com base em informações do site, incluindo escolhas estratégicas de marca, posicionamento e comunicação.</li>
                  </ul>
                  <p>6.3. O site pode conter links para páginas de terceiros (como redes sociais, parceiros, plataformas de conteúdo ou ferramentas externas). Esses links são fornecidos apenas para conveniência do usuário, não implicando em endosso, controle ou responsabilidade do Estúdio sobre o conteúdo, políticas ou práticas desses sites.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-medium tracking-tight text-cream mb-4">
                  7. Privacidade e Proteção de Dados
                </h2>
                <div className="space-y-4 text-muted leading-[1.6]">
                  <p>7.1. O Estúdio poderá coletar dados pessoais informados voluntariamente pelo usuário (como nome, e-mail, telefone, empresa, cargo e outras informações relevantes) por meio de formulários de contato, pedidos de proposta, cadastro em listas de e-mail ou outros pontos de contato disponibilizados no site.</p>
                  <p>7.2. O tratamento desses dados observará a legislação aplicável, especialmente a Lei Geral de Proteção de Dados (LGPD – Lei nº 13.709/2018), e será realizado para finalidades legítimas, como:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Atendimento de solicitações e contatos iniciados pelo próprio usuário;</li>
                    <li>Envio de informações sobre serviços, conteúdos, novidades e materiais do Estúdio (quando o usuário consentir ou solicitar);</li>
                    <li>Fins administrativos e de melhoria da experiência do usuário no site.</li>
                  </ul>
                  <p>7.3. O Estúdio adota medidas de segurança razoáveis para proteger os dados pessoais, mas não pode garantir segurança absoluta contra todos os riscos inerentes ao ambiente digital. Ao utilizar o site e fornecer seus dados, o usuário reconhece e aceita esses riscos.</p>
                  <p>7.4. O usuário poderá, a qualquer momento, solicitar esclarecimentos sobre o tratamento de seus dados pessoais por meio dos canais de contato indicados na Seção 12.</p>
                  <p>7.5. Caso o Estúdio disponibilize uma Política de Privacidade específica, ela complementará estes Termos, prevalecendo naquilo que tratar de forma mais detalhada sobre proteção de dados pessoais.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-medium tracking-tight text-cream mb-4">
                  8. Comunicação
                </h2>
                <div className="space-y-4 text-muted leading-[1.6]">
                  <p>8.1. Qualquer comunicação oficial relacionada a estes Termos ou ao uso do site deverá ser realizada pelos canais de contato oficiais do Estúdio:</p>
                  <p>
                    E-mail: <a href="mailto:hello@svicerostudio.com.br" className="text-copper hover:underline">hello@svicerostudio.com.br</a><br />
                    WhatsApp: <a href="https://wa.me/5511964932007" target="_blank" rel="noopener noreferrer" className="text-copper hover:underline">+55 (11) 96493-2007</a>
                  </p>
                  <p>8.2. O Estúdio poderá entrar em contato com o usuário utilizando os dados informados pelo próprio usuário (como e-mail e WhatsApp), respeitando as finalidades para as quais tais dados foram fornecidos.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-medium tracking-tight text-cream mb-4">
                  9. Alterações nos Termos
                </h2>
                <div className="space-y-4 text-muted leading-[1.6]">
                  <p>9.1. O Estúdio poderá, a qualquer tempo, alterar, atualizar ou complementar estes Termos de Uso, sem necessidade de aviso prévio individual.</p>
                  <p>9.2. A versão atualizada estará sempre disponível neste site, com indicação da data da última atualização.</p>
                  <p>9.3. Ao continuar utilizando o site após eventuais alterações, o usuário declara estar ciente e concordar com a nova versão dos Termos.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-medium tracking-tight text-cream mb-4">
                  10. Vigência e Rescisão
                </h2>
                <div className="space-y-4 text-muted leading-[1.6]">
                  <p>10.1. Estes Termos de Uso permanecem em vigor por prazo indeterminado, enquanto o site estiver ativo.</p>
                  <p>10.2. O Estúdio poderá, a seu exclusivo critério, restringir, suspender ou encerrar o acesso de qualquer usuário ao site em caso de descumprimento destes Termos ou de uso considerado inadequado, abusivo ou ilícito.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-medium tracking-tight text-cream mb-4">
                  11. Legislação Aplicável e Foro
                </h2>
                <div className="space-y-4 text-muted leading-[1.6]">
                  <p>11.1. Estes Termos de Uso serão regidos e interpretados de acordo com as leis da República Federativa do Brasil.</p>
                  <p>11.2. Fica eleito o foro da Comarca de São Paulo/SP, com renúncia expressa a qualquer outro, por mais privilegiado que seja, para dirimir eventuais controvérsias decorrentes destes Termos ou do uso do site.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-medium tracking-tight text-cream mb-4">
                  12. Contato
                </h2>
                <div className="space-y-4 text-muted leading-[1.6]">
                  <p>Em caso de dúvidas sobre estes Termos de Uso, sobre o funcionamento do site ou sobre nossos serviços, entre em contato conosco:</p>
                  <p>
                    <strong>Svicero Studio</strong><br />
                    E-mail: <a href="mailto:hello@svicerostudio.com.br" className="text-copper hover:underline">hello@svicerostudio.com.br</a><br />
                    WhatsApp: <a href="https://wa.me/5511964932007" target="_blank" rel="noopener noreferrer" className="text-copper hover:underline">+55 (11) 96493-2007</a><br />
                    Endereço físico: O Svicero Studio atua de forma remota e não possui atendimento presencial ao público.
                  </p>
                </div>
              </section>

              <div className="mt-8 pt-8 border-t border-white/5 text-center">
                <p className="text-[10px] uppercase font-mono tracking-widest text-muted">
                  Última atualização: 11 de maio de 2026
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

export default Termos
