import React from 'react';

const AdminMetricCard = ({ label, value, suffix, icon, iconColor, iconBg }) => {
  return (
    <div className="rounded-xl border border-white/5 bg-ds-surface p-5 transition-colors hover:border-white/10">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-widest text-ds-muted">{label}</span>
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconBg}`}>
          <i className={`${icon} text-sm ${iconColor}`}></i>
        </div>
      </div>
      <div className="text-3xl font-semibold tracking-tight text-ds-text">
        {value !== null ? value : '—'}
      </div>
      <p className="mt-1 text-xs text-ds-muted">{suffix}</p>
    </div>
  );
};

export default AdminMetricCard;