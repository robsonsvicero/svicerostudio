import Button from './UI/Button';

const CTAFinal = () => {
  return (
    <section className="w-full bg-dark-bg pb-16 sm:pb-24 px-4 sm:px-6 flex justify-center items-center min-h-[320px] sm:min-h-[420px]">
      <div className="max-w-screen-xl w-full mx-auto bg-gradient-to-br from-secondary via-secondary to-secondary700 rounded-[28px] sm:rounded-[48px] shadow-xl flex flex-col items-center justify-center px-5 sm:px-8 py-10 sm:py-16">

        <h2 className="font-title text-2xl sm:text-3xl md:text-5xl font-extrabold text-white text-center mb-4 sm:mb-6 text-balance">
          Sua marca ainda não sustenta o preço que você merece cobrar?
        </h2>

        <p className="text-base sm:text-lg md:text-xl text-white/80 font-light text-center mb-8 sm:mb-10 max-w-2xl">
          O primeiro passo é um diagnóstico honesto: entendemos juntos onde sua 
          marca está perdendo valor hoje e o que precisa mudar para você sair da 
          guerra de preço de vez.
        </p>

        <div className="flex flex-col md:flex-row gap-6 mt-2">
          <Button
            href="#contato"
            variant="primary"
            className="transition-colors"
          >
            Agendar Diagnóstico
          </Button>
          <Button
            href="https://wa.me/5511964932007"
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
            className="transition-colors"
          >
            Falar pelo WhatsApp
          </Button>
        </div>

      </div>
    </section>
  );
};

export default CTAFinal;