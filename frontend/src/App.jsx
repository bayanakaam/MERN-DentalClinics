import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

// التخطيط
import DashboardLayout from './layouts/DashboardLayout';

// الصفحات
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; 
import DoctorDashboard from './pages/DoctorDashboard';
import LabDashboard from './pages/LabDashboard';

import DoctorCasesPage from './pages/DoctorCasesPage'; 
import DoctorOrdersPage from './pages/DoctorOrdersPage'; 
import CreateCasePage from './pages/CreateCasePage'; 


// صفحات وهمية مؤقتة


const DoctorCalendarPage = () => <h2>My Calendar</h2>;
const LabOrdersPage = () => <h2>Incoming Orders</h2>;
const UnauthorizedPage = () => <h1 style={{ textAlign: 'center' }}>403 - Unauthorized</h1>;

const HomePage = () => {
    const { user } = useAuth();
    if (user?.role === 'Doctor') return <Navigate to="/doctor/dashboard" />;
    if (user?.role === 'Lab') return <Navigate to="/lab/dashboard" />;
    return <Navigate to="/login" />;
};

function App() {
  return (
    <Routes>
      {/* المسارات العامة */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* مسارات الطبيب المتداخلة */}
      <Route 
        path="/doctor" 
        element={
          <ProtectedRoute allowedRoles={['Doctor']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DoctorDashboard />} />
        <Route path="cases" element={<DoctorCasesPage />} />
        <Route path="cases/new" element={<CreateCasePage />} />
        <Route path="orders" element={<DoctorOrdersPage />} />
        <Route path="calendar" element={<DoctorCalendarPage />} />
        
      </Route>

      {/* مسارات المختبر المتداخلة */}
      <Route 
        path="/lab" 
        element={
          <ProtectedRoute allowedRoles={['Lab']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<LabDashboard />} />
        <Route path="orders" element={<LabOrdersPage />} />
      </Route>

      {/* المسار الرئيسي */}
      <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
