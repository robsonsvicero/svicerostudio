import React from 'react';

const AdminSectionCard = ({
  badge,
  title,
  children,
  className = '',
  paddingClassName = 'p-6',
}) => {
  return (
    <section className={`rounded-xl border border-white/5 bg-ds-surface ${className}`.trim()}>
      <div className={paddingClassName}>
        {(badge || title) && (
          <div className="mb-5">
            {badge && <p className="mb-1 text-xs font-mono uppercase tracking-widest text-ds-accent">{badge}</p>}
            {title && <h2 className="text-base font-semibold text-ds-text">{title}</h2>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
};

export default AdminSectionCard;