// Centraliza a URL base da API para todo o projeto.
// Em localhost usa o backend local; em produção usa a variável de ambiente.
export const API_URL = (() => {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://localhost:8080';
    }
  }
  return import.meta.env.VITE_API_URL || 'https://svicerostudio-production.up.railway.app';
})();
