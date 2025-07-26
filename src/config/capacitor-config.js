import { Capacitor } from '@capacitor/core';

// Configuración específica para Capacitor
export const getApiBaseUrl = () => {
  // Si estamos en un dispositivo nativo (Android/iOS)
  if (Capacitor.isNativePlatform()) {
    // Para producción, usar la URL del backend en Render
    return 'https://brayamsac-backend.onrender.com';
  }
  
  // Si estamos en web, usar la configuración normal
  return import.meta.env.VITE_API_URL || 'http://localhost:3000';
};

// Función para detectar si estamos en un dispositivo móvil
export const isMobile = () => {
  return Capacitor.isNativePlatform();
};

// Función para obtener información de la plataforma
export const getPlatformInfo = () => {
  return {
    platform: Capacitor.getPlatform(),
    isNative: Capacitor.isNativePlatform(),
    isWeb: !Capacitor.isNativePlatform()
  };
};

// Configuración de red para dispositivos móviles
export const MOBILE_CONFIG = {
  // Timeout más largo para dispositivos móviles
  REQUEST_TIMEOUT: 15000,
  // Reintentos automáticos
  MAX_RETRIES: 3,
  // Intervalo entre reintentos
  RETRY_DELAY: 1000
};