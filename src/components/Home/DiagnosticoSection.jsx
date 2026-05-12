import Button from "../UI/Button";

const DiagnosticoSection = () => {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-16 font-body">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

        {/* Lado esquerdo: explicação */}
        <div>
          <span className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-copper/25 bg-copper/5 text-[11px] font-mono uppercase tracking-[.2em] text-copper">
            <span className="w-1.5 h-1.5 rounded-full bg-copper shadow-[0_0_10px_rgba(184,115,51,0.5)]"></span>
            PRIMEIRO PASSO
          </span>

          <h2 className="text-4xl md:text-[3.75rem] font-medium tracking-[-0.02em] leading-[1.1] text-cream text-left mb-6">
            O que é o Diagnóstico de Posicionamento?
          </h2>

          <p className="text-xl font-normal leading-[1.6] text-muted mb-4">
            É uma conversa estratégica em que analisamos juntos como sua marca é 
            percebida hoje, onde ela está perdendo valor e quais ajustes de 
            posicionamento podem te ajudar a sair da guerra de preço.
          </p>

          <p className="text-base font-normal leading-[1.6] text-muted mb-6">
            Não é uma reunião para discutir cor de logo ou layout de site. 
            É um diagnóstico honesto, baseado em perguntas de negócio, para 
            entender se faz sentido avançarmos juntos e qual seria o próximo passo.
          </p>

          <ul className="text-base font-normal leading-[1.6] text-muted space-y-3 mt-4">
            <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-copper rounded-full"></span> Duração média de 45–60 minutos, online.</li>
            <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-copper rounded-full"></span> Foco em objetivos, público, concorrência e percepção de marca.</li>
            <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-copper rounded-full"></span> Você sai com clareza sobre por que sua marca não sustenta ainda o preço que merece.</li>
          </ul>
        </div>

        {/* Lado direito: para quem é + CTA */}
        <div className="bg-surface border border-white/5 hover:border-white/10 shadow-lg rounded-[2rem] p-8 md:p-10 flex flex-col justify-between relative overflow-hidden transition-colors">
          <div className="absolute top-0 right-0 w-48 h-48 bg-copper/5 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          
          <div className="relative z-10">
            <h3 className="text-[1.875rem] font-medium tracking-tight text-cream mb-6">
              Para quem esse diagnóstico faz mais sentido?
            </h3>

            <ul className="text-base font-normal leading-[1.6] text-muted mb-6 space-y-3">
              <li className="flex gap-3 items-start"><span className="w-1.5 h-1.5 bg-white/10 rounded-full mt-2"></span> Empresas que já vendem, mas se sentem presas em guerra de preço.</li>
              <li className="flex gap-3 items-start"><span className="w-1.5 h-1.5 bg-white/10 rounded-full mt-2"></span> Negócios migrando para o digital que não querem começar com uma marca fraca.</li>
              <li className="flex gap-3 items-start"><span className="w-1.5 h-1.5 bg-white/10 rounded-full mt-2"></span> Profissionais que querem cobrar melhor e atrair clientes mais alinhados.</li>
            </ul>

            <p className="text-sm font-normal leading-[1.6] text-muted mb-8">
              Se você se identificou com esses cenários, o Diagnóstico de Posicionamento 
              é o melhor ponto de partida para entender como o Svicero Studio pode te ajudar.
            </p>

            <Button variant="primary" href="/formulario-interesse" className="w-full">
              Agendar Diagnóstico
            </Button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default DiagnosticoSection;