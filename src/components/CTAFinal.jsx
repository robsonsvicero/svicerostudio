import Button from './UI/Button';

const CTAFinal = () => {
  return (
    <section className="w-full bg-dark-bg pb-24 px-4 flex justify-center items-center min-h-[420px]">
      <div className="max-w-screen-xl w-full mx-auto bg-gradient-to-br from-secondary via-secondary to-secondary700 rounded-[48px] shadow-xl flex flex-col items-center justify-center px-8 py-16">
        <h2 className="font-title text-4xl md:text-5xl font-extrabold text-white text-center mb-6">Pronto para dar o próximo passo com sua marca?</h2>
        <p className="text-lg md:text-xl text-white/80 font-light text-center mb-10">Se você sente que já passou da hora da sua marca acompanhar o nível do seu trabalho, o próximo passo é simples. Conte um pouco sobre seu momento para que o Svicero Studio possa te orientar com clareza.</p>
        <div className="flex flex-col md:flex-row gap-6 mt-2">
          <Button href="/formulario-interesse" variant="primary" className="transition-colors">
            Preencher formulário de interesse
          </Button>
          <Button href="https://wa.me/5511964932007" target="_blank" rel="noopener noreferrer" variant="outline" className="transition-colors">
            Falar pelo WhatsApp
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTAFinal;
