import React from "react";
import { useParams } from "react-router-dom";
import { useUsuario } from "../hooks/useUsuario";
import { useSubalmacenesAsignadosByAlmacen } from "../hooks/useSubalmacenesAsignadosByAlmacen";
import UserHeader from "../components/UserHeader";
import SubalmacenCard from "../components/SubalmacenCard";

export default function SubalmacenesPorAlmacenPage() {
  const { id } = useParams();
  const { usuario, loading: loadingUsuario, error: userError } = useUsuario();
  const { subalmacenes, loading, error } = useSubalmacenesAsignadosByAlmacen(id);

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

  if (loadingUsuario || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
          Subalmacenes
        </h2>
        {subalmacenes.length === 0 ? (
          <div className="text-gray-400 text-center w-full max-w-4xl py-8 text-base sm:text-lg">
            No hay subalmacenes
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full max-w-4xl">
            {subalmacenes.map((sub) => (
              <SubalmacenCard key={sub.id} nombre={sub.nombre} id={sub.id} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
