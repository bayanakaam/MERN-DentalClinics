import api from './api';

const getMyPatients = async () => {
  const response = await api.get('/patients');
  return response.data;
};

const patientService = {
  getMyPatients,
};

export default patientService;
