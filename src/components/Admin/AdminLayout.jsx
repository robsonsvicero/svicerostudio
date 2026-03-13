import React from 'react';
import { Link } from 'react-router-dom';
import Toast from '../UI/Toast';
import { useToast } from '../../hooks/useToast';

/**
 * Layout base para todas as páginas do Admin.
 * Provê o wrapper de tela, o link "Voltar ao painel" e o Toast global.
 *
 * Uso:
 *   const { showToastMessage, toastProps } = useAdminLayout();
 *   <AdminLayout toastProps={toastProps}>...</AdminLayout>
 *
 * Ou via o hook useToast diretamente, passando a prop toastProps.
 */
const AdminLayout = ({ children, toastProps }) => {
  return (
    <div className="min-h-screen bg-dark-bg text-[#EFEFEF] font-sans">
      {toastProps && (
        <Toast
          show={toastProps.show}
          message={toastProps.message}
          type={toastProps.type}
          onClose={toastProps.onClose}
        />
      )}
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10 lg:py-10">
        <Link
          to="/admin"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-white/60 transition hover:text-white"
        >
          <span aria-hidden="true">‹</span> Voltar ao painel
        </Link>
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
