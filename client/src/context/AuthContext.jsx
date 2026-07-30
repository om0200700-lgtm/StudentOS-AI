import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('studentos_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await authAPI.getMe();
          setUser(res.data.data);
        } catch (error) {
          console.error('Failed to load user:', error);
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await authAPI.login({ email, password });
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('studentos_token', res.data.token);
      return res.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred during login' };
    }
  };

  const register = async (userData) => {
    try {
      const res = await authAPI.register(userData);
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('studentos_token', res.data.token);
      return res.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred during registration' };
    }
  };

  const loginWithGoogle = async (googleToken) => {
    try {
      const res = await authAPI.googleLogin({ token: googleToken });
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('studentos_token', res.data.token);
      return res.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred during Google login' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('studentos_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, loginWithGoogle, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
