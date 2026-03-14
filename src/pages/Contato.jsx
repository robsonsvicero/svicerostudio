import React from 'react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import Button from '../components/UI/Button';
import SEOHelmet from '../components/SEOHelmet';

const channels = [
  {
    title: 'E-mail',
    value: 'contato@svicerostudio.com.br',
    description: 'Para mensagens formais, dúvidas ou apresentações de proposta.',
    href: 'mailto:contato@svicerostudio.com.br',
  },
  {
    title: 'WhatsApp',
    value: '(11) 96493-2007',
    description: 'Para conversas rápidas ou demandas mais urgentes.',
    href: 'https://wa.me/5511964932007',
  },
  {
    title: 'Instagram',
    value: '@svicerostudio',
    description: 'Acompanhe projetos, bastidores e conteúdos do estúdio.',
    href: 'https://instagram.com/svicerostudio',
  },
];

const Contato = () => {
  return (
    <>
      <SEOHelmet
        title="Contato — Svicero Studio"
        description="Fale com o Svicero Studio pelo canal que preferir: e-mail, WhatsApp ou Instagram. Para projetos de marca e site, preencha nosso formulário de interesse."
        keywords="contato svicero studio, falar com designer, whatsapp designer"
      />
      <div className="bg-[#141414] min-h-screen text-[#EFEFEF] font-sans">
        <Header variant="solid" />

        {/* HERO */}
        <section className="relative overflow-hidden border-b border-white/8 mt-20 lg:mt-36">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(184,115,51,0.20),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(95,178,216,0.08),transparent_26%)]" />

          <div className="relative mx-auto max-w-7xl px-6 py-20 text-center lg:px-10 lg:py-24">
            

            <h1 className="mt-6 font-title text-5xl font-semibold tracking-[-0.05em] text-white lg:text-6xl">
              Fale com o Svicero Studio
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/70">
              Use o canal que for mais confortável para você. Se a ideia é falar
              sobre um projeto de marca ou site, o formulário de interesse ajuda
              o estúdio a responder de forma mais precisa.
            </p>
          </div>
        </section>

        {/* BLOCO PROJETO */}
        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
          <div className="rounded-[34px] border border-white/8 bg-[#181818] p-10 shadow-2xl shadow-black/30">
            <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">
              Projetos
            </p>

            <h2 className="mt-4 font-title text-4xl font-semibold tracking-[-0.04em] text-white">
              Quero falar sobre um projeto de marca ou site
            </h2>

            <p className="mt-6 max-w-3xl text-base leading-8 text-white/70">
              Se você quer entender se algum dos pacotes do Svicero Studio faz
              sentido para o seu momento, preencha o formulário de interesse.
              Assim o estúdio entende seu contexto e consegue responder com mais
              clareza sobre próximos passos e investimento.
            </p>

            <div className="mt-8">
              <Button href="/formulario-interesse" variant="secondary">
                Preencher formulário de interesse
              </Button>
            </div>
          </div>
        </section>

        {/* CONTATO DIRETO */}
        <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-10 lg:pb-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">
                Contato direto
              </p>

              <h2 className="mt-4 font-title text-4xl font-semibold tracking-[-0.04em] text-white">
                Dúvidas rápidas, parcerias ou outros assuntos
              </h2>

              <p className="mt-6 text-base leading-8 text-white/70">
                Se ainda não é o momento de falar sobre um projeto específico,
                mas você quer tirar uma dúvida ou conversar sobre outra demanda,
                use um destes canais.
              </p>
            </div>

            <div className="grid gap-4">
              {channels.map((channel) => (
                <a
                  key={channel.title}
                  href={channel.href}
                  target={channel.href.startsWith('http') ? '_blank' : undefined}
                  rel={channel.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="group rounded-2xl border border-white/8 bg-[#181818] px-6 py-5 transition duration-300 hover:border-white/20 hover:-translate-y-0.5 block"
                >
                  <p className="text-xs uppercase tracking-[0.18em] text-white/40">
                    {channel.title}
                  </p>

                  <p className="mt-2 font-title text-lg font-semibold text-white group-hover:text-[#E9BF84] transition-colors">
                    {channel.value}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-white/60">
                    {channel.description}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* TEMPO DE RESPOSTA */}
        <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-10 lg:pb-20">
          <div className="rounded-[28px] border border-white/8 bg-white/[0.03] p-8">
            <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">
              Tempo de resposta
            </p>

            <h3 className="mt-3 font-title text-2xl font-semibold text-white">
              Em quanto tempo você recebe resposta?
            </h3>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70">
              O estúdio costuma responder mensagens e formulários em até alguns
              dias úteis. Se sua demanda for urgente, o melhor caminho é entrar
              em contato diretamente pelo WhatsApp.
            </p>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-10 lg:pb-28">
          <div className="rounded-[34px] border border-[#B87333]/20 bg-[linear-gradient(135deg,#B87333_0%,#844219_100%)] p-12 text-center">
            <h2 className="font-title text-4xl font-semibold text-[#F8F7F2]">
              Pronto para dar o próximo passo com sua marca?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#F8F7F2]/85">
              Preencha o formulário de interesse ou chame o estúdio no WhatsApp
              para iniciar a conversa.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                href="/formulario-interesse"
                variant="primary"
                className="transition-colors"
              >Preencher formulário de interesse
              </Button>

              <Button
                href="https://wa.me/5511964932007"
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                className="transition-colors"
              >Falar pelo WhatsApp
              </Button>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Contato;
