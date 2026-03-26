import React from 'react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import Button from '../components/UI/Button';
import FAQ from '../components/Blog/FAQ';
import { API_URL } from '../lib/api';
import SEOHelmet from '../components/SEOHelmet';

const etapas = [
  {
    titulo: 'Diagnóstico & alinhamento',
    texto: 'Começamos entendendo onde você está e para onde quer ir. Conversa inicial (online) para entender seu negócio, público, objetivos e desafios. Análise da sua presença atual (Instagram, site, materiais, se houver). Definição conjunta dos objetivos do projeto.',
    papelCliente: 'Conta sua história, seus objetivos e responde a um questionário simples.',
    papelEstudio: 'Uma visão clara do que está desalinhado hoje e do que vamos buscar com a nova marca e presença digital.'
  },
  {
    titulo: 'Estratégia de marca',
    texto: 'Antes de qualquer escolha visual, definimos as bases da sua marca. Quem você quer atrair. Qual posição quer ocupar na cabeça das pessoas. Como você quer ser percebido (tom, valores, personalidade).',
    papelCliente: 'Participa de uma conversa guiada e aprova os direcionamentos.',
    papelEstudio: 'Um direcionamento estratégico resumido, que serve como norte para identidade visual, site e comunicação.'
  },
  {
    titulo: 'Criação da identidade visual',
    texto: 'Com a estratégia definida, partimos para o visual. Desenvolvimento de logo principal e variações de uso. Definição de paleta de cores e tipografia. Criação de elementos gráficos de apoio (ícones, texturas, etc.). Apresentação em contexto, para você ver a marca aplicada (mockups, exemplos de uso).',
    papelCliente: 'Avalia as propostas, dá feedback sincero e escolhe o caminho que mais faz sentido para o seu negócio.',
    papelEstudio: 'Uma marca que representa seu posicionamento e transmite confiança – sem cara de amadorismo.'
  },
  {
    titulo: 'Construção do site',
    texto: 'Agora é hora de transformar a marca em uma presença digital sólida. Definição da estrutura do site (páginas, seções, navegação). Criação do layout com foco em experiência do usuário (UX). Textos orientados para clareza e conversão. Desenvolvimento do site responsivo. Integrações essenciais (WhatsApp, formulários, redes sociais).',
    papelCliente: 'Aprova a estrutura, envia conteúdos específicos e revisa as telas antes da publicação.',
    papelEstudio: 'Um site que te representa, passa profissionalismo e torna mais fácil dizer “acessa meu site para saber mais”.'
  },
  {
    titulo: 'Materiais & ajustes finos',
    texto: 'Com a marca e o site prontos, criamos o básico para o seu dia a dia. Criação de templates essenciais para redes sociais. Artes como cartão de visita. Ajustes finos de texto, detalhes visuais e pequenos refinamentos.',
    papelCliente: 'Testa, dá feedback e pede ajustes, se necessário.',
    papelEstudio: 'Um kit pronto para começar a usar a nova marca de forma consistente.'
  },
  {
    titulo: 'Entrega & suporte pós-projeto',
    texto: 'Fechamos com uma entrega organizada e um período de suporte para você se adaptar com segurança. Entrega de todos os arquivos organizados. Guia rápido de uso da marca e do site. Suporte por X dias após a entrega.',
    papelCliente: 'Começa a usar a nova marca e o site no dia a dia.',
    papelEstudio: 'Segurança para aplicar tudo na prática, sem se sentir perdido ou abandonado após a entrega.'
  }
];

const faq = [
  {
    pergunta: 'Quanto tempo leva, em média, um projeto completo?',
    resposta: 'Depende do escopo, mas, em média, um projeto que envolve identidade visual + site leva de X a Y semanas. Isso pode variar conforme o número de ajustes e sua disponibilidade para aprovar cada etapa.'
  },
  {
    pergunta: 'Eu preciso decidir tudo sozinho?',
    resposta: 'Não. O processo é guiado. Você toma decisões com base em propostas e recomendações do estúdio, sempre com contexto e explicação.'
  },
  {
    pergunta: 'E se eu não gostar de algo?',
    resposta: 'Feedback faz parte do processo. Em cada etapa há espaço para ajustes e refinamentos, sempre dentro do escopo combinado.'
  },
  {
    pergunta: 'Você atende clientes de outras cidades ou países?',
    resposta: 'Sim. Todo o processo foi pensado para funcionar 100% online, com reuniões em vídeo e troca de materiais digitais.'
  }
];

