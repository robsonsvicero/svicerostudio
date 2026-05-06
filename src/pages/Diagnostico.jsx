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

      <div className="bg-[#141414] min-h-screen text-[#EFEFEF] font-body">
        <Header variant="solid" />

        {/* HERO */}
        <section className="relative overflow-hidden border-b border-white/8 mt-20 lg:mt-36">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(184,115,51,0.18),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(95,178,216,0.10),transparent_28%)]" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-14 sm:py-20 text-center lg:px-10 lg:py-24">
            <span className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-secondary/10 text-xs font-semibold text-secondary tracking-widest shadow-sm border border-secondary/40">
              <span className="w-2 h-2 -rotate-45 bg-secondary inline-block" />
              PRIMEIRO PASSO
            </span>

            <h1 className="mt-4 font-title text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.04em] text-white lg:text-6xl text-balance">
              Diagnóstico de Posicionamento
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-base sm:text-lg leading-7 sm:leading-8 text-white/75">
              Uma conversa estratégica para entender por que sua marca ainda não
              sustenta o preço que você merece cobrar — e o que precisa mudar no
              seu posicionamento para sair da guerra de preços.
            </p>

            <p className="mx-auto mt-4 max-w-3xl text-sm sm:text-base leading-7 text-white/60">
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
              <h2 className="font-title text-2xl sm:text-3xl md:text-4xl font-semibold tracking-[-0.04em] text-white">
                O que é o Diagnóstico de Posicionamento?
              </h2>

              <p className="mt-6 text-base sm:text-lg md:text-xl leading-8 text-white/75">
                É uma sessão online de 45–60 minutos em que analisamos juntos como
                sua marca é percebida hoje, onde ela está perdendo valor e quais
                ajustes de posicionamento podem te ajudar a cobrar melhor e atrair
                clientes mais alinhados.
              </p>

              <p className="mt-4 text-base sm:text-lg leading-7 text-white/70">
                Não é uma reunião para “pegar um orçamento de logo”. É uma
                conversa de dono de negócio para dono de negócio: falamos de
                objetivos, vendas, público, concorrência e percepção de marca. O
                design só entra depois disso, como ferramenta.
              </p>

              <ul className="mt-6 space-y-2 text-base sm:text-lg text-white/75 leading-relaxed">
                <li>• Sessão 100% estratégica, sem pitch de venda disfarçado.</li>
                <li>• Usamos perguntas de negócio, não jargão de design.</li>
                <li>
                  • Você sai com clareza sobre por que está em guerra de preços
                  e o que precisa mudar na sua marca.
                </li>
              </ul>
            </div>

            <div className="rounded-[28px] border border-white/8 bg-[#181818] p-8 shadow-2xl shadow-black/30">
              <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">
                Para quem faz mais sentido
              </p>

              <h3 className="mt-4 font-title text-2xl sm:text-3xl font-semibold text-white">
                Esse diagnóstico é ideal se você:
              </h3>

              <ul className="mt-5 space-y-3 text-base sm:text-lg text-white/75 leading-relaxed">
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

              <p className="mt-6 text-sm sm:text-base text-white/65 leading-7">
                Se você se identificou com dois ou mais pontos, este é o melhor
                próximo passo antes de qualquer decisão sobre identidade visual
                ou site.
              </p>
            </div>
          </div>
        </section>

        {/* BLOCO 2 – Como funciona na prática */}
        <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-10 lg:pb-20">
          <div className="rounded-[34px] border border-white/8 bg-[#181818] p-8 sm:p-10 lg:p-12 shadow-2xl shadow-black/30">
            <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">
              Como funciona
            </p>

            <h2 className="mt-4 font-title text-2xl sm:text-3xl md:text-4xl font-semibold tracking-[-0.04em] text-white">
              Da sala da estratégia à sala do design
            </h2>

            <p className="mt-6 max-w-3xl text-base sm:text-lg leading-7 sm:leading-8 text-white/75">
              Usamos a lógica do business designer: primeiro entendemos o jogo de
              negócio que você está jogando, depois pensamos em como a marca e o
              design podem te ajudar a ganhar esse jogo.
            </p>

            <div className="mt-8 grid gap-8 md:grid-cols-3">
              <div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  1. Perguntas estratégicas
                </h3>
                <p className="text-sm sm:text-base text-white/70 leading-7">
                  Começamos com um roteiro de perguntas sobre negócio, mercado,
                  clientes, desafios e objetivos — inspirado nas perguntas que
                  uso em consultorias e nas aulas que você viu nos ebooks.
                </p>
              </div>

              <div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  2. Mapa de dores e oportunidades
                </h3>
                <p className="text-sm sm:text-base text-white/70 leading-7">
                  Juntos, identificamos onde sua marca está te puxando para
                  baixo hoje: percepção, mensagem, diferenciação, experiência.
                  É aqui que surgem os verdadeiros gargalos.
                </p>
              </div>

              <div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  3. Próximos passos claros
                </h3>
                <p className="text-sm sm:text-base text-white/70 leading-7">
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
              <h2 className="font-title text-2xl sm:text-3xl md:text-4xl font-semibold tracking-[-0.04em] text-white">
                O que você leva dessa conversa
              </h2>

              <ul className="mt-6 space-y-3 text-base sm:text-lg text-white/80 leading-relaxed">
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

              <p className="mt-6 text-sm sm:text-base text-white/65 leading-7 max-w-2xl">
                Em outras palavras: você não sai com um “orçamento de logo”. Você
                sai com um diagnóstico sobre o seu posicionamento e uma visão
                clara de como a marca pode sustentar o valor que você quer
                cobrar.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/8 bg-gradient-to-br from-secondary via-secondary to-secondary700 p-8 flex flex-col justify-between">
              <h3 className="font-title text-2xl font-semibold text-white mb-4">
                Agendar Diagnóstico
              </h3>

              <p className="text-sm sm:text-base text-white/90 leading-7 mb-6">
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
                  href="/diagnostico"
                  variant="outline"
                  className="w-full"
                >
                  Agendar Diagnóstico
                </Button>

                <p className="text-[11px] text-white/70 leading-5 mt-1">
                  O diagnóstico não é compromisso de fechar projeto. É um passo
                  anterior, para entender se faz sentido trabalharmos juntos e
                  como o Svicero Studio pode gerar mais valor para o seu negócio.
                </p>
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
