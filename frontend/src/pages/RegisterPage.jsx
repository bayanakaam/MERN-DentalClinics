import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import './AuthForm.css'; // إعادة استخدام نفس ملف الأنماط

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    role: '', // الدور سيتم تحديده أولاً
    companyName: ''
  });
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (role) => {
    setFormData({ ...formData, role: role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.role) {
      setError('Please select a role to begin.');
      return;
    }
    setIsSubmitting(true);
    try {
      await register(formData);
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Register</h2>
        <p className="auth-subtitle">Please fill these informations:</p>
        
        {/* --- قسم اختيار الدور الجديد --- */}
        <div className="role-selector">
          <p>I am a:</p>
          <div className="role-options">
            <button 
              type="button"
              className={`role-button ${formData.role === 'Doctor' ? 'active' : ''}`}
              onClick={() => handleRoleChange('Doctor')}
            >
              Doctor
            </button>
            <button 
              type="button"
              className={`role-button ${formData.role === 'Lab' ? 'active' : ''}`}
              onClick={() => handleRoleChange('Lab')}
            >
              Lab
            </button>
          </div>
        </div>

        {/* --- باقي النموذج (يظهر بعد اختيار الدور) --- */}
        {formData.role && (
          <>
            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="fullName">Full Name</label>
                <input type="text" id="fullName" name="fullName" placeholder="Enter your full name" onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label htmlFor="address">Address</label>
                <input type="text" id="address" name="address" placeholder="Enter your address" onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label htmlFor="phone">Mobile Phone</label>
                <input type="tel" id="phone" name="phone" placeholder="Enter you mobile number" onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label htmlFor="companyName">
                  {formData.role === 'Doctor' ? 'Clinic Name' : 'Company Name'}
                </label>
                <input type="text" id="companyName" name="companyName" placeholder={formData.role === 'Doctor' ? 'Enter clinic name' : 'Enter company name'} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" placeholder="Enter your email" onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" placeholder="Enter your password" onChange={handleChange} required />
              </div>
            </div>
            
            <button type="submit" className="auth-button" disabled={isSubmitting}>
              {isSubmitting ? 'REGISTERING...' : 'REGISTER'}
            </button>
          </>
        )}
        
        {error && <p className="error-message">{error}</p>}

        <p className="auth-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;
