import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('75user');
      const storedToken = localStorage.getItem('75token');
      if (storedUser && storedToken) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.role !== 'admin') {
          setUser(parsedUser);
        } else {
          localStorage.removeItem('75user');
          localStorage.removeItem('75token');
        }
      }
    } catch (e) {
      localStorage.removeItem('75user');
      localStorage.removeItem('75token');
    } finally {
      setIsReady(true);
    }
  }, []);

  const signup = useCallback(async (name, email, password, phone = '') => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/auth/register`, {
        name, email, password, phone, role: 'customer'
      });
      if (!data.success) throw new Error(data.message || 'Signup failed');
      const userData = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role
      };
      localStorage.setItem('75token', data.token);
      localStorage.setItem('75user', JSON.stringify(userData));
      setUser(userData);
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/auth/login`, { email, password });
      if (!data.success) throw new Error(data.message || 'Login failed');
      if (data.user.role === 'admin') throw new Error('Use admin login page.');
      const userData = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role
      };
      localStorage.setItem('75token', data.token);
      localStorage.setItem('75user', JSON.stringify(userData));
      setUser(userData);
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('75token');
    localStorage.removeItem('75user');
  }, []);

  const getToken = useCallback(() => localStorage.getItem('75token'), []);

  return (
    <UserContext.Provider value={{ user, isReady, loading, signup, login, logout, getToken }}>
      {children}
    </UserContext.Provider>
  );
};