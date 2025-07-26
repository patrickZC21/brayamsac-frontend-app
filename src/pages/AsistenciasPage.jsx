import React, { useState, useEffect } from "react";
import FechasList from "../components/FechasList";
import TrabajadoresAsistencia from "../components/TrabajadoresAsistencia";
import useAsistencias from "../hooks/useAsistencias";
import { useUsuario } from "../hooks/useUsuario";

const AsistenciasPage = () => {
  const { usuario, loading: loadingUsuario, error: userError } = useUsuario();
  const { fechas, fechaSeleccionada, seleccionarFecha, cargarAsistencias } = useAsistencias();
  const [asistencias, setAsistencias] = useState([]);

  // Cargar asistencias reales al seleccionar fecha
  useEffect(() => {
    if (fechaSeleccionada) {
      cargarAsistencias(fechaSeleccionada).then(data => {
        if (data) setAsistencias(data);
      });
    }
  }, [fechaSeleccionada, cargarAsistencias]);

  // Función para refrescar asistencias tras guardar
  const refreshAsistencias = () => {
    if (fechaSeleccionada) {
      cargarAsistencias(fechaSeleccionada).then(data => {
        if (data) setAsistencias(data);
      });
    }
  };

  // Si hay error de usuario (sesión expirada), mostrar mensaje
  if (userError) {
    return (
      <div style={{ minHeight: '100vh', background: '#fafbfc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
      <div style={{ minHeight: '100vh', background: '#fafbfc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontWeight: 700, fontSize: 24, marginBottom: 16 }}>Almacen \\ Subalmacen \\ Fechas</h2>
      <FechasList fechas={fechas} onSelect={seleccionarFecha} fechaSeleccionada={fechaSeleccionada} />
      {fechaSeleccionada && (
        <TrabajadoresAsistencia asistencias={asistencias} onRefreshAsistencias={refreshAsistencias} />
      )}
    </div>
  );
};

export default AsistenciasPage;
