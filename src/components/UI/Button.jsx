import React from 'react';

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
  ...props
}) => {

  const sizeClasses = {
    sm: 'px-6 py-3 text-xs md:text-sm',
    md: 'px-6 py-4 md:px-8 md:py-4 text-sm md:text-base',
    lg: 'px-10 py-5 text-sm md:text-base',
    icon: 'p-3',
    bar: 'w-full h-full',
  };

  if (variant === 'primary') {
    // Variant: Secondary Border Beam (Inverted Primary)
    const beamSecondaryContent = (
      <>
        {/* White beam is now default */}
        <span className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_75%,#222222_100%)] opacity-100 transition-opacity duration-300"></span>
        {/* Solid white/cream border appears on hover */}
        <span className="absolute inset-0 rounded-full bg-cream opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
        <span className={`flex items-center justify-center gap-3 uppercase transition-colors duration-300 group-hover:text-ds-surface font-bold tracking-[0.15em] text-white bg-ds-accent hover:bg-ds-accent-hover w-full h-full rounded-full relative shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] ${sizeClasses[size] || ''}`}>
            <span className="relative z-10">{children}</span>
            {icon && <span className="relative z-10 transition-transform duration-300 group-hover:scale-110">{icon}</span>}
        </span>
      </>
    );
    const beamSecondaryClasses = `group inline-flex overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_35px_rgba(255,122,89,0.5)] rounded-full p-[1px] relative items-center justify-center focus:outline-none focus:ring-2 focus:ring-copper ${className}`;
    
    if (href) {
      return <a href={href} target={target} rel={rel} className={beamSecondaryClasses} {...props}>{beamSecondaryContent}</a>;
    }
    return <button type={type} onClick={onClick} className={beamSecondaryClasses} {...props}>{beamSecondaryContent}</button>;
  }

  if (variant === 'secondary') {
    // Variant: Border Beam
    const beamContent = (
      <>
        {/* Beam is now default */}
        <span className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_75%,#FF7A59_100%)] opacity-100 transition-opacity duration-300"></span>
        {/* Solid border appears on hover to "illuminate" */}
        <span className="absolute inset-0 rounded-full bg-ds-text opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
        <span className={`flex items-center justify-center gap-3 uppercase transition-colors duration-300 group-hover:text-ds-surface font-bold tracking-[0.15em] text-ds-surface bg-ds-text w-full h-full rounded-full relative shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] ${sizeClasses[size] || ''}`}>
            <span className="relative z-10">{children}</span>
            {icon && <span className="relative z-10 transition-transform duration-300 group-hover:scale-110">{icon}</span>}
        </span>
      </>
    );
    const beamClasses = `group inline-flex overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_35px_rgba(59,130,246,0.5)] rounded-full p-[1px] relative items-center justify-center focus:outline-none focus:ring-2 focus:ring-copper ${className}`;
    
    if (href) {
      return <a href={href} target={target} rel={rel} className={beamClasses} {...props}>{beamContent}</a>;
    }
    return <button type={type} onClick={onClick} className={beamClasses} {...props}>{beamContent}</button>;
  }

  if (variant === 'custom') {
    const customClasses = `inline-flex items-center justify-center gap-3 transition-all duration-300 focus:outline-none ${sizeClasses[size] || ''} ${className}`;
    const customContent = (
      <>
        {children}
        {icon && <span className="transition-transform duration-300 group-hover:translate-x-1">{icon}</span>}
      </>
    );

    if (href) {
      return <a href={href} target={target} rel={rel} className={customClasses} {...props}>{customContent}</a>;
    }
    return <button type={type} onClick={onClick} className={customClasses} {...props}>{customContent}</button>;
  }


  const usesSurfaceStyling = /(?:^|\s)(?:bg-|border-)/.test(className);
  const usesLightSurfaceStyling = /(?:^|\s)(?:bg-white\/(?:5|10)|bg-white\/\[.*?\])/.test(className);

  if (usesSurfaceStyling) {
    const plainClasses = `inline-flex items-center justify-center gap-3 transition-all duration-300 focus:outline-none ${sizeClasses[size] || ''} ${className} ${usesLightSurfaceStyling ? 'hover:bg-ds-text hover:text-white' : ''}`;
    const plainContent = (
      <>
        <span className="relative z-10">{children}</span>
        {icon && <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">{icon}</span>}
      </>
    );

    if (href) {
      return <a href={href} target={target} rel={rel} className={plainClasses} {...props}>{plainContent}</a>;
    }
    return <button type={type} onClick={onClick} className={plainClasses} {...props}>{plainContent}</button>;
  }


  // Fallback / Variant: Outline Beam
  const outlineBeamContent = (
    <>
      <span className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_75%,#222222_100%)] opacity-100 transition-opacity duration-300"></span>
      <span className="absolute inset-0 rounded-full bg-ds-text opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
      <span className={`flex items-center justify-center gap-3 uppercase transition-colors duration-300 font-bold tracking-[0.15em] text-ds-text bg-ds-outline hover:bg-ds-outline-hover w-full h-full rounded-full relative ${sizeClasses[size] || ''}`}>
        <span className="relative z-10">{children}</span>
        {icon && <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">{icon}</span>}
      </span>
    </>
  );

  const outlineBeamClasses = `group inline-flex overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_35px_rgba(34,34,34,0.2)] rounded-full p-[1px] relative items-center justify-center focus:outline-none focus:ring-2 focus:ring-copper ${className}`;

  if (href) {
    return <a href={href} target={target} rel={rel} className={outlineBeamClasses} {...props}>{outlineBeamContent}</a>;
  }
  return <button type={type} onClick={onClick} className={outlineBeamClasses} {...props}>{outlineBeamContent}</button>;
};

export default Button;
