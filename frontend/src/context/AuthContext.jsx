import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('access_token') || null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('access_token', token);
    } else {
      localStorage.removeItem('access_token');
    }
  }, [token]);

  const login = async (username, password) => {
    const res = await api.post('/login/', { username, password });
    setToken(res.data.access);
    localStorage.setItem('access_token', res.data.access);
    localStorage.setItem('refresh_token', res.data.refresh);
    return res.data;
  };

  const register = async (username, password, role = 'USER') => {
    const res = await api.post('/register/', { username, password, role });
    return res.data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);