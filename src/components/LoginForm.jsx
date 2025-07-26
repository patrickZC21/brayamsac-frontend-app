import React, { useState } from "react";
import logo from "../assets/img/logoInicioApp.png"; // tu logo
import NotificationMessage from './NotificationMessage';
import { API_CONFIG } from '../config/constants.js';

export default function LoginForm({ onLogin }) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);
    
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json; charset=utf-8",
          "Accept": "application/json"
        },
        body: JSON.stringify({ correo: usuario, contraseña: password }),
      });
      
      const data = await response.json();
      
      // Si hay conflicto de sesión (409), intentar forzar el login automáticamente
      if (response.status === 409) {
        // Intentar cerrar sesión anterior automáticamente
        try {
          await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.FORCE_LOGOUT}`, {
            method: "POST",
            headers: { 
              "Content-Type": "application/json; charset=utf-8",
              "Accept": "application/json"
            },
            body: JSON.stringify({ correo: usuario }),
          });
          
          // Esperar un momento y reintentar login
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const retryResponse = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`, {
            method: "POST",
            headers: { 
              "Content-Type": "application/json; charset=utf-8",
              "Accept": "application/json"
            },
            body: JSON.stringify({ correo: usuario, contraseña: password }),
          });
          
          const retryData = await retryResponse.json();
          
          if (!retryResponse.ok) {
            throw new Error(retryData.error || retryData.message || "Error de autenticación");
          }
          
          // Usar los datos del reintento
          Object.assign(data, retryData);
        } catch (retryError) {
          throw new Error("Error al cerrar sesión anterior: " + retryError.message);
        }
      } else if (!response.ok) {
        throw new Error(data.error || data.message || "Error de autenticación");
      }
      
      // Validar rol - Solo COORDINADOR puede acceder
      if (data.usuario && data.usuario.nombre_rol) {
        const rol = data.usuario.nombre_rol.toUpperCase();
        if (rol === "COORDINADOR") {
          setSuccessMessage("¡Login exitoso! Redirigiendo...");
          setTimeout(() => onLogin?.(data), 1000);
        } else {
          setError("Solo los usuarios con rol COORDINADOR pueden ingresar a esta aplicación.");
        }
      } else {
        setError("Error: No se pudo verificar el rol del usuario.");
      }
    } catch (err) {
      setError(err.message || "Error de conexión");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen w-full flex flex-col items-center pt-32">
      {/* Logo */}
      <img src={logo} alt="Logo Brayam" className="h-34 mb-8" />
      <h2 className="text-2xl font-bold mb-2 text-center">
        Bienvenido a BrayamSAC!{" "}
        <span className="inline-block">👋</span>
      </h2>
      <p className="text-sm text-gray-500 mb-6 text-center">
        Ahora tienes acceso a la aplicación de BrayamSAC
      </p>
      <form
        className="w-full max-w-xs flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <div>
          <label className="text-xs font-bold mb-1 block">Correo de la  empresa</label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-500 bg-white"
            placeholder="Correo electrónico"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-xs font-bold mb-1 block">Contraseña</label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-500 bg-white"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && (
          <NotificationMessage 
            type="error" 
            message={error} 
            onClose={() => setError("")}
          />
        )}
        
        {successMessage && (
          <NotificationMessage 
            type="success" 
            message={successMessage} 
            onClose={() => setSuccessMessage("")}
          />
        )}
        

        <button
          type="submit"
          className="bg-[#07a1e4] text-white font-bold py-4 rounded-full mt-12 transition hover:bg-[#138abe] shadow-md tracking-wider drop-shadow-md text-base"
          style={{ boxShadow: '0 4px 12px 0 rgba(0,0,0,0.04)' }}
          disabled={loading}
        >
          {loading ? "Ingresando..." : "INGRESAR"}
        </button>
      </form>
    </div>
  );
}
