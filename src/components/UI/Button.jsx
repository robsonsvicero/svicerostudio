import React, { useRef, useState, useEffect } from 'react';
import './Button.css';

const Button = ({ 
  children, 
  variant = 'outline', // outline, primary, secondary, custom
  size = 'md', 
  className = '', 
  icon,
  onClick,
  href,
  target,
  rel,
  type = 'button',
  fillColor: customFillColor, // Cor de preenchimento customizada
  ...props 
}) => {
  const btnRef = useRef(null);
  const circleRef = useRef(null);
  const [circleSize, setCircleSize] = useState(0);

  useEffect(() => {
    if (btnRef.current) {
      const width = btnRef.current.offsetWidth;
      const height = btnRef.current.offsetHeight;
      // O círculo cobre toda a diagonal do botão
      const size = Math.sqrt(width * width + height * height) * 1.2;
      setCircleSize(size);
    }
  }, [className]); // Removido btnRef.current e size das dependências

  // Classes base
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 relative overflow-hidden group focus:outline-none focus:ring-2 focus:ring-primary';
  const sizeClasses = {
    sm: 'px-6 py-2 text-base',
    md: 'px-8 py-3 text-lg',
    lg: 'px-12 py-4 text-xl',
  };

  // Variações de estilo
  let variantClasses = '';
  let outlineHoverClass = '';
  if (variant === 'primary') {
    variantClasses = 'bg-primary border-none text-cream';
  } else if (variant === 'secondary') {
    variantClasses = 'bg-secondary border-none text-cream';
  } else if (variant === 'outline') {
    variantClasses = 'bg-transparent border-2 border-primary text-low-dark outline-hover';
    outlineHoverClass = 'outline-hover';
  } else if (variant === 'custom') {
    // Variante custom: não aplica estilos de cor/borda, permite controle total via className
    variantClasses = '';
  }

  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses} ${className}`;

  // Centraliza o círculo no centro do botão
  const handleMouseEnter = () => {
    const btn = btnRef.current;
    const circle = circleRef.current;
    if (!btn || !circle) return;
    const width = btn.offsetWidth;
    const height = btn.offsetHeight;
    circle.style.left = `${width / 2}px`;
    circle.style.top = `${height / 2}px`;
    circle.classList.add('btn-fill-animate');
  };
  const handleMouseLeave = () => {
    const circle = circleRef.current;
    if (circle) {
      circle.classList.remove('btn-fill-animate');
    }
  };

  // Cor do preenchimento animado
  let fillColor = '#171F2A'; // primary
  if (variant === 'secondary') fillColor = '#844219'; // secondary
  else if (variant === 'outline') fillColor = '#2F353B'; // hover mais visível
  else if (variant === 'custom') fillColor = '#FFF8F0'; // cream
  
  // Permite sobrescrever com prop customFillColor
  if (customFillColor) fillColor = customFillColor;

  // Classes de hover para texto (custom não força cor)
  const textHoverClass = variant === 'custom' ? '' : 'group-hover:text-cream text-cream';
  const iconHoverClass = variant === 'custom' ? '' : 'group-hover:text-cream text-cream';

  // Para outline, texto escuro e hover claro
  const textBaseClass = variant === 'outline' ? 'text-low-dark group-hover:text-[#FFF8F0]' : '';

  const content = (
    <>
      {/* Círculo animado para preenchimento */}
      <span
        ref={circleRef}
        className="btn-fill absolute rounded-full z-0"
        style={{ width: circleSize, height: circleSize, background: fillColor }}
        aria-hidden="true"
      />
      {icon && <span className={`relative z-10 mr-2 text-xl transition-colors duration-300 ${iconHoverClass}`}>{icon}</span>}
      <span className={`relative z-10 transition-colors duration-300 ${textHoverClass} ${textBaseClass}`}>{children}</span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={classes}
        ref={btnRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={classes}
      ref={btnRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {content}
    </button>
  );
};

export default Button;
