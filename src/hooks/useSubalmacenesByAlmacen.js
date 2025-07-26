import { useEffect, useState } from "react";
import { getSubalmacenesByAlmacen } from "../services/subalmacenesService";

export function useSubalmacenesByAlmacen(almacenId) {
  const [subalmacenes, setSubalmacenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!almacenId) return;
    const token = localStorage.getItem("token");
    getSubalmacenesByAlmacen(almacenId, token)
      .then(setSubalmacenes)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [almacenId]);

  return { subalmacenes, loading, error };
}
