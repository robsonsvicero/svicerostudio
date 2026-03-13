import React from 'react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import Button from '../components/UI/Button';
import { Link } from 'react-router-dom';

const pacotes = [
  {
    nome: 'Presença Essencial',
    destaque: false,
    descricao: 'Para quem está começando a se posicionar de forma profissional e precisa dar os primeiros passos consistentes na identidade visual, sem investir ainda em um site completo.',
    inclui: [
      'Diagnóstico rápido de marca',
      'Logo principal + versões de uso',
      'Paleta de cores',
      'Tipografia básica',
      '1–2 templates simples para redes sociais',
      'Mini guia de uso da marca (PDF curto)'
    ],
    entrega: 'Você sai com uma identidade visual organizada, que tira a cara de amadorismo e já permite comunicar de forma mais profissional nas redes.',
    naoInclui: 'Não inclui site, materiais mais complexos ou estratégia aprofundada.',
    cta: 'Quero este',
    subtexto: 'Indicado para quem está nos primeiros passos da marca.'
  },
  {
    nome: 'Site Estratégico',
    destaque: false,
    descricao: 'Para quem já tem uma identidade visual definida, mas ainda não tem um site à altura ou está preso em um site amador que não ajuda a vender.',
    inclui: [
      'Análise da identidade visual atual',
      'Planejamento da estrutura do site',
      'Site de X páginas',
      'Layout responsivo',
      'Integração com WhatsApp, formulários e redes sociais',
      'Boas práticas de UX',
      'Entrega organizada + breve guia de atualização'
    ],
    entrega: 'É necessário já ter uma identidade visual minimamente estruturada. Caso não tenha, o Pacote Marca de Alto Padrão pode ser mais adequado para você.',
    cta: 'Quero este',
    subtexto: ''
  },
  {
    nome: 'Marca de Alto Padrão',
    destaque: true,
    rotulo: 'Mais completo',
    descricao: 'Para quem quer alinhar marca, site e materiais ao nível real do serviço, ganhar confiança para cobrar melhor e ter uma presença digital profissional de ponta a ponta.',
    inclui: [
      'Estratégia e posicionamento',
      'Identidade visual completa',
      'Site estratégico em X páginas',
      'Kit de materiais para o dia a dia',
      'Entrega organizada + suporte pós-projeto'
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
    site: 'Site de X páginas',
    altoPadrao: 'Site de X páginas, alinhado à nova marca'
  },
  {
    linha: 'Materiais extras',
    essencial: '1–2 templates básicos',
    site: 'Opcional (adicional)',
    altoPadrao: 'Kit de materiais definido no pacote'
  },
  {
    linha: 'Suporte pós-entrega',
    essencial: '10 dias uteis',
    site: '15 dias uteis',
    altoPadrao: '20 dias uteis (pode ser maior)'
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
        <section className="mx-auto max-w-7xl px-6 pt-20 lg:pt-36 pb-16 lg:px-10 lg:pb-24 text-center">
          <h1 className="font-title text-5xl font-semibold tracking-[-0.06em] text-white lg:text-7xl">Escolha o pacote que melhor combina com o momento do seu negócio</h1>
          <p className="mt-6 max-w-3xl mx-auto text-base leading-8 text-white/72 lg:text-xl">
            Todos os pacotes foram pensados para ajudar autônomos e pequenos negócios a sair da cara de amador e ganhar mais confiança no digital – em diferentes estágios de crescimento.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row justify-center">
              <Button href="https://wa.me/5511964932007" variant="secondary">Falar com o Svicero Studio</Button>
              <Button href="#comparar" variant="outline" className="px-5 py-3">Comparar pacotes</Button>
          </div>
        </section>

        {/* DESTAQUE – Pacote principal */}
        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-20">
            <div className="grid gap-8 md:grid-cols-3">
            {/* Pacote principal */}
            <div className="md:col-span-1 h-full flex">
              <div className="relative rounded-[30px] border border-[#B87333]/30 bg-[#181818] p-8 shadow-lg flex flex-col h-full">
                <span className="absolute top-4 right-4 bg-[#B87333] text-white text-xs font-bold px-4 py-1 rounded-full">Mais completo</span>
                <h2 className="text-2xl font-semibold text-[#E9BF84] mb-2">Marca de Alto Padrão</h2>
                <p className="text-white/80 mb-4">{pacotes[2].descricao}</p>
                <ul className="space-y-2 mb-4">
                  {pacotes[2].inclui.map((item, idx) => (
                    <li key={idx} className="text-white/80 text-base">{item}</li>
                  ))}
                </ul>
                <p className="text-[#E9BF84] font-medium mb-4">{pacotes[2].beneficio}</p>
                  <Button 
                    href={`https://wa.me/5511964932007?text=Olá! Tenho interesse no pacote ${encodeURIComponent(pacotes[2].nome)}.`}
                    variant="secondary" 
                    className="w-full mt-auto">
                    {pacotes[2].cta}
                  </Button>
              </div>
            </div>
            {/* Pacotes secundários */}
            <div className="md:col-span-2 flex flex-col gap-8 md:flex-row">
              {/* Presença Essencial */}
              <div className="rounded-[30px] border border-white/8 bg-[#181818] p-8 flex-1 flex flex-col h-full">
                <h2 className="text-xl font-semibold text-[#E9BF84] mb-2">Pacote Presença Essencial</h2>
                <p className="text-white/80 mb-4">{pacotes[0].descricao}</p>
                <ul className="space-y-2 mb-4">
                  {pacotes[0].inclui.map((item, idx) => (
                    <li key={idx} className="text-white/80 text-base">{item}</li>
                  ))}
                </ul>
                <p className="text-white/70 mb-2">{pacotes[0].entrega}</p>
                <p className="text-[#B87333] text-sm mb-2">{pacotes[0].naoInclui}</p>
                  <Button 
                    href={`https://wa.me/5511964932007?text=Olá! Tenho interesse no pacote ${encodeURIComponent(pacotes[0].nome)}.`}
                    variant="outline" 
                    className="w-full mb-2 mt-auto">
                    {pacotes[0].cta}
                  </Button>
                <span className="text-xs text-white/60">{pacotes[0].subtexto}</span>
              </div>
              {/* Site Estratégico */}
              <div className="rounded-[30px] border border-white/8 bg-[#181818] p-8 flex-1 flex flex-col h-full">
                <h2 className="text-xl font-semibold text-[#E9BF84] mb-2">Pacote Site Estratégico</h2>
                <p className="text-white/80 mb-4">{pacotes[1].descricao}</p>
                <ul className="space-y-2 mb-4">
                  {pacotes[1].inclui.map((item, idx) => (
                    <li key={idx} className="text-white/80 text-base">{item}</li>
                  ))}
                </ul>
                <p className="text-white/70 mb-2">{pacotes[1].entrega}</p>
                  <Button 
                    href={`https://wa.me/5511964932007?text=Olá! Tenho interesse no pacote ${encodeURIComponent(pacotes[1].nome)}.`}
                    variant="outline" 
                    className="w-full mb-2 mt-auto">
                    {pacotes[1].cta}
                  </Button>
              </div>
            </div>
          </div>
        </section>

        {/* TABELA DE COMPARAÇÃO */}
        <section id="comparar" className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-20">
          <h2 className="font-[Manrope] text-3xl font-semibold tracking-[-0.04em] text-white mb-8 text-center">Compare os pacotes e veja qual faz mais sentido para você</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2">
              <thead>
                <tr>
                  <th className="bg-[#181818] text-[#E9BF84] px-6 py-3 rounded-tl-xl text-left">&nbsp;</th>
                  <th className="bg-[#181818] text-[#E9BF84] px-6 py-3 text-center">Presença Essencial</th>
                  <th className="bg-[#181818] text-[#E9BF84] px-6 py-3 text-center">Site Estratégico</th>
                  <th className="bg-[#B87333] text-white px-6 py-3 rounded-tr-xl text-center">Marca de Alto Padrão</th>
                </tr>
              </thead>
              <tbody>
                {tabela.map((row, idx) => (
                  <tr key={idx}>
                    <td className="bg-[#181818] text-[#E9BF84] font-semibold px-6 py-3 text-left">{row.linha}</td>
                    <td className="bg-[#181818] text-white/80 px-6 py-3 text-center">{row.essencial}</td>
                    <td className="bg-[#181818] text-white/80 px-6 py-3 text-center">{row.site}</td>
                    <td className="bg-[#B87333] text-white px-6 py-3 text-center">{row.altoPadrao}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-8 text-center text-white/80 text-lg">Em dúvida sobre qual pacote faz mais sentido?<br/>Me chama no WhatsApp e eu te ajudo a escolher com base no seu momento.</p>
          <div className="mt-4 flex justify-center">
              <Button href="https://wa.me/5511964932007" variant="custom" className="bg-[#B87333] px-6 py-3.5 text-white text-lg font-semibold">Falar com o Svicero Studio</Button>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-20">
          <h2 className="font-[Manrope] text-3xl font-semibold tracking-[-0.04em] text-white mb-8 text-center">Perguntas frequentes sobre pacotes</h2>
          <div className="grid gap-8 md:grid-cols-2">
            {faq.map((item, idx) => (
              <div key={idx} className="rounded-[30px] border border-white/8 bg-[#181818] p-6">
                <h3 className="text-lg font-semibold text-[#E9BF84] mb-2">{item.pergunta}</h3>
                <p className="text-white/80 text-base">{item.resposta}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-20 text-center">
          <h2 className="font-[Manrope] text-3xl font-semibold tracking-[-0.04em] text-white mb-6">Vamos descobrir qual pacote é o ideal para o seu momento?</h2>
          <p className="text-white/80 text-base mb-6">Me chama no WhatsApp ou preencha o formulário que eu te ajudo a entender qual opção faz mais sentido para o seu negócio hoje.</p>
          <div className="flex flex-col gap-3 sm:flex-row justify-center">
            <Button href="https://wa.me/5511964932007" variant="secondary" >Falar com o Svicero Studio</Button>
            <Button href="formulario-interesse" variant="outline">Preencher formulário de interesse</Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PlanosPacotes;
