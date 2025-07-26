// Servicio para obtener fechas de subalmacenes
import axios from 'axios';

const API_URL = '/api/fechas'; // Corregido para coincidir con el backend

export const getSubalmacenFechas = async (subalmacenId) => {
  const token = localStorage.getItem('token');
  const { data } = await axios.get(`${API_URL}?subalmacen_id=${subalmacenId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};
