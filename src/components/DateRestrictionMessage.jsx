import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatearFecha } from '../utils/dateValidation';
import { logger } from '../utils/logger.js';

/**
 * Componente que muestra un mensaje de error cuando se intenta acceder 
 * a una fecha que no es la actual
 */
export default function DateRestrictionMessage({ 
  fechaSeleccionada, 
  fechaActual, 
  mensaje,
  subalmacenId 
}) {
  const navigate = useNavigate();
  const [navegando, setNavegando] = useState(false);

  const manejarNavegacion = useCallback(async () => {
    try {
      setNavegando(true);
      
      // Validar parámetros antes de navegar
      if (!subalmacenId || isNaN(parseInt(subalmacenId))) {
        throw new Error('ID de subalmacén inválido');
      }
      
      logger.debug('Navegando a lista de fechas', { subalmacenId });
      
      // Navegar con manejo de errores
      navigate(`/subalmacenes/${subalmacenId}/fechas`);
    } catch (error) {
      logger.error('Error en navegación', { 
        error: error.message, 
        subalmacenId,
        stack: error.stack 
      });
      alert('Error al navegar. Intenta recargar la página.');
    } finally {
      setNavegando(false);
    }
  }, [navigate, subalmacenId]);

  return (
    <div style={{
      background: '#fff3cd',
      border: '1px solid #ffeaa7',
      borderRadius: '8px',
      padding: '20px',
      margin: '20px 0',
      textAlign: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        fontSize: '48px',
        marginBottom: '16px',
        color: '#e17055'
      }}>
        🚫
      </div>
      
      <h3 style={{
        color: '#e17055',
        marginBottom: '16px',
        fontSize: '18px',
        fontWeight: '600'
      }}>
        Acceso Restringido
      </h3>
      
      <p style={{
        color: '#6c5ce7',
        marginBottom: '16px',
        fontSize: '16px',
        lineHeight: '1.5'
      }}>
        {mensaje}
      </p>
      
      <div style={{
        background: '#f8f9fa',
        padding: '12px',
        borderRadius: '6px',
        margin: '16px 0',
        fontSize: '14px',
        color: '#495057'
      }}>
        <div style={{ marginBottom: '8px' }}>
          <strong>Fecha seleccionada:</strong> {formatearFecha(fechaSeleccionada)}
        </div>
        <div>
          <strong>Fecha actual del sistema:</strong> {formatearFecha(fechaActual)}
        </div>
      </div>
      
      <p style={{
        color: '#74b9ff',
        fontSize: '14px',
        marginBottom: '20px',
        fontStyle: 'italic'
      }}>
        Solo puedes registrar asistencias en la fecha actual: {formatearFecha(fechaActual)}
      </p>
      
      <button
        onClick={manejarNavegacion}
        disabled={navegando}
        style={{
          background: navegando ? '#6c757d' : '#0984e3',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '6px',
          fontSize: '16px',
          cursor: navegando ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.2s',
          opacity: navegando ? 0.6 : 1
        }}
        onMouseOver={(e) => {
          if (!navegando) {
            e.target.style.background = '#0770c2';
          }
        }}
        onMouseOut={(e) => {
          if (!navegando) {
            e.target.style.background = '#0984e3';
          }
        }}
      >
        {navegando ? 'Navegando...' : '← Volver a Fechas'}
      </button>
    </div>
  );
}
