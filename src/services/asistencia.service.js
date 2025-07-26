import { buildApiUrl, logger, validators, apiRequest } from '../config/app-security.js';

// Crear nueva asistencia
export async function crearAsistencia(data) {
  const url = buildApiUrl('/api/asistencias');
  return await apiRequest(url, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// Servicio para obtener asistencias reales por subalmacén y fecha
export async function getAsistenciasPorFecha(subalmacenId, fecha) {
  try {
    // Validaciones previas más estrictas
    if (!validators.isValidId(subalmacenId)) {
      throw new Error('ID de subalmacén inválido');
    }
    
    if (!fecha || typeof fecha !== 'string') {
      throw new Error('Fecha inválida');
    }
    
    // Validar formato de fecha básico
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      logger.warn('Formato de fecha sospechoso', { fecha });
    }
    
    logger.log('getAsistenciasPorFecha llamado con:', { subalmacenId, fecha });
    
    const url = buildApiUrl('/api/asistencias', {
      subalmacen_id: subalmacenId,
      fecha: fecha
    });
    
    const data = await apiRequest(url);
    
    // Validar respuesta del backend
    if (!Array.isArray(data)) {
      logger.warn('Respuesta inesperada del backend', { 
        data, 
        tipo: typeof data,
        subalmacenId, 
        fecha 
      });
      return [];
    }
    
    logger.log('Asistencias obtenidas del backend:', {
      count: data.length,
      subalmacenId,
      fecha
    });
    
    return data;
  } catch (error) {
    logger.error('Error al obtener asistencias:', {
      error: error.message,
      subalmacenId,
      fecha,
      stack: error.stack
    });
    
    // Retornar array vacío en lugar de propagar el error
    // Esto evita que la aplicación se cierre
    return [];
  }
}

// Validar formato HH:mm y evitar valores vacíos/nulos antes de enviar al backend
function isValidHourString(value) {
  return validators.isValidTimeFormat(value);
}

// Actualizar asistencia por id
export async function updateAsistencia(id, data) {
  if (!validators.isValidId(id)) {
    throw new Error('ID de asistencia inválido');
  }
  
  // Filtrar solo campos válidos y no vacíos
  const validData = {};
  
  if (typeof data.hora_entrada !== 'undefined') {
    validData.hora_entrada = isValidHourString(data.hora_entrada) 
      ? data.hora_entrada 
      : (data.hora_entrada === '' ? null : undefined);
  }
  
  if (typeof data.hora_salida !== 'undefined') {
    validData.hora_salida = isValidHourString(data.hora_salida) 
      ? data.hora_salida 
      : (data.hora_salida === '' ? null : undefined);
  }
  
  // Eliminar los undefined
  Object.keys(validData).forEach(k => validData[k] === undefined && delete validData[k]);
  
  if (Object.keys(validData).length === 0) {
    throw new Error('No hay datos válidos para actualizar');
  }
  
  const url = buildApiUrl(`/api/asistencias/${id}`);
  return await apiRequest(url, {
    method: 'PUT',
    body: JSON.stringify(validData)
  });
}
