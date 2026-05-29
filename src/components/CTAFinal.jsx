import Button from './UI/Button';
import ScrollReveal from './UI/ScrollReveal';

const CTAFinal = ({ primaryCta, secondaryCta }) => {
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

  const ctaCardBackground = {
    background: `
      radial-gradient(52% 58% at 18% 20%, rgba(59,130,246,0.12) 0%, rgba(59,130,246,0.04) 36%, rgba(59,130,246,0) 72%),
      radial-gradient(36% 42% at 100% 100%, rgba(59,130,246,0.16) 0%, rgba(59,130,246,0.05) 38%, rgba(59,130,246,0) 76%),
      linear-gradient(120deg, rgba(247,248,255,0.96) 0%, rgba(235,238,252,0.97) 48%, rgba(223,228,249,0.98) 100%)
    `,
  };

  return (
    <section className="w-full bg-ds-bg py-16 sm:py-24 px-4 sm:px-6 flex justify-center items-center min-h-[320px] sm:min-h-[420px] font-body">
      <ScrollReveal direction="up" delay={0.2} duration={0.8} className="w-full max-w-screen-xl mx-auto">
        <div style={ctaCardBackground} className="w-full border border-white/10 text-ds-text rounded-[2rem] sm:rounded-[3rem] shadow-xl flex flex-col items-center justify-center px-5 sm:px-8 py-10 sm:py-16 relative overflow-hidden transition-colors hover:border-white/20">

          <h2 className="text-[1.875rem] md:text-[3.75rem] font-medium tracking-[-0.02em] leading-[1.1] text-center mb-6 text-balance relative z-10">
            A percepção que o paciente tem da sua clínica já faz jus ao nível do seu trabalho?
          </h2>

          <p className="text-lg md:text-xl font-normal leading-[1.6] text-ds-muted text-center mb-10 max-w-2xl relative z-10">
            No diagnóstico estratégico, analisamos como sua clínica é percebida hoje e o que precisa mudar para alinhar percepção, posicionamento e valor percebido.
          </p>

          <div className="flex flex-col md:flex-row gap-4 mt-2 relative z-10">
            <Button
              variant={primary.variant}
              href={primary.href}
            >
              {primary.label}
            </Button>
            <Button
              variant={secondary.variant}
              href={secondary.href}
            >
              {secondary.label}
            </Button>
          </div>

        </div>
      </ScrollReveal>
    </section>
  );
};

export default CTAFinal;