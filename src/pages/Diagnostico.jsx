import React from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import Button from "../components/UI/Button";
import SEOHelmet from "../components/SEOHelmet";

const Diagnostico = () => {
  return (
    <>
      <SEOHelmet
        title="Diagnóstico de Posicionamento Clínico"
        description="Uma análise estratégica individual para avaliar por que a marca da sua clínica não apoia o valor dos seus tratamentos particulares e o que precisa mudar."
        canonical="/diagnostico"
      />

      <div className="bg-ds-bg min-h-screen text-ds-text font-body">
        <Header variant="solid" />

        {/* HERO */}
        <section className="relative overflow-hidden border-b border-white/5 pt-16">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-ds-accent/5 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-ds-accent/5 rounded-full blur-[80px] pointer-events-none -translate-x-1/3 translate-y-1/3" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-14 sm:py-20 text-center lg:px-10 lg:py-24">
            <span className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-ds-accent/25 bg-ds-accent/5 text-[11px] font-mono uppercase tracking-[.2em] text-ds-accent">
              <span className="w-1.5 h-1.5 rounded-full bg-ds-accent shadow-[0_0_10px_rgba(184,115,51,0.5)]" />
              ANÁLISE ESTRATÉGICA
            </span>

            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-[4rem] font-medium tracking-tight text-ds-text text-balance">
              Diagnóstico de Posicionamento
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-[1.6] text-ds-muted">
              Uma conversa estratégica para entender por que a imagem da sua clínica ainda não sustenta o valor que você merece cobrar e o que precisa mudar na sua comunicação e presença visual para afastar a concorrência por preço.
            </p>

            <p className="mx-auto mt-4 max-w-3xl text-sm sm:text-base leading-[1.6] text-ds-muted">
              Não é uma reunião de “opinião sobre layout”. É um exame de percepção de marca, com foco em posicionamento e valor percebido.
            </p>
          </div>
        </section>

        {/* BLOCO 1 – O que é e para quem é */}
        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <h2 className="text-[1.875rem] md:text-4xl font-medium tracking-tight text-ds-text">
                O que é o Diagnóstico de Posicionamento?
              </h2>

              <p className="mt-6 text-base sm:text-lg md:text-xl leading-[1.6] text-ds-muted">
                É uma sessão online, de 45 a 60 minutos, em que analisamos individualmente como a sua prática clínica é percebida hoje pelo mercado local.
              </p>

              <p className="mt-4 text-base sm:text-lg leading-[1.6] text-ds-muted">
                Identificamos onde a sua imagem está protegendo seu faturamento e onde está drenando lucro, seja por confusão de posicionamento, comunicação genérica ou estética desalinhada com o nível da sua entrega técnica.
              </p>

              <ul className="mt-6 space-y-2 text-base sm:text-lg text-ds-muted leading-[1.6]">
                <li>• Sessão 100% consultiva, focada em análise de posicionamento real, não em “achismos de design”.</li>
                <li>• Conversa de negócios em que avaliamos sua estrutura de tratamentos, perfil de público-alvo e principais concorrentes na região.</li>
                <li>
                  • Abordagem focada em objetivos de faturamento e valor percebido, não apenas em aparência visual.
                </li>
                <li>
                  • Você sai com clareza sobre quais ruídos de imagem estão fazendo sua clínica disputar pacientes por preço — e quais ajustes podem começar a inverter esse jogo.
                </li>
              </ul>
            </div>

            <div className="rounded-[2rem] border border-white/5 bg-ds-surface backdrop-blur-xl p-8 shadow-sm hover:border-white/10 transition-colors">
              <p className="text-[10px] uppercase font-mono tracking-widest text-ds-accent">
                QUEM SE BENEFICIA DESTA ANÁLISE
              </p>

              <h3 className="mt-4 text-2xl sm:text-3xl font-medium tracking-tight text-ds-text">
                Este diagnóstico é ideal se você:
              </h3>

              <ul className="mt-5 space-y-3 text-base sm:text-lg text-ds-muted leading-[1.6]">
                <li>
                  • Possui infraestrutura e excelência técnica, mas sente que sua marca ainda atrai pacientes focados em descontos.
                </li>
                <li>
                  • Deseja aumentar o ticket médio e focar em tratamentos particulares mais complexos, mas encontra dificuldades para justificar propostas de maior valor.
                </li>
                <li>
                  • Quer reposicionar a presença visual da clínica e estabelecer uma percepção de autoridade desde o primeiro contato, evitando retrabalhos e mudanças fragmentadas.
                </li>
                <li>
                  • Procura um parceiro estratégico focado em soluções comerciais, não em “templates de agência” ou peças soltas para redes sociais.
                </li>
              </ul>

              <p className="mt-6 text-sm sm:text-base text-ds-muted leading-[1.6]">
                Se vê em pelo menos um desses cenários e quer um diagnóstico claro sobre o que precisa mudar na sua marca para que ela acompanhe a qualidade da sua entrega clínica.
              </p>
            </div>
          </div>
        </section>

        {/* BLOCO 2 – Como funciona na prática */}
        <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-10 lg:pb-20">
          <div className="rounded-[2rem] border border-white/5 bg-ds-surface backdrop-blur-xl p-8 sm:p-10 lg:p-12 shadow-sm">
            <p className="text-[10px] uppercase font-mono tracking-widest text-ds-accent">
              COMO FUNCIONA O PROCESSO
            </p>

            <h2 className="mt-4 text-[1.875rem] md:text-4xl font-medium tracking-tight text-ds-text">
              Da avaliação comercial à consolidação visual
            </h2>

            <p className="mt-6 max-w-3xl text-lg leading-[1.6] text-ds-muted">
              AAnalisamos seu mercado de forma objetiva. Primeiro, entendemos metas comerciais e o perfil de público que a sua clínica precisa atrair. Depois, definimos como a identidade e o design devem pavimentar esse caminho de valor.
            </p>

            <div className="mt-8 grid gap-8 md:grid-cols-3">
              <div>
                <h3 className="text-ds-text font-medium text-lg mb-2">
                  1. Mapeamento de contexto
                </h3>
                <p className="text-sm sm:text-base text-ds-muted leading-[1.6]">
                  Levantamos informações estruturadas sobre o modelo de atendimento, público local, principais especialidades da clínica e histórico de recusas ou pedidos de desconto.
                </p>
              </div>

              <div>
                <h3 className="text-ds-text font-medium text-lg mb-2">
                  2. Identificação de gargalos
                </h3>
                <p className="text-sm sm:text-base text-ds-muted leading-[1.6]">
                  Avaliamos seus pontos de contato atuais (site, redes, materiais, perfil de apresentação) para entender onde a sua imagem está gerando ruídos ou não sustentando o nível do seu currículo e da sua prática clínica.
                </p>
              </div>

              <div>
                <h3 className="text-ds-text font-medium text-lg mb-2">
                  3. Direcionamentop prático
                </h3>
                <p className="text-sm sm:text-base text-ds-muted leading-[1.6]">
                  Ao final da sessão, você recebe um direcionamento claro sobre as correções prioritárias — e, se fizer sentido, as próximas etapas para um projeto completo de marca e presença digital com o estúdio.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BLOCO 3 – O que você leva + CTA */}
        <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-10 lg:pb-24">
          <div className="grid gap-10 lg:grid-cols-[1.3fr,1fr] items-center">
            <div>
              <h2 className="text-[1.875rem] md:text-4xl font-medium tracking-tight text-ds-text">
                Os retornos práticos da sessão
              </h2>

              <ul className="mt-6 space-y-3 text-base sm:text-lg text-ds-muted leading-[1.6]">
                <li>
                  • Entendimento claro sobre os fatores de comunicação e imagem que impedem sua clínica de praticar tabelas de preço mais lucrativas.
                </li>
                <li>
                  • Uma perspectiva externa, técnica e profissional sobre se a sua marca atual transmite, ou não, o nível de excelência que você já entrega.
                </li>
                <li>
                  • Um filtro estratégico para decidir se o próximo passo deve ser reposicionamento de marca, nova identidade visual ou modernização de site.
                </li>
                <li>
                  • Segurança para investir em comunicação de forma assertiva, evitando soluções estéticas isoladas que não geram resultado financeiro.
                </li>
              </ul>

              <p className="mt-6 text-sm sm:text-base text-ds-muted leading-[1.6] max-w-2xl">
                Em resumo, você sai da sessão não com “dicas soltas”, mas com um diagnóstico analítico da percepção da sua clínica e das diretrizes para valorizar os seus serviços — seja para ajustar preços, qualificar melhor a demanda ou preparar um projeto maior de marca.
              </p>
            </div>

            {/* CARD DESTACADO DE CTA */}
            <div className="relative rounded-[2rem] border border-ds-accent/30 bg-ds-surface backdrop-blur-xl p-6 sm:p-8 lg:p-10 flex flex-col justify-between shadow-[0_8px_32px_rgba(184,115,51,0.15)] overflow-hidden">
              <div className="absolute inset-0 bg-ds-accent/5 pointer-events-none mix-blend-overlay"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-medium tracking-tight text-ds-text mb-4">
                  Solicitar Diagnóstico
                </h3>

                <p className="text-sm sm:text-base text-ds-text/90 leading-[1.6] mb-6">
                  Para agendar sua análise, você pode iniciar preenchendo nosso formulário, clicando no botão abaixo. Avaliaremos o contexto da sua clínica com base nas informações enviadas e retornaremos com detalhes sobre datas disponíveis, formato da sessão e próximos passos.
                </p>

                <div className="flex flex-col gap-4">
                  <Button
                  href="/formulario-interesse"
                    
                    variant="primary"
                    className="w-full"
                  >
                    Agendar diagnóstico
                  </Button>

                  <p className="text-[11px] text-ds-muted leading-[1.6] mt-1 font-mono uppercase tracking-wider text-center">
                    As vagas para diagnóstico são limitadas por mês para garantir profundidade em cada análise. O preenchimento do formulário não implica compromisso imediato com projeto completo, ele é o primeiro passo para entender se faz sentido avançarmos juntos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Diagnostico;