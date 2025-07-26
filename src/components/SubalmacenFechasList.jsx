// Componente para mostrar la lista de fechas de un subalmacen
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { esFechaActual } from '../utils/dateValidation';

export function SubalmacenFechasList({ fechas, subalmacenId }) {
  const navigate = useNavigate();
  if (!fechas || fechas.length === 0) {
    return (
      <div className="text-gray-400 text-center py-8 text-base sm:text-lg">
        No hay fechas disponibles.
      </div>
    );
  }
  return (
    <ul className="list-none p-0 space-y-3 sm:space-y-4">
      {fechas.map((fecha, idx) => {
        let fechaMostrar = fecha;
        // Si es objeto, intenta extraer la propiedad correcta
        if (typeof fecha === 'object' && fecha !== null) {
          fechaMostrar = fecha.fecha || fecha;
        }
        // Formato DD/MM/YYYY
        const dateObj = new Date(fechaMostrar);
        const fechaFormateada =
          dateObj instanceof Date && !isNaN(dateObj)
            ? dateObj.toLocaleDateString('es-PE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })
            : fechaMostrar;
        
        // Fecha en formato ISO para navegación y validación
        const fechaStr =
          dateObj instanceof Date && !isNaN(dateObj)
            ? dateObj.toISOString().slice(0, 10)
            : fechaMostrar;
        return (
          <li
            key={idx}
            className={`bg-white rounded-lg shadow-md p-4 sm:p-5 text-base sm:text-lg text-gray-700 flex items-center cursor-pointer transition-all duration-300 hover:shadow-lg active:scale-95 w-full ${
              esFechaActual(fechaStr) 
                ? 'border-l-4 border-green-500 opacity-100' 
                : 'border-l-4 border-blue-500 opacity-70'
            }`}
            onClick={() => {
              navigate(`/subalmacenes/${subalmacenId}/fechas/${fechaStr}`);
            }}
            style={{
              touchAction: 'manipulation' // Mejora la respuesta táctil en móviles
            }}
          >
            <div className="flex items-center flex-1">
              {esFechaActual(fechaStr) && (
                <span className="mr-2 text-base sm:text-lg text-green-500">
                  ✅
                </span>
              )}
              <span className="font-medium">{fechaFormateada}</span>
              {esFechaActual(fechaStr) && (
                <span className="ml-2 text-xs sm:text-sm text-green-500 font-bold">
                  (HOY)
                </span>
              )}
            </div>
            <span className="ml-auto text-gray-400 text-xl sm:text-2xl leading-none">
              &#8250;
            </span>
          </li>
        );
      })}
    </ul>
  );
}
