import React from 'react';
import Button from '../UI/Button';

const baseClasses = {
  sm: 'uppercase rounded-full border-2 border-ds-text bg-white/5 px-4 py-2 text-sm font-medium text-ds-text hover:text-ds-surface hover:bg-ds-tech hover:border-ds-tech transition',
  md: 'uppercase rounded-full border-2 border-ds-text bg-ds-surface px-4 py-2 text-sm font-medium text-ds-text hover:text-ds-surface hover:bg-ds-tech hover:border-ds-tech transition',
  lg: 'uppercase rounded-full border-2 border-ds-text px-4 py-2 text-lg font-semibold text-ds-text hover:text-ds-surface hover:scale-110 hover:bg-ds-tech transition hover:border-ds-tech',
};

const AdminHeaderActionButton = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  size = 'sm',
  className = '',
}) => {
  return (
    <Button type={type} onClick={onClick} disabled={disabled} className={`${baseClasses[size] || baseClasses.sm} ${className}`.trim()}>
      {children}
    </Button>
  );
};

export default AdminHeaderActionButton;