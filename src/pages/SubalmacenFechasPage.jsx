// Página principal para mostrar fechas de subalmacenes
import React from 'react';
import { useParams } from 'react-router-dom';
import { useSubalmacenFechas } from '../hooks/useSubalmacenFechas';
import { SubalmacenFechasList } from '../components/SubalmacenFechasList';
import UserHeader from '../components/UserHeader';
import { useUsuario } from '../hooks/useUsuario';

export default function SubalmacenFechasPage() {
  const { subalmacenId } = useParams();
  const { fechas, loading, error } = useSubalmacenFechas(subalmacenId);
  const { usuario, loading: loadingUsuario, error: userError } = useUsuario();

  // Si hay error de usuario (sesión expirada), mostrar mensaje
  if (userError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
  if (!loadingUsuario && !usuario) {
    window.location.href = "/";
    return null;
  }

  // Mostrar loading mientras se carga el usuario
  if (loadingUsuario) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <UserHeader name={usuario?.nombre} role={usuario?.nombre_rol} />
      <main className="flex-1 flex flex-col items-center pt-4 sm:pt-8 px-4">
        <div className="w-full max-w-4xl">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-6">
            Almacén \\ Subalmacén \\ Fechas
          </h2>
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando fechas...</p>
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-600">Error: {error.message}</p>
            </div>
          )}
          <SubalmacenFechasList fechas={fechas} subalmacenId={subalmacenId} />
        </div>
      </main>
    </div>
  );
}
