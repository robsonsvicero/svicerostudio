import ScrollReveal from '../UI/ScrollReveal';

import logoMenuZn from '../../assets/logo-menuzn.png';
import logoRobsonSvicero from '../../assets/logo-robsonsvicero.png';
import seloSublim from '../../assets/selo_sublim.png';
import logoPowerBrain from '../../assets/logo-powerbrain.png';

const partners = [
  {
    title: 'Instituto Sublim',
    logo: seloSublim,
    site: 'https://institutosublim.org',
  },
  {
    title: 'Menu ZN',
    logo: logoMenuZn,
    site: 'https://menuzonanorte.com.br',
  },
  {
    title: 'PowerBrain',
    logo: logoPowerBrain,
    site: 'https://powerbrainbr.com/',
  },
  {
    title: 'Robson Svicero',
    logo: logoRobsonSvicero,
    site: 'https://robsonsvicero.com.br',
  },
];

const PartnersSection = () => {
  return (
    <section
      id="parceiros"
      aria-label="Parceiros do Svicero Studio"
      className="border-y border-white/10 bg-ds-surface px-4 py-10 font-body sm:px-6 md:px-16"
    >
      <ScrollReveal direction="up" delay={0.1}>
        <div className="mx-auto flex max-w-screen-xl flex-col gap-8 lg:flex-row lg:items-center lg:gap-14">
          <span className="flex w-fit flex-shrink-0 items-center gap-2 rounded-full border border-ds-accent/20 bg-ds-accent/10 px-4 py-1.5 text-[11px] font-mono uppercase tracking-[0.2em] text-ds-accent shadow-[0_0_15px_rgba(255,122,89,0.15)] backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-ds-accent shadow-[0_0_10px_rgba(255,122,89,0.8)]" />
            Parceiros
          </span>

          <div className="grid flex-1 grid-cols-2 items-center gap-x-8 gap-y-7 sm:grid-cols-4 lg:gap-x-12">
            {partners.map((partner) => (
              <a
                key={partner.title}
                href={partner.site}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-16 items-center justify-center rounded-xl px-3 transition-colors hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ds-accent"
                aria-label={`Acessar site ${partner.title}`}
                title={partner.title}
              >
                <img
                  src={partner.logo}
                  alt={`Logo ${partner.title}`}
                  className="max-h-12 max-w-full object-contain opacity-70 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0"
                  loading="lazy"
                  draggable="false"
                />
              </a>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
};

export default PartnersSection;
