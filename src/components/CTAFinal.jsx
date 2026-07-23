import Button from './UI/Button';
import ScrollReveal from './UI/ScrollReveal';

const defaultQuestions = [
  'Sua empresa é lembrada pelo preço ou pela autoridade?',
  'O cliente entende seu diferencial em menos de cinco segundos?',
  'Seu site gera confiança ou apenas informa?',
];

const CTAFinal = ({ primaryCta, questions = defaultQuestions }) => {
  const primary = {
    label: 'Agendar Diagnóstico',
    href: '/formulario-interesse',
    variant: 'secondary',
    ...primaryCta,
  };

  return (
    <section className="w-full overflow-hidden border-y border-white/20 bg-[linear-gradient(120deg,var(--ds-accent)_0%,var(--ds-accent-hover)_48%,#6f2818_100%)] font-body">
      <ScrollReveal direction="up" delay={0.15} duration={0.8} className="w-full">
        <div className="relative w-full px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
          <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/15 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-40 -left-24 h-80 w-80 rounded-full bg-black/15 blur-[100px]" />

          <div className="relative z-10 mx-auto grid max-w-screen-xl gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
            <div>
              <h2 className="text-3xl font-medium leading-[1.1] tracking-[-0.02em] text-white sm:text-4xl lg:text-5xl">
                O que a sua marca comunica antes mesmo da primeira conversa?
              </h2>

              <p className="mt-6 max-w-lg text-base leading-[1.7] text-white/75 md:text-lg">
                As respostas revelam se percepção, posicionamento e experiência estão acompanhando a qualidade real do seu negócio.
              </p>
            </div>

            <ol className="border-t border-white/10">
              {questions.map((question, index) => (
                <li
                  key={question}
                  className="grid gap-4 border-b border-white/10 py-7 sm:grid-cols-[3rem_1fr] sm:items-start sm:gap-5 md:py-8"
                >
                  <span className="font-mono text-xs tracking-widest text-white/60">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="text-xl font-medium leading-[1.4] tracking-tight text-white md:text-2xl">
                    {question}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <div className="relative z-10 mx-auto mt-12 flex max-w-screen-xl flex-col items-center gap-6 border-t border-white/10 pt-10 text-center">
            <p className="max-w-xl text-sm leading-[1.6] text-white/75 md:text-base">
              Um diagnóstico estratégico ajuda a transformar essas perguntas em decisões claras.
            </p>
            <div className="flex justify-center">
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
