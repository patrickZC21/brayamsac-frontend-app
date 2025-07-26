import React, { useEffect, useState } from "react";
import { buildApiUrl, logger, apiRequest } from "../config/app-security.js";
import UserHeader from "../components/UserHeader";
import { useUsuario } from "../hooks/useUsuario";

export default function DashboardApp() {
  const { usuario, loading, error: userError } = useUsuario();
  const [almacenes, setAlmacenes] = useState([]);
  const [loadingAlmacenes, setLoadingAlmacenes] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAlmacenes = async () => {
      try {
        setLoadingAlmacenes(true);
        const url = buildApiUrl("/api/almacenes");
        const data = await apiRequest(url);
        
        if (Array.isArray(data)) {
          setAlmacenes(data);
        } else {
          logger.warn('Datos de almacenes no válidos:', data);
          setAlmacenes([]);
        }
      } catch (error) {
        logger.error('Error al cargar almacenes:', error);
        setError("Error al cargar almacenes");
        setAlmacenes([]);
      } finally {
        setLoadingAlmacenes(false);
      }
    };

    loadAlmacenes();
  }, []);

  // Si hay error de usuario (sesión expirada), mostrar mensaje y no renderizar nada más
  if (userError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Sesión Expirada</h2>
          <p className="text-gray-500 mb-4">{userError}</p>
          <p className="text-sm text-gray-400">Serás redirigido al login en unos momentos...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario y no está cargando, redirigir al login
  if (!loading && !usuario) {
    window.location.href = "/";
    return null;
  }

  if (loading || loadingAlmacenes)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
    
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Error al cargar datos</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <UserHeader name={usuario?.nombre} role={usuario?.nombre_rol} />
      <main className="flex-1 flex flex-col items-center pt-4 sm:pt-8 px-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-6 w-full max-w-4xl text-left">
          Almacén
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full max-w-4xl">
          {almacenes.map((almacen) => (
            <div
              key={almacen.id}
              className="bg-white rounded-xl shadow-md flex flex-col items-center justify-center p-6 sm:p-8 cursor-pointer hover:shadow-xl transition-all duration-300 border border-gray-100 min-h-[140px] sm:min-h-[160px] active:scale-95"
              onClick={() => (window.location.href = `/subalmacenes/${almacen.id}`)}
              style={{
                touchAction: 'manipulation' // Mejora la respuesta táctil en móviles
              }}
            >
              <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">🏢</div>
              <span className="font-bold text-gray-600 text-base sm:text-lg tracking-wide text-center leading-tight">
                {almacen.nombre}
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
