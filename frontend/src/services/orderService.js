import api from './api';

/**
 * @description إنشاء طلب جديد من قبل الطبيب
 * @param {object} orderData - بيانات الطلب (caseId, labId)
 * @returns {Promise<object>} - الطلب الذي تم إنشاؤه
 */
const createOrder = (orderData) => {
  // ملاحظة: هذا المسار يفترض أنك قد قمت ببنائه في الـ Backend
  // POST /api/orders
  return api.post('/orders', orderData);
};

/**
 * @description جلب جميع الطلبات الخاصة بالطبيب المسجل دخوله
 * @returns {Promise<Array>} - مصفوفة من الطلبات
 */
const getMyDoctorOrders = async () => {
  // هذا هو المسار الجديد الذي أنشأناه في الـ Backend
  // GET /api/orders/my-doctor-orders
  const response = await api.get('/orders/my-doctor-orders');
  return response.data;
};

/**
 * @description جلب جميع الطلبات الواردة للمختبر المسجل دخوله
 * @returns {Promise<Array>} - مصفوفة من الطلبات
 */
const getMyLabOrders = async () => {
  // هذا المسار يفترض أنك قد قمت ببنائه في الـ Backend
  // GET /api/orders/lab-orders
  const response = await api.get('/orders/lab-orders');
  return response.data;
};

/**
 * @description تحديث حالة طلب معين من قبل المختبر
 * @param {string} orderId - معرّف الطلب
 * @param {object} statusData - بيانات الحالة الجديدة { status, deliveryDate }
 * @returns {Promise<object>} - الطلب المحدّث
 */
const updateOrderStatus = async (orderId, statusData) => {
  // هذا المسار يفترض أنك قد قمت ببنائه في الـ Backend
  // PUT /api/orders/:orderId/status
  const response = await api.put(`/orders/${orderId}/status`, statusData);
  return response.data;
};


// تجميع كل الدوال في كائن واحد لتصديره
const orderService = {
  createOrder,
  getMyDoctorOrders,
  getMyLabOrders,
  updateOrderStatus,
};

export default orderService;
