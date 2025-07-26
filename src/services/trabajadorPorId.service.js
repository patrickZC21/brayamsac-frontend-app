// Servicio para obtener datos de un trabajador por su ID
export async function getTrabajadorPorId(id) {
  if (!id) return null;
  const token = localStorage.getItem('token');
  const res = await fetch(`/api/trabajadores/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) return null;
  const data = await res.json();
  // Si no tiene nombre o dni, no es válido
  if (!data || !data.nombre || !data.dni) return null;
  return data;
}
