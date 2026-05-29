import React from 'react';
import { Link } from 'react-router-dom';

const AdminSectionLinkCard = ({ title, desc, icon, link, count, countLabel }) => {
  return (
    <Link
      to={link}
      className="group rounded-xl border border-white/5 bg-ds-surface p-5 transition-all hover:border-ds-accent/30 hover:bg-ds-surface"
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-ds-accent/20 bg-ds-accent/10 transition-colors group-hover:bg-ds-accent/20">
          <i className={`${icon} text-base text-ds-accent`}></i>
        </div>
        <span className="text-xs tabular-nums text-ds-muted">
          {count !== null ? count : '—'} {countLabel}
        </span>
      </div>
      <h4 className="mb-1 text-base font-semibold text-ds-text transition-colors group-hover:text-copper-light">
        {title}
      </h4>
      <p className="text-sm leading-relaxed text-ds-muted">{desc}</p>
      <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-ds-muted opacity-80 transition-all group-hover:text-ds-accent group-hover:opacity-100">
        Acessar <i className="fa-solid fa-arrow-right text-[10px]"></i>
      </div>
    </Link>
  );
};

export default AdminSectionLinkCard;