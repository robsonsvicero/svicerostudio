// utils/authFetch.js
// Função utilitária para requisições autenticadas
// Sempre inclui o token salvo no contexto ou localStorage

export const authFetch = async (url, options = {}, token) => {
  // Busca token do contexto ou localStorage se não informado
  const authToken = token || localStorage.getItem('svicero_admin_token');
  if (!authToken) throw new Error('Token de autenticação não encontrado');

  // Garante que headers existam
  options.headers = options.headers || {};
  options.headers['Authorization'] = `Bearer ${authToken}`;

  return fetch(url, options);
};
