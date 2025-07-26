// Servicio para obtener datos reales de subalmacen y almacen desde el backend
export async function getInfoAlmacenSubalmacen(subalmacenId) {
  if (!subalmacenId) return { almacen: '', subalmacen: '' };
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/subalmacenes/${subalmacenId}/info`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Error al obtener info');
    const data = await response.json();
    // Se espera que el backend retorne { almacen: 'Nombre Almacen', subalmacen: 'Nombre Subalmacen' }
    return data;
  } catch {
    // Si hay error, retorna vacío o valores por defecto
    return { almacen: '', subalmacen: '' };
  }
}
