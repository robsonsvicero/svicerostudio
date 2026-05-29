import Button from "../UI/Button";
import ScrollReveal from "../UI/ScrollReveal";
import SectionHeader from "../UI/SectionHeader";

const DiagnosticoSection = () => {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-16 font-body">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

        {/* Lado esquerdo: explicação do processo */}
        <ScrollReveal direction="right" delay={0.1}>
          <SectionHeader
            badge="PRIMEIRO PASSO"
            title="O que é o Diagnóstico de Posicionamento?"
            description="O diagnóstico analisa como a clínica é percebida hoje e onde existem desalinhamentos entre:"
            className="mb-0"
            descriptionClassName="mb-4"
          />

          <p className="mt-6 text-base font-normal leading-[1.6] text-ds-muted text-left">
            Mais do que avaliar estética, investigamos: <span className="font-semibold text-ds-text">qualidade</span>, <span className="font-semibold text-ds-text">posicionamento</span>, <span className="font-semibold text-ds-text">comunicação</span>, <span className="font-semibold text-ds-text">experiência</span> e <span className="font-semibold text-ds-text">percepção de valor</span>.
          </p>

          <br></br>
          <ul className="text-base font-normal leading-[1.6] text-ds-muted mb-10 space-y-4">
            <li className="flex items-start gap-4">
              <span className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-ds-accent/10 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-ds-accent" />
              </span>
              quais sinais a marca transmite,
            </li>
            <li className="flex items-start gap-4">
              <span className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-ds-accent/10 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-ds-accent" />
              </span>
              quais pacientes tende a atrair,
            </li>
            <li className="flex items-start gap-4">
              <span className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-ds-accent/10 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-ds-accent" />
              </span>
              onde existe perda de clareza,
            </li>
            <li className="flex items-start gap-4">
              <span className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-ds-accent/10 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-ds-accent" />
              </span>
              o que impede a clínica de parecer tão madura quanto realmente é.
            </li>
          </ul>
          <p className="mt-6 text-base font-normal leading-[1.6] text-ds-muted text-left">
            O objetivo não é criar uma marca “mais bonita”, é tornar percepção, discurso e experiência mais coerentes.
          </p>
        </ScrollReveal>

        {/* Lado direito: card de qualificação + CTA */}
        <ScrollReveal direction="left" delay={0.2} className="bg-ds-surface border border-white/5 hover:border-white/10 shadow-lg rounded-[2rem] p-8 md:p-10 flex flex-col justify-between relative overflow-hidden transition-colors">
          <div className="absolute top-0 right-0 w-48 h-48 bg-ds-accent/5 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

          <div className="relative z-10">
            <h3 className="text-[1.875rem] font-medium tracking-tight text-ds-text mb-6">
              Para quem esse diagnóstico faz sentido?
            </h3>

            <p className="mt-6 text-base font-normal leading-[1.6] text-ds-muted text-left">
              Para clínicas que sentem que:
            </p>
            <br></br>

            <ul className="text-base font-normal leading-[1.6] text-ds-muted mb-10 space-y-4">
              <li className="flex items-start gap-4">
                <span className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-ds-accent/10 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-ds-accent" />
                </span>
                o nível do trabalho ainda não está sendo percebido com clareza,
              </li>
              <li className="flex items-start gap-4">
                <span className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-ds-accent/10 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-ds-accent" />
                </span>
                a comunicação parece genérica,
              </li>
              <li className="flex items-start gap-4">
                <span className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-ds-accent/10 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-ds-accent" />
                </span>
                existe dificuldade em justificar valor,
              </li>
              <li className="flex items-start gap-4">
                <span className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-ds-accent/10 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-ds-accent" />
                </span>
                ou o crescimento começou a exigir um posicionamento mais maduro.
              </li>
            </ul>

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