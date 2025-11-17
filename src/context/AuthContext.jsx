import { createContext, useState, useContext, useEffect } from "react";
import { registerRequest, loginRequest} from "../api/auth.js";

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
      
      if (error.response?.data?.error) {
        setErrors(error.response.data.error);
      } else if (error.response?.data?.message) {
        setErrors([error.response.data.message]);
      } else {
        setErrors(["Registration failed. Please try again."]);
      }
      throw error;
    }
  };

  const signIn = async (userData) => {
    try {
      const res = await loginRequest(userData);
      console.log("Login successful:", res.data);
      setUser(res.data);
      setIsAuthenticated(true);
      return res.data;
    } catch (error) {
      console.log("Login error:", error.response?.data);
      if (error.response?.data?.error) {
        setErrors(error.response.data.error);
      } else if (error.response?.data?.message) {
        setErrors([error.response.data.message]);
      } else {
        setErrors(["Login failed. Please try again."]);
      }
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      signUp, 
      signIn,
      user, 
      isAuthenticated, 
      errors,
      clearErrors: () => setErrors([])
    }}>
      {children}
    </AuthContext.Provider>
  );
};