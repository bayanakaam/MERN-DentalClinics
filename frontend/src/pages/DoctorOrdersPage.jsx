import React, { useState, useEffect } from 'react';
import orderService from '../services/orderService';
import './DashboardPages.css'; // إعادة استخدام نفس ملف الأنماط

const DoctorOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError('');
        // ملاحظة: هذا سيعطي خطأ 404 الآن لأننا لم ننشئ الـ API بعد.
        // سنتعامل مع هذا في الخطوة التالية.
        const { data } = await orderService.getMyDoctorOrders();
        setOrders(data);
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to fetch orders.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // دالة مساعدة لتحديد لون شارة الحالة
  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'status-pending';
      case 'accepted': return 'status-accepted';
      case 'finished': return 'status-finished';
      case 'denied': return 'status-denied';
      default: return 'status-new';
    }
  };

  if (loading) {
    return <div className="loading-state">Loading orders...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="dashboard-page">
      <header className="page-header">
        <h1>My Orders</h1>
        <p>Track the status of all your orders sent to labs.</p>
      </header>

      <div className="content-card">
        <div className="card-header">
          <h2>All Orders ({orders?.length})</h2>
        </div>

        <table className="styled-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Patient</th>
              <th>Lab</th>
              <th>Status</th>
              <th>Delivery Date</th>
            </tr>
          </thead>
          <tbody>
            {orders?.length > 0 ? orders?.map((order) => (
              <tr key={order._id}>
                <td>#{order._id.substring(0, 8)}...</td>
                <td>{order.case?.patient?.fullName || 'N/A'}</td>
                <td>{order.lab?.name || 'N/A'}</td>
                <td>
                  <span className={`status-badge ${getStatusBadgeClass(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  {order.deliveryDate 
                    ? new Date(order.deliveryDate).toLocaleDateString() 
                    : 'Not set'}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                  You have not created any orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorOrdersPage;
