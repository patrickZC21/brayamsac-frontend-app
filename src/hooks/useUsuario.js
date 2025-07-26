import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_CONFIG } from '../config/constants.js';
import { isTokenExpired, clearAuthData, getUserFromToken } from '../utils/tokenValidator.js';

export function useUsuario() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    // Validación del lado del cliente primero
    if (!token || isTokenExpired(token)) {
      // Limpiar datos de autenticación si el token es inválido o ha expirado
      clearAuthData();
      setLoading(false);
      setUsuario(null);
      setError(token ? 'Sesión expirada' : null);
      
      // Solo redirigir si había un token que expiró
      if (token) {
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 1000);
      }
      return;
    }
    
    // Intentar obtener información del usuario desde el token
    const userFromToken = getUserFromToken();
    if (userFromToken) {
      // Si podemos obtener info del token, usarla temporalmente
      setUsuario(userFromToken);
    }
    
    fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.VALIDATE}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) {
          // Si el token es inválido, limpiarlo y redirigir
          if (res.status === 401 || res.status === 403) {
            clearAuthData();
            setUsuario(null);
            setError("Sesión expirada");
            // Redirigir al login después de un breve delay
            setTimeout(() => {
              navigate("/", { replace: true });
            }, 1000);
            return null;
          }
          throw new Error(`Error ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.usuario) {
          setUsuario(data.usuario);
          setError(null);
        } else {
          setError("No autenticado");
          setUsuario(null);
        }
      })
      .catch((err) => {
        console.error("Error al validar usuario:", err);
        setError("Error al validar usuario");
        setUsuario(null);
        // En caso de error de red, no redirigir inmediatamente
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  return { usuario, loading, error };
}
