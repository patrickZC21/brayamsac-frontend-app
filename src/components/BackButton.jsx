import React from "react";
import { useNavigate } from "react-router-dom";

const BackButton = ({ className = "", style = {} }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    try {
      // Verificar si hay historial disponible
      if (window.history.length <= 1) {
        // Si no hay historial, ir al dashboard
        navigate('/dashboard-app', { replace: true });
      } else {
        // Usar navigate(-1) para ir hacia atrás en el historial
        navigate(-1);
      }
    } catch (error) {
      console.error('Error en navegación:', error);
      // Fallback: navegar al dashboard
      navigate('/dashboard-app', { replace: true });
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`flex items-center justify-center p-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200 ${className}`}
      style={{
        minWidth: '44px',
        minHeight: '44px',
        ...style
      }}
      aria-label="Retroceder"
    >
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6"
      >
        <path 
          d="M15 18L9 12L15 6" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

export default BackButton;