import React from 'react';

const Button = ({
  children,
  variant = 'outline', // outline, primary, secondary
  size = 'md',
  className = '',
  icon,
  onClick,
  href,
  target,
  rel,
  type = 'button',
  ...props
}) => {

  const sizeClasses = {
    sm: 'px-6 py-3 text-xs md:text-sm',
    md: 'px-8 py-4 text-sm',
    lg: 'px-10 py-5 text-sm md:text-base',
    icon: 'p-3',
    bar: 'w-full h-full',
  };

  if (variant === 'secondary') {
    // Variant: Border Beam
    const beamContent = (
      <>
        {/* Beam is now default */}
        <span className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_75%,#B87333_100%)] opacity-100 transition-opacity duration-300"></span>
        {/* Solid border appears on hover to "illuminate" */}
        <span className="absolute inset-0 rounded-full bg-copper opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
        <span className={`flex items-center justify-center gap-3 uppercase transition-colors duration-300 group-hover:text-white font-bold tracking-[0.15em] text-white bg-surface w-full h-full rounded-full relative shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] ${sizeClasses[size] || ''}`}>
            <span className="relative z-10">{children}</span>
            {icon && <span className="relative z-10 transition-transform duration-300 group-hover:scale-110">{icon}</span>}
        </span>
      </>
    );
    const beamClasses = `group inline-flex overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_35px_rgba(184,115,51,0.5)] rounded-full p-[1px] relative items-center justify-center focus:outline-none focus:ring-2 focus:ring-copper ${className}`;
    
    if (href) {
      return <a href={href} target={target} rel={rel} className={beamClasses} {...props}>{beamContent}</a>;
    }
    return <button type={type} onClick={onClick} className={beamClasses} {...props}>{beamContent}</button>;
  }

  if (variant === 'primary') {
    // Variant: Secondary Border Beam (Inverted Primary)
    const beamSecondaryContent = (
      <>
        {/* White beam is now default */}
        <span className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_75%,#FAFAF8_100%)] opacity-100 transition-opacity duration-300"></span>
        {/* Solid white/cream border appears on hover */}
        <span className="absolute inset-0 rounded-full bg-cream opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
        <span className={`flex items-center justify-center gap-3 uppercase transition-colors duration-300 group-hover:text-copper font-bold tracking-[0.15em] text-white bg-copper w-full h-full rounded-full relative shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] ${sizeClasses[size] || ''}`}>
            <span className="relative z-10">{children}</span>
            {icon && <span className="relative z-10 transition-transform duration-300 group-hover:scale-110">{icon}</span>}
        </span>
      </>
    );
    const beamSecondaryClasses = `group inline-flex overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_35px_rgba(250,250,248,0.4)] rounded-full p-[1px] relative items-center justify-center focus:outline-none focus:ring-2 focus:ring-copper ${className}`;
    
    if (href) {
      return <a href={href} target={target} rel={rel} className={beamSecondaryClasses} {...props}>{beamSecondaryContent}</a>;
    }
    return <button type={type} onClick={onClick} className={beamSecondaryClasses} {...props}>{beamSecondaryContent}</button>;
  }

  // Fallback / Variant: Outline Glass
  const outlineClasses = `relative overflow-hidden group flex items-center justify-center gap-3 border border-white/10 bg-white/5 backdrop-blur-sm text-white rounded-full font-bold uppercase tracking-[0.15em] hover:bg-white hover:text-primary hover:border-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-copper ${sizeClasses[size] || ''} ${className}`;
  
  const outlineContent = (
    <>
      {children}
      {icon && <span className="transition-transform duration-300 group-hover:translate-x-1">{icon}</span>}
    </>
  );

  if (href) {
    return <a href={href} target={target} rel={rel} className={outlineClasses} {...props}>{outlineContent}</a>;
  }
  return <button type={type} onClick={onClick} className={outlineClasses} {...props}>{outlineContent}</button>;
};

export default Button;
