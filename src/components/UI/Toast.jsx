import React from 'react';
import Button from './Button';

const Toast = ({ show, message, type = 'success', onClose }) => {
  if (!show) return null;

  return (
    <div className={`fixed top-8 right-8 z-50 min-w-[320px] max-w-[450px] p-6 bg-white rounded-xl shadow-2xl flex items-center justify-between gap-4 animate-slideInRight border-l-4 ${type === 'success' ? 'border-green-500' : 'border-red-500'}`}>
      <div className="flex items-center gap-3 flex-1">
        <i className={`fa-solid text-2xl ${type === 'success' ? 'fa-circle-check text-green-500' : 'fa-circle-exclamation text-red-500'}`}></i>
        <span className="text-neutral-900 text-base font-medium">{message}</span>
      </div>
      <Button
        className="bg-transparent border-none text-neutral-500 hover:text-neutral-900 transition-colors p-1 flex items-center justify-center text-xl"
        onClick={onClose}
        aria-label="Fechar notificação"
      >
        <i className="fa-solid fa-xmark"></i>
      </Button>
    </div>
  );
};

export default Toast;
