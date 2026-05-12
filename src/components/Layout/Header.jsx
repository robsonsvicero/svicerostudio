import Button from "../UI/Button";
import { Cog, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import logo from "../../assets/logo_horizontal.png";
import simbolo from "../../assets/simbolo.png";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const navLinks = [
    { href: "/", label: "HOME" },
    { href: "/portfolio", label: "PROJETOS" },
    { href: "/diagnostico", label: "DIAGNÓSTICO" },
    { href: "/planos-pacotes", label: "PLANOS & PACOTES" },
    { href: "/contato", label: "CONTATO" },
    { href: "/blog", label: "BLOG" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0D0D0D]/60 backdrop-blur-2xl py-2 font-body border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
      {/* DESKTOP */}
      <div className="hidden md:flex items-center justify-between max-w-7xl mx-auto px-6 h-16">
        {/* Logo à esquerda */}
        <div className="flex items-center justify-start">
          <a href="/" className="hover:opacity-80 transition-opacity">
              <img
                src={logo}
                alt="Svicero Studio Logo"
                className="h-16 w-auto object-contain brightness-0 invert"
              />
          </a>
        </div>

        {/* Centro: MENU aciona o overlay */}
        <div className="flex justify-center items-center">
          <Button 
            onClick={() => setMenuOpen(true)}
            className="group flex items-center gap-3 text-sm font-bold tracking-[0.3em] text-cream hover:text-copper transition-colors"
          >
            <span className="w-8 h-[1px] bg-white/40 group-hover:w-12 transition-all"></span>
            MENU
            <span className="w-8 h-[1px] bg-white/40 group-hover:w-12 transition-all"></span>
          </Button>
        </div>
      </div>

      {/* MOBILE */}
      <div className="md:hidden flex items-center justify-between h-16 px-6">
        <a href="/">
          <img src={simbolo} alt="Logo" className="h-10 brightness-0 invert" />
        </a>

        <Button
          onClick={() => setMenuOpen(true)}
          className="text-cream p-2"
          aria-label="Abrir Menu"
        >
          <Menu size={28} />
        </Button>
      </div>

      {/* OVERLAY MENU (FULL SCREEN) */}
      {/* OVERLAY MENU (FULL SCREEN) */}
      <div className={`fixed inset-0 w-screen h-screen z-[100] bg-charcoal transition-all duration-500 ease-in-out ${menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'} overflow-y-auto overflow-x-hidden`}>
        {/* Botão de Fechar */}
        <div className="absolute top-6 right-6 md:top-10 md:right-10 z-[110]">
          <Button 
            onClick={() => setMenuOpen(false)}
            className="text-cream hover:text-copper transition-colors p-3 bg-white/5 rounded-full"
            aria-label="Fechar Menu"
          >
            <X size={32} strokeWidth={1.5} />
          </Button>
        </div>

        {/* Links do Menu */}
        <nav className="min-h-screen w-full flex flex-col items-center justify-start pt-24 pb-20 px-6 gap-4 md:gap-4">
          {navLinks.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-[1.875rem] md:text-[3.75rem] font-medium tracking-tight text-cream hover:text-copper transition-all transform text-center ${menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}

          {/* Botão Admin no final do menu */}
          <a 
            href="/admin"
            className={`mt-10 flex items-center gap-3 px-10 py-5 rounded-full border border-white/10 bg-surface text-[12px] font-bold tracking-[0.2em] text-cream hover:bg-copper hover:border-copper transition-all shadow-sm ${menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            style={{ transitionDelay: `${navLinks.length * 100}ms` }}
            onClick={() => setMenuOpen(false)}
          >
            <Cog size={18} />
            PAINEL ADMINISTRATIVO
          </a>

          {/* Rodapé do Menu */}
          <div className="mt-20 text-center opacity-30">
            <p className="text-[10px] tracking-[0.5em] font-medium uppercase text-muted">
              Svicero Studio © 2026
            </p>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
