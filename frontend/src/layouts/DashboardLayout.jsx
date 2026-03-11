import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './DashboardLayout.css'; // استيراد ملف الأنماط الجديد

// استيراد الأيقونات التي سنحتاجها من مكتبة react-icons
import { 
  FaTachometerAlt, // أيقونة الداشبورد
  FaBriefcaseMedical, // أيقونة الحالات
  FaShippingFast, // أيقونة الطلبات
  FaCalendarAlt, // أيقونة التقويم
  FaSignOutAlt, // أيقونة تسجيل الخروج
  FaUserCircle // أيقونة المستخدم
} from 'react-icons/fa';
import logo from '/logo.png'; // استيراد الشعار من مجلد public

const DashboardLayout = () => {
  const { user, logout } = useAuth();

  // تحديد الروابط بناءً على دور المستخدم
  const links = user?.role === 'Doctor' ? [
    { path: '/doctor/dashboard', icon: <FaTachometerAlt />, name: 'Dashboard' },
    { path: '/doctor/cases', icon: <FaBriefcaseMedical />, name: 'My Cases' },
    { path: '/doctor/orders', icon: <FaShippingFast />, name: 'My Orders' },
    { path: '/doctor/calendar', icon: <FaCalendarAlt />, name: 'Calendar' },
  ] : [
    { path: '/lab/dashboard', icon: <FaTachometerAlt />, name: 'Dashboard' },
    { path: '/lab/orders', icon: <FaShippingFast />, name: 'Incoming Orders' },
  ];

  return (
    <div className="dashboard-container">
      {/* 1. الشريط الجانبي (Sidebar) */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src={logo} alt="IY Dent Logo" className="sidebar-logo" />
        </div>
        <nav className="sidebar-nav">
          {links.map((link) => (
            <NavLink to={link.path} key={link.path} className="sidebar-link">
              {link.icon}
              <span className="link-text">{link.name}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-profile">
            <FaUserCircle className="user-avatar" />
            <span className="user-name">{user?.fullName || 'User'}</span>
          </div>
          <button onClick={logout} className="logout-button">
            <FaSignOutAlt />
            <span className="link-text">Logout</span>
          </button>
        </div>
      </aside>

      {/* 2. منطقة المحتوى الرئيسية */}
      <main className="main-content">
        {/* <header className="main-header"> ... سيتم إضافته لاحقاً ... </header> */}
        <div className="content-area">
          {/* Outlet هو المكان الذي سيتم فيه عرض محتوى الصفحات (DoctorDashboard, DoctorCases, etc.) */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
