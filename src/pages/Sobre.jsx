import React from 'react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import Button from '../components/UI/Button';
import ScrollReveal from '../components/UI/ScrollReveal';
import SEOHelmet from '../components/SEOHelmet';
import aboutPhoto from '../assets/about-photo.png';

const pilares = [
  'Direção estratégica',
  'Pensamento sistêmico',
  'Design editorial',
  'Tecnologia',
  'Clareza de comunicação',
];

const indicadores = [
  { valor: '150+', rotulo: 'Projetos entregues' },
  { valor: '10+', rotulo: 'Anos no mercado' },
  { valor: '3x', rotulo: 'Ticket médio aumentado' },
];

const Sobre = () => {
  return (
    <>
      <SEOHelmet
        title="Sobre o Svicero Studio | Estratégia, percepção e design"
        description="Conheça o Svicero Studio, liderado por Robson Svicero, e sua abordagem de estratégia, percepção de marca, posicionamento e sistemas visuais."
        canonical="https://svicerostudio.com.br/sobre"
      />

      <div className="bg-ds-bg min-h-screen text-ds-text font-body">
        <Header />

        <main>
          <section className="relative overflow-hidden border-b border-white/5 pt-20 lg:pt-32">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-ds-accent/5 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
            <ScrollReveal direction="up" delay={0.1}>
              <div className="relative mx-auto max-w-7xl px-6 py-16 text-center lg:px-10 lg:py-24">
                <p className="text-[10px] uppercase tracking-[0.35em] text-ds-accent font-mono">
                  Sobre o estúdio
                </p>
                <h1 className="mx-auto mt-6 max-w-5xl text-4xl sm:text-5xl lg:text-[4rem] font-medium tracking-[-0.02em] leading-[1.05] text-balance">
                  Estratégia, percepção e clareza para marcas que cresceram, mas ainda não comunicam isso
                </h1>
                <p className="mx-auto mt-7 max-w-3xl text-lg md:text-xl leading-[1.6] text-ds-muted">
                  O Svicero Studio nasceu da interseção entre estratégia, design e percepção.
                </p>
              </div>
            </ScrollReveal>
          </section>

          <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
            <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 items-start">
              <ScrollReveal direction="right" delay={0.1}>
                <div className="lg:sticky lg:top-8">
                  <div className="aspect-[4/5] overflow-hidden rounded-[2rem] bg-ds-surface shadow-xl">
                    <img
                      src={aboutPhoto}
                      alt="Robson Svicero"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="mt-6 grid grid-cols-3 gap-3">
                    {indicadores.map((item) => (
                      <div key={item.rotulo} className="rounded-2xl border border-white/5 bg-ds-surface p-4">
                        <span className="block text-2xl font-semibold text-ds-text">{item.valor}</span>
                        <span className="mt-1 block text-[9px] font-mono uppercase tracking-wider text-ds-muted">
                          {item.rotulo}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="left" delay={0.2}>
                <div className="space-y-6 text-lg md:text-xl leading-[1.7] text-ds-muted">
                  <p>
                    Mais do que criar identidades visuais, nosso trabalho busca entender como uma marca é interpretada e como pequenas decisões de comunicação impactam confiança, clareza e valor percebido.
                  </p>
                  <p>
                    Acreditamos que marcas fortes não precisam exagerar para serem lembradas; elas precisam transmitir coerência. Foi dessa visão que o estúdio surgiu: da percepção de que muitos negócios evoluem tecnicamente antes que a comunicação possa acompanhar esse crescimento.
                  </p>
                  <p>
                    A clínica amadurece, a experiência melhora, o nível de entrega aumenta, mas a percepção da marca continua transmitindo uma fase anterior do negócio. É exatamente nesse desalinhamento que começamos a atuar.
                  </p>
                  <p>
                    Hoje, o Svicero Studio é liderado por Robson Svicero, estrategista e designer especializado em percepção de marca, posicionamento e sistemas visuais contemporâneos. Seu trabalho combina:
                  </p>

                  <ul className="grid gap-3 sm:grid-cols-2 py-3">
                    {pilares.map((item) => (
                      <li key={item} className="flex items-center gap-3 rounded-2xl border border-white/5 bg-ds-surface px-5 py-4">
                        <span className="h-2 w-2 flex-shrink-0 rounded-full bg-ds-accent" />
                        <span className="text-base text-ds-text">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="text-2xl md:text-3xl font-medium leading-[1.4] text-ds-text">
                    Design não existe para decorar. Ele existe para organizar percepção.
                  </p>
                  <p>
                    A estética que construímos não busca parecer inacessível. Ela busca parecer lúcida: mais clara, com menos excesso e mais confiança, deixando o “performático” de lado. Porque acreditamos que sofisticação não está em parecer mais caro, mas em transmitir maturidade, coerência e intenção.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </section>

          <section className="border-t border-white/5 px-6 py-16 lg:py-24">
            <ScrollReveal direction="up" delay={0.1}>
              <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/5 bg-ds-surface p-8 text-center shadow-sm sm:p-12">
                <p className="text-[10px] uppercase tracking-widest text-ds-accent font-mono">Próximo passo</p>
                <h2 className="mt-4 text-3xl md:text-4xl font-medium tracking-tight">
                  Sua marca precisa acompanhar a qualidade da sua entrega?
                </h2>
                <p className="mx-auto mt-5 max-w-2xl text-base md:text-lg leading-[1.6] text-ds-muted">
                  Conheça nosso processo ou converse com o estúdio para entender por onde começar.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <Button href="/processos" variant="secondary">Conhecer o processo</Button>
                  <Button href="/contato" variant="primary">Falar com o estúdio</Button>
                </div>
              </div>
            </ScrollReveal>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Sobre;
