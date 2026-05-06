import React from 'react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import Button from '../components/UI/Button';
import SEOHelmet from '../components/SEOHelmet';

const channels = [
  {
    title: 'E-mail',
    value: 'contato@svicerostudio.com.br',
    description: 'Para mensagens formais, parcerias ou apresentações.',
    href: 'mailto:contato@svicerostudio.com.br',
  },
  {
    title: 'WhatsApp',
    value: '(11) 96493-2007',
    description: 'Para conversas rápidas ou demandas mais urgentes.',
    href: 'https://wa.me/5511964932007?text=Olá%20Robson%2C%20gostaria%20de%20conversar%20com%20o%20Svicero%20Studio.',
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
        description="Fale com o Svicero Studio pelo canal que preferir: e-mail, WhatsApp ou Instagram."
        keywords="contato svicero studio, falar com designer, whatsapp designer"
      />
      <div className="bg-[#141414] min-h-screen text-[#EFEFEF] font-body">
        <Header variant="solid" />

        {/* HERO */}
        <section className="relative overflow-hidden border-b border-white/8 mt-20 lg:mt-36">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(184,115,51,0.20),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(95,178,216,0.08),transparent_26%)]" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-14 sm:py-20 text-center lg:px-10 lg:py-24">
            <h1 className="mt-6 font-title text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.04em] text-white lg:text-6xl text-balance">
              Fale com o estúdio
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-7 sm:leading-8 text-white/70">
              Para dúvidas, parcerias ou conversas rápidas, use o canal que 
              preferir. Se a ideia é falar sobre um projeto de marca, o melhor 
              caminho é agendar um diagnóstico.
            </p>

            <div className="mt-8 flex justify-center">
              <Button href="/diagnostico" variant="secondary">
                Agendar Diagnóstico
              </Button>
            </div>
          </div>
        </section>

        {/* CANAIS DIRETOS */}
        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">
                Contato direto
              </p>

              <h2 className="mt-4 font-title text-4xl font-semibold tracking-[-0.04em] text-white">
                Dúvidas rápidas, parcerias ou outros assuntos
              </h2>

              <p className="mt-6 text-base leading-8 text-white/70">
                Se ainda não é o momento de falar sobre um projeto, mas você 
                quer tirar uma dúvida ou conversar sobre outra demanda, use um 
                destes canais diretamente.
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
              O estúdio costuma responder mensagens em até dois dias úteis. 
              Se sua demanda for urgente, o caminho mais rápido é o WhatsApp.
            </p>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Contato;