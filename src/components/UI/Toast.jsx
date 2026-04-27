import React from 'react';
import Button from './Button';

const Toast = ({ show, message, type = 'success', onClose }) => {
  if (!show) return null;

  return (
    <div className={`fixed top-4 right-4 left-4 sm:left-auto sm:top-8 sm:right-8 z-50 w-auto sm:min-w-[320px] sm:max-w-[450px] p-4 sm:p-6 bg-white rounded-xl shadow-2xl flex items-center justify-between gap-3 sm:gap-4 font-body animate-slideInRight border-l-4 ${type === 'success' ? 'border-green-500' : 'border-red-500'}`}>
      <div className="flex items-center gap-3 flex-1">
        <i className={`fa-solid text-2xl ${type === 'success' ? 'fa-circle-check text-green-500' : 'fa-circle-exclamation text-red-500'}`}></i>
        <span className="text-neutral-900 text-sm sm:text-base font-medium">{message}</span>
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
