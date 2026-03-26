import { useState, useCallback } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export function useAuth() {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login falhou');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setToken(data.token);
      setUser(data.user);
      
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setError(null);
  }, []);

  const checkSession = useCallback(async () => {
    if (!token) return null;
    
    try {
      const response = await fetch(`${API_URL}/auth/session`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        logout();
        return null;
      }

      const data = await response.json();
      return data.user;
    } catch (err) {
      logout();
      return null;
    }
  }, [token, logout]);

  return {
    token,
    user,
    login,
    logout,
    checkSession,
    isAuthenticated: !!token,
    loading,
    error
  };
}
