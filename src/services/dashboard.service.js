export async function getDashboardResumen() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${import.meta.env.VITE_API_URL}/dashboard/resumen`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("No se pudo obtener el resumen");
  return await response.json();
}
