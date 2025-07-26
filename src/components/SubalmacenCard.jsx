import { useNavigate } from "react-router-dom";

export default function SubalmacenCard({ nombre, id }) {
  const navigate = useNavigate();
  // Debug: mostrar el id recibido
  // SubalmacenCard renderizado
  return (
    <div
      className="bg-white rounded-xl shadow-md flex flex-col items-center justify-center p-6 sm:p-8 cursor-pointer hover:shadow-xl transition-all duration-300 border border-gray-100 min-h-[140px] sm:min-h-[160px] active:scale-95"
      onClick={() => navigate(`/subalmacenes/${id}/fechas`)}
      style={{
        touchAction: 'manipulation' // Mejora la respuesta táctil en móviles
      }}
    >
      <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">🏢</div>
      <span className="font-bold text-gray-600 text-base sm:text-lg tracking-wide text-center leading-tight">
        {nombre}
      </span>
    </div>
  );
}
