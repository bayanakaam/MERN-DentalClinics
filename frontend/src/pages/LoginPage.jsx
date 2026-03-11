import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import './AuthForm.css'; // ملف أنماط مشترك للنماذج

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Login</h2>
        <p className="auth-subtitle">Welcome back!</p>
        
        <div className="input-group">
          <label htmlFor="email">Username</label>
          <input 
            type="email" 
            id="email" 
            placeholder="Enter your username" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password" 
            placeholder="Enter your password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>
        
        <button type="submit" className="auth-button">LOGIN</button>
        
        {error && <p className="error-message">{error}</p>}

        <p className="auth-link">
          New to IY Dent? <Link to="/register">Register here</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
