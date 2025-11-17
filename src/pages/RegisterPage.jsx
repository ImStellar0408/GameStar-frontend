import { useForm } from "react-hook-form";
import "./register.css";
import { registerRequest } from "../api/auth.js";

function RegisterPage() {
  const { register, handleSubmit } = useForm();

  const onSubmit = handleSubmit(async (data) => {
            const res = await registerRequest(data);
            console.log(res);
        })

  return (
    <div className="register-page">
      <div className="glass-particle"></div>
      <div className="glass-particle"></div>
      <div className="glass-particle"></div>

      <div className="register-card">
        <h1 className="register-title">Crea tu cuenta</h1>
        <p className="register-subtitle">
          Únete a GameTracker para seguir tus juegos y descubrimientos.
        </p>
        <form
          className="register-form"
          onSubmit={onSubmit}
        >
          <input
            placeholder="Nombre de usuario"
            type="text"
            {...register("username", { required: true })}
          />
          <input
            placeholder="Correo electrónico"
            type="email"
            {...register("email", { required: true })}
          />
          <input
            placeholder="Contraseña"
            type="password"
            {...register("password", { required: true })}
          />
          <button type="submit">Registrarse</button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
