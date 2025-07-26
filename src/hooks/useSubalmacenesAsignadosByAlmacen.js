import { useEffect, useState } from "react";
import { getSubalmacenesAsignadosByAlmacen } from "../services/subalmacenesService";

export function useSubalmacenesAsignadosByAlmacen(almacenId) {
  const [subalmacenes, setSubalmacenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!almacenId) return;
    const token = localStorage.getItem("token");
    getSubalmacenesAsignadosByAlmacen(almacenId, token)
      .then(setSubalmacenes)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [almacenId]);

  return { subalmacenes, loading, error };
}
