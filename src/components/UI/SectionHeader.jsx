const SectionHeader = ({
  badge,
  title,
  description,
  align = 'left',
  className = '',
  titleClassName = '',
  descriptionClassName = '',
}) => {
  const alignmentClasses = align === 'center' ? 'items-center text-center' : 'items-start text-left';

  return (
    <div className={`mb-12 flex flex-col ${alignmentClasses} ${className}`.trim()}>
      {badge && (
        <span className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-ds-accent/25 bg-ds-accent/5 text-[11px] font-mono uppercase tracking-[.2em] text-ds-accent w-auto max-w-max">
          <span className="w-1.5 h-1.5 rounded-full bg-ds-accent shadow-[0_0_10px_rgba(184,115,51,0.5)]" />
          {badge}
        </span>
      )}

      <h2 className={`text-4xl md:text-[3.75rem] font-medium tracking-[-0.02em] leading-[1.1] text-ds-text ${align === 'center' ? 'mx-auto' : 'text-left'} ${titleClassName}`.trim()}>
        {title}
      </h2>

      {description && (
        <p className={`mt-6 text-xl font-normal leading-[1.6] text-ds-muted max-w-2xl ${align === 'center' ? 'mx-auto' : ''} ${descriptionClassName}`.trim()}>
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;