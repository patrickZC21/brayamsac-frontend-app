import React, { useEffect, useState } from "react";
import { getTrabajadorPorId } from '../services/trabajadorPorId.service';
import { statusLabels, getStatusLetter } from '../hooks/asistencia.constants';
import AsistenciaHeader from './AsistenciaHeader';
import ListaTrabajadoresAsistencia from './ListaTrabajadoresAsistencia';
import { useAsistenciaEstados } from '../hooks/useAsistenciaEstados';
import AgregarTrabajadorModal from './AgregarTrabajadorModal';
// import { buildApiUrl, apiRequest } from '../config/app-security.js'; // No utilizadas actualmente
import { API_CONFIG } from '../config/constants.js';
import { logger } from '../utils/logger.js';

const TrabajadoresAsistencia = ({ asistencias = [], onRefreshAsistencias }) => {
  const [trabajadoresInfo, setTrabajadoresInfo] = useState({});
  const [searchText, setSearchText] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [todosTrabajadores, setTodosTrabajadores] = useState([]);
  const [LOADING_TRABAJADORES, setLoadingTrabajadores] = useState(false);
  const [ERROR_TRABAJADORES, setErrorTrabajadores] = useState(null);
  
  // Asegurar que existe usuario_id en localStorage
  if (!localStorage.getItem('usuario_id')) {
    localStorage.setItem('usuario_id', '1'); // Usuario por defecto
  }
  const {
    showHoraInputs, setShowHoraInputs,
    horas, setHoras,
    guardado, setGuardado,
    showObsInputs, setShowObsInputs,
    observaciones, setObservaciones,
    obsGuardado, setObsGuardado,
    fGuardado, setFGuardado,
    showFaltaInputs, setShowFaltaInputs
  } = useAsistenciaEstados();

  useEffect(() => {
    // Siempre obtener la info de los trabajadores desde el backend si hay asistencias
    const cargarTrabajadoresInfo = async () => {
      try {
        if (asistencias.length > 0) {
          const uniqueIds = [...new Set(asistencias.map(a => a.trabajador_id).filter(id => id))];
          
          if (uniqueIds.length === 0) {
            logger.warn('No hay IDs de trabajadores válidos en las asistencias');
            return;
          }
          
          const results = await Promise.allSettled(uniqueIds.map(id => getTrabajadorPorId(id)));
          const info = {};
          
          results.forEach((result, index) => {
            if (result.status === 'fulfilled' && result.value) {
              info[result.value.id] = result.value;
            } else {
              logger.error('Error al obtener trabajador', { 
                trabajadorId: uniqueIds[index], 
                error: result.reason?.message || 'Error desconocido' 
              });
            }
          });
          
          setTrabajadoresInfo(info);
          logger.debug('Información de trabajadores cargada', { count: Object.keys(info).length });
        }
      } catch (error) {
        logger.error('Error al cargar información de trabajadores', { 
          error: error.message, 
          stack: error.stack 
        });
        setTrabajadoresInfo({});
      }
    };
    
    cargarTrabajadoresInfo();
  }, [asistencias]);

  useEffect(() => {
    // Inicializar horas desde asistencias
    try {
      if (asistencias && Array.isArray(asistencias) && asistencias.length > 0) {
        setHoras(prev => {
          const horasBD = { ...prev };
          
          asistencias.forEach(a => {
            try {
              if (a && a.trabajador_id) {
                if (!horasBD[a.trabajador_id] || (!horasBD[a.trabajador_id].ingreso && !horasBD[a.trabajador_id].salida)) {
                  horasBD[a.trabajador_id] = {
                    ingreso: (a.hora_entrada && typeof a.hora_entrada === 'string') ? a.hora_entrada.slice(0,5) : '',
                    salida: (a.hora_salida && typeof a.hora_salida === 'string') ? a.hora_salida.slice(0,5) : ''
                  };
                }
              }
            } catch (asistenciaError) {
              logger.error('Error procesando asistencia individual', { 
                error: asistenciaError.message, 
                asistencia: a 
              });
            }
          });
          
          return horasBD;
        });
        
        logger.debug('Horas inicializadas desde asistencias', { count: asistencias.length });
      }
    } catch (error) {
      logger.error('Error al inicializar horas desde asistencias', { 
        error: error.message, 
        stack: error.stack 
      });
    }
  }, [asistencias, setHoras]);

  // Filtrar trabajadores por nombre o apellido usando searchText
  const filteredTrabajadoresInfo = React.useMemo(() => {
    try {
      if (!trabajadoresInfo || typeof trabajadoresInfo !== 'object') {
        return [];
      }
      
      return Object.values(trabajadoresInfo).filter(t => {
        try {
          if (!t || !t.id) return false;
          
          if (!searchText || searchText.trim() === '') return true;
          
          const searchLower = searchText.toLowerCase().trim();
          const nombre = (t?.nombre || '').toLowerCase();
          const apellido = (t?.apellido || '').toLowerCase();
          
          return nombre.includes(searchLower) || apellido.includes(searchLower);
        } catch (filterError) {
          logger.error('Error filtrando trabajador individual', { 
            error: filterError.message, 
            trabajador: t 
          });
          return false;
        }
      });
    } catch (error) {
      logger.error('Error en filtrado de trabajadores', { 
        error: error.message, 
        stack: error.stack 
      });
      return [];
    }
  }, [trabajadoresInfo, searchText]);

  // Mapear los IDs filtrados para filtrar asistencias
  const filteredAsistencias = React.useMemo(() => {
    try {
      if (!Array.isArray(asistencias) || !Array.isArray(filteredTrabajadoresInfo)) {
        return [];
      }
      
      const filteredIds = filteredTrabajadoresInfo.map(t => t.id).filter(id => id);
      return asistencias.filter(a => a && a.trabajador_id && filteredIds.includes(a.trabajador_id));
    } catch (error) {
      logger.error('Error filtrando asistencias', { 
        error: error.message, 
        stack: error.stack 
      });
      return [];
    }
  }, [asistencias, filteredTrabajadoresInfo]);

  // Obtener trabajadores que NO están en la asistencia actual
  const trabajadoresEnAsistencia = asistencias.map(a => a.trabajador_id);
  const trabajadoresDisponibles = Array.isArray(todosTrabajadores)
    ? todosTrabajadores.filter(t => !trabajadoresEnAsistencia.includes(t.id))
    : [];
  // Debug
  logger.debug('Trabajadores disponibles para agregar', { count: trabajadoresDisponibles.length, trabajadores: trabajadoresDisponibles });

  // Handler para agregar trabajadores seleccionados
  const handleAgregarTrabajadores = async (ids) => {
    // Crear asistencia para cada trabajador seleccionado
    const subalmacenId = asistencias[0]?.subalmacen_id;
    const programacionFechaId = asistencias[0]?.programacion_fecha_id;
    const registradoPor = localStorage.getItem('usuario_id') || 1; // Por defecto usar ID 1 si no existe
    
    logger.debug('Datos para agregar trabajadores', { subalmacenId, programacionFechaId, registradoPor, ids });
    logger.debug('Primera asistencia de referencia', { asistencia: asistencias[0] });
    
    if (!subalmacenId || !programacionFechaId) {
      alert('No se pudo determinar subalmacén o fecha de la asistencia actual.');
      return;
    }
    
    try {
      const { crearAsistencia } = await import('../services/asistencia.service');
      
      for (const id of ids) {
        const asistenciaData = {
          trabajador_id: id,
          subalmacen_id: subalmacenId,
          programacion_fecha_id: programacionFechaId,
          registrado_por: parseInt(registradoPor),
          justificacion: 'Sin novedades',
          hora_entrada: '00:00',
          hora_salida: '00:00'
        };
        
        logger.apiRequest('POST', '/api/asistencias', asistenciaData);
        await crearAsistencia(asistenciaData);
      }
      
      logger.userAction('refreshAsistencias', { trigger: 'agregar_trabajadores' });
      if (typeof onRefreshAsistencias === 'function') {
        // Forzar la actualización después de un pequeño delay para asegurar que el backend procesó la inserción
        setTimeout(() => {
          onRefreshAsistencias();
          logger.debug('onRefreshAsistencias ejecutado correctamente');
        }, 500);
      } else {
        logger.error('onRefreshAsistencias no es una función válida');
      }
    } catch (e) {
      logger.error('Error al agregar trabajadores', { error: e.message, stack: e.stack });
      alert('Error al agregar trabajadores: ' + e.message);
    }
    setModalOpen(false);
  };

  // Al abrir el modal, obtener todos los trabajadores del backend
  useEffect(() => {
    if (!modalOpen) return;
    setLoadingTrabajadores(true);
    setErrorTrabajadores(null);
    const token = localStorage.getItem('token');
    fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TRABAJADORES}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async res => {
        if (!res.ok) {
          throw new Error("No autorizado o error en la petición");
        }
        const data = await res.json();
        if (!Array.isArray(data)) {
          throw new Error("Respuesta inesperada del servidor");
        }
        logger.dataUpdate('trabajadores', { count: data?.length });
        setTodosTrabajadores(data);
        setLoadingTrabajadores(false);
      })
      .catch(err => {
        setErrorTrabajadores(err.message || "Error al cargar trabajadores");
        setTodosTrabajadores([]);
        setLoadingTrabajadores(false);
      });
  }, [modalOpen]);

  return (
    <div style={{ width: '100%', fontFamily: 'inherit', background: '#fff', minHeight: '100vh' }}>
      <AsistenciaHeader
        titulo="Estado diario"
        descripcion="A: Asistencia | F: Falta | O: Observaciones"
        showSearch={true}
        showAddButton={true}
        searchText={searchText}
        setSearchText={setSearchText}
        onAddButtonClick={() => setModalOpen(true)}
      />
      <AgregarTrabajadorModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        trabajadores={trabajadoresDisponibles}
        onAgregar={handleAgregarTrabajadores}
      />
      <div style={{ width: '100%', background: '#fff', borderRadius: 0, boxShadow: 'none', padding: '0 8px', boxSizing: 'border-box' }}>
        <div style={{ fontWeight: 900, fontSize: 22, background: '#f4f4f4', borderTopLeftRadius: 0, borderTopRightRadius: 0, padding: '22px 16px 18px 16px', borderBottom: '1px solid #eee', color: '#0a194e', letterSpacing: 0.2, textTransform: 'uppercase', textAlign: 'center' }}>
          lista de trabajadores
        </div>
        <ListaTrabajadoresAsistencia
          asistencias={filteredAsistencias}
          trabajadoresInfo={trabajadoresInfo}
          guardado={guardado}
          fGuardado={fGuardado}
          obsGuardado={obsGuardado}
          showHoraInputs={showHoraInputs}
          showFaltaInputs={showFaltaInputs}
          showObsInputs={showObsInputs}
          horas={horas}
          setHoras={setHoras}
          setShowHoraInputs={setShowHoraInputs}
          setShowFaltaInputs={setShowFaltaInputs}
          setShowObsInputs={setShowObsInputs}
          setGuardado={setGuardado}
          setFGuardado={setFGuardado}
          setObsGuardado={setObsGuardado}
          observaciones={observaciones}
          setObservaciones={setObservaciones}
          statusLabels={statusLabels}
          getStatusLetter={getStatusLetter}
          onRefreshAsistencias={onRefreshAsistencias}
        />
      </div>
    </div>
  );
};

export default TrabajadoresAsistencia;
