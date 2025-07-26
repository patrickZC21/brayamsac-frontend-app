import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_CONFIG } from '../config/constants.js';
import { clearAuthData, isTokenExpired } from '../utils/tokenValidator.js';
import logo from "../assets/img/logoInicioApp.png";
import BackButton from "./BackButton";

const UserHeader = ({ name, role, showBackButton = true }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // No mostrar botón de retroceso en la página principal del dashboard
  const shouldShowBackButton = showBackButton && location.pathname !== '/dashboard-app';

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token && !isTokenExpired(token)) {
        // Solo intentar logout en el servidor si el token aún es válido
        await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGOUT}`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json; charset=utf-8",
            "Accept": "application/json"
          }
        });
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      // Continuar con el logout local aunque falle el backend
    } finally {
      // Limpiar todos los datos de autenticación
      clearAuthData();
      navigate("/");
    }
  };

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center justify-between px-4 sm:px-8 py-4 border-b bg-white" style={{ borderBottom: "2px solid #e5e7eb" }}>
      <div className="flex items-center space-x-2">
        {shouldShowBackButton && (
          <BackButton className="mr-2" />
        )}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="text-left hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200"
          >
            <div className="font-semibold text-gray-800 text-sm">{name}</div>
            <div className="text-xs text-gray-400">{role}</div>
          </button>
        
          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="py-2">
                <button
                  onClick={() => {
                    handleLogout();
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                >
                  🚪 Cerrar Sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <img src={logo} alt="Logo Brayam" className="h-8 sm:h-12" />
    </div>
  );
};

export default UserHeader;
