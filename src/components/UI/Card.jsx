import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  variant = 'default',
  hover = true,
  ...props 
}) => {
  // Tailwind classes para variantes e hover
  const baseClasses = 'rounded-xl transition-all duration-300';
  const variantClasses = {
    default: 'bg-neutral-900 border border-gray-800',
    project: 'bg-neutral-900 sticky top-0',
    service: 'bg-neutral-900 h-full',
  };
  const hoverClasses = hover ? 'hover:shadow-2xl hover:scale-[1.02]' : '';
  const classes = `${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`;

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

// Subcomponentes
Card.Image = ({ src, alt, className = '' }) => (
  <div className={`overflow-hidden rounded-t-xl ${className}`}>
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105 rounded-xl"
      loading="lazy"
    />
  </div>
);

Card.Content = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

Card.Title = ({ children, className = '' }) => (
  <h3 className={`font-title text-2xl font-light text-cream mb-6 ${className}`}>
    {children}
  </h3>
);

Card.Description = ({ children, className = '' }) => (
  <p className={`text-lg text-cream/60 mb-6 leading-relaxed ${className}`}>
    {children}
  </p>
);

Card.Actions = ({ children, className = '' }) => (
  <div className={`flex flex-col gap-4 ${className}`}>
    {children}
  </div>
);

Card.Button = ({ children, href, variant = 'outline', className = '' }) => {
  const variantClasses = {
    outline: 'border-2 border-primary text-cream hover:bg-secondary hover:border-secondary',
    filled: 'bg-primary text-cream hover:bg-secondary/80',
  };
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`w-full flex items-center justify-center py-3 px-6 rounded-full font-medium transition-all duration-300 ${variantClasses[variant]} ${className}`}
    >
      {children}
    </a>
  );
};

Card.Badge = ({ children, variant = 'default', className = '' }) => {
  const variantClasses = {
    default: 'bg-primary/10 text-primary border border-primary/20',
    designer: 'bg-primary/10 text-primary border border-primary/20',
    'ui-ux': 'bg-primary/10 text-primary border border-primary/20',
    developer: 'bg-primary/10 text-primary border border-primary/20',
    cta: 'bg-primary/10 text-primary border border-primary/30 hover:bg-primary hover:border-primary hover:text-cream',
  };
  return (
    <span className={`inline-block text-sm font-medium px-4 py-2 rounded-full w-fit my-4 transition-all duration-300 ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Card;
