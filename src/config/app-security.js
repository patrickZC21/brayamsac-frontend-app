// Configuración centralizada y segura para la app de asistencias
import { isTokenExpired, clearAuthData } from '../utils/tokenValidator.js';

export const APP_CONFIG = {
  API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'AsistenciasApp',
  PORT: import.meta.env.VITE_PORT || 5174,
  
  // Endpoints de la API
  ENDPOINTS: {
    asistencias: '/api/asistencias',
    almacenes: '/api/almacenes',
    subalmacenes: '/api/subalmacenes',
    trabajadores: '/api/trabajadores',
    dashboard: '/api/dashboard',
    auth: '/api/auth'
  }
};

// Helper para construir URLs de API de forma segura
export const buildApiUrl = (endpoint, params = {}) => {
  let url = `${APP_CONFIG.API_BASE_URL}${endpoint}`;
  
  // Agregar query parameters si existen
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value);
    }
  });
  
  if (queryParams.toString()) {
    url += `?${queryParams.toString()}`;
  }
  
  return url;
};

// Gestión segura de tokens con validación mejorada
export const tokenManager = {
  set: (token) => {
    if (!token || typeof token !== 'string' || !token.trim()) {
      console.warn('Token inválido proporcionado');
      return false;
    }
    
    // Verificar que el token no esté expirado antes de guardarlo
    if (isTokenExpired(token.trim())) {
      console.warn('Intento de guardar token expirado');
      return false;
    }
    
    try {
      localStorage.setItem('token', token.trim());
      return true;
    } catch (error) {
      console.error('Error al guardar token:', error);
      return false;
    }
  },
  
  get: () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !token.trim()) {
        return null;
      }
      
      // Verificar si el token ha expirado
      if (isTokenExpired(token.trim())) {
        console.log('Token expirado detectado, limpiando automáticamente');
        clearAuthData();
        return null;
      }
      
      return token.trim();
    } catch (error) {
      console.error('Error al obtener token:', error);
      return null;
    }
  },
  
  remove: () => {
    try {
      clearAuthData(); // Usar la función más completa
      return true;
    } catch (error) {
      console.error('Error al eliminar datos de autenticación:', error);
      return false;
    }
  },
  
  isValid: () => {
    const token = tokenManager.get();
    return token !== null && token.length > 0 && !isTokenExpired(token);
  },
  
  getAuthHeaders: () => {
    const token = tokenManager.get();
    return token ? {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json; charset=utf-8',
      'Accept': 'application/json'
    } : {
      'Content-Type': 'application/json; charset=utf-8',
      'Accept': 'application/json'
    };
  }
};

// Logger que no imprime en producción
export const logger = {
  log: (...args) => {
    if (import.meta.env.DEV) {
      console.log('[DEV]', ...args);
    }
  },
  
  error: (...args) => {
    if (import.meta.env.DEV) {
      console.error('[DEV]', ...args);
    } else {
      // En producción, solo registrar errores críticos
      console.error('[ERROR]', args[0]);
    }
  },
  
  warn: (...args) => {
    if (import.meta.env.DEV) {
      console.warn('[DEV]', ...args);
    }
  },
  
  info: (...args) => {
    if (import.meta.env.DEV) {
      console.info('[DEV]', ...args);
    }
  }
};

// Utilidades para validación de datos
export const validators = {
  isValidTimeFormat: (time) => {
    return typeof time === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(time);
  },
  
  isValidDate: (date) => {
    return date instanceof Date && !isNaN(date.getTime());
  },
  
  isValidId: (id) => {
    return id && (typeof id === 'string' || typeof id === 'number') && String(id).trim() !== '';
  },
  
  sanitizeInput: (input) => {
    if (typeof input !== 'string') return input;
    return input.trim().replace(/[<>]/g, '');
  }
};

// Cache simple para optimizar requests repetidos
class SimpleCache {
  constructor(ttl = 5 * 60 * 1000) { // 5 minutos por defecto
    this.cache = new Map();
    this.ttl = ttl;
  }
  
  set(key, value) {
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }
  
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }
  
  clear() {
    this.cache.clear();
  }
  
  delete(key) {
    this.cache.delete(key);
  }
}

export const apiCache = new SimpleCache();

// Helper para requests con manejo de errores mejorado
export const apiRequest = async (url, options = {}) => {
  try {
    const defaultOptions = {
      headers: tokenManager.getAuthHeaders(),
      ...options
    };
    
    logger.log('API Request:', url, defaultOptions);
    
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      // Manejo específico para errores de autenticación
      if (response.status === 401 || response.status === 403) {
        logger.warn('Token inválido o expirado, limpiando sesión');
        clearAuthData(); // Usar limpieza completa
        // No redirigir aquí, dejar que los componentes manejen esto
        const error = new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
        error.status = response.status;
        error.isAuthError = true;
        throw error;
      }
      
      let errorText;
      try {
        errorText = await response.text();
      } catch {
        errorText = 'Error desconocido';
      }
      
      const error = new Error(`HTTP ${response.status}: ${errorText}`);
      error.status = response.status;
      throw error;
    }
    
    const data = await response.json();
    logger.log('API Response:', data);
    
    return data;
  } catch (error) {
    logger.error('API Request failed:', error.message);
    
    // Si es un error de red, proporcionar un mensaje más amigable
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      const networkError = new Error('Error de conexión. Verifica tu conexión a internet.');
      networkError.isNetworkError = true;
      throw networkError;
    }
    
    throw error;
  }
};
