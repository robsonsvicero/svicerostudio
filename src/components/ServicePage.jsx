import React from 'react';
import Header from './Layout/Header';
import Footer from './Layout/Footer'; 

import Button from './UI/Button';


const ServicePage = ({
  heroImage,
  title,
  subtitle,
  includes = [],
  process = [],
  examples = [],
  ctaImage,
  ctaTitle,
  ctaDescription,
  accentColor = 'secondary'
}) => {
  return (
    <div className="bg-dark-bg min-h-screen flex flex-col text-[#EFEFEF] font-sans">
      <Header variant="solid" />
      <main className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-white/8">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,20,20,0.55)_0%,rgba(20,20,20,0.76)_50%,#141414_100%),radial-gradient(circle_at_top_right,rgba(184,115,51,0.22),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(95,178,216,0.10),transparent_24%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#2F353B_0%,#171F2A_45%,#844219_140%)] opacity-50" />

          <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-6 lg:px-10 lg:pb-28">
            <div className="mx-auto flex min-h-[72vh] max-w-4xl flex-col items-center justify-center text-center">
              <div className="inline-flex items-center rounded-full border border-[#B87333]/25 bg-[#B87333]/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-[#E9BF84] self-start">
                Serviço estratégico
              </div>
              <h1 className="mt-6 font-title text-5xl font-semibold tracking-[-0.06em] text-white lg:text-7xl">
                {title}
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-white/72 lg:text-xl">
                {subtitle}
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                {/* Botão Diagnostico removido */}
                <Button 
                  href="/portfolio"
                  variant='outline'>
                  Ver projetos entregues
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ESCOPO E MÉTODO */}
        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[30px] border border-white/8 bg-white/[0.03] p-6 backdrop-blur lg:p-8">
              <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">Escopo</p>
              <h2 className="mt-3 font-[Manrope] text-3xl font-semibold tracking-[-0.04em] text-white">
                O que inclui
              </h2>
              <div className="mt-8 space-y-4">
                {includes.map((item, index) => (
                  <div key={item} className="flex gap-4 rounded-2xl border border-white/8 bg-[#181818] px-4 py-4">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#B87333]/25 bg-[#B87333]/10 text-xs font-semibold text-[#E9BF84]">
                      {index + 1}
                    </span>
                    <p className="text-sm leading-7 text-white/72">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[30px] border border-white/8 bg-white/[0.03] p-6 backdrop-blur lg:p-8">
              <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">Método</p>
              <h2 className="mt-3 font-[Manrope] text-3xl font-semibold tracking-[-0.04em] text-white">
                Processo de criação
              </h2>
              <div className="mt-8 space-y-4">
                {process.map((step, index) => (
                  <div key={step} className="rounded-2xl border border-white/8 bg-[#181818] px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">Etapa {index + 1}</p>
                    <p className="mt-2 text-sm leading-7 text-white/72">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PROJETOS ENTREGUES */}
        <section className="mx-auto max-w-7xl px-6 py-8 lg:px-10 lg:py-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#E9BF84]">Portfólio</p>
              <h2 className="mt-3 font-[Manrope] text-4xl font-semibold tracking-[-0.05em] text-white">
                Projetos entregues
              </h2>
            </div>
            <a href="/portfolio" className="hidden rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/75 transition hover:bg-white/8 lg:block">
              Ver todos
            </a>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {examples.map((example, index) => (
              <a
                key={example.title}
                href={example.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group overflow-hidden rounded-[30px] border border-white/8 bg-[#181818] transition duration-300 hover:-translate-y-1 hover:border-white/14 focus:outline-none focus:ring-2 focus:ring-[#B87333]"
                aria-label={example.title}
              >
                <div className="aspect-[4/4.8] w-full relative bg-[linear-gradient(135deg,#2F353B_0%,#844219_100%)]">
                  {/* Imagem do projeto */}
                  {example.image && (
                    <img
                      src={example.image}
                      alt={example.alt || example.title}
                      className="absolute inset-0 h-full w-full object-cover z-0"
                      loading="lazy"
                    />
                  )}
                  <div className="relative flex h-full items-end p-6 z-10">
                    <div>
                      <div className="inline-flex rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/65 backdrop-blur">
                        Case selecionado
                      </div>
                      <h3 className="mt-4 font-[Manrope] text-3xl font-semibold tracking-[-0.04em] text-white">
                        {example.title}
                      </h3>
                      <p className="mt-2 text-sm text-white/70">{example.alt}</p>
                    </div>
                  </div>
                  {/* Overlay para legibilidade */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent z-10 pointer-events-none" />
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* CONVITE ESTRATÉGICO */}
        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
          <div className="overflow-hidden rounded-[34px] border border-[#B87333]/18 bg-[linear-gradient(135deg,#B87333_0%,#844219_100%)]">
            <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="flex items-center p-8 lg:p-12">
                <div className="max-w-xl">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#F8F7F2]/70">Convite estratégico</p>
                  <h2 className="mt-4 font-[Manrope] text-4xl font-semibold tracking-[-0.05em] text-[#F8F7F2] lg:text-5xl">
                    {ctaTitle}
                  </h2>
                  <p className="mt-5 max-w-lg text-base leading-8 text-[#F8F7F2]/78">
                    {ctaDescription}
                  </p>
                  <Button 
                    variant='custom'
                    className="mt-8 bg-[#F8F7F2] px-6 py-3.5 text-[#171F2A] transition hover:brightness-95">
                    Falar com um Estrategista
                  </Button>
                </div>
              </div>

              <div className="p-4 lg:p-6">
                {ctaImage && (
                  <img src={ctaImage} alt={ctaTitle} className="h-full min-h-[320px] rounded-[28px] border border-white/12 bg-[linear-gradient(135deg,#F8F7F2_0%,#E9BF84_160%)] shadow-2xl shadow-black/20 object-cover" />
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ServicePage;
