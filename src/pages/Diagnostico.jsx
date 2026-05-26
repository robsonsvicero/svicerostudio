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
              Uma conversa estratégica para entender por que a imagem da sua clínica ainda não 
              sustenta o valor que você merece cobrar — e o que precisa mudar na sua comunicação 
              visual para afastar a concorrência por preço.
            </p>

            <p className="mx-auto mt-4 max-w-3xl text-sm sm:text-base leading-[1.6] text-ds-muted">
              Profissionais diagnosticam, amadores prescrevem. Antes de sugerir cores, 
              logotipos ou mudanças estruturais em sites, avaliamos os gargalos de percepção do seu consultório.
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
                É uma sessão online de 45 a 60 minutos em que analisamos individualmente como 
                a sua prática clínica é percebida hoje pelo mercado local, identificando onde a sua imagem 
                está drenando seus lucros e quais ajustes estéticos vão apoiar o fechamento de tratamentos de alto ticket.
              </p>

              <p className="mt-4 text-base sm:text-lg leading-[1.6] text-ds-muted">
                Não é uma reunião comercial para recolher um "orçamento de logotipo". É uma 
                conversa de negócios em que avaliamos sua estrutura de tratamentos, perfil de público-alvo 
                particular e principais concorrentes regionais. O design só entra após este alinhamento estratégico.
              </p>

              <ul className="mt-6 space-y-2 text-base sm:text-lg text-ds-muted leading-[1.6]">
                <li>• Sessão 100% consultiva, com foco em análise de posicionamento real.</li>
                <li>• Abordagem focada em objetivos de faturamento e valor percebido.</li>
                <li>
                  • Você sai com clareza exata sobre quais ruídos visuais estão fazendo você disputar pacientes por preço.
                </li>
              </ul>
            </div>

            <div className="rounded-[2rem] border border-white/5 bg-[#141414]/60 backdrop-blur-xl p-8 shadow-sm hover:border-white/10 transition-colors">
              <p className="text-[10px] uppercase font-mono tracking-widest text-ds-accent">
                QUEM SE BENEFICIA DESTA ANÁLISE
              </p>

              <h3 className="mt-4 text-2xl sm:text-3xl font-medium tracking-tight text-ds-text">
                Este diagnóstico é ideal se você:
              </h3>

              <ul className="mt-5 space-y-3 text-base sm:text-lg text-ds-muted leading-[1.6]">
                <li>
                  • Possui infraestrutura de excelência e alta qualificação técnica, mas sente que sua marca atual atrai pacientes focados em descontos.
                </li>
                <li>
                  • Deseja aumentar o ticket médio e focar em tratamentos particulares complexos, mas enfrenta dificuldades para justificar propostas de maior valor.
                </li>
                <li>
                  • Decidiu reestruturar a presença visual da sua clínica e quer estabelecer um posicionamento imponente desde o primeiro momento, evitando retrabalhos.
                </li>
                <li>
                  • Procura um parceiro estratégico focado em soluções comerciais, em vez de agências focadas em templates ou produções genéricas.
                </li>
              </ul>

              <p className="mt-6 text-sm sm:text-base text-ds-muted leading-[1.6]">
                Se você identificou dois ou mais desses cenários na sua clínica, este diagnóstico é o ponto de partida ideal para alinhar sua marca à excelência da sua entrega técnica.
              </p>
            </div>
          </div>
        </section>

        {/* BLOCO 2 – Como funciona na prática */}
        <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-10 lg:pb-20">
          <div className="rounded-[2rem] border border-white/5 bg-[#141414]/60 backdrop-blur-xl p-8 sm:p-10 lg:p-12 shadow-sm">
            <p className="text-[10px] uppercase font-mono tracking-widest text-ds-accent">
              COMO FUNCIONA O PROCESSO
            </p>

            <h2 className="mt-4 text-[1.875rem] md:text-4xl font-medium tracking-tight text-ds-text">
              Da avaliação comercial à consolidação visual
            </h2>

            <p className="mt-6 max-w-3xl text-lg leading-[1.6] text-ds-muted">
              Analisamos seu mercado de forma objetiva: primeiro entendemos as metas comerciais e o perfil 
              de público que a sua clínica precisa atrair, para depois definirmos como a identidade e o design 
              vão pavimentar esse caminho de valor.
            </p>

            <div className="mt-8 grid gap-8 md:grid-cols-3">
              <div>
                <h3 className="text-ds-text font-medium text-lg mb-2">
                  1. Mapeamento de Contexto
                </h3>
                <p className="text-sm sm:text-base text-ds-muted leading-[1.6]">
                  Iniciamos com perguntas estruturadas sobre o modelo de atendimentos, público local, principais 
                  especialidades da clínica e o histórico de recusas de orçamentos complexos.
                </p>
              </div>

              <div>
                <h3 className="text-ds-text font-medium text-lg mb-2">
                  2. Identificação de Gargalos
                </h3>
                <p className="text-sm sm:text-base text-ds-muted leading-[1.6]">
                  Avaliamos os seus pontos de contato atuais (Instagram, site, papelaria de apresentação) para 
                  descobrir exatamente onde a sua imagem está gerando ruídos ou desvalorizando seu currículo.
                </p>
              </div>

              <div>
                <h3 className="text-ds-text font-medium text-lg mb-2">
                  3. Direcionamento Prático
                </h3>
                <p className="text-sm sm:text-base text-ds-muted leading-[1.6]">
                  Ao final da sessão, você recebe um direcionamento claro sobre as correções necessárias e se faz 
                  sentido avançarmos para um projeto completo de Engenharia de Marca com o estúdio.
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
                  • Entendimento claro sobre os fatores de comunicação visual que impedem a sua clínica de manter tabelas de preço mais lucrativas.
                </li>
                <li>
                  • Uma perspectiva externa, técnica e profissional a respeito da imagem que a sua clínica transmite hoje para pacientes em potencial.
                </li>
                <li>
                  • Um filtro estratégico para descobrir se a sua prioridade atual é de reposicionamento de marca, nova identidade visual ou modernização de site.
                </li>
                <li>
                  • Segurança para investir em comunicação de forma assertiva, eliminando soluções estéticas vazias que não alteram seus resultados financeiros.
                </li>
              </ul>

              <p className="mt-6 text-sm sm:text-base text-ds-muted leading-[1.6] max-w-2xl">
                Em resumo: você não sai da conversa com uma mera lista de preços de artes genéricas, e sim com um diagnóstico analítico da percepção da sua clínica e as diretrizes para valorizar os seus serviços.
              </p>
            </div>

            {/* CARD DESTACADO DE CTA */}
            <div className="relative rounded-[2rem] border border-ds-accent/30 bg-ds-accent/10 backdrop-blur-xl p-8 flex flex-col justify-between shadow-[0_8px_32px_rgba(184,115,51,0.15)] overflow-hidden">
              <div className="absolute inset-0 bg-ds-accent/5 pointer-events-none mix-blend-overlay"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-medium tracking-tight text-ds-text mb-4">
                  Solicitar Diagnóstico
                </h3>

                <p className="text-sm sm:text-base text-ds-text/90 leading-[1.6] mb-6">
                  Para agendar sua análise, você pode iniciar um contato direto pelo WhatsApp ou preencher nosso 
                  formulário estratégico. Avaliaremos o seu contexto clínico em detalhes antes de estruturar qualquer proposta.
                </p>

                <div className="flex flex-col gap-4">
                  <Button
                    href="https://wa.me/5511964932007?text=Ol%C3%A1%20Robson%2C%20gostaria%20de%20agendar%20um%20diagn%C3%B3stico%20de%20posicionamento%20para%20a%20minha%20marca."
                    target="_blank"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="primary"
                    className="w-full"
                  >
                    Agendar pelo WhatsApp
                  </Button>

                  <Button
                    href="/formulario-interesse"
                    variant="outline"
                    className="w-full"
                  >
                    Preencher Formulário Estratégico
                  </Button>

                  <p className="text-[11px] text-white/70 leading-[1.6] mt-1 font-mono uppercase tracking-wider text-center">
                    O diagnóstico não constitui compromisso contratual imediato. É um passo de alinhamento mútuo 
                    para entender se o Svicero Studio é o parceiro ideal para a maturidade atual do seu consultório.
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