import React from 'react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import Button from '../components/UI/Button';
import { Link } from 'react-router-dom';
import CTAFinal from '../components/CTAFinal';
import FAQSection from '../components/Home/FAQSection';

const pacotes = [
  {
    nome: 'Marca Essencial',
    destaque: false,
    descricao: 'Para quem está dando os primeiros passos profissionais e precisa de uma identidade visual organizada, sem investir ainda em um site completo.',
    inclui: [
      'Diagnóstico rápido de marca',
      'Logo principal + versões de uso',
      'Paleta de cores + tipografia básica',
      'Templates simples para redes sociais'
    ],
    entrega: 'Ideal para tirar a cara de amadorismo e começar a comunicar com mais profissionalismo nas redes.',
    naoInclui: '* Não inclui site, materiais mais complexos ou estratégia aprofundada.',
    cta: 'Quero este',
    subtexto: 'Indicado para quem está nos primeiros passos da marca.'
  },
  {
    nome: 'Site Estratégico',
    destaque: false,
    descricao: 'Para quem já tem identidade visual, mas precisa de um site à altura do serviço, pensado para gerar confiança e facilitar o contato.',
    inclui: [
      'Planejamento da estrutura do site',
      'Site responsivo de 5 a 7 páginas',
      'Integração com WhatsApp e formulários',
      'Boas práticas de UX'
    ],
    entrega: 'Indicado para quem quer transformar o site em uma ferramenta real de vendas.',
    cta: 'Quero este',
    subtexto: ''
  },
  {
    nome: 'Posicionamento Premium',
    destaque: true,
    rotulo: 'Mais completo',
    descricao: 'Para quem quer alinhar marca, site e materiais ao nível real do serviço, ganhar segurança para aumentar seus preços e ter uma presença digital profissional de ponta a ponta.',
    inclui: [
      'Estratégia e posicionamento de marca',
      'Identidade visual completa',
      'Site estratégico com foco em UX',
      'Kit de materiais + suporte pós-projeto'
    ],
    beneficio: 'Pensado para quem quer construir uma base sólida de marca e digital, e não apenas “mais um logo” ou “mais um site”.',
    cta: 'Quero este'
  }
];

const tabela = [
  {
    linha: 'Estratégia de marca',
    essencial: 'Básica',
    site: 'Focada em navegação e conversão',
    altoPadrao: 'Completa (posicionamento + público + diferenciais)'
  },
  {
    linha: 'Identidade visual',
    essencial: 'Logo + paleta + tipografia + mini guia',
    site: 'Uso da identidade existente',
    altoPadrao: 'Identidade completa + aplicações + guia detalhado'
  },
  {
    linha: 'Site visual',
    essencial: 'Não incluído',
    site: 'Site de 5 páginas',
    altoPadrao: 'Site de 5 a 7 páginas, alinhado à nova marca'
  },
  {
    linha: 'Materiais extras',
    essencial: '1–2 templates básicos',
    site: 'Opcional (adicional)',
    altoPadrao: 'Kit de materiais definido no pacote'
  },
  {
    linha: 'Suporte pós-entrega',
    essencial: '10 dias úteis',
    site: '15 dias úteis',
    altoPadrao: '20 dias úteis (pode ser maior)'
  }
];

const faq = [
  {
    pergunta: 'Não sei qual pacote escolher. Você pode me orientar?',
    resposta: 'Claro. No primeiro contato, eu entendo seu momento, o que você já tem pronto e para onde quer ir. A partir disso, recomendo o pacote mais adequado – e, se nada fizer sentido, eu te falo com honestidade.'
  },
  {
    pergunta: 'Posso começar com o Presença Essencial e depois migrar para o Marca de Alto Padrão?',
    resposta: 'Pode sim. Muitos clientes começam com um pacote mais enxuto e, quando o negócio cresce, evoluem para algo mais completo. Sempre que possível, reaproveito o que já foi construído.'
  },
  {
    pergunta: 'E se eu já tiver logo, mas não gostar dela?',
    resposta: 'A gente avalia caso a caso. Se a base estiver boa, posso ajustar. Se estiver muito desalinhada com seus objetivos, provavelmente o melhor será trabalhar em uma nova identidade (nesse caso, o Marca de Alto Padrão faz mais sentido).'
  },
  {
    pergunta: 'Você faz algo fora desses pacotes?',
    resposta: 'Em alguns casos específicos, posso montar algo sob medida. Isso é avaliado na nossa conversa inicial.'
  }
];

