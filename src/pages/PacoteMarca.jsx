import React from 'react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import Button from '../components/UI/Button';

// Exemplo de depoimentos (depois integrar BD)
const testimonials = [
  {
    nome: 'Cliente 1',
    texto: 'Minha marca ficou incrível, superou minhas expectativas!',
    cargo: 'Consultora',
  },
  {
    nome: 'Cliente 2',
    texto: 'O site ficou profissional e já trouxe novos clientes.',
    cargo: 'Coach',
  },
  {
    nome: 'Cliente 3',
    texto: 'O processo foi organizado e o suporte fez toda diferença.',
    cargo: 'Empreendedora',
  },
];

const bulletsParaQuem = [
  'Você está à frente do próprio negócio e sente que sua imagem não acompanha a qualidade do seu trabalho.',
  'Tem vergonha de mostrar seu Instagram ou site quando alguém pede “o link pra te conhecer melhor”.',
  'Quer cobrar melhor pelos seus serviços, mas sente que sua marca ainda não sustenta um preço mais alto.',
  'Já entendeu que só um logo bonito não resolve – você precisa de identidade, site e comunicação organizados.',
];

const reforcoParaQuem = 'Se você se vê em pelo menos dois pontos acima, o Pacote Marca de Alto Padrão foi pensado exatamente para o seu momento.';

const blocosIncluidos = [
  {
    titulo: 'Estratégia e posicionamento',
    itens: [
      'Encontro de diagnóstico e alinhamento (online)',
      'Definição de público-alvo, diferenciais e proposta de valor',
      'Direcionamento de linguagem e tom da marca',
      'Resultado: clareza sobre como você quer ser visto e o espaço que quer ocupar no mercado.'
    ]
  },
  {
    titulo: 'Identidade visual completa',
    itens: [
      'Logo principal + versões de uso (horizontal/vertical, claro/escuro)',
      'Paleta de cores',
      'Tipografia principal e secundária',
      'Elementos gráficos de apoio (ícones, texturas, etc.)',
      'Mini manual de uso da marca (PDF)',
      'Resultado: uma marca que passa confiança, tira a cara de amadorismo e é fácil de aplicar no dia a dia.'
    ]
  },
  {
    titulo: 'Presença digital (site estratégico)',
    itens: [
      'Site de X páginas (Home + Sobre + Serviços + Contato, por exemplo)',
      'Estrutura pensada em UX (experiência do usuário)',
      'Foco em facilitar contato, agendamento ou pedidos',
      'Layout responsivo (funciona bem em celular e computador)',
      'Integração com WhatsApp, redes sociais e formulários de contato',
      'Resultado: um site que parece profissional, ajuda a vender e transmite o nível do seu trabalho.'
    ]
  },
  {
    titulo: 'Kit de materiais para o dia a dia',
    itens: [
      'Arte base para posts ou capas (ex: template de feed/story)',
      'Arte de cartão de visita ou equivalente digital',
      'Arte de capa para WhatsApp/Instagram ou outra rede prioritária',
      'Resultado: tudo que você precisa para manter a comunicação com a mesma cara, sem cada peça parecer de um lugar diferente.'
    ]
  },
  {
    titulo: 'Entrega organizada + suporte inicial',
    itens: [
      'Entrega de todos os arquivos em pasta organizada (Google Drive ou similar)',
      'Vídeo ou guia rápido explicando como usar a nova identidade',
      'Suporte por X dias após a entrega para dúvidas e pequenos ajustes (definir: 15/30 dias, etc.)',
      'Resultado: segurança para implementar a nova marca sem se sentir perdido.'
    ]
  },
];

const processo = [
  'Contato e diagnóstico',
  'Imersão e estratégia',
  'Criação da identidade visual',
  'Construção do site e materiais',
  'Ajustes finais e entrega',
];

const beneficios = [
  'Você para de parecer amador e passa a ser visto como profissional de alto padrão.',
  'Ganha segurança para falar o seu preço sem pedir desculpas.',
  'Passa mais confiança já nos primeiros segundos de contato com sua marca.',
  'Tem um site e uma identidade visual que trabalham por você 24h por dia.',
  'Para de perder tempo “quebrando a cabeça com arte” – sua comunicação fica organizada e consistente.',
];

const bulletsNaoEh = [
  'Você só quer “um logo baratinho pra quebrar o galho”.',
  'Não está disposto a participar minimamente do processo (responder questionário, dar feedback).',
  'Quer copiar a marca de outro profissional ou seguir modinha de design.',
];

const reforcoNaoEh = 'Se você quer construir algo sólido, que ajude o seu negócio a crescer, esse pacote foi pensado para você.';

