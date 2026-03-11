// src/components/StatCard.jsx
import React from 'react';
import './StatCard.css'; // سننشئ هذا الملف بعد قليل

const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className="stat-card" style={{ '--card-color': color }}>
      <div className="card-icon">
        {icon}
      </div>
      <div className="card-info">
        <span className="card-value">{value}</span>
        <span className="card-title">{title}</span>
      </div>
    </div>
  );
};

export default StatCard;
