import React from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import Button from "../components/UI/Button";
import SEOHelmet from "../components/SEOHelmet";

const Diagnostico = () => {
  return (
    <>
      <SEOHelmet
        title="Diagnóstico de Posicionamento — Svicero Studio"
        description="Uma conversa estratégica para entender por que sua marca ainda não sustenta o preço que você merece cobrar — e o que precisa mudar no seu posicionamento para sair da guerra de preços."
        keywords="diagnóstico de posicionamento, estratégia de marca, guerra de preços, branding para empresários"
      />

      <div className="bg-charcoal min-h-screen text-cream font-body">
        <Header variant="solid" />

        {/* HERO */}
        <section className="relative overflow-hidden border-b border-white/5 pt-16">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-copper/5 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-copper/5 rounded-full blur-[80px] pointer-events-none -translate-x-1/3 translate-y-1/3" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-14 sm:py-20 text-center lg:px-10 lg:py-24">
            <span className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-copper/25 bg-copper/5 text-[11px] font-mono uppercase tracking-[.2em] text-copper">
              <span className="w-1.5 h-1.5 rounded-full bg-copper shadow-[0_0_10px_rgba(184,115,51,0.5)]" />
              PRIMEIRO PASSO
            </span>

            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-[4rem] font-medium tracking-tight text-cream text-balance">
              Diagnóstico de Posicionamento
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-[1.6] text-muted">
              Uma conversa estratégica para entender por que sua marca ainda não
              sustenta o preço que você merece cobrar — e o que precisa mudar no
              seu posicionamento para sair da guerra de preços.
            </p>

            <p className="mx-auto mt-4 max-w-3xl text-sm sm:text-base leading-[1.6] text-muted">
              Profissionais diagnosticam, amadores prescrevem. Antes de falar de
              logo, site ou “layout bonito”, entramos na sala da estratégia junto
              com você.
            </p>
          </div>
        </section>

       {/* BLOCO 1 – O que é e para quem é */}
        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <h2 className="text-[1.875rem] md:text-4xl font-medium tracking-tight text-cream">
                O que é o Diagnóstico de Posicionamento?
              </h2>

              <p className="mt-6 text-base sm:text-lg md:text-xl leading-[1.6] text-muted">
                É uma sessão online de 45–60 minutos em que analisamos juntos como
                sua marca é percebida hoje, onde ela está perdendo valor e quais
                ajustes de posicionamento podem te ajudar a cobrar melhor e atrair
                clientes mais alinhados.
              </p>

              <p className="mt-4 text-base sm:text-lg leading-[1.6] text-muted">
                Não é uma reunião para “pegar um orçamento de logo”. É uma
                conversa de dono de negócio para dono de negócio: falamos de
                objetivos, vendas, público, concorrência e percepção de marca. O
                design só entra depois disso, como ferramenta.
              </p>

              <ul className="mt-6 space-y-2 text-base sm:text-lg text-muted leading-[1.6]">
                <li>• Sessão 100% estratégica, sem pitch de venda disfarçado.</li>
                <li>• Usamos perguntas de negócio, não jargão de design.</li>
                <li>
                  • Você sai com clareza sobre por que está em guerra de preços
                  e o que precisa mudar na sua marca.
                </li>
              </ul>
            </div>

            <div className="rounded-[2rem] border border-white/5 bg-[#141414]/60 backdrop-blur-xl p-8 shadow-sm hover:border-white/10 transition-colors">
              <p className="text-[10px] uppercase font-mono tracking-widest text-copper">
                Para quem faz mais sentido
              </p>

              <h3 className="mt-4 text-2xl sm:text-3xl font-medium tracking-tight text-cream">
                Esse diagnóstico é ideal se você:
              </h3>

              <ul className="mt-5 space-y-3 text-base sm:text-lg text-muted leading-[1.6]">
                <li>
                  • Já vende, mas sente que sua marca te força a competir por
                  preço em vez de valor.
                </li>
                <li>
                  • Quer aumentar ticket médio, mas não tem segurança de
                  justificar preços mais altos.
                </li>
                <li>
                  • Está migrando para o digital e não quer começar com uma
                  marca fraca, igual a todo mundo.
                </li>
                <li>
                  • Quer um parceiro que pense junto com você, em vez de alguém
                  que só “faça arte” sob demanda.
                </li>
              </ul>

              <p className="mt-6 text-sm sm:text-base text-muted leading-[1.6]">
                Se você se identificou com dois ou mais pontos, este é o melhor
                próximo passo antes de qualquer decisão sobre identidade visual
                ou site.
              </p>
            </div>
          </div>
        </section>

        {/* BLOCO 2 – Como funciona na prática */}
        <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-10 lg:pb-20">
          <div className="rounded-[2rem] border border-white/5 bg-[#141414]/60 backdrop-blur-xl p-8 sm:p-10 lg:p-12 shadow-sm">
            <p className="text-[10px] uppercase font-mono tracking-widest text-copper">
              Como funciona
            </p>

            <h2 className="mt-4 text-[1.875rem] md:text-4xl font-medium tracking-tight text-cream">
              Da sala da estratégia à sala do design
            </h2>

            <p className="mt-6 max-w-3xl text-lg leading-[1.6] text-muted">
              Usamos a lógica do business designer: primeiro entendemos o jogo de
              negócio que você está jogando, depois pensamos em como a marca e o
              design podem te ajudar a ganhar esse jogo.
            </p>

            <div className="mt-8 grid gap-8 md:grid-cols-3">
              <div>
                <h3 className="text-cream font-medium text-lg mb-2">
                  1. Perguntas estratégicas
                </h3>
                <p className="text-sm sm:text-base text-muted leading-[1.6]">
                  Começamos com um roteiro de perguntas sobre negócio, mercado,
                  clientes, desafios e objetivos — inspirado nas perguntas que
                  uso em consultorias e nas aulas que você viu nos ebooks.
                </p>
              </div>

              <div>
                <h3 className="text-cream font-medium text-lg mb-2">
                  2. Mapa de dores e oportunidades
                </h3>
                <p className="text-sm sm:text-base text-muted leading-[1.6]">
                  Juntos, identificamos onde sua marca está te puxando para
                  baixo hoje: percepção, mensagem, diferenciação, experiência.
                  É aqui que surgem os verdadeiros gargalos.
                </p>
              </div>

              <div>
                <h3 className="text-cream font-medium text-lg mb-2">
                  3. Próximos passos claros
                </h3>
                <p className="text-sm sm:text-base text-muted leading-[1.6]">
                  Ao final, você recebe uma indicação clara de próximos passos:
                  se faz sentido um projeto com o estúdio, que tipo de projeto e
                  qual foco ele deveria ter para gerar mais valor.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BLOCO 3 – O que você leva + CTA */}
        <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-10 lg:pb-24">
          <div className="grid gap-10 lg:grid-cols-[1.3fr,1fr] items-center">
            <div>
              <h2 className="text-[1.875rem] md:text-4xl font-medium tracking-tight text-cream">
                O que você leva dessa conversa
              </h2>

              <ul className="mt-6 space-y-3 text-base sm:text-lg text-muted leading-[1.6]">
                <li>
                  • Clareza sobre por que você está em guerra de preços e quais
                  movimentos de marca podem te tirar dela.
                </li>
                <li>
                  • Visão externa, profissional, sobre a forma como seu negócio
                  se apresenta hoje.
                </li>
                <li>
                  • Um filtro: entender se o momento é de reposicionamento,
                  de identidade visual, de site novo — ou se antes disso você
                  precisa ajustar outras peças.
                </li>
                <li>
                  • Base para tomar decisões de investimento em marca com mais
                  segurança, sem cair em soluções estéticas que não mudam o
                  resultado.
                </li>
              </ul>

              <p className="mt-6 text-sm sm:text-base text-muted leading-[1.6] max-w-2xl">
                Em outras palavras: você não sai com um “orçamento de logo”. Você
                sai com um diagnóstico sobre o seu posicionamento e uma visão
                clara de como a marca pode sustentar o valor que você quer
                cobrar.
              </p>
            </div>

            <div className="relative rounded-[2rem] border border-copper/30 bg-copper/10 backdrop-blur-xl p-8 flex flex-col justify-between shadow-[0_8px_32px_rgba(184,115,51,0.15)] overflow-hidden">
              <div className="absolute inset-0 bg-copper/5 pointer-events-none mix-blend-overlay"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-medium tracking-tight text-cream mb-4">
                  Agendar Diagnóstico
                </h3>
  
                <p className="text-sm sm:text-base text-cream/90 leading-[1.6] mb-6">
                Para agendar, você pode falar direto pelo WhatsApp ou, se
                preferir, preencher o formulário. Em ambos os casos, a intenção é
                a mesma: entender o seu contexto antes de qualquer proposta.
              </p>

              <div className="flex flex-col gap-4">
                <Button
                  href="https://wa.me/5511964932007?text=Ol%C3%A1%20Robson%2C%20gostaria%20de%20agendar%20um%20diagn%C3%B3stico%20de%20posicionamento%20para%20a%20minha%20marca."
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
                  Preencher formulário
                </Button>

                <p className="text-[11px] text-white/70 leading-[1.6] mt-1 font-mono uppercase tracking-wider text-center">
                  O diagnóstico não é compromisso de fechar projeto. É um passo
                  anterior, para entender se faz sentido trabalharmos juntos e
                  como o Svicero Studio pode gerar mais valor para o seu negócio.
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
