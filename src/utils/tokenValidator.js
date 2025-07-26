/**
 * Utilidades para validación segura de tokens JWT en el frontend
 * Solo para frontend - no requiere cambios en backend
 */

/**
 * Verifica si un token JWT ha expirado
 * @param {string} token - Token JWT a validar
 * @returns {boolean} - true si el token ha expirado o es inválido
 */
export const isTokenExpired = (token) => {
  if (!token || typeof token !== 'string') {
    return true;
  }
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return true;
    }
    
    // Decodificar el payload del JWT
    const payload = JSON.parse(atob(parts[1]));
    
    // Verificar si tiene campo de expiración
    if (!payload.exp) {
      return true;
    }
    
    // Comparar con tiempo actual (con margen de 30 segundos)
    const currentTime = Math.floor(Date.now() / 1000);
    const expirationTime = payload.exp;
    
    return expirationTime <= (currentTime + 30); // 30 segundos de margen
  } catch (error) {
    console.error('Error validando token:', error);
    return true;
  }
};

/**
 * Obtiene el payload decodificado de un token JWT
 * @param {string} token - Token JWT
 * @returns {object|null} - Payload del token o null si es inválido
 */
export const getTokenPayload = (token) => {
  if (!token || typeof token !== 'string') {
    return null;
  }
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    
    return JSON.parse(atob(parts[1]));
  } catch (error) {
    console.error('Error parseando token:', error);
    return null;
  }
};

/**
 * Obtiene el tiempo restante antes de que expire el token (en segundos)
 * @param {string} token - Token JWT
 * @returns {number} - Segundos restantes (0 si ya expiró o es inválido)
 */
export const getTokenTimeRemaining = (token) => {
  const payload = getTokenPayload(token);
  
  if (!payload || !payload.exp) {
    return 0;
  }
  
  const currentTime = Math.floor(Date.now() / 1000);
  const timeRemaining = payload.exp - currentTime;
  
  return Math.max(0, timeRemaining);
};

/**
 * Limpia todos los datos de autenticación del localStorage
 */
export const clearAuthData = () => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario_id');
    localStorage.removeItem('user_data'); // Por si existe
    
    // Limpiar cualquier otro dato relacionado con autenticación
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('auth_') || key.startsWith('user_')) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Error limpiando datos de autenticación:', error);
  }
};

/**
 * Verifica si el usuario está autenticado con token válido
 * @returns {boolean} - true si está autenticado con token válido
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return token && !isTokenExpired(token);
};

/**
 * Obtiene información del usuario desde el token
 * @returns {object|null} - Información del usuario o null
 */
export const getUserFromToken = () => {
  const token = localStorage.getItem('token');
  
  if (!isAuthenticated()) {
    return null;
  }
  
  const payload = getTokenPayload(token);
  
  return {
    id: payload?.id || payload?.user_id || payload?.userId,
    email: payload?.email,
    nombre: payload?.nombre || payload?.name,
    rol: payload?.rol || payload?.role,
    exp: payload?.exp,
    iat: payload?.iat
  };
};