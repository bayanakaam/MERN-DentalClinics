import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        api.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
      } catch (error) {
        console.error("Failed to parse user data from localStorage", error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const userData = {
      token: response.data.token,
      ...response.data.user
    };
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    api.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
    
    if (userData.role === 'Doctor') {
      navigate('/doctor/dashboard');
    } else if (userData.role === 'Lab') {
      navigate('/lab/dashboard');
    } else {
      navigate('/');
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  const register = async (userData) => {
    const { role, fullName, email, password, phone, address, companyName } = userData;

    if (role === 'Doctor') {
      const doctorData = {
        fullName,
        email,
        password,
        address,
        phoneNumber: phone,
        // --- التعديل الأول: إضافة قيمة افتراضية ---
        clinicName: companyName || 'N/A' 
      };
      await api.post('/auth/doctor/register', doctorData);

    } else if (role === 'Lab') {
      const labData = {
        // --- التعديل الثاني: إعادة تسمية name وتوحيد phoneNumber ---
        name: companyName || 'N/A',
        email,
        password,
        phoneNumber: phone, // <-- توحيد الاسم هنا أيضاً
        address
      };
      await api.post('/auth/lab/register', labData);

    } else {
      throw new Error('Invalid role specified');
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
