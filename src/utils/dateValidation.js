/**
 * Utilidades para validación de fechas en la aplicación de asistencias
 */

import { logger } from './logger.js';

/**
 * Obtiene la fecha actual del sistema en la zona horaria local
 * @returns {string} - Fecha actual en formato YYYY-MM-DD
 */
export function obtenerFechaActual() {
  const ahora = new Date();
  
  // Logs detallados para debugging
  logger.debug('obtenerFechaActual ejecutándose', {
    fechaCompleta: ahora.toString(),
    zonaHoraria: Intl.DateTimeFormat().resolvedOptions().timeZone,
    offset: ahora.getTimezoneOffset()
  });
  
  // Usar la zona horaria local para obtener la fecha correcta
  const año = ahora.getFullYear();
  const mes = String(ahora.getMonth() + 1).padStart(2, '0');
  const dia = String(ahora.getDate()).padStart(2, '0');
  
  const fechaActual = `${año}-${mes}-${dia}`;
  
  logger.debug('Componentes de fecha extraídos', {
    año,
    mes,
    mesOriginal: ahora.getMonth(),
    dia,
    fechaNormalizada: fechaActual
  });
  
  // Comparar con otros métodos
  logger.debug('Comparación con otros métodos', {
    isoString: ahora.toISOString().slice(0, 10),
    localString: ahora.toLocaleDateString('es-PE')
  });
  
  return fechaActual;
}

/**
 * Verifica si una fecha dada es la fecha actual del sistema
 * @param {string} fechaStr - Fecha en formato YYYY-MM-DD o similar
 * @returns {boolean} - True si la fecha es la fecha actual
 */
export function esFechaActual(fechaStr) {
  logger.debug('esFechaActual llamada', { fechaStr });
  
  if (!fechaStr) {
    logger.debug('fechaStr está vacía, retornando false');
    return false;
  }

  try {
    // Obtener la fecha actual del sistema
    const fechaActual = obtenerFechaActual();
    
    // Normalizar la fecha proporcionada
    let fechaNormalizada;
    if (fechaStr.includes('/')) {
      logger.debug('Procesando fecha como DD/MM/YYYY');
      // Si viene en formato DD/MM/YYYY o MM/DD/YYYY, convertir
      const partes = fechaStr.split('/');
      if (partes.length === 3) {
        // Asumir formato DD/MM/YYYY
        fechaNormalizada = `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`;
        logger.debug('Fecha convertida de DD/MM/YYYY', { fechaNormalizada });
      }
    } else {
      logger.debug('Procesando fecha como YYYY-MM-DD');
      // Si ya está en formato YYYY-MM-DD, validar y usar directamente
      if (/^\d{4}-\d{2}-\d{2}$/.test(fechaStr)) {
        logger.debug('Formato YYYY-MM-DD válido, usando directamente');
        fechaNormalizada = fechaStr;
      } else {
        // Para otros formatos, usar Date con cuidado de zona horaria
        logger.debug('Formato no estándar, usando Date object');
        const fecha = new Date(fechaStr + 'T12:00:00'); // Añadir hora para evitar problemas de UTC
        if (!isNaN(fecha.getTime())) {
          const año = fecha.getFullYear();
          const mes = String(fecha.getMonth() + 1).padStart(2, '0');
          const dia = String(fecha.getDate()).padStart(2, '0');
          fechaNormalizada = `${año}-${mes}-${dia}`;
          logger.debug('Fecha normalizada desde Date object', { fechaNormalizada });
        }
      }
    }

    if (!fechaNormalizada) {
      logger.warn('No se pudo normalizar la fecha', { fechaStr });
      return false;
    }

    // Comparar con la fecha actual del sistema
    const esFechaActualSistema = fechaNormalizada === fechaActual;
    
    logger.debug('Comparación con fecha actual', {
      fechaNormalizada,
      fechaActual,
      esFechaActualSistema
    });

    return esFechaActualSistema;
  } catch (error) {
    logger.error('Error al validar fecha', { error: error.message, fechaStr });
    return false;
  }
}

/**
 * Formatea una fecha para mostrar en la UI
 * @param {string} fechaStr - Fecha en formato YYYY-MM-DD
 * @returns {string} - Fecha formateada como DD/MM/YYYY
 */
export function formatearFecha(fechaStr) {
  logger.debug('formatearFecha llamada', { fechaStr });
  
  if (!fechaStr) {
    logger.debug('fechaStr está vacía, retornando cadena vacía');
    return '';
  }
  
  try {
    // Si ya viene en formato DD/MM/YYYY, devolverla tal como está
    if (fechaStr.includes('/') && fechaStr.split('/').length === 3) {
      logger.debug('Fecha ya está en formato DD/MM/YYYY', { fechaStr });
      return fechaStr;
    }
    
    // Si viene en formato YYYY-MM-DD, convertir a DD/MM/YYYY
    logger.debug('Convirtiendo fecha YYYY-MM-DD a DD/MM/YYYY');
    
    // Crear fecha a partir del string, asegurándonos de usar la zona horaria local
    const [año, mes, dia] = fechaStr.split('-');
    logger.debug('Componentes extraídos', { año, mes, dia });
    
    // Validar que tenemos los componentes necesarios
    if (!año || !mes || !dia) {
      logger.debug('Componentes inválidos, retornando string original');
      return fechaStr;
    }
    
    // Formatear directamente sin crear objeto Date para evitar problemas de zona horaria
    const fechaFormateada = `${dia.padStart(2, '0')}/${mes.padStart(2, '0')}/${año}`;
    logger.debug('Fecha formateada resultante', { fechaFormateada });
    
    return fechaFormateada;
  } catch (error) {
    logger.error('Error al formatear fecha', { error: error.message, fechaStr });
    return fechaStr;
  }
}

/**
 * Obtiene información detallada de la fecha actual para debugging
 * @returns {object} - Objeto con información de la fecha actual
 */
export function obtenerInfoFechaActual() {
  const ahora = new Date();
  return {
    fechaCompleta: ahora.toString(),
    fechaISO: ahora.toISOString(),
    fechaLocal: ahora.toLocaleDateString('es-PE'),
    fechaNormalizada: obtenerFechaActual(),
    zonaHoraria: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timestamp: ahora.getTime()
  };
}

/**
 * Mensaje de error para fechas no válidas
 */
export const MENSAJE_ERROR_FECHA = 'Solo se puede acceder a registrar asistencias en la fecha actual del sistema.';