const PacoteMarca = () => {
  return (
    <div className="bg-[#141414] min-h-screen flex flex-col text-[#EFEFEF] font-sans py-20 md:py-36">
      <Header variant="solid" />
      <main className="flex-1">
        {/* HERO */}
        <section className="mx-auto max-w-7xl px-6 pt-12 pb-16 lg:px-10 lg:pb-24">
          <h1 className="font-title text-5xl font-semibold tracking-[-0.06em] text-white lg:text-7xl">Pacote Marca de Alto Padrão</h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-white/72 lg:text-xl">
            Para autônomos, MEIs e pequenos negócios que querem sair da “cara de amador” e ter uma marca à altura da qualidade do que entregam.
          </p>
        </section>

        {/* PARA QUEM É */}
        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-20">
          <h2 className="font-[Manrope] text-3xl font-semibold tracking-[-0.04em] text-white mb-6">Esse pacote é para você se…</h2>
          <ul className="space-y-4">
            {bulletsParaQuem.map((item, idx) => (
              <li key={idx} className="flex gap-3 items-start">
                <span className="mt-1 h-6 w-6 flex items-center justify-center rounded-full border border-[#B87333]/25 bg-[#B87333]/10 text-xs font-semibold text-[#E9BF84]">{idx+1}</span>
                <span className="text-white/80 text-base">{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-lg text-[#E9BF84] font-medium">{reforcoParaQuem}</p>
        </section>

        {/* O QUE ESTÁ INCLUÍDO */}
        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-20">
          <h2 className="font-[Manrope] text-3xl font-semibold tracking-[-0.04em] text-white mb-8">O que está incluído no Pacote Marca de Alto Padrão</h2>
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {blocosIncluidos.map((bloco, idx) => (
              <div key={bloco.titulo} className="rounded-[30px] border border-white/8 bg-white/[0.03] p-6 backdrop-blur">
                <h3 className="text-xl font-semibold text-[#E9BF84] mb-4">{bloco.titulo}</h3>
                <ul className="space-y-2">
                  {bloco.itens.map((item, i) => (
                    <li key={i} className="text-white/80 text-base">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* PROCESSO */}
        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-20">
          <h2 className="font-[Manrope] text-3xl font-semibold tracking-[-0.04em] text-white mb-6">Como vamos trabalhar juntos</h2>
          <ol className="space-y-4 list-decimal list-inside">
            {processo.map((step, idx) => (
              <li key={idx} className="text-white/80 text-base">{step}</li>
            ))}
          </ol>
        </section>

        {/* BENEFÍCIOS */}
        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-20">
          <h2 className="font-[Manrope] text-3xl font-semibold tracking-[-0.04em] text-white mb-6">O que muda para o seu negócio com esse pacote</h2>
          <ul className="space-y-4">
            {beneficios.map((item, idx) => (
              <li key={idx} className="flex gap-3 items-start">
                <span className="mt-1 h-6 w-6 flex items-center justify-center rounded-full border border-[#B87333]/25 bg-[#B87333]/10 text-xs font-semibold text-[#E9BF84]">{idx+1}</span>
                <span className="text-white/80 text-base">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* PARA QUEM NÃO É */}
        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-20">
          <h2 className="font-[Manrope] text-3xl font-semibold tracking-[-0.04em] text-white mb-6">Esse pacote não é para você se…</h2>
          <ul className="space-y-4">
            {bulletsNaoEh.map((item, idx) => (
              <li key={idx} className="flex gap-3 items-start">
                <span className="mt-1 h-6 w-6 flex items-center justify-center rounded-full border border-[#B87333]/25 bg-[#B87333]/10 text-xs font-semibold text-[#E9BF84]">{idx+1}</span>
                <span className="text-white/80 text-base">{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-lg text-[#E9BF84] font-medium">{reforcoNaoEh}</p>
        </section>

        {/* INVESTIMENTO E CTA */}
        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-20 text-center">
          <h2 className="font-[Manrope] text-3xl font-semibold tracking-[-0.04em] text-white mb-6">Investimento</h2>
          <p className="text-white/80 text-base mb-6">O Pacote Marca de Alto Padrão é personalizado de acordo com o momento e a complexidade do seu negócio.<br/>Me chama no WhatsApp ou preencha o formulário para eu entender sua necessidade e te enviar uma proposta clara, sem surpresas.</p>
          <Button href="https://wa.me/5511964932007" variant="custom" className="bg-[#B87333] px-6 py-3.5 text-white text-lg font-semibold mt-4">Quero conversar sobre o pacote</Button>
        </section>

        {/* PROVA SOCIAL */}
        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-20">
          <h2 className="font-[Manrope] text-3xl font-semibold tracking-[-0.04em] text-white mb-8">Depoimentos de clientes</h2>
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {testimonials.map((dep, idx) => (
              <div key={idx} className="rounded-[30px] border border-white/8 bg-white/[0.03] p-6 backdrop-blur">
                <p className="text-white/80 text-base mb-4">“{dep.texto}”</p>
                <div className="flex items-center gap-3">
                  <span className="text-[#E9BF84] font-semibold">{dep.nome}</span>
                  <span className="text-white/60 text-sm">{dep.cargo}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PacoteMarca;
