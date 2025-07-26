// Servicio para obtener asistencias reales por subalmacén y fecha
export async function getAsistenciasRegistradas(subalmacenId, fecha) {
  if (!subalmacenId || !fecha) return [];
  const token = localStorage.getItem('token');
  const res = await fetch(`/api/asistencias?subalmacen_id=${subalmacenId}&fecha=${fecha}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) return [];
  return await res.json();
}
