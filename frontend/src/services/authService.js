import axios from 'axios';

// تحديد عنوان URL الأساسي للـ API
// تأكد من أن رقم المنفذ (5000) يطابق منفذ الـ Backend
const API_URL = 'http://localhost:5000/api/auth';

/**
 * دالة لتسجيل دخول المستخدم (طبيب أو مختبر )
 * @param {string} email - البريد الإلكتروني للمستخدم
 * @param {string} password - كلمة المرور
 * @param {string} role - دور المستخدم ('doctor' or 'lab')
 * @returns {Promise<object>} - بيانات المستخدم والتوكن
 */
const login = async (email, password, role) => {
  // تحديد المسار الصحيح بناءً على الدور
  const loginPath = role === 'doctor' ? '/doctor/login' : '/lab/login';
  
  // إجراء طلب POST باستخدام axios
  const response = await axios.post(API_URL + loginPath, {
    email,
    password,
  });

  // إذا كان الطلب ناجحاً ويحتوي على توكن، قم بتخزينه في localStorage
  if (response.data && response.data.token) {
    // localStorage هو مكان في المتصفح لتخزين البيانات بشكل دائم
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

// يمكنك إضافة دالة تسجيل الخروج هنا لاحقاً
const logout = () => {
  localStorage.removeItem('user');
};

const authService = {
  login,
  logout,
};

export default authService;
