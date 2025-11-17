import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/register.css";

function RegisterPage() {
  const { register, handleSubmit, formState: { errors: formErrors } } = useForm();
  const { signUp, isAuthenticated, errors: authErrors } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/games");
    }
  }, [isAuthenticated]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsLoading(true);
      console.log("Submitting:", data);
      await signUp(data);
    } catch (error) {
      console.log("Error in onSubmit:", error);
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <div className="register-page">
      <div className="glass-particle"></div>
      <div className="glass-particle"></div>
      <div className="glass-particle"></div>

      <div className="register-card">
        <h1 className="register-title">Join GameTracker</h1>
        <p className="register-subtitle">
          To track your games and discoveries.
        </p>
        
        {/* Mostrar errores del backend */}
        {authErrors.map((error, i) => (
          <div key={i} className="error-message">
            {error}
          </div>
        ))}
        
        <form className="register-form" onSubmit={onSubmit}>
          <input
            placeholder="Username"
            type="text"
            {...register("username", { required: "Username is required" })}
          />
          {formErrors.username && (
            <span className="field-error">
              {formErrors.username.message}
            </span>
          )}
          
          <input
            placeholder="Email"
            type="email"
            {...register("email", { 
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email address"
              }
            })}
          />
          {formErrors.email && (
            <span className="field-error">
              {formErrors.email.message}
            </span>
          )}
          
          <input
            placeholder="Password"
            type="password"
            {...register("password", { 
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters"
              }
            })}
          />
          {formErrors.password && (
            <span className="field-error">
              {formErrors.password.message}
            </span>
          )}
          
          <button 
            type="submit" 
            disabled={isLoading}
            className={isLoading ? "loading" : ""}
          >
            {isLoading ? "Creating Account..." : "Register"}
          </button>
        </form>

        {/* Enlace para ir al login */}
        <div className="register-link">
          <p>Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;