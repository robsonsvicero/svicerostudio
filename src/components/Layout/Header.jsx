import Button from "../UI/Button";
import { Cog, Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "../../assets/logo_horizontal.png";
import simbolo from "../../assets/simbolo.png";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMenuHovered, setIsMenuHovered] = useState(false);

  const navLinks = [
    { href: "/", label: "HOME" },
    { href: "/portfolio", label: "PROJETOS" },
    { href: "/planos-pacotes", label: "PLANOS & PACOTES" },
    { href: "/contato", label: "CONTATO" },
    { href: "/blog", label: "BLOG" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-footer-bg py-2 font-body">
      {/* DESKTOP */}
        <div className="hidden md:flex items-center justify-between max-w-7xl mx-auto px-0">
        {/* Logo / Símbolo à esquerda */}
        <div className="flex-1 flex items-center justify-start">
          <img
            src={isMenuHovered ? simbolo : logo}
            alt="Logo"
            className={isMenuHovered ? "h-16" : "h-16"}
          />
        </div>

        {/* Centro: MENU (normal) ou navegação (hover) */}
        <div
          className="flex-1 flex justify-center items-center"
          onMouseEnter={() => setIsMenuHovered(true)}
          onMouseLeave={() => setIsMenuHovered(false)}
        >
          {isMenuHovered ? (
            <nav className="flex items-center gap-10">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-bold tracking-[0.15em] text-text-primary hover:text-text-primary whitespace-nowrap"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          ) : (
            <span className="text-sm font-bold tracking-[0.2em] text-text-primary cursor-pointer">
              MENU
            </span>
          )}
        </div>

        {/* Ícone de engrenagem à direita */}
        <div className="flex-1 flex justify-end">
          <Button 
            variant="custom" 
            size="icon" 
            className="bg-transparent hover:bg-secondary"
            href="/admin">
            
            <Cog className="text-cream/40" size={24} />
          </Button>
        </div>
      </div>

      {/* MOBILE */}
      <div className="md:hidden flex items-center justify-between h-16 px-4">
        <img src={simbolo} alt="Logo" className="h-12" />

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* menu mobile expandido */}
      {menuOpen && (
        <nav className="md:hidden bg-primary border-t border-white/10 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-text-primary"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Button variant="ghost" size="icon" className="mt-2 w-fit">
            <Cog size={20} />
          </Button>
        </nav>
      )}
    </header>
  );
};

export default Header;
