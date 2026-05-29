import React from 'react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import Button from '../components/UI/Button';
import FAQSection from '../components/Home/FAQSection';
import { API_URL } from '../lib/api';
import SEOHelmet from '../components/SEOHelmet';
import CTAFinal from '../components/CTAFinal';
import ScrollReveal from '../components/UI/ScrollReveal';

const etapas = [
  {
    titulo: 'Diagnóstico & alinhamento',
    texto: 'Investigamos como sua clínica é percebida hoje, no online e no offline, e comparamos essa percepção com a qualidade real do trabalho que você entrega. Entendemos contexto, público, concorrência, sinais visuais e verbais que já existem e onde estão os desalinhamentos entre discurso e experiência.',
    papelCliente: 'Apresenta a estrutura atual da clínica, suas principais especialidades e os desafios de faturamento.',
    papelEstudio: 'Um mapa claro dos problemas de percepção e das oportunidades estratégicas que vão guiar todo o projeto.'
  },
  {
    titulo: 'Estratégia de posicionamento',
    texto: 'A partir do diagnóstico, definimos como sua clínica deve ser percebida para crescer com mais segurança: quais pacientes priorizar, quais promessas evitar, que diferenças precisam ser explícitas e como traduzir sua competência técnica em valor percebido. É aqui que organizamos narrativa, proposta de valor e pilares de comunicação.',
    papelCliente: 'Valida as diretrizes de mercado e aprova as bases conceituais sugeridas.',
    papelEstudio: 'Um posicionamento claro, que orienta linguagem, identidade visual e tomada de decisão no dia a dia.'
  },
  {
    titulo: 'Identidade visual',
    texto: 'Só depois da estratégia bem definida entramos na camada visual. Desenvolvemos uma identidade que não performa luxo, mas transmite maturidade, clareza e confiança: logotipo, cores, tipografia, sistema visual e aplicações-chave que funcionam no consultório, no digital e nos materiais institucionais.',
    papelCliente: 'Avalia as defesas visuais e escolhe o caminho estético que melhor apoia o valor dos seus tratamentos.',
    papelEstudio: 'Um sistema visual coerente, que reforça seu posicionamento em todos os pontos de contato.'
  },
  {
    titulo: 'Arquitetura e design do site',
    texto: 'Estruturamos o site como uma extensão da consulta: organizado, sem ruídos e focado em facilitar a decisão do paciente. Definimos a arquitetura de conteúdo, fluxos de navegação, argumentos principais, provas sociais e elementos visuais que sustentam confiança.',
    papelCliente: 'Revisa a disposição das telas e fornece dados técnicos específicos da clínica (como corpo clínico e CRO).',
    papelEstudio: 'Um site que explica a sua proposta de forma simples, reduz objeções e ajuda o paciente a sentir segurança em avançar.'
  },
  {
    titulo: 'Ativos institucionais & ajustes',
    texto: 'A partir da identidade, desdobramos os materiais essenciais para o dia a dia: apresentações, modelos de posts, materiais internos, itens de recepção e peças-chave de comunicação. Ajustamos a linguagem e o uso do sistema visual para que a equipe consiga aplicar com segurança.',
    papelCliente: 'Acompanha as revisões finais e valida os detalhes de funcionamento da plataforma digital.',
    papelEstudio: 'Uma marca pronta para ser usada com consistência, sem depender de “inventar algo novo” a cada demanda.'
  },
  {
    titulo: 'Entrega & suporte pós-projeto',
    texto: 'Organizamos todos os arquivos finais, guias de uso e orientações necessárias para preservar a integridade da marca ao longo do tempo. Durante um período combinado, ficamos disponíveis para esclarecer dúvidas de aplicação e orientar ajustes pontuais.',
    papelCliente: 'Assume o controle dos novos ativos visuais e inicia a utilização dos canais digitais atualizados.',
    papelEstudio: 'Uma transição segura, com suporte para que a marca não se perca nos primeiros meses de uso.'
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
    <div className="bg-ds-bg min-h-screen flex flex-col text-ds-text font-body">
      <Header variant="solid" />
      <main className="flex-1">
        <SEOHelmet
          title="Metodologia de Trabalho — Engenharia de Percepção Visual"
          description="Conheça as etapas estruturadas do Svicero Studio para alinhar a identidade visual e a presença digital da sua clínica ao nível do seu rigor técnico."
        />

        {/* HERO */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-12 lg:px-10 lg:pb-24 mt-20 lg:mt-36 text-center">
          <ScrollReveal direction="up" delay={0.03} duration={0.7}>
            <h1 className="text-4xl sm:text-5xl lg:text-[4rem] font-medium tracking-tight text-ds-text mb-4 text-balance">
              A engenharia por trás da percepção de marca
            </h1>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.12} duration={0.75}>
            <p className="mt-6 max-w-3xl mx-auto text-lg leading-[1.6] text-ds-muted lg:text-xl">
              Sem improvisos ou abordagens genéricas.
              Você acompanha o desenvolvimento do projeto em etapas claras, do diagnóstico estratégico à entrega das plataformas, para que cada decisão estética seja sustentada por posicionamento, linguagem e experiência.
            </p>
          </ScrollReveal>
        </section>

        {/* POR QUE TER PROCESSO IMPORTA */}
        <section className="flex flex-col items-center justify-center rounded-[2rem] border border-white/5 bg-ds-surface shadow-sm text-xs font-semibold text-ds-accent mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-20 text-center hover:border-white/10 transition-colors">
          <ScrollReveal direction="up" delay={0.04} duration={0.65} className="w-full">
            <h2 className="text-[1.875rem] md:text-4xl font-medium tracking-tight leading-tight text-ds-text mb-4">
              Por que a previsibilidade metodológica protege o seu investimento
            </h2>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.1} duration={0.7} className="w-full">
            <p className="max-w-4xl mx-auto text-left font-normal text-lg mb-6 text-ds-muted leading-[1.6]">
              Um projeto de marca não é um pacote de peças, é um ativo estratégico. Para que ele funcione na prática, na sala de espera, no Instagram, no site, na conversa com o paciente, é preciso que cada etapa siga uma lógica clara: entender o contexto da clínica, organizar a percepção atual, definir um posicionamento sólido e só então traduzir tudo isso em identidade visual e presença digital.
            </p>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.16} duration={0.72} className="w-full">
            <p className="max-w-4xl mx-auto text-left font-normal text-lg mb-6 text-ds-muted leading-[1.6]">
              No Svicero Studio, usamos uma metodologia que reduz improvisos, antecipa ruídos e torna o resultado final mais previsível: tanto para você, quanto para o paciente que vai interpretar sua marca.
            </p>
          </ScrollReveal>

          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 mb-16">
              {etapas.map((etapa, idx) => (
                <ScrollReveal
                  key={idx}
                  direction={idx % 2 === 0 ? 'right' : 'left'}
                  delay={0.08 + Math.floor(idx / 2) * 0.07}
                  duration={0.7}
                >
                  <div className="rounded-[2rem] border border-white/5 bg-ds-bg p-8 shadow-sm flex flex-col h-full text-ds-text hover:border-white/10 hover:shadow-md transition-all">
                    <div className="text-2xl font-medium tracking-tight text-ds-accent mb-2">{etapa.titulo}</div>
                    <p className="text-base font-normal mb-6 text-ds-muted leading-[1.6] text-left">{etapa.texto}</p>

                    <div className="flex flex-col md:flex-row md:gap-8 mt-auto border-t border-white/5 pt-6">
                      <div className="flex-1 mb-4 md:mb-0">
                        <div className="text-[10px] uppercase font-mono tracking-widest text-ds-accent mb-2">O seu papel:</div>
                        <div className="text-sm font-normal text-ds-muted leading-[1.6] text-left">{etapa.papelCliente}</div>
                      </div>
                      <div className="flex-1">
                        <div className="text-[10px] uppercase font-mono tracking-widest text-ds-text mb-2">A entrega do estúdio:</div>
                        <div className="text-sm font-normal text-ds-muted leading-[1.6] text-left">{etapa.papelEstudio}</div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          <ScrollReveal direction="up" delay={0.14} duration={0.65}>
            <Button
              href="/formulario-interesse"
              className="mx-auto"
              variant='primary'
            >
              AGENDAR DIAGNÓSTICO
            </Button>
          </ScrollReveal>
        </section>

        {/* PAPEL DO CLIENTE */}
        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-20">
          <ScrollReveal direction="right" delay={0.04} duration={0.7}>
            <div className="rounded-[2rem] border border-white/5 bg-ds-surface p-10 shadow-sm hover:border-white/10 transition-colors">
            <h2 className="text-[1.875rem] font-medium tracking-tight text-ds-text mb-4">
              O que o projeto exige da sua rotina (de forma prática)
            </h2>
            <p className="mb-8 text-ds-muted leading-[1.6]">
              Nosso trabalho é aprofundado e colaborativo, mas foi pensado para encaixar na rotina clínica. Você entra com a expertise técnica do negócio e decisões estratégicas; nós cuidamos da organização, análise e tradução em marca.
            </p>

            <ul className="space-y-5 text-base mb-8 max-w-2xl mx-auto text-left">
              <li className="flex gap-4 items-start">
                <ScrollReveal direction="right" delay={0.06} duration={0.55} className="flex gap-4 items-start">
                  <span className="mt-0.5 h-6 w-6 flex-shrink-0 flex items-center justify-center rounded-full border border-ds-accent/25 bg-ds-accent/10 text-xs font-mono font-medium text-ds-accent">1</span>
                  <span className="text-ds-muted leading-[1.6]">Participar de algumas conversas estratégicas ao longo do projeto (reuniões online em datas combinadas).</span>
                </ScrollReveal>
              </li>
              <li className="flex gap-4 items-start">
                <ScrollReveal direction="right" delay={0.1} duration={0.55} className="flex gap-4 items-start">
                  <span className="mt-0.5 h-6 w-6 flex-shrink-0 flex items-center justify-center rounded-full border border-ds-accent/25 bg-ds-accent/10 text-xs font-mono font-medium text-ds-accent">2</span>
                  <span className="text-ds-muted leading-[1.6]">Reservar tempo para revisar materiais-chave e aprovar direcionamentos importantes.</span>
                </ScrollReveal>
              </li>
              <li className="flex gap-4 items-start">
                <ScrollReveal direction="right" delay={0.14} duration={0.55} className="flex gap-4 items-start">
                  <span className="mt-0.5 h-6 w-6 flex-shrink-0 flex items-center justify-center rounded-full border border-ds-accent/25 bg-ds-accent/10 text-xs font-mono font-medium text-ds-accent">3</span>
                  <span className="text-ds-muted leading-[1.6]">Disponibilizar informações básicas da clínica (história, equipe, especialidades, números relevantes).</span>
                </ScrollReveal>
              </li>
              <li className="flex gap-4 items-start">
                <ScrollReveal direction="right" delay={0.18} duration={0.55} className="flex gap-4 items-start">
                  <span className="mt-0.5 h-6 w-6 flex-shrink-0 flex items-center justify-center rounded-full border border-ds-accent/25 bg-ds-accent/10 text-xs font-mono font-medium text-ds-accent">4</span>
                  <span className="text-ds-muted leading-[1.6]">Oferecer feedbacks honestos sobre como se sente em relação às propostas apresentadas.</span>
                </ScrollReveal>
              </li>
            </ul>

            <div className='flex justify-center border-t border-white/5 pt-8 mt-4'>
              <ScrollReveal direction="up" delay={0.12} duration={0.6}>
                <p className="text-center max-w-2xl text-ds-muted text-sm">
                  <span className='font-medium text-ds-text'>Sempre que possível, usamos métodos assíncronos (formulários, gravações, revisões comentadas) para diminuir o impacto na sua agenda clínica.</span>
                </p>
              </ScrollReveal>
            </div>
            </div>
          </ScrollReveal>
        </section>

        {/* PAPEL DO ESTÚDIO */}
        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-20">
          <ScrollReveal direction="left" delay={0.04} duration={0.7}>
            <div className="rounded-[2rem] border border-white/5 bg-ds-surface p-10 shadow-sm hover:border-white/10 transition-colors">
            <h2 className="text-[1.875rem] font-medium tracking-tight text-ds-text mb-8 text-center">
              As garantias contratuais e profissionais do Svicero Studio
            </h2>
            <ul className="space-y-5 text-base max-w-2xl mx-auto text-left">
              <li className="flex gap-4 items-start">
                <ScrollReveal direction="left" delay={0.06} duration={0.55} className="flex gap-4 items-start">
                  <span className="mt-0.5 h-6 w-6 flex-shrink-0 flex items-center justify-center rounded-full border border-ds-accent/25 bg-ds-accent/10 text-xs font-mono font-medium text-ds-accent">1</span>
                  <span className="text-ds-muted leading-[1.6]">Organização rigorosa e relatórios de andamento em cada fase linear do projeto.</span>
                </ScrollReveal>
              </li>
              <li className="flex gap-4 items-start">
                <ScrollReveal direction="left" delay={0.1} duration={0.55} className="flex gap-4 items-start">
                  <span className="mt-0.5 h-6 w-6 flex-shrink-0 flex items-center justify-center rounded-full border border-ds-accent/25 bg-ds-accent/10 text-xs font-mono font-medium text-ds-accent">2</span>
                  <span className="text-ds-muted leading-[1.6]">Cronograma organizado e comunicação transparente durante todo o projeto.</span>
                </ScrollReveal>
              </li>
              <li className="flex gap-4 items-start">
                <ScrollReveal direction="left" delay={0.14} duration={0.55} className="flex gap-4 items-start">
                  <span className="mt-0.5 h-6 w-6 flex-shrink-0 flex items-center justify-center rounded-full border border-ds-accent/25 bg-ds-accent/10 text-xs font-mono font-medium text-ds-accent">3</span>
                  <span className="text-ds-muted leading-[1.6]">Entrega de arquivos finais em formatos adequados para uso digital e impressão.</span>
                </ScrollReveal>
              </li>
              <li className="flex gap-4 items-start">
                <ScrollReveal direction="left" delay={0.18} duration={0.55} className="flex gap-4 items-start">
                  <span className="mt-0.5 h-6 w-6 flex-shrink-0 flex items-center justify-center rounded-full border border-ds-accent/25 bg-ds-accent/10 text-xs font-mono font-medium text-ds-accent">4</span>
                  <span className="text-ds-muted leading-[1.6]">Manual de marca para orientar o uso correto da identidade visual.</span>
                </ScrollReveal>
              </li>
              <li className="flex gap-4 items-start">
                <ScrollReveal direction="left" delay={0.22} duration={0.55} className="flex gap-4 items-start">
                  <span className="mt-0.5 h-6 w-6 flex-shrink-0 flex items-center justify-center rounded-full border border-ds-accent/25 bg-ds-accent/10 text-xs font-mono font-medium text-ds-accent">5</span>
                  <span className="text-ds-muted leading-[1.6]">Conduta ética: confidencialidade sobre dados internos, números e estratégias da clínica.</span>
                </ScrollReveal>
              </li>
              <li className="flex gap-4 items-start">
                <ScrollReveal direction="left" delay={0.26} duration={0.55} className="flex gap-4 items-start">
                  <span className="mt-0.5 h-6 w-6 flex-shrink-0 flex items-center justify-center rounded-full border border-ds-accent/25 bg-ds-accent/10 text-xs font-mono font-medium text-ds-accent">5</span>
                  <span className="text-ds-muted leading-[1.6]">Uso responsável de Inteligência Artificial, sempre como ferramenta de análise e organização, nunca para copiar ou replicar identidades de terceiros.</span>
                </ScrollReveal>
              </li>
            </ul>
            </div>
          </ScrollReveal>
        </section>

        {/* MINI FAQ SOBRE O PROCESSO */}
        {loading ? (
          <div className="text-ds-muted text-center py-12">Carregando perguntas...</div>
        ) : (
          <FAQSection
            faqs={perguntas}
            startIndex={4}
            endIndex={8}
            title="Principais dúvidas"
            subtitle="FAQ"
          />
        )}

        {/* CTA FINAL */}
        <CTAFinal
          secondaryCta={{
            label: 'Ver projetos',
            href: '/projetos',
            variant: 'outline',
          }}
        />
      </main>
      <Footer />
    </div>
  );
}

export default Processos;