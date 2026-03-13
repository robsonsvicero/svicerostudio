import React from 'react';

const resolveApiBaseUrl = () => {
  // Em localhost, sempre usar o backend local
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://localhost:8080';
    }
  }
  // Em produção, usar a variável de ambiente
  return import.meta.env.VITE_API_URL || 'https://svicerostudio-production.up.railway.app';
};

const API_URL = resolveApiBaseUrl();
console.log('[AuthContext] API_URL:', API_URL);
const TOKEN_KEY = 'svicero_admin_token';

const AuthContext = React.createContext({})

export const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [token, setToken] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setUser(null);
      setToken(null);
      setLoading(false);
      return;
    }
    setToken(token);
    fetch(`${API_URL}/api/auth/session`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) {
          localStorage.removeItem(TOKEN_KEY);
          setUser(null);
          setToken(null);
        } else {
          const data = await res.json();
          setUser(data.user);
        }
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
        setToken(null);
        setLoading(false);
      });
  }, []);

  const signIn = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const payload = await res.json();
      if (!res.ok) {
        setToken(null);
        return { error: { message: payload.error || 'Erro ao fazer login' } };
      }
      localStorage.setItem(TOKEN_KEY, payload.token);
      setToken(payload.token);
      setUser(payload.user);
      return { error: null };
    } catch (err) {
      setToken(null);
      return { error: { message: 'Erro de conexão' } };
    }
  };

  const signOut = async () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setToken(null);
    return { error: null };
  };

  const value = {
    user,
    token,
    loading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