const PlanosPacotes = () => {
  return (
    <div className="bg-charcoal min-h-screen flex flex-col text-cream font-body">
      <Header variant="solid" />
      <main className="flex-1">
        {/* HERO */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-14 sm:pt-20 lg:pt-36 pb-14 sm:pb-16 lg:px-10 lg:pb-24 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-[4rem] font-medium tracking-tight text-cream text-balance">
            Escolha o pacote ideal para o momento da sua marca
          </h1>

          <p className="mt-6 max-w-3xl mx-auto text-lg leading-[1.6] text-muted lg:text-xl">
            Cada pacote foi pensado para ajudar negócios que já entregam um bom serviço, mas ainda não transmitem isso com clareza no digital.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row justify-center">
            <Button href="https://wa.me/5511964932007" variant="primary">
              Falar com o Svicero Studio
            </Button>

            <Button href="#comparar" variant="outline">
              Comparar pacotes
            </Button>
          </div>
        </section>

        {/* PACOTES */}
        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-20">
          <div className="grid gap-8 md:grid-cols-3">

            {/* PRESENÇA ESSENCIAL */}
            <div className="relative rounded-[2rem] border border-white/5 bg-[#141414]/60 backdrop-blur-xl p-8 flex-1 flex flex-col h-full shadow-lg transition-all duration-500 hover:shadow-2xl hover:border-white/10 hover:-translate-y-2 group mt-0 md:mt-4">
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[2rem]"></div>
              <div className="relative z-10 flex flex-col h-full">

                <h2 className="text-2xl font-medium text-cream mb-4 tracking-tight">
                  Presença Essencial
                </h2>

                <p className="text-muted leading-[1.6] mb-6">
                  Para quem quer parar de parecer improvisado e começar a transmitir mais profissionalismo nas redes.
                </p>

                <ul className="space-y-3 mb-6">
                  {pacotes[0].inclui.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-muted text-base"
                    >
                      <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-copper/40" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <p className="text-copper italic font-light mb-4 text-sm">
                    Ideal para começar a transmitir mais valor sem precisar investir em um projeto completo.
                  </p>

                  <p className="text-muted text-[10px] uppercase font-mono tracking-widest mb-6">
                    Não inclui site nem estratégia aprofundada.
                  </p>

                  <Button
                    href={`https://wa.me/5511964932007?text=Olá! Tenho interesse no pacote ${encodeURIComponent(pacotes[0].nome)}.`}
                    variant="outline"
                    className="w-full mt-auto"
                  >
                    Quero este pacote
                  </Button>
                </div>
              </div>
            </div>

            {/* PREMIUM */}
            <div className="md:col-span-1 h-full flex z-10 relative">
              <div className="relative overflow-hidden rounded-[2.5rem] border border-copper/40 bg-[#1A1A1A]/90 backdrop-blur-2xl p-8 md:p-10 shadow-[0_20px_50px_rgba(184,115,51,0.15)] flex flex-col h-full w-full transition-all duration-500 hover:-translate-y-3 group md:scale-105">

                {/* Glow & Lights */}
                <div className="absolute inset-0 bg-gradient-to-b from-copper/10 to-transparent opacity-80 pointer-events-none mix-blend-overlay"></div>
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-copper/20 rounded-full blur-3xl pointer-events-none group-hover:bg-copper/30 transition-colors duration-500"></div>

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-6">
                    <span className="bg-copper/10 border border-copper/20 text-copper text-[10px] uppercase font-bold tracking-widest px-4 py-1.5 rounded-full">
                      Recomendado
                    </span>
                  </div>

                  <h2 className="text-3xl font-medium text-cream mb-4 tracking-tight">
                    Posicionamento Premium
                  </h2>

                  <p className="text-muted leading-[1.6] mb-6">
                    Para marcas que já entregam qualidade, mas ainda não transmitem isso com clareza, autoridade e percepção de valor.
                  </p>

                  <ul className="space-y-3 mb-6">
                    {pacotes[2].inclui.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-muted text-base"
                      >
                        <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-copper shadow-[0_0_8px_rgba(184,115,51,0.5)]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="rounded-xl border border-copper/20 bg-copper/5 p-5 mb-8">
                    <p className="text-copper text-[10px] uppercase tracking-widest font-mono mb-2">
                      Resultado esperado
                    </p>

                    <p className="text-cream leading-[1.6]">
                      Mais segurança para cobrar melhor, transmitir profissionalismo e construir uma presença digital alinhada ao nível real do seu serviço.
                    </p>
                  </div>

                  <Button
                    href={`https://wa.me/5511964932007?text=Olá! Tenho interesse no pacote ${encodeURIComponent(pacotes[2].nome)}.`}
                    variant="primary"
                    className="w-full mt-auto"
                  >
                    Quero este pacote
                  </Button>
                </div>
              </div>
            </div>

            {/* SITE DE AUTORIDADE */}
            <div className="relative rounded-[2rem] border border-white/5 bg-[#141414]/60 backdrop-blur-xl p-8 flex-1 flex flex-col h-full shadow-lg transition-all duration-500 hover:shadow-2xl hover:border-white/10 hover:-translate-y-2 group mt-0 md:mt-4">
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[2rem]"></div>
              <div className="relative z-10 flex flex-col h-full">

                <h2 className="text-2xl font-medium text-cream mb-4 tracking-tight">
                  Site de Autoridade
                </h2>

                <p className="text-muted leading-[1.6] mb-6">
                  Para negócios que já têm identidade visual, mas precisam de um site que transmita confiança e ajude a gerar oportunidades reais.
                </p>

                <ul className="space-y-3 mb-6">
                  {pacotes[1].inclui.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-muted text-base"
                    >
                      <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-copper/40" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <p className="text-copper italic font-light mb-6 text-sm">
                    Um site pensado para aumentar confiança, facilitar contato e fortalecer sua presença digital.
                  </p>

                  <Button
                    href={`https://wa.me/5511964932007?text=Olá! Tenho interesse no pacote ${encodeURIComponent(pacotes[1].nome)}.`}
                    variant="outline"
                    className="w-full mt-auto"
                  >
                    Quero este pacote
                  </Button>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* RESULTADO */}
        <section className="mx-auto max-w-5xl px-6 py-12 lg:px-10 lg:py-20 text-center">
          <span className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-copper/25 bg-copper/5 text-[11px] font-mono uppercase tracking-[.2em] text-copper">
            <span className="w-1.5 h-1.5 rounded-full bg-copper shadow-[0_0_10px_rgba(184,115,51,0.5)]"></span>
            O QUE MUDA
          </span>

          <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-cream mb-8 text-balance">
            Mais do que design, o objetivo é mudar a percepção da sua marca
          </h2>

          <div className="grid gap-5 md:grid-cols-2 text-left">
            {[
              'Mais confiança para vender e se posicionar',
              'Presença mais profissional no digital',
              'Mais clareza na comunicação da marca',
              'Segurança para cobrar melhor pelo seu serviço',
              'Menos aparência de improviso',
              'Mais percepção de valor'
            ].map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/5 bg-surface shadow-sm px-5 py-4 text-muted hover:border-white/10 transition-colors"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        {/* TABELA */}
        <section
          id="comparar"
          className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-20"
        >
          <h2 className="text-[1.875rem] font-medium tracking-tight text-cream mb-10 text-center">
            Compare os pacotes
          </h2>

          <div className="overflow-x-auto rounded-[2rem] border border-white/5 bg-surface shadow-sm">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-white/5 bg-charcoal/50">
                  <th className="px-6 py-5 text-left text-copper text-xs uppercase tracking-widest font-mono">
                    Recursos
                  </th>

                  <th className="px-6 py-5 text-center text-cream font-semibold">
                    Presença Essencial
                  </th>

                  <th className="px-6 py-5 text-center text-cream font-semibold">
                    Site de Autoridade
                  </th>

                  <th className="px-6 py-5 text-center text-copper font-semibold">
                    Posicionamento Premium
                  </th>
                </tr>
              </thead>

              <tbody>
                {tabela.map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-white/5 hover:bg-surface/50 transition-colors"
                  >
                    <td className="px-6 py-5 text-cream font-medium text-sm">
                      {row.linha}
                    </td>

                    <td className="px-6 py-5 text-center text-muted text-sm">
                      {row.essencial}
                    </td>

                    <td className="px-6 py-5 text-center text-muted text-sm">
                      {row.site}
                    </td>

                    <td className="px-6 py-5 text-center text-cream font-medium text-sm">
                      {row.altoPadrao}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-10 text-center">
            <p className="text-muted text-lg mb-5">
              Ainda não sabe qual faz mais sentido para o seu momento?
            </p>
            <div className="w-full max-w-4xl mx-auto">
              <Button
                href="https://wa.me/5511964932007"
                variant="outline"
              >
                Conversar no WhatsApp
              </Button>
            </div>

          </div>
        </section>

        {/* FAQ */}
        <FAQSection 
          title="Perguntas frequentes" 
          subtitle="FAQ" 
          faqs={faq} 
          startIndex={0} 
          endIndex={4} 
        />

        {/* CTA FINAL */}
        <CTAFinal />
      </main>
      <Footer />
    </div>
  );
};

export default PlanosPacotes;
