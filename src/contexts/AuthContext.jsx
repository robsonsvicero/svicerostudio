import React, { createContext, useContext, useEffect, useState } from 'react'
const API_URL = import.meta.env.VITE_API_URL || 'https://svicerostudio-production.up.railway.app';
const TOKEN_KEY = 'svicero_admin_token';

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return context
}

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Recupera token e usuário do localStorage
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    // Valida sessão na API
    fetch(`${API_URL}/api/auth/session`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) {
          localStorage.removeItem(TOKEN_KEY);
          setUser(null);
        } else {
          const data = await res.json();
          setUser(data.user);
        }
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  }, []);

  // Login
  const signIn = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const payload = await res.json();
      if (!res.ok) {
        return { error: { message: payload.error || 'Erro ao fazer login' } };
      }
      localStorage.setItem(TOKEN_KEY, payload.token);
      setUser(payload.user);
      return { error: null };
    } catch (err) {
      return { error: { message: 'Erro de conexão' } };
    }
  };

  // Logout
  const signOut = async () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    return { error: null };
  };

  const value = {
    user,
    loading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
