import Button from "../UI/Button";

const DiagnosticoSection = () => {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-16 font-body">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

        {/* Lado esquerdo: explicação */}
        <div>
          <span className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-secondary/5 text-xs font-semibold text-secondary tracking-widest shadow-sm border border-secondary/30">
            <span className="w-2 h-2 -rotate-45 bg-secondary inline-block" />
            PRIMEIRO PASSO
          </span>

          <h2 className="font-title text-3xl sm:text-4xl font-extrabold text-white mb-4">
            O que é o Diagnóstico de Posicionamento?
          </h2>

          <p className="text-[#B2B8C6] text-base sm:text-lg md:text-xl leading-relaxed mb-4">
            É uma conversa estratégica em que analisamos juntos como sua marca é 
            percebida hoje, onde ela está perdendo valor e quais ajustes de 
            posicionamento podem te ajudar a sair da guerra de preço.
          </p>

          <p className="text-[#B2B8C6] text-base sm:text-lg leading-relaxed mb-4">
            Não é uma reunião para discutir cor de logo ou layout de site. 
            É um diagnóstico honesto, baseado em perguntas de negócio, para 
            entender se faz sentido avançarmos juntos e qual seria o próximo passo.
          </p>

          <ul className="text-[#B2B8C6] text-base sm:text-lg leading-relaxed space-y-2 mt-4">
            <li>• Duração média de 45–60 minutos, online.</li>
            <li>• Foco em objetivos, público, concorrência e percepção de marca.</li>
            <li>• Você sai com clareza sobre por que sua marca não sustenta ainda o preço que merece.</li>
          </ul>
        </div>

        {/* Lado direito: para quem é + CTA */}
        <div className="bg-[#222] rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
          <h3 className="font-title text-2xl sm:text-3xl font-semibold text-white mb-4">
            Para quem esse diagnóstico faz mais sentido?
          </h3>

          <p className="text-[#B2B8C6] text-base sm:text-lg leading-relaxed mb-4">
            • Empresas que já vendem, mas se sentem presas em guerra de preço. <br />
            • Negócios migrando para o digital que não querem começar com uma marca fraca. <br />
            • Profissionais que querem cobrar melhor e atrair clientes mais alinhados.
          </p>

          <p className="text-[#B2B8C6] text-sm sm:text-base leading-relaxed mb-6">
            Se você se identificou com esses cenários, o Diagnóstico de Posicionamento 
            é o melhor ponto de partida para entender como o Svicero Studio pode te ajudar.
          </p>

          <Button href="/diagnostico" variant="secondary" className="w-full">
            Agendar Diagnóstico
          </Button>
        </div>

      </div>
    </section>
  );
};

export default DiagnosticoSection;