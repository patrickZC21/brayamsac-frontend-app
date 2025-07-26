import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_CONFIG, TIME_INTERVALS } from '../config/constants.js';
import { isTokenExpired, clearAuthData, getTokenTimeRemaining } from '../utils/tokenValidator.js';

export const useTokenExpiration = () => {
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (token && !isTokenExpired(token)) {
        // Solo intentar logout en el servidor si el token aún es válido
        await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGOUT}`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
      }
    } catch (error) {
      console.error("Error al cerrar sesión automáticamente:", error);
    } finally {
      clearAuthData();
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    // Verificar token cada 30 segundos
    const interval = setInterval(async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      // Primero verificar del lado del cliente
      if (isTokenExpired(token)) {
        console.log("Token expirado detectado localmente");
        handleLogout();
        return;
      }

      // Si el token expira en menos de 5 minutos, verificar con el servidor
      const timeRemaining = getTokenTimeRemaining(token);
      if (timeRemaining < 300) { // 5 minutos
        try {
          const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.VALIDATE}`, {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });

          if (!response.ok) {
            // Token inválido o expirado según el servidor
            console.log("Token inválido según el servidor");
            handleLogout();
          }
        } catch (error) {
          console.error("Error al validar token con el servidor:", error);
          // En caso de error de red, no cerrar sesión automáticamente
          // Solo si el token está realmente expirado localmente
        }
      }
    }, TIME_INTERVALS.TOKEN_VALIDATION);

    return () => clearInterval(interval);
  }, [navigate, handleLogout]);

  return { handleLogout };
};
