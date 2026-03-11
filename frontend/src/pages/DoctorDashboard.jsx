import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import caseService from '../services/caseService';
import './DashboardPages.css'; // ملف أنماط مشترك لصفحات الداشبورد

// استيراد أيقونات لبطاقات الإحصاء
import { FaBriefcaseMedical, FaPlusCircle, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const DoctorDashboard = () => {
  const [stats, setStats] = useState({ total: 0, pending: 0, accepted: 0, finished: 0 });
  const [recentCases, setRecentCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ملاحظة: سنحتاج إلى إنشاء API endpoint جديد لجلب هذه الإحصائيات
        // في الوقت الحالي، سنستخدم بيانات وهمية
        const casesData = await caseService.getMyCases();
        setRecentCases(casesData.slice(0, 5)); // عرض أحدث 5 حالات فقط

        // بيانات إحصائيات وهمية حالياً
        setStats({
          total: casesData.length,
          new: casesData.filter(c => !c.order).length, // حالات لم يتم طلبها بعد
          accepted: 20, // قيمة وهمية
          denied: 5,    // قيمة وهمية
        });

      } catch (err) {
        setError('Failed to fetch dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="dashboard-page">
      <header className="page-header">
        <h1>Doctor Dashboard</h1>
        <p>Welcome back! Here's a summary of your activity.</p>
      </header>

      {/* قسم بطاقات الإحصائيات */}
      <div className="stats-grid">
        <StatCard title="Total Cases" value={stats.total} icon={<FaBriefcaseMedical />} color="#3b82f6" />
        <StatCard title="New Cases" value={stats.new} icon={<FaPlusCircle />} color="#10b981" />
        <StatCard title="Accepted Orders" value={stats.accepted} icon={<FaCheckCircle />} color="#f97316" />
        <StatCard title="Denied Orders" value={stats.denied} icon={<FaTimesCircle />} color="#ef4444" />
      </div>

      {/* قسم أحدث الحالات */}
      <div className="content-card">
        <div className="card-header">
          <h2>Recent Cases</h2>
          <Link to="/doctor/cases" className="view-all-link">View All</Link>
        </div>
        <table className="styled-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Creation Date</th>
              <th>Treatments</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentCases.length > 0 ? recentCases.map(caseItem => (
              <tr key={caseItem._id}>
                <td>{caseItem.patient?.fullName || 'N/A'}</td>
                <td>{new Date(caseItem.createdAt).toLocaleDateString()}</td>
                <td>{caseItem.treatments.length}</td>
                <td>
                  {/* سنضيف حالة الطلب هنا لاحقاً */}
                  <span className="status-badge status-new">New</span>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4">No recent cases found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorDashboard;
