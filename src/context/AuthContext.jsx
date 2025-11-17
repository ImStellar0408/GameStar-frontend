import { createContext, useState, useContext, useEffect } from "react";
import { registerRequest } from "../api/auth.js";

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);

  // Limpiar errores después de 5 segundos
  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  const signUp = async (userData) => {
    try {
      setErrors([]); // Limpiar errores anteriores
      const response = await registerRequest(userData);
      console.log("Registration successful:", response.data);
      setUser(response.data);
      setIsAuthenticated(true);
      return response.data;
    } catch (error) {
      console.log("Registration error:", error.response?.data);
      
      // Extraer los errores del backend
      if (error.response?.data?.error) {
        // Si el backend devuelve { error: ["mensaje1", "mensaje2"] }
        setErrors(error.response.data.error);
      } else if (error.response?.data?.message) {
        // Si el backend devuelve { message: "mensaje" }
        setErrors([error.response.data.message]);
      } else {
        // Error genérico
        setErrors(["Registration failed. Please try again."]);
      }
      throw error; // Propagar el error para que el componente lo capture
    }
  };

  return (
    <AuthContext.Provider value={{
      signUp, 
      user, 
      isAuthenticated, 
      errors,
      clearErrors: () => setErrors([]) // Función para limpiar errores manualmente
    }}>
      {children}
    </AuthContext.Provider>
  );
};