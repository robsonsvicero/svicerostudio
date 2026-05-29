import React from 'react';

const AdminListCard = ({
  title,
  count,
  loading,
  loadingText,
  emptyText,
  children,
  headerRight,
  className = '',
  bodyClassName = 'p-4',
}) => {
  return (
    <section className={`rounded-xl border border-white/5 bg-ds-surface ${className}`.trim()}>
      <div className="border-b border-white/5 px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-base font-semibold text-ds-text">
            {title}
            {!loading && typeof count === 'number' && <span className="ml-2 text-sm font-normal text-ds-muted">({count})</span>}
          </h2>
          {headerRight}
        </div>
      </div>

      <div className={bodyClassName}>
        {loading ? (
          <p className="p-6 text-ds-muted">{loadingText}</p>
        ) : (
          <>
            {count === 0 ? (
              <p className="p-6 text-ds-muted">{emptyText}</p>
            ) : (
              children
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default AdminListCard;