import { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // On mount (and whenever token changes), verify it with the backend.
  // The API interceptor in api.js reads localStorage and attaches the
  // Authorization header automatically — no manual header management here.
  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await API.get('/auth/verify');
        if (res.data.user) setUser(res.data.user);
      } catch {
        // Token expired or invalid — clear everything
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      const { token: newToken, user: userData } = res.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);