import { useEffect, useRef } from 'react';
import { API_CONFIG } from '../config/constants.js';

export function useSSENotifications(onAsistenciaChange) {
  const eventSourceRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Crear conexión SSE
    const eventSource = new EventSource(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.NOTIFICATIONS}?token=${token}`);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log('📡 Conexión SSE establecida');
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('📨 Notificación recibida:', data);

        if (data.type === 'asistencia_change' && typeof onAsistenciaChange === 'function') {
          onAsistenciaChange(data);
        }
      } catch (error) {
        console.error('Error procesando notificación SSE:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('❌ Error en conexión SSE:', error);
    };

    // Cleanup al desmontar
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        console.log('🔌 Conexión SSE cerrada');
      }
    };
  }, [onAsistenciaChange]);

  return eventSourceRef.current;
}
