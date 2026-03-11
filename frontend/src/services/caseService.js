import api from './api'; // <--- استيراد الـ instance المجهز

/**
 * دالة لجلب جميع الحالات الخاصة بالطبيب المسجل دخوله
 * @returns {Promise<Array>} - مصفوفة من الحالات
 */
const getMyCases = async () => {
  // لاحظ أننا لا نحتاج لتحديد العنوان الكامل أو إضافة التوكن يدوياً
  const response = await api.get('/cases');
  return response.data;
};

const createCase = async (formData) => {
  const response = await api.post('/cases', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const caseService = {
  getMyCases,
  createCase, 
};

export default caseService;