const Processos = () => {
  const [perguntas, setPerguntas] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/faq`)
      .then(res => res.json())
      .then(data => {
        let faqs = Array.isArray(data) ? data : [];
        faqs = faqs.sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));
        setPerguntas(faqs);
        setLoading(false);
      })
      .catch(() => {
        setPerguntas([]);
        setLoading(false);
      });
  }, []);
  return (
    <div className="bg-dark-bg min-h-screen flex flex-col text-[#EFEFEF] font-body">
      <Header variant="solid" />
      <main className="flex-1">
        <SEOHelmet title="Processo Svicero Studio" description="Veja como funciona o processo de criação de marca e site no Svicero Studio." />
        {/* HERO */}
        <section className="mx-auto max-w-7xl px-6 pt-12 lg:px-10 lg:pb-24 mt-20 lg:mt-36 text-center">
          <h1 className="font-title text-5xl font-semibold tracking-[-0.06em] text-white lg:text-7xl mb-4">Como funciona o processo no Svicero Studio</h1>
          <p className="mt-6 max-w-3xl mx-auto text-base leading-8 text-white/72 lg:text-xl ">
            Nada de projeto bagunçado ou sem previsibilidade. Você sabe exatamente o que vai acontecer em cada etapa, do primeiro contato à entrega final.
          </p>

        </section>

        {/* POR QUE TER PROCESSO IMPORTA */}
        <section className=" flex flex-col items-center justify-center rounded-[30px] border border-secondary/25 bg-cream/10 text-xs font-semibold text-secondary mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-20 text-center">
          <h2 className="font-title text-3xl font-semibold tracking-[-0.04em] text-white mb-4">Por que um bom processo é tão importante quanto um bom design</h2>
          <p className="max-w-4xl mx-auto text-left font-normal text-lg mb-6 text-white/80">
            Um projeto de marca e site não é só “fazer um logo bonito” ou montar uma página na internet. Ele precisa traduzir o que você faz, como você pensa e o tipo de cliente que você quer atrair. Por isso, no Svicero Studio, o processo foi pensado para: entender seu momento com profundidade, transformar isso em estratégia, e só então partir para o visual e o digital. Você não entra em um funil genérico, você entra em um processo claro, passo a passo, com começo, meio e fim.
          </p>
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 mb-16">
              {etapas.map((etapa, idx) => (
                <div key={idx} className="rounded-[30px] border border-secondary/30 bg-dark-card/75 p-8 shadow-lg flex flex-col h-full text-white">
                  <div className="text-2xl font-semibold text-secondary mb-2">{etapa.titulo}</div>
                  <p className="text-m font-normal mb-4 text-white/80 leading-normal text-left">{etapa.texto}</p>
                  <div className="flex flex-col md:flex-row md:gap-8">
                    <div className="flex-1 mb-2 md:mb-0">
                      <div className="text-base font-bold text-[#E9BF84] mb-1 ">O que você faz:</div>
                      <div className="text-sm font-light text-white/80 leading-normal text-left">{etapa.papelCliente}</div>
                    </div>
                    <div className="flex-1">
                      <div className="text-base font-bold text-[#E9BF84] mb-1">O que você recebe:</div>
                      <div className="text-sm font-light text-white/80 leading-normal text-left">{etapa.papelEstudio}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Button 
            href="/contato" 
            className="mx-auto"
            variant='secondary'
            >Quero falar sobre meu projeto</Button>
        </section>

        {/* PAPEL DO CLIENTE */}
        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-20">
          <div className="rounded-[30px] border border-[#B87333]/30 bg-[#181818] p-8 shadow-lg">
            <h2 className="font-title text-3xl font-semibold tracking-[-0.04em] text-white mb-4">O que eu preciso fazer durante o processo?</h2>
            <p className="mb-6 text-white/80">O processo é colaborativo, mas não é pesado. Você entra com o conhecimento do seu negócio; o estúdio entra com estratégia, design e tecnologia.</p>
            <ul className="space-y-4 text-lg mb-4 max-w-xl mx-auto text-left">
              <li className="flex gap-3 items-start"><span className="mt-1 h-6 w-6 flex items-center justify-center rounded-full border border-[#B87333]/25 bg-[#B87333]/10 text-xs font-semibold text-[#E9BF84]">1</span><span className="text-white/80 text-base">Participar das reuniões-chave (diagnóstico e aprovações).</span></li>
              <li className="flex gap-3 items-start"><span className="mt-1 h-6 w-6 flex items-center justify-center rounded-full border border-[#B87333]/25 bg-[#B87333]/10 text-xs font-semibold text-[#E9BF84]">2</span><span className="text-white/80 text-base">Responder a um questionário simples sobre seu negócio e público.</span></li>
              <li className="flex gap-3 items-start"><span className="mt-1 h-6 w-6 flex items-center justify-center rounded-full border border-[#B87333]/25 bg-[#B87333]/10 text-xs font-semibold text-[#E9BF84]">3</span><span className="text-white/80 text-base">Enviar materiais básicos (fotos, logotipos antigos, se existirem, etc.).</span></li>
              <li className="flex gap-3 items-start"><span className="mt-1 h-6 w-6 flex items-center justify-center rounded-full border border-[#B87333]/25 bg-[#B87333]/10 text-xs font-semibold text-[#E9BF84]">4</span><span className="text-white/80 text-base">Dar feedback sincero e dentro dos prazos combinados.</span></li>
            </ul>
            <div className='flex justify-center'>
              <p className="text-left text-white/60"><span className='font-semibold'>Não se preocupe:</span> você não precisa “saber de design” ou “entender de site”. Seu papel é falar do seu negócio; o nosso é traduzir isso em marca e presença digital.</p>
            </div>
            
          </div>
        </section>

        {/* PAPEL DO ESTÚDIO */}
        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-20">
          <div className="rounded-[30px] border border-[#B87333]/30 bg-[#181818] p-8 shadow-lg">
            <h2 className="font-title text-3xl font-semibold tracking-[-0.04em] text-white mb-4">O que o Svicero Studio garante nesse processo</h2>
            <ul className="space-y-4 text-lg mb-4 max-w-xl mx-auto text-left">
              <li className="flex gap-3 items-start"><span className="mt-1 h-6 w-6 flex items-center justify-center rounded-full border border-[#B87333]/25 bg-[#B87333]/10 text-xs font-semibold text-[#E9BF84]">1</span><span className="text-white/80 text-base">Organização e clareza em cada etapa.</span></li>
              <li className="flex gap-3 items-start"><span className="mt-1 h-6 w-6 flex items-center justify-center rounded-full border border-[#B87333]/25 bg-[#B87333]/10 text-xs font-semibold text-[#E9BF84]">2</span><span className="text-white/80 text-base">Prazos combinados e respeitados (salvo imprevistos alinhados).</span></li>
              <li className="flex gap-3 items-start"><span className="mt-1 h-6 w-6 flex items-center justify-center rounded-full border border-[#B87333]/25 bg-[#B87333]/10 text-xs font-semibold text-[#E9BF84]">3</span><span className="text-white/80 text-base">Explicações em linguagem simples, sem jargão desnecessário.</span></li>
              <li className="flex gap-3 items-start"><span className="mt-1 h-6 w-6 flex items-center justify-center rounded-full border border-[#B87333]/25 bg-[#B87333]/10 text-xs font-semibold text-[#E9BF84]">4</span><span className="text-white/80 text-base">Foco em resultado para o seu negócio, e não apenas na estética.</span></li>
              <li className="flex gap-3 items-start"><span className="mt-1 h-6 w-6 flex items-center justify-center rounded-full border border-[#B87333]/25 bg-[#B87333]/10 text-xs font-semibold text-[#E9BF84]">5</span><span className="text-white/80 text-base">Orientação honesta: se algo não fizer sentido para o seu momento, vamos falar.</span></li>
            </ul>
          </div>
        </section>

        {/* MINI FAQ SOBRE O PROCESSO */}
        <section className="w-full px-6 py-12 lg:px-10 lg:py-20">
          <h2 className="font-title text-3xl font-semibold tracking-[-0.04em] text-white mb-8 text-center">Dúvidas rápidas sobre o processo</h2>
          {loading ? (
            <div className="text-white text-center">Carregando perguntas...</div>
          ) : (
            <div className="flex w-full">
              <FAQ faqs={perguntas} />
            </div>
          )}
        </section>

        {/* CTA FINAL */}
        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-20 text-center">
          <div className="rounded-[30px] border border-[#B87333]/30 bg-secondary p-8 shadow-lg">
            <h2 className="font-title text-3xl font-semibold tracking-[-0.04em] text-white mb-6">Pronto para dar o próximo passo com a sua marca?</h2>
            <p className="text-white/80 text-base mb-8 max-w-2xl mx-auto">Se você se identificou com esse processo e sente que é o momento de levar sua marca e presença digital a outro nível, o próximo passo é simples.</p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button 
              href="/contato" 
              variant='primary'
              >Quero falar sobre meu projeto</Button>
              <Button 
              href="/planos" 
              variant='outline'
              >Ver pacotes e investimentos</Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Processos;