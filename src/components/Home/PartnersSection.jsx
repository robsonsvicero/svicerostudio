import ScrollReveal from '../UI/ScrollReveal';
import SectionHeader from '../UI/SectionHeader';

import logoMenuZn from '../../assets/logo-menuzn.png';
import logoRobsonSvicero from '../../assets/logo-robsonsvicero.png';
import seloSublim from '../../assets/selo_sublim.png';
import logoPowerBrain from '../../assets/logo-powerbrain.png';

const partners = [
  {
    title: 'Menu ZN',
    logo: logoMenuZn,
    site: 'https://menuzonanorte.com.br',
  },
  {
    title: 'Robson Svicero',
    logo: logoRobsonSvicero,
    site: 'https://robsonsvicero.com.br',
  },
  {
    title: 'Instituto Sublim',
    logo: seloSublim,
    site: 'https://institutosublim.org',
  },
  {
    title: 'PowerBrain',
    logo: logoPowerBrain,
    site: 'https://powerbrainbr.com/',
  },
];

const PartnersSection = () => {
  return (
    <section
      id="parceiros"
      className="py-16 sm:py-24 px-4 sm:px-6 md:px-16 bg-ds-bg font-body border-y border-ds-border/70"
    >
      <div className="max-w-screen-xl mx-auto">
        <ScrollReveal direction="up" delay={0.1} className="mb-10">
          <SectionHeader
            badge="PARCEIROS"
            title="Marcas e iniciativas que caminham com a gente"
            description="Uma rede de projetos parceiros conectados por estratégia, comunicação e desenvolvimento de marcas."
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
          {partners.map((partner, index) => (
            <ScrollReveal
              key={partner.title}
              direction="up"
              delay={0.1 + index * 0.08}
              className="h-full"
            >
              <article className="h-full min-h-[230px] flex flex-col items-center justify-center text-center p-6 bg-ds-surface border border-ds-border rounded-2xl shadow-sm hover:-translate-y-1 hover:border-ds-accent/35 hover:shadow-xl transition-all duration-300">
                <a
                  href={partner.site}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-28 w-full items-center justify-center rounded-xl bg-ds-bg/70 p-5 transition-colors duration-300 hover:bg-ds-accent/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ds-accent focus-visible:ring-offset-4 focus-visible:ring-offset-ds-surface"
                  aria-label={`Acessar site ${partner.title}`}
                >
                  <img
                    src={partner.logo}
                    alt={`Logo ${partner.title}`}
                    className="max-h-20 max-w-full object-contain"
                    loading="lazy"
                    draggable="false"
                  />
                </a>

                <h3 className="mt-6 text-xl font-medium tracking-tight text-ds-text">
                  {partner.title}
                </h3>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
