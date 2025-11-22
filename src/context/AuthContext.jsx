import { createContext, useState, useContext, useEffect, use } from "react";
import { registerRequest, loginRequest, verifyTokenRequest} from "../api/auth.js";
import Cookies from "js-cookie";
import { set } from "react-hook-form";

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
  const [loading, setLoading] = useState(true);

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
      setErrors([]); 
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

  const logout = () => {
    Cookies.remove("token");
    setIsAuthenticated(false);
    setUser(null);
  };

  useEffect(() => {
    async function checkLogin() {
      const cookies = Cookies.get();
      
      if(!cookies.token) {
        setIsAuthenticated(false);
        setLoading(false);
        return setUser(null);
      }

      try {
        const res = await verifyTokenRequest(cookies.token);
        if(!res.data){
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }
        setIsAuthenticated(true);
        setUser(res.data);
        setLoading(false);
      }
      catch (error) {
        console.log("Token verification error:", error);
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
      }

    }
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider value={{
      signUp, 
      signIn,
      logout,
      loading,
      user, 
      isAuthenticated, 
      errors,
      clearErrors: () => setErrors([])
    }}>
      {children}
    </AuthContext.Provider>
  );
};