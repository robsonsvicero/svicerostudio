import Button from "../UI/Button";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import logo from "../../assets/logo_horizontal.png";
import simbolo from "../../assets/simbolo.png";

const whatsappUrl = "https://wa.me/5511964932007?text=Ol%C3%A1!%20Venho%20pelo%20site%20do%20est%C3%BAdio%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es";

const navLinks = [
  { href: "/", label: "HOME" },
  { href: "/sobre", label: "SOBRE" },
  { href: "/projetos", label: "PROJETOS" },
  { href: "/processos", label: "PROCESSOS" },
  { href: "/diagnostico", label: "DIAGNÓSTICO" },
  { href: "/contato", label: "CONTATO" },
  { href: "/blog", label: "BLOG" },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const isActiveLink = (href) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header className="w-full z-50 bg-ds-text py-2 font-body border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
        {/* Desktop: navegação convencional, com links sempre visíveis. */}
        <div className="hidden xl:flex items-center justify-between gap-8 max-w-7xl mx-auto px-6 h-16">
          <a href="/" className="shrink-0 hover:opacity-80 transition-opacity">
            <img
              src={logo}
              alt="Svicero Studio Logo"
              className="h-16 w-auto object-contain brightness-0 invert"
            />
          </a>

          <nav aria-label="Navegação principal" className="flex items-center justify-end gap-5 xl:gap-7">
            {navLinks.map((link) => {
              const isActive = isActiveLink(link.href);

              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`text-base font-semibold tracking-[0.04em] hover:text-ds-accent transition-colors whitespace-nowrap ${isActive ? "text-ds-accent" : "text-white/85"}`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                </a>
              );
            })}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-black/15 transition-all hover:-translate-y-0.5 hover:bg-[#20bd5a] whitespace-nowrap"
              aria-label="Conversar pelo WhatsApp no número (11) 96493-2007"
            >
              <i className="fa-brands fa-whatsapp text-xl" aria-hidden="true" />
              <span>(11) 96493-2007</span>
            </a>
          </nav>
        </div>

        {/* Tablet e mobile: menu compacto. */}
        <div className="xl:hidden flex items-center justify-between h-16 px-6">
          <a href="/">
            <img src={simbolo} alt="Svicero Studio" className="h-10 brightness-0 invert" />
          </a>

          <div className="flex items-center gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#20bd5a] whitespace-nowrap"
              aria-label="Conversar pelo WhatsApp no número (11) 96493-2007"
            >
              <i className="fa-brands fa-whatsapp text-lg" aria-hidden="true" />
              <span className="hidden min-[360px]:inline">(11) 96493-2007</span>
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="text-white bg-ds-accent hover:bg-ds-accent-hover p-2 rounded-full transition-colors"
              aria-label="Abrir menu"
              aria-expanded={menuOpen}
              aria-controls="menu-responsivo"
            >
              <Menu size={28} />
            </button>
          </div>
        </div>
      </header>

      <div
        id="menu-responsivo"
        className={`fixed inset-0 w-full h-[100dvh] z-[100] bg-ds-bg transition-all duration-500 ease-in-out ${menuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"} overflow-y-auto overflow-x-hidden`}
      >
        <div className="absolute top-6 right-6 md:top-10 md:right-10 z-[110]">
          <Button
            onClick={() => setMenuOpen(false)}
            variant="custom"
            className="text-white hover:bg-ds-accent transition-colors p-3 bg-ds-text rounded-full"
            aria-label="Fechar menu"
          >
            <X size={32} strokeWidth={1.5} />
          </Button>
        </div>

        <nav aria-label="Navegação responsiva" className="min-h-screen w-full flex flex-col items-center justify-start pt-24 pb-20 px-6 gap-4">
          {navLinks.map((link, index) => {
            const isActive = isActiveLink(link.href);

            return (
              <a
                key={link.href}
                href={link.href}
                className={`text-[1.875rem] md:text-[3.25rem] font-medium tracking-tight hover:text-ds-accent transition-all transform text-center ${isActive ? "text-ds-accent" : "text-ds-text"} ${menuOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                style={{ transitionDelay: `${index * 100}ms` }}
                onClick={() => setMenuOpen(false)}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
              </a>
            );
          })}

          <div className="mt-20 text-center opacity-90">
            <p className="text-[10px] tracking-[0.5em] font-medium uppercase text-ds-accent">
              Svicero Studio © 2026
            </p>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Header;
