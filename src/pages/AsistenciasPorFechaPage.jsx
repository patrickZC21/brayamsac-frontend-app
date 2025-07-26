import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TrabajadoresAsistencia from '../components/TrabajadoresAsistencia';
import useAsistencias from '../hooks/useAsistencias';
import UserHeader from '../components/UserHeader';
import { useUsuario } from '../hooks/useUsuario';
import { getInfoAlmacenSubalmacen } from '../services/infoAlmacenSubalmacen.service';
import { useDateValidation } from '../hooks/useDateValidation';
import DateRestrictionMessage from '../components/DateRestrictionMessage';
import { logger } from '../utils/logger';

export default function AsistenciasPorFechaPage() {
  const { subalmacenId, fecha } = useParams();
  const { usuario, loading: loadingUsuario, error: userError } = useUsuario();
  const [info, setInfo] = useState({ almacen: '', subalmacen: '' });
  const [error, setError] = useState(null);
  
  // Validar si la fecha seleccionada es la actual
  const { mensaje, fechaActual, puedeAcceder, error: validationError } = useDateValidation(fecha);

  // Usar el hook con el subalmacenId
  const {
    cargarAsistencias,
  } = useAsistencias(subalmacenId);

  const [trabajadores] = useState([]);
  const [asistencias, setAsistencias] = useState([]);
  const [loading, setLoading] = useState(true);

  // Manejar notificaciones SSE para actualización en tiempo real
  // useSSENotifications((notification) => {
  //   console.log('🔔 Notificación de cambio recibida:', notification);
  //   // Solo actualizar si el cambio es para el mismo subalmacén y fecha
  //   if (notification.subalmacen_id == subalmacenId && notification.fecha === fecha) {
  //     console.log('✅ Actualizando asistencias por notificación SSE');
  //     refreshAsistencias();
  //   }
  // });

  // Cargar datos reales al montar o cambiar fecha/subalmacen
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setError(null);
        
        // Solo cargar asistencias si la fecha es válida y no hay errores de validación
        if (puedeAcceder && !validationError) {
          setLoading(true);
          const data = await cargarAsistencias(fecha);
          setAsistencias(data || []);
        }
        
        // Cargar info del almacén
        const infoData = await getInfoAlmacenSubalmacen(subalmacenId);
        setInfo(infoData || { almacen: '', subalmacen: '' });
      } catch (error) {
        logger.error('Error al cargar datos', { 
          error: error.message, 
          fecha, 
          subalmacenId,
          stack: error.stack 
        });
        setError('Error al cargar los datos. Intenta recargar la página.');
      } finally {
        setLoading(false);
      }
    };
    
    cargarDatos();
  }, [subalmacenId, fecha, puedeAcceder, validationError, cargarAsistencias]);

  // Refrescar asistencias tras guardar
  const refreshAsistencias = () => {
    logger.userAction('refreshAsistencias', { fecha });
    if (fecha && puedeAcceder) {
      setLoading(true);
      cargarAsistencias(fecha).then(data => {
        logger.dataUpdate('asistencias', { count: data?.length, fecha });
        setAsistencias(data || []);
        setLoading(false);
      }).catch(error => {
        logger.error('Error al recargar asistencias', { error: error.message, fecha });
        setLoading(false);
      });
    } else {
      logger.error('No hay fecha disponible para refrescar asistencias', { fecha });
    }
  };

  // Si hay error de usuario (sesión expirada), mostrar mensaje
  if (userError) {
    return (
      <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: 32 }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>🔒</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#374151', marginBottom: 8 }}>Sesión Expirada</h2>
          <p style={{ color: '#6B7280', marginBottom: 16 }}>{userError}</p>
          <p style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>Serás redirigido al login en unos momentos...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario y no está cargando, redirigir al login
  if (!loadingUsuario && !usuario) {
    window.location.href = "/";
    return null;
  }

  // Mostrar loading mientras se carga el usuario
  if (loadingUsuario) {
    return (
      <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: 48, 
            height: 48, 
            border: '3px solid #E5E7EB', 
            borderTop: '3px solid #3B82F6', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#6B7280' }}>Cargando...</p>
        </div>
      </div>
    );
  }

  // Mostrar error si existe
  if (error || validationError) {
    return (
      <div style={{ minHeight: '100vh', background: '#fff' }}>
        <UserHeader name={usuario?.nombre} role={usuario?.nombre_rol} />
        <div style={{ maxWidth: 600, margin: '0 auto', padding: 32 }}>
          <div style={{ 
            background: '#fee', 
            border: '1px solid #fcc', 
            borderRadius: 8, 
            padding: 20, 
            textAlign: 'center' 
          }}>
            <div style={{ fontSize: '48px', marginBottom: 16, color: '#c33' }}>⚠️</div>
            <h3 style={{ color: '#c33', marginBottom: 16 }}>Error</h3>
            <p style={{ color: '#666', marginBottom: 16 }}>
              {error || validationError || 'Ha ocurrido un error inesperado'}
            </p>
            <button 
              onClick={() => window.location.reload()}
              style={{
                background: '#007bff',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              🔄 Recargar Página
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <UserHeader name={usuario?.nombre} role={usuario?.nombre_rol} />
      <div style={{ maxWidth: 600, margin: '0 auto', background: '#fff', borderRadius: 0, padding: 32, boxShadow: 'none' }}>
        <div style={{ fontWeight: 700, color: '#888', fontSize: 18, marginBottom: 8 }}>
          {info.almacen} \ {info.subalmacen}
        </div>
        <h2 style={{ color: '#888', fontWeight: 700, marginBottom: 16 }}>
          Asistencias del {info.subalmacen}
        </h2>
        <div style={{ fontSize: 18, marginBottom: 24 }}>
          Fecha seleccionada: <b>{fecha}</b>
        </div>
        
        {/* Mostrar mensaje de restricción si la fecha no es válida */}
        {!puedeAcceder ? (
          <DateRestrictionMessage 
            fechaSeleccionada={fecha}
            fechaActual={fechaActual}
            mensaje={mensaje}
            subalmacenId={subalmacenId}
          />
        ) : loading ? (
          <div style={{ color: '#aaa' }}>Cargando asistencias...</div>
        ) : (
          <TrabajadoresAsistencia trabajadores={trabajadores} asistencias={asistencias} onRefreshAsistencias={refreshAsistencias} />
        )}
      </div>
    </div>
  );
}
