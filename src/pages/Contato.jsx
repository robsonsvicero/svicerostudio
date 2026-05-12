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
      <div className="bg-charcoal min-h-screen text-cream font-body">
        <Header variant="solid" />

        {/* HERO */}
        <section className="relative overflow-hidden border-b border-white/5 pt-20 lg:pt-36">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-copper/5 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-copper/5 rounded-full blur-[80px] pointer-events-none -translate-x-1/3 translate-y-1/3" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-14 sm:py-20 text-center lg:px-10 lg:py-24">
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-[4rem] font-medium tracking-[-0.02em] leading-[1] text-cream text-balance">
              Fale com o estúdio
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-[1.6] text-muted">
              Para dúvidas, parcerias ou conversas rápidas, use o canal que 
              preferir. Se a ideia é falar sobre um projeto de marca, o melhor 
              caminho é agendar um diagnóstico.
            </p>

            <div className="mt-8 flex justify-center">
              <Button href="/formulario-interesse" variant="primary">
                Agendar Diagnóstico
              </Button>
            </div>
          </div>
        </section>

        {/* CANAIS DIRETOS */}
        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-copper font-mono">
                Contato direto
              </p>

              <h2 className="mt-4 text-[1.875rem] md:text-4xl font-medium tracking-tight text-cream">
                Dúvidas rápidas, parcerias ou outros assuntos
              </h2>

              <p className="mt-6 text-base leading-[1.6] text-muted">
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
                  className="group rounded-3xl border border-white/5 hover:border-white/10 bg-surface px-8 py-6 transition duration-300 hover:shadow-lg hover:-translate-y-1 block shadow-sm"
                >
                  <p className="text-[10px] uppercase tracking-widest text-muted font-mono">
                    {channel.title}
                  </p>

                  <h3 className="mt-2 text-xl font-medium text-cream group-hover:text-copper transition-colors">
                    {channel.value}
                  </h3>

                  <p className="mt-2 text-sm leading-[1.6] text-muted">
                    {channel.description}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* TEMPO DE RESPOSTA */}
        <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-10 lg:pb-20">
          <div className="rounded-[2rem] border border-white/5 hover:border-white/10 transition-colors bg-surface p-10 shadow-sm">
            <p className="text-[10px] uppercase tracking-widest text-copper font-mono">
              Tempo de resposta
            </p>

            <h3 className="mt-3 text-2xl font-medium tracking-tight text-cream">
              Em quanto tempo você recebe resposta?
            </h3>

            <p className="mt-4 text-base leading-[1.6] text-muted">
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