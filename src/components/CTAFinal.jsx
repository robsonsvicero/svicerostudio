import Button from './UI/Button';
import ScrollReveal from './UI/ScrollReveal';

const defaultQuestions = [
  'Sua empresa é lembrada pelo preço ou pela autoridade?',
  'O cliente entende seu diferencial em menos de cinco segundos?',
  'Seu site gera confiança ou apenas informa?',
];

const CTAFinal = ({ primaryCta, secondaryCta, questions = defaultQuestions }) => {
  const primary = {
    label: 'Agendar Diagnóstico',
    href: '/formulario-interesse',
    variant: 'primary',
    ...primaryCta,
  };

  const secondary = {
    label: 'Conheça o processo',
    href: '/processos',
    variant: 'outline',
    ...secondaryCta,
  };

  return (
    <section className="w-full bg-ds-bg px-4 py-20 font-body sm:px-6 sm:py-28">
      <ScrollReveal direction="up" delay={0.15} duration={0.8} className="mx-auto w-full max-w-screen-xl">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-ds-surface px-6 py-10 shadow-xl sm:rounded-[3rem] sm:px-10 sm:py-14 lg:px-16 lg:py-16">
          <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-ds-accent/10 blur-[100px]" />

          <div className="relative z-10 grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
            <div>
              <span className="mb-6 flex w-fit items-center gap-2 rounded-full border border-ds-accent/20 bg-ds-accent/10 px-4 py-1.5 text-[11px] font-mono uppercase tracking-[0.2em] text-ds-accent shadow-[0_0_15px_rgba(255,122,89,0.15)] backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-ds-accent shadow-[0_0_10px_rgba(255,122,89,0.8)]" />
                Antes de avançar
              </span>

              <h2 className="text-3xl font-medium leading-[1.1] tracking-[-0.02em] text-ds-text sm:text-4xl lg:text-5xl">
                O que a sua marca comunica antes mesmo da primeira conversa?
              </h2>

              <p className="mt-6 max-w-lg text-base leading-[1.7] text-ds-muted md:text-lg">
                As respostas revelam se percepção, posicionamento e experiência estão acompanhando a qualidade real do seu negócio.
              </p>
            </div>

            <ol className="border-t border-white/10">
              {questions.map((question, index) => (
                <li
                  key={question}
                  className="grid gap-4 border-b border-white/10 py-7 sm:grid-cols-[3rem_1fr] sm:items-start sm:gap-5 md:py-8"
                >
                  <span className="font-mono text-xs tracking-widest text-ds-accent/70">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="text-xl font-medium leading-[1.4] tracking-tight text-ds-text md:text-2xl">
                    {question}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <div className="relative z-10 mt-12 flex flex-col gap-5 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
            <p className="max-w-xl text-sm leading-[1.6] text-ds-muted md:text-base">
              Um diagnóstico estratégico ajuda a transformar essas perguntas em decisões claras.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button variant={primary.variant} href={primary.href}>
                {primary.label}
              </Button>
              
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
};

export default CTAFinal;
