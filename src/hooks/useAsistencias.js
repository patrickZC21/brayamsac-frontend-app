import { useState } from "react";
import { logger } from "../config/app-security.js";
import { getAsistenciasPorFecha } from "../services/asistencia.service";
import { useSubalmacenFechas } from "./useSubalmacenFechas";

export default function useAsistencias(subalmacenId) {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [trabajadores, setTrabajadores] = useState([]);
  const [asistencias, setAsistencias] = useState([]);
  const { fechas = [] } = useSubalmacenFechas(subalmacenId);

  const seleccionarFecha = (fecha) => {
    setFechaSeleccionada(fecha);
  };

  // Consulta real y sincroniza trabajadores
  const cargarAsistencias = async (fecha) => {
    try {
      logger.log('cargarAsistencias llamado con fecha:', fecha, 'subalmacenId:', subalmacenId);
      
      // Validaciones de entrada
      if (!subalmacenId || !fecha) {
        logger.warn('cargarAsistencias: parámetros faltantes', { subalmacenId, fecha });
        setAsistencias([]);
        setTrabajadores([]);
        return [];
      }
      
      // Validar formato de fecha básico
      if (typeof fecha !== 'string' || !fecha.match(/^\d{4}-\d{2}-\d{2}$/)) {
        logger.error('cargarAsistencias: formato de fecha inválido', { fecha });
        setAsistencias([]);
        setTrabajadores([]);
        return [];
      }
      
      const data = await getAsistenciasPorFecha(subalmacenId, fecha);
      logger.log('Datos recibidos en cargarAsistencias:', data);
      
      // Asegurar que data sea un array
      const asistenciasArray = Array.isArray(data) ? data : [];
      setAsistencias(asistenciasArray);
      
      // Derivar trabajadores únicos de las asistencias
      const trabajadoresUnicos = [];
      const ids = new Set();
      
      asistenciasArray.forEach((a) => {
        try {
          if (
            a && 
            a.trabajador_id &&
            a.trabajador_nombre &&
            !ids.has(a.trabajador_id)
          ) {
            trabajadoresUnicos.push({
              id: a.trabajador_id,
              nombre: a.trabajador_nombre,
              dni: a.trabajador_dni || "",
            });
            ids.add(a.trabajador_id);
          }
        } catch (workerError) {
          logger.error('Error procesando trabajador individual', { 
            error: workerError.message, 
            trabajador: a 
          });
        }
      });
      
      setTrabajadores(trabajadoresUnicos);
      logger.log('Trabajadores únicos derivados:', trabajadoresUnicos.length);
      
      return asistenciasArray;
    } catch (error) {
      logger.error('Error en cargarAsistencias', { 
        error: error.message, 
        fecha, 
        subalmacenId,
        stack: error.stack 
      });
      
      // En caso de error, establecer estados seguros
      setAsistencias([]);
      setTrabajadores([]);
      
      // Retornar array vacío en lugar de lanzar el error
      return [];
    }
  };

  return {
    fechas,
    trabajadores,
    asistencias,
    fechaSeleccionada,
    seleccionarFecha,
    cargarAsistencias,
  };
}
