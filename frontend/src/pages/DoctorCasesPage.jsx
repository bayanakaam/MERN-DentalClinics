import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import caseService from '../services/caseService';
import './DashboardPages.css'; // إعادة استخدام نفس ملف الأنماط

const DoctorCasesPage = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await caseService.getMyCases();
        setCases(data);
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to fetch cases.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  if (loading) {
    return <div className="loading-state">Loading cases...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="dashboard-page">
      {/* 1. عنوان الصفحة */}
      <header className="page-header">
        <h1>My Medical Cases</h1>
        <p>Here you can manage all your patient cases.</p>
      </header>

      {/* 2. بطاقة المحتوى الرئيسية */}
      <div className="content-card">
        <div className="card-header">
          <h2>All Cases ({cases.length})</h2>
          <Link to="/doctor/cases/new" className="create-new-button">
            + Create New Case
          </Link>
        </div>

        {/* 3. الجدول المصمم */}
        <table className="styled-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Creation Date</th>
              <th>Treatments</th>
              <th>File</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {cases.length > 0 ? cases.map((caseItem) => (
              <tr key={caseItem._id}>
                <td>{caseItem.patient?.fullName || 'N/A'}</td>
                <td>{new Date(caseItem.createdAt).toLocaleDateString()}</td>
                <td>{caseItem.treatments.length}</td>
                <td>
                  <a 
                    href={`http://localhost:5000/${caseItem.caseFile}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="file-link"
                  >
                    View File
                  </a>
                </td>
                <td>
                  {/* 
                    هنا سنعرض حالة الطلب المرتبط بالحالة.
                    سنحتاج إلى تعديل الـ API لإرسال هذه المعلومة.
                    في الوقت الحالي، سنضع شارة "New" إذا لم يكن هناك طلب.
                  */}
                  <span className="status-badge status-new">New</span>
                </td>
              </tr>
             )) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                  You have not created any cases yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorCasesPage;
