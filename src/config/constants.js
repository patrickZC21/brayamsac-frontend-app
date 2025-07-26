// Constantes de configuración de la aplicación
import { getApiBaseUrl } from './capacitor-config.js';

// URLs de la API
export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      LOGOUT: '/api/auth/logout',
      FORCE_LOGOUT: '/api/auth/force-logout',
      VALIDATE: '/api/auth/validar'
    },
    TRABAJADORES: '/api/trabajadores',
    NOTIFICATIONS: '/api/notifications/events'
  }
};

// Intervalos de tiempo (en milisegundos)
export const TIME_INTERVALS = {
  TOKEN_VALIDATION: 30000, // 30 segundos
  CACHE_EXPIRY: 5 * 60 * 1000, // 5 minutos
  REQUEST_TIMEOUT: 10000 // 10 segundos
};

// Configuración de logging
export const LOG_CONFIG = {
  ENABLED_IN_DEV: true,
  ENABLED_IN_PROD: false,
  LEVELS: {
    ERROR: 'error',
    WARN: 'warn',
    INFO: 'info',
    DEBUG: 'debug'
  }
};

// Mensajes de error estándar
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Verifica tu conexión a internet.',
  UNAUTHORIZED: 'Sesión expirada. Por favor, inicia sesión nuevamente.',
  FORBIDDEN: 'No tienes permisos para realizar esta acción.',
  NOT_FOUND: 'El recurso solicitado no fue encontrado.',
  SERVER_ERROR: 'Error interno del servidor. Intenta nuevamente más tarde.',
  VALIDATION_ERROR: 'Los datos proporcionados no son válidos.'
};

// Configuración de validación
export const VALIDATION_CONFIG = {
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  }
};

// Estados de la aplicación
export const APP_STATES = {
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
  IDLE: 'idle'
};