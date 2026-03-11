import React from 'react';
import './AuthLayout.css'; // فقط استيراد ملف CSS

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-container">
      {/* هذا الـ div الفارغ سيتم تصميمه بالكامل في CSS */}
      <div className="auth-logo-background"></div>

      <div className="auth-form-section">
        <div className="auth-form-card">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
