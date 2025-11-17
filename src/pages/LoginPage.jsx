import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css"; 

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm();
  const { signIn, isAuthenticated, errors: authErrors } = useAuth();
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
      await signIn(data);
    } catch (error) {
      console.log("Error in login:", error);
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <div className="login-page">
      <div className="login-particle"></div>
      <div className="login-particle"></div>
      <div className="login-particle"></div>

      <div className="login-card">
        <h1 className="login-title">Welcome back</h1>
        <p className="login-subtitle">
          Sign in to continue your gaming journey.
        </p>
        
        {authErrors.map((error, i) => (
          <div key={i} className="login-error-message">
            {error}
          </div>
        ))}
        
        <form className="login-form" onSubmit={onSubmit}>
          <input
            placeholder="Email"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email address",
              },
            })}
          />
          {formErrors.email && (
            <span className="login-field-error">{formErrors.email.message}</span>
          )}

          <input
            placeholder="Password"
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          {formErrors.password && (
            <span className="login-field-error">{formErrors.password.message}</span>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={isLoading ? "loading" : ""}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="login-link">
          <p>Don't have an account? <a href="/register">Create one</a></p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;