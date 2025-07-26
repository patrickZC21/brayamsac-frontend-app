import { useMemo } from 'react';
import { esFechaActual, obtenerFechaActual, MENSAJE_ERROR_FECHA } from '../utils/dateValidation';
import { logger } from '../utils/logger.js';

/**
 * Hook personalizado para validar el acceso a fechas de asistencias
 * @param {string} fecha - Fecha a validar en formato YYYY-MM-DD
 * @returns {object} - Objeto con información de validación
 */
export function useDateValidation(fecha) {
  const validacion = useMemo(() => {
    try {
      if (!fecha) {
        logger.debug('useDateValidation: fecha no proporcionada');
        return {
          esValida: false,
          mensaje: 'No se ha proporcionado una fecha válida.',
          fechaActual: obtenerFechaActual(),
          puedeAcceder: false,
          error: null
        };
      }

      // Validar formato básico de fecha
      if (typeof fecha !== 'string') {
        logger.warn('useDateValidation: fecha no es string', { fecha, tipo: typeof fecha });
        return {
          esValida: false,
          mensaje: 'Formato de fecha inválido.',
          fechaActual: obtenerFechaActual(),
          puedeAcceder: false,
          error: 'Formato inválido'
        };
      }

      const esValida = esFechaActual(fecha);
      
      logger.debug('useDateValidation: validación completada', {
        fecha,
        esValida,
        fechaActual: obtenerFechaActual()
      });
      
      return {
        esValida,
        mensaje: esValida ? '' : MENSAJE_ERROR_FECHA,
        fechaActual: obtenerFechaActual(),
        puedeAcceder: esValida,
        fechaSeleccionada: fecha,
        error: null
      };
    } catch (error) {
      logger.error('Error en useDateValidation', { 
        error: error.message, 
        fecha,
        stack: error.stack 
      });
      return {
        esValida: false,
        mensaje: 'Error al validar la fecha. Intenta recargar la página.',
        fechaActual: obtenerFechaActual(),
        puedeAcceder: false,
        fechaSeleccionada: fecha,
        error: error.message
      };
    }
  }, [fecha]);

  return validacion;
}
