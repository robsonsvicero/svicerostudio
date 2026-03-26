const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });

  // Se token expirou, fazer logout
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Você pode disparar um evento ou usar Context para notificar o app
    window.dispatchEvent(new Event('auth:expired'));
  }

  return response;
}

// Função auxiliar para requisições GET
export async function apiGet(endpoint) {
  const response = await apiRequest(endpoint);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao buscar dados');
  }
  return response.json();
}

// Função auxiliar para requisições POST
export async function apiPost(endpoint, data) {
  const response = await apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao criar dados');
  }
  return response.json();
}

// Função auxiliar para requisições PUT/PATCH
export async function apiUpdate(endpoint, data, method = 'PUT') {
  const response = await apiRequest(endpoint, {
    method,
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao atualizar dados');
  }
  return response.json();
}

// Função auxiliar para requisições DELETE
export async function apiDelete(endpoint) {
  const response = await apiRequest(endpoint, {
    method: 'DELETE'
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao deletar dados');
  }
  return response.json();
}
