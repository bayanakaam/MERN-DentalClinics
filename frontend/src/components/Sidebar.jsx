import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ width: '250px', background: '#f4f4f4', padding: '20px', height: '100vh' }}>
      <h3>{user?.role} Menu</h3>
      <nav>
        <ul>
          {user?.role === 'Doctor' && (
            <>
              <li><Link to="/doctor/dashboard">Dashboard</Link></li>
              <li><Link to="/doctor/cases">My Cases</Link></li>
              <li><Link to="/doctor/orders">My Orders</Link></li>
              <li><Link to="/doctor/calendar">Calendar</Link></li>
            </>
          )}
          {user?.role === 'Lab' && (
            <>
              <li><Link to="/lab/dashboard">Dashboard</Link></li>
              <li><Link to="/lab/orders">Incoming Orders</Link></li>
            </>
          )}
        </ul>
      </nav>
      <button onClick={handleLogout} style={{ marginTop: 'auto' }}>Logout</button>
    </div>
  );
};

export default Sidebar;
