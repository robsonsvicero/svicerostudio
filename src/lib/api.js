// Centraliza a URL base da API para todo o projeto.
// Em localhost usa o backend local; em produção usa a variável de ambiente.
export const API_URL = import.meta.env.VITE_API_URL || 'https://svicerostudio-production.up.railway.app';
