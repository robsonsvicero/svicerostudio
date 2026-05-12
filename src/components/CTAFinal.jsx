import Button from './UI/Button';
import ScrollReveal from './UI/ScrollReveal';

const CTAFinal = () => {
  return (
    <section className="w-full bg-charcoal py-16 sm:py-24 px-4 sm:px-6 flex justify-center items-center min-h-[320px] sm:min-h-[420px] font-body">
      <ScrollReveal direction="up" delay={0.2} duration={0.8} className="w-full max-w-screen-xl mx-auto">
        <div className="w-full bg-surface border border-white/5 text-cream rounded-[2rem] sm:rounded-[3rem] shadow-xl flex flex-col items-center justify-center px-5 sm:px-8 py-10 sm:py-16 relative overflow-hidden transition-colors hover:border-white/10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-copper/15 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-copper/5 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

          <h2 className="text-[1.875rem] md:text-[3.75rem] font-medium tracking-[-0.02em] leading-[1.1] text-center mb-6 text-balance relative z-10">
            Sua marca ainda não sustenta o preço que você merece cobrar?
          </h2>

          <p className="text-lg md:text-xl font-normal leading-[1.6] text-muted text-center mb-10 max-w-2xl relative z-10">
            O primeiro passo é um diagnóstico honesto: entendemos juntos onde sua 
            marca está perdendo valor hoje e o que precisa mudar para você sair da 
            guerra de preço de vez.
          </p>

          <div className="flex flex-col md:flex-row gap-4 mt-2 relative z-10">
            <Button
              variant='primary'
              href="/formulario-interesse"
            >
              Agendar Diagnóstico
            </Button>
            <Button
              variant='outline'
              href="https://wa.me/5511964932007"
              target="_blank"
              rel="noopener noreferrer"
            >
              Falar pelo WhatsApp
            </Button>
          </div>

        </div>
      </ScrollReveal>
    </section>
  );
};

export default CTAFinal;