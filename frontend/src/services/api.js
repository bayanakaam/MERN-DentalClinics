import axios from 'axios';

// إنشاء instance من axios
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // عنوان URL الأساسي لكل طلبات الـ API
} );

// إضافة Interceptor لإرفاق التوكن مع كل طلب
api.interceptors.request.use(
  (config) => {
    // جلب بيانات المستخدم من localStorage
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      if (user.token) {
        // إضافة التوكن إلى هيدر Authorization
        config.headers['Authorization'] = `Bearer ${user.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
