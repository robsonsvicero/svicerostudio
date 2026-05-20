import React from 'react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import Button from '../components/UI/Button';
import FAQSection from '../components/Home/FAQSection';
import { API_URL } from '../lib/api';
import SEOHelmet from '../components/SEOHelmet';
import CTAFinal from '../components/CTAFinal';

const etapas = [
  {
    titulo: 'Diagnóstico & alinhamento',
    texto: 'Iniciamos avaliando o momento atual do seu consultório e seus objetivos comerciais. Em uma sessão online individual, analisamos a percepção da sua imagem atual (Instagram, site institucional e materiais de apresentação, se houver) para mapear onde a sua comunicação visual está gerando ruídos.',
    papelCliente: 'Apresenta a estrutura atual da clínica, suas principais especialidades e os desafios de faturamento.',
    papelEstudio: 'Um relatório claro identificando os pontos cegos de posicionamento e as diretrizes estratégicas do projeto.'
  },
  {
    titulo: 'Estratégia de posicionamento',
    texto: 'Antes de desenhar qualquer elemento visual, definimos os pilares comerciais da marca. Mapeamos o perfil do paciente particular local que sua clínica precisa atrair, determinamos seus diferenciais técnicos e estabelecemos como a sua marca deve se posicionar para defender valores de alto ticket.',
    papelCliente: 'Valida as diretrizes de mercado e aprova as bases conceituais sugeridas.',
    papelEstudio: 'Um documento estruturado que serve como base técnica para a criação da identidade visual e do site.'
  },
  {
    titulo: 'Criação da identidade visual',
    texto: 'Com as diretrizes de mercado fixadas, partimos para a engenharia visual. Desenvolvemos o símbolo principal, versões de uso, sistema tipográfico e paleta cromática. Apresentamos a identidade aplicada a cenários reais da odontologia (recepção, papelaria de orçamentos e assinaturas digitais) para total fidelidade de contexto.',
    papelCliente: 'Avalia as defesas visuais e escolhe o caminho estético que melhor apoia o valor dos seus tratamentos.',
    papelEstudio: 'Um sistema de marca imponente, sóbrio e projetado para transmitir segurança imediata ao paciente particular.'
  },
  {
    titulo: 'Arquitetura e design do site',
    texto: 'Transformamos o seu novo posicionamento em uma plataforma digital robusta. Planejamos a estrutura de navegação com foco na experiência do usuário (UX), redigimos textos institucionais focados em autoridade e desenhamos um layout responsivo sob medida, integrando WhatsApp e formulários de conversão.',
    papelCliente: 'Revisa a disposição das telas e fornece dados técnicos específicos da clínica (como corpo clínico e CRO).',
    papelEstudio: 'Um site de alta fidelidade que funciona como a vitrine digital da clínica, facilitando o agendamento de consultas.'
  },
  {
    titulo: 'Ativos institucionais & ajustes',
    texto: 'Com o ecossistema visual e digital validado, estruturamos os materiais de suporte essenciais para a rotina de atendimentos da sua equipe. Criamos diretrizes visuais para publicações digitais e arquivos de papelaria, realizando os ajustes finos de código e diagramação antes do lançamento oficial.',
    papelCliente: 'Acompanha as revisões finais e valida os detalhes de funcionamento da plataforma digital.',
    papelEstudio: 'Um kit completo de ativos institucionais prontos para uso, garantindo unidade visual em todos os pontos de contato.'
  },
  {
    titulo: 'Entrega & suporte pós-projeto',
    texto: 'Finalizamos o processo com o envio organizado de todos os arquivos proprietários da sua nova marca em alta resolução e o site publicado. Fornecemos um manual técnico de uso do sistema visual e mantemos um período de suporte técnico dedicado para garantir estabilidade e segurança.',
    papelCliente: 'Assume o controle dos novos ativos visuais e inicia a utilização dos canais digitais atualizados.',
    papelEstudio: 'Todos os arquivos finais homologados e a segurança de um suporte presente na fase inicial de transição.'
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
    <div className="bg-charcoal min-h-screen flex flex-col text-cream font-body">
      <Header variant="solid" />
      <main className="flex-1">
        <SEOHelmet 
          title="Metodologia de Trabalho — Engenharia de Percepção Visual" 
          description="Conheça as etapas estruturadas do Svicero Studio para alinhar a identidade visual e a presença digital da sua clínica ao nível do seu rigor técnico." 
        />
        
        {/* HERO */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-12 lg:px-10 lg:pb-24 mt-20 lg:mt-36 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-[4rem] font-medium tracking-tight text-cream mb-4 text-balance">
            A Engenharia por trás do Design
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg leading-[1.6] text-muted lg:text-xl">
            Sem improvisos ou abordagens genéricas. Você acompanha o desenvolvimento do projeto através de fases lineares bem definidas, do diagnóstico estratégico à entrega técnica das plataformas.
          </p>
        </section>

        {/* POR QUE TER PROCESSO IMPORTA */}
        <section className="flex flex-col items-center justify-center rounded-[2rem] border border-white/5 bg-surface shadow-sm text-xs font-semibold text-copper mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-20 text-center hover:border-white/10 transition-colors">
          <h2 className="text-[1.875rem] md:text-4xl font-medium tracking-tight leading-tight text-cream mb-4">
            Por que a previsibilidade metodológica protege o seu investimento
          </h2>
          <p className="max-w-4xl mx-auto text-left font-normal text-lg mb-6 text-muted leading-[1.6]">
            Um projeto de posicionamento de marca não se resume a ilustrar um logotipo ou diagramar uma página padrão. Ele precisa refletir a seriedade técnica do seu consultório e conversar com o comportamento de consumo do paciente particular de alto ticket. No Svicero Studio, o processo foi desenhado para extrair seus diferenciais técnicos, estruturar bases lógicas sólidas e, apenas com esses alicerces fixados, construir as suas frentes visuais e institucionais.
          </p>
          
          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 mb-16">
              {etapas.map((etapa, idx) => (
                <div key={idx} className="rounded-[2rem] border border-white/5 bg-charcoal p-8 shadow-sm flex flex-col h-full text-cream hover:border-white/10 hover:shadow-md transition-all">
                  <div className="text-2xl font-medium tracking-tight text-copper mb-2">{etapa.titulo}</div>
                  <p className="text-base font-normal mb-6 text-muted leading-[1.6] text-left">{etapa.texto}</p>
                  
                  <div className="flex flex-col md:flex-row md:gap-8 mt-auto border-t border-white/5 pt-6">
                    <div className="flex-1 mb-4 md:mb-0">
                      <div className="text-[10px] uppercase font-mono tracking-widest text-copper mb-2">O seu papel:</div>
                      <div className="text-sm font-normal text-muted leading-[1.6] text-left">{etapa.papelCliente}</div>
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] uppercase font-mono tracking-widest text-cream mb-2">A entrega do estúdio:</div>
                      <div className="text-sm font-normal text-muted leading-[1.6] text-left">{etapa.papelEstudio}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <Button
            href="/formulario-interesse"
            className="mx-auto"
            variant='primary'
          >
            AGENDAR DIAGNÓSTICO
          </Button>
        </section>

        {/* PAPEL DO CLIENTE */}
        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-20">
          <div className="rounded-[2rem] border border-white/5 bg-surface p-10 shadow-sm hover:border-white/10 transition-colors">
            <h2 className="text-[1.875rem] font-medium tracking-tight text-cream mb-4">
              O que é exigido da sua rotina durante o projeto?
            </h2>
            <p className="mb-8 text-muted leading-[1.6]">
              O desenvolvimento é colaborativo, mas estruturado de forma a não sobrecarregar sua agenda. Você entra com a expertise clínica do seu negócio; o estúdio assume a engenharia analítica e visual.
            </p>
            
            <ul className="space-y-5 text-base mb-8 max-w-2xl mx-auto text-left">
              <li className="flex gap-4 items-start">
                <span className="mt-0.5 h-6 w-6 flex-shrink-0 flex items-center justify-center rounded-full border border-copper/25 bg-copper/10 text-xs font-mono font-medium text-copper">1</span>
                <span className="text-muted leading-[1.6]">Participar das reuniões estratégicas pontuais de diagnóstico e validação de fases.</span>
              </li>
              <li className="flex gap-4 items-start">
                <span className="mt-0.5 h-6 w-6 flex-shrink-0 flex items-center justify-center rounded-full border border-copper/25 bg-copper/10 text-xs font-mono font-medium text-copper">2</span>
                <span className="text-muted leading-[1.6]">Preencher o mapeamento técnico inicial sobre os objetivos e estrutura da sua clínica.</span>
              </li>
              <li className="flex gap-4 items-start">
                <span className="mt-0.5 h-6 w-6 flex-shrink-0 flex items-center justify-center rounded-full border border-copper/25 bg-copper/10 text-xs font-mono font-medium text-copper">3</span>
                <span className="text-muted leading-[1.6]">Disponibilizar materiais básicos de consulta (como registros de CRO e fotografias institucionais, se hover).</span>
              </li>
              <li className="flex gap-4 items-start">
                <span className="mt-0.5 h-6 w-6 flex-shrink-0 flex items-center justify-center rounded-full border border-copper/25 bg-copper/10 text-xs font-mono font-medium text-copper">4</span>
                <span className="text-muted leading-[1.6]">Fornecer feedbacks objetivos dentro das janelas de alinhamento combinadas em cronograma.</span>
              </li>
            </ul>
            
            <div className='flex justify-center border-t border-white/5 pt-8 mt-4'>
              <p className="text-center max-w-2xl text-muted text-sm">
                <span className='font-medium text-cream'>Diretriz de tranquilidade:</span> você não precisa dominar conceitos de design ou desenvolvimento de software. Seu papel é expor a visão clínica do seu negócio; o nosso é traduzir isso em autoridade de mercado estável.
              </p>
            </div>
          </div>
        </section>

        {/* PAPEL DO ESTÚDIO */}
        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-20">
          <div className="rounded-[2rem] border border-white/5 bg-surface p-10 shadow-sm hover:border-white/10 transition-colors">
            <h2 className="text-[1.875rem] font-medium tracking-tight text-cream mb-8 text-center">
              As garantias contratuais e profissionais do Svicero Studio
            </h2>
            <ul className="space-y-5 text-base max-w-2xl mx-auto text-left">
              <li className="flex gap-4 items-start">
                <span className="mt-0.5 h-6 w-6 flex-shrink-0 flex items-center justify-center rounded-full border border-copper/25 bg-copper/10 text-xs font-mono font-medium text-copper">1</span>
                <span className="text-muted leading-[1.6]">Organização rigorosa e relatórios de andamento em cada fase linear do projeto.</span>
              </li>
              <li className="flex gap-4 items-start">
                <span className="mt-0.5 h-6 w-6 flex-shrink-0 flex items-center justify-center rounded-full border border-copper/25 bg-copper/10 text-xs font-mono font-medium text-copper">2</span>
                <span className="text-muted leading-[1.6]">Prazos de entrega estipulados em cronograma e rigorosamente respeitados.</span>
              </li>
              <li className="flex gap-4 items-start">
                <span className="mt-0.5 h-6 w-6 flex-shrink-0 flex items-center justify-center rounded-full border border-copper/25 bg-copper/10 text-xs font-mono font-medium text-copper">3</span>
                <span className="text-muted leading-[1.6]">Comunicação clara e transparente em linguagem corporativa, livre de jargões técnicos vazios.</span>
              </li>
              <li className="flex gap-4 items-start">
                <span className="mt-0.5 h-6 w-6 flex-shrink-0 flex items-center justify-center rounded-full border border-copper/25 bg-copper/10 text-xs font-mono font-medium text-copper">4</span>
                <span className="text-muted leading-[1.6]">Foco total na entrega de ativos visuais que gerem valor comercial e facilitem vendas de alto ticket.</span>
              </li>
              <li className="flex gap-4 items-start">
                <span className="mt-0.5 h-6 w-6 flex-shrink-0 flex items-center justify-center rounded-full border border-copper/25 bg-copper/10 text-xs font-mono font-medium text-copper">5</span>
                <span className="text-muted leading-[1.6]">Consultoria honesta: se alguma solução visual ou tecnológica não for condizente com o estágio da sua clínica, faremos o alerta prontamente.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* MINI FAQ SOBRE O PROCESSO */}
        {loading ? (
          <div className="text-muted text-center py-12">Carregando perguntas...</div>
        ) : (
          <FAQSection
            faqs={perguntas}
            startIndex={4}
            endIndex={8}
            title="Dúvidas céleres sobre a metodologia"
            subtitle="FAQ"
          />
        )}

        {/* CTA FINAL */}
        <CTAFinal />
      </main>
      <Footer />
    </div>
  );
}

export default Processos;