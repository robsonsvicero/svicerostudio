import Button from "../UI/Button";
import ScrollReveal from "../UI/ScrollReveal";

const DiagnosticoSection = () => {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-16 font-body">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

        {/* Lado esquerdo: explicação do processo */}
        <ScrollReveal direction="right" delay={0.1}>
          <span className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-copper/25 bg-copper/5 text-[11px] font-mono uppercase tracking-[.2em] text-copper">
            <span className="w-1.5 h-1.5 rounded-full bg-copper shadow-[0_0_10px_rgba(184,115,51,0.5)]"></span>
            PRIMEIRO PASSO
          </span>

          <h2 className="text-4xl md:text-[3.75rem] font-medium tracking-[-0.02em] leading-[1.1] text-cream text-left mb-6">
            O que é o Diagnóstico de Posicionamento?
          </h2>

          <p className="text-xl font-normal leading-[1.6] text-muted mb-4">
            É uma análise estratégica aprofundada em que avaliamos como a sua clínica é 
            percebida hoje pelo mercado particular, onde a sua imagem está drenando sua margem 
            de lucro e quais ações de design estratégico vão blindar sua tabela de preços.
          </p>

          <p className="text-base font-normal leading-[1.6] text-muted mb-6">
            Não é uma reunião para discutir "corzinha de logotipo" ou templates prontos. 
            É um diagnóstico comercial honesto, baseado no seu modelo de atendimento, para 
            entender se a sua estrutura está pronta para atrair o público premium de alto ticket.
          </p>

          <ul className="text-base font-normal leading-[1.6] text-muted space-y-3 mt-4">
            <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-copper rounded-full"></span> Duração média de 45 a 60 minutos, realizada online de forma individual.</li>
            <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-copper rounded-full"></span> Foco em estrutura de tratamentos, público local e diferenciação estética.</li>
            <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-copper rounded-full"></span> Você sai com clareza exata sobre o ruído visual que está afastando o paciente particular.</li>
          </ul>
        </ScrollReveal>

        {/* Lado direito: card de qualificação + CTA */}
        <ScrollReveal direction="left" delay={0.2} className="bg-surface border border-white/5 hover:border-white/10 shadow-lg rounded-[2rem] p-8 md:p-10 flex flex-col justify-between relative overflow-hidden transition-colors">
          <div className="absolute top-0 right-0 w-48 h-48 bg-copper/5 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          
          <div className="relative z-10">
            <h3 className="text-[1.875rem] font-medium tracking-tight text-cream mb-6">
              Para quem essa análise estratégica é indispensável?
            </h3>

            <ul className="text-base font-normal leading-[1.6] text-muted mb-6 space-y-3">
              <li className="flex gap-3 items-start"><span className="w-1.5 h-1.5 bg-white/10 rounded-full mt-2"></span> Ortodontistas e cirurgiões-dentistas experientes reféns de tabelas de convênio ou manutenções baratas.</li>
              <li className="flex gap-3 items-start"><span className="w-1.5 h-1.5 bg-white/10 rounded-full mt-2"></span> Clínicas estruturadas que investiram em tecnologia, mas continuam atraindo pacientes que barganham valor.</li>
              <li className="flex gap-3 items-start"><span className="w-1.5 h-1.5 bg-white/10 rounded-full mt-2"></span> Profissionais que decidiram migrar para tratamentos de alto ticket (Invisalign, Estética Avançada) e exigem uma imagem AAA.</li>
            </ul>

            <p className="text-sm font-normal leading-[1.6] text-muted mb-8">
              Se o seu posicionamento atual não reflete a excelência do seu currículo técnico, 
              este diagnóstico é o ponto de virada para transformar o seu consultório em uma marca de elite.
            </p>

            <Button variant="primary" href="/formulario-interesse" className="w-full">
              Agendar Diagnóstico
            </Button>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};

export default DiagnosticoSection;