import React from 'react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import Button from '../components/UI/Button';
import { Link } from 'react-router-dom';

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
    <div className="bg-dark-bg min-h-screen flex flex-col text-[#EFEFEF] font-sans">
      <Header variant="solid" />
      <main className="flex-1">
        {/* HERO */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-14 sm:pt-20 lg:pt-36 pb-14 sm:pb-16 lg:px-10 lg:pb-24 text-center">
          <h1 className="font-title text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.04em] text-white lg:text-7xl text-balance">
            Escolha o pacote ideal para o momento da sua marca
          </h1>

          <p className="mt-6 max-w-3xl mx-auto text-base leading-8 text-white/72 lg:text-xl">
            Cada pacote foi pensado para ajudar negócios que já entregam um bom serviço, mas ainda não transmitem isso com clareza no digital.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row justify-center">
            <Button href="https://wa.me/5511964932007" variant="secondary">
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

            {/* PREMIUM */}
            <div className="md:col-span-1 h-full flex">
              <div className="relative overflow-hidden rounded-[32px] border border-[#B87333]/30 bg-[#181818] p-8 shadow-2xl flex flex-col h-full">

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(184,115,51,0.18),transparent_40%)] pointer-events-none" />

                <div className="relative z-10 flex flex-col h-full">
                  <span className="absolute top-0 right-0 bg-[#B87333] text-white text-xs font-bold px-4 py-1 rounded-full">
                    Mais completo
                  </span>

                  <h2 className="text-3xl font-semibold text-[#E9BF84] mt-6 mb-4">
                    Posicionamento Premium
                  </h2>

                  <p className="text-white/80 leading-relaxed mb-6">
                    Para marcas que já entregam qualidade, mas ainda não transmitem isso com clareza, autoridade e percepção de valor.
                  </p>

                  <ul className="space-y-3 mb-6">
                    {pacotes[2].inclui.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-white/80 text-base"
                      >
                        <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#E9BF84]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="rounded-2xl border border-[#B87333]/20 bg-[#B87333]/5 p-5 mb-8">
                    <p className="text-[#E9BF84] text-sm uppercase tracking-widest mb-2">
                      Resultado esperado
                    </p>

                    <p className="text-white/85 leading-relaxed">
                      Mais segurança para cobrar melhor, transmitir profissionalismo e construir uma presença digital alinhada ao nível real do seu serviço.
                    </p>
                  </div>

                  <Button
                    href={`https://wa.me/5511964932007?text=Olá! Tenho interesse no pacote ${encodeURIComponent(pacotes[2].nome)}.`}
                    variant="secondary"
                    className="w-full mt-auto"
                  >
                    Quero este pacote
                  </Button>
                </div>
              </div>
            </div>

            {/* SECUNDÁRIOS */}
            <div className="md:col-span-2 flex flex-col gap-8 md:flex-row">

              {/* PRESENÇA ESSENCIAL */}
              <div className="rounded-[30px] border border-white/8 bg-[#181818] p-8 flex-1 flex flex-col h-full transition-all duration-300 hover:border-white/15 hover:-translate-y-1">

                <h2 className="text-2xl font-semibold text-[#E9BF84] mb-4">
                  Presença Essencial
                </h2>

                <p className="text-white/80 leading-relaxed mb-6">
                  Para quem quer parar de parecer improvisado e começar a transmitir mais profissionalismo nas redes.
                </p>

                <ul className="space-y-3 mb-6">
                  {pacotes[0].inclui.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-white/80 text-base"
                    >
                      <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-white/70" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <p className="text-[#E9BF84] italic font-light mb-4">
                    Ideal para começar a transmitir mais valor sem precisar investir em um projeto completo.
                  </p>

                  <p className="text-white/40 text-sm mb-6">
                    Não inclui site nem estratégia aprofundada.
                  </p>

                  <Button
                    href={`https://wa.me/5511964932007?text=Olá! Tenho interesse no pacote ${encodeURIComponent(pacotes[0].nome)}.`}
                    variant="outline"
                    className="w-full"
                  >
                    Quero este pacote
                  </Button>
                </div>
              </div>

              {/* SITE DE AUTORIDADE */}
              <div className="rounded-[30px] border border-white/8 bg-[#181818] p-8 flex-1 flex flex-col h-full transition-all duration-300 hover:border-white/15 hover:-translate-y-1">

                <h2 className="text-2xl font-semibold text-[#E9BF84] mb-4">
                  Site de Autoridade
                </h2>

                <p className="text-white/80 leading-relaxed mb-6">
                  Para negócios que já têm identidade visual, mas precisam de um site que transmita confiança e ajude a gerar oportunidades reais.
                </p>

                <ul className="space-y-3 mb-6">
                  {pacotes[1].inclui.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-white/80 text-base"
                    >
                      <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-white/70" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <p className="text-[#E9BF84] italic font-light mb-6">
                    Um site pensado para aumentar confiança, facilitar contato e fortalecer sua presença digital.
                  </p>

                  <Button
                    href={`https://wa.me/5511964932007?text=Olá! Tenho interesse no pacote ${encodeURIComponent(pacotes[1].nome)}.`}
                    variant="outline"
                    className="w-full"
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
          <span className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white/5 text-xs font-semibold text-[#E9BF84] tracking-widest border border-white/10">
            O QUE MUDA
          </span>

          <h2 className="font-title text-3xl sm:text-4xl font-semibold tracking-[-0.04em] text-white mb-8">
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
                className="rounded-2xl border border-white/8 bg-[#181818] px-5 py-4 text-white/80"
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
          <h2 className="font-title text-3xl font-semibold tracking-[-0.04em] text-white mb-10 text-center">
            Compare os pacotes
          </h2>

          <div className="overflow-x-auto rounded-[30px] border border-white/8 bg-[#181818]">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-6 py-5 text-left text-[#E9BF84]">
                    Recursos
                  </th>

                  <th className="px-6 py-5 text-center text-white">
                    Presença Essencial
                  </th>

                  <th className="px-6 py-5 text-center text-white">
                    Site de Autoridade
                  </th>

                  <th className="px-6 py-5 text-center text-[#E9BF84]">
                    Posicionamento Premium
                  </th>
                </tr>
              </thead>

              <tbody>
                {tabela.map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-white/5"
                  >
                    <td className="px-6 py-5 text-[#E9BF84] font-medium">
                      {row.linha}
                    </td>

                    <td className="px-6 py-5 text-center text-white/75">
                      {row.essencial}
                    </td>

                    <td className="px-6 py-5 text-center text-white/75">
                      {row.site}
                    </td>

                    <td className="px-6 py-5 text-center text-white">
                      {row.altoPadrao}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-10 text-center">
            <p className="text-white/75 text-lg mb-5">
              Ainda não sabe qual faz mais sentido para o seu momento?
            </p>

            <Button
              href="https://wa.me/5511964932007"
              variant="secondary"
            >
              Conversar no WhatsApp
            </Button>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-20">
          <h2 className="font-title text-3xl font-semibold tracking-[-0.04em] text-white mb-10 text-center">
            Perguntas frequentes
          </h2>

          <div className="grid gap-8 md:grid-cols-2">
            {faq.map((item, idx) => (
              <div
                key={idx}
                className="rounded-[30px] border border-white/8 bg-[#181818] p-7"
              >
                <h3 className="text-xl font-semibold text-[#E9BF84] mb-3">
                  {item.pergunta}
                </h3>

                <p className="text-white/80 leading-relaxed">
                  {item.resposta}
                </p>
              </div>
            ))}
          </div>
        </section>
        {/* CTA FINAL */}
        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-20 text-center">
          <h2 className="font-[DM Sans] text-3xl font-semibold tracking-[-0.04em] text-white mb-6">Vamos descobrir qual pacote é o ideal para o seu momento?</h2>
          <p className="text-white/80 text-base mb-6">Me chama no WhatsApp ou preencha o formulário que eu te ajudo a entender qual opção faz mais sentido para o seu negócio hoje.</p>
          <div className="flex flex-col gap-3 sm:flex-row justify-center">
            <Button href="https://wa.me/5511964932007" variant="secondary" >Falar com o Svicero Studio</Button>
            <Button href="/diagnostico" variant="outline">Agendar Diagnóstico</Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PlanosPacotes;
