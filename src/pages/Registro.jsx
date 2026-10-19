import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { limpiarError, registrar } from "../store/authSlice";

// Mismas reglas que el Joi del backend (auth.validators.js) para no sobrecargar el servidor.
const reglas = {
  nombreUsuario: {
    required: "El nombre de usuario es obligatorio",
    minLength: { value: 3, message: "Mínimo 3 caracteres" },
    maxLength: { value: 30, message: "Máximo 30 caracteres" },
  },
  email: {
    required: "El email es obligatorio",
    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Formato de email inválido" },
  },
  password: {
    deps: ["repetir"], // al cambiar la contraseña se revalida "repetir"
    required: "La contraseña es obligatoria",
    minLength: { value: 6, message: "Mínimo 6 caracteres" },
    pattern: { value: /^(?=.*[a-zA-Z])(?=.*\d)/, message: "Debe tener al menos una letra y un número" },
  },
};

const Registro = () => {
  const dispatch = useDispatch();
  const { cargando, error } = useSelector((s) => s.auth);
  const { register, handleSubmit, getValues, formState: { errors, isValid } } = useForm({
    mode: "onChange",
    defaultValues: { nombreUsuario: "", email: "", password: "", repetir: "" },
  });

  useEffect(() => () => { dispatch(limpiarError()); }, [dispatch]);

  // El backend no recibe "repetir": solo se usa para validar en el frontend.
  const onSubmit = ({ nombreUsuario, email, password }) =>
    dispatch(registrar({ nombreUsuario: nombreUsuario.trim(), email: email.trim(), password }));

  return (
    <div className="auth-fondo">
      <form className="tarjeta auth-tarjeta" onSubmit={handleSubmit(onSubmit)} noValidate>
        <h1 className="marca grande">Finan<b>Focus</b></h1>
        <p className="suave">Creá tu cuenta</p>

        <label htmlFor="nombreUsuario">Usuario</label>
        <input id="nombreUsuario" autoComplete="username" {...register("nombreUsuario", reglas.nombreUsuario)} />
        {errors.nombreUsuario && <small className="error">{errors.nombreUsuario.message}</small>}

        <label htmlFor="email">Email</label>
        <input id="email" type="email" autoComplete="email" {...register("email", reglas.email)} />
        {errors.email && <small className="error">{errors.email.message}</small>}

        <label htmlFor="password">Contraseña</label>
        <input id="password" type="password" autoComplete="new-password" {...register("password", reglas.password)} />
        {errors.password && <small className="error">{errors.password.message}</small>}

        <label htmlFor="repetir">Repetir contraseña</label>
        <input id="repetir" type="password" autoComplete="new-password"
          {...register("repetir", {
            required: "Repetí la contraseña",
            validate: (v) => v === getValues("password") || "Las contraseñas no coinciden",
          })} />
        {errors.repetir && <small className="error">{errors.repetir.message}</small>}

        {error && <p className="error" role="alert">{error}</p>}

        <button className="btn" type="submit" disabled={!isValid || cargando}>
          {cargando ? "Creando cuenta..." : "Registrarme"}
        </button>
        <p className="suave centro">¿Ya tenés cuenta? <Link to="/login">Ingresá</Link></p>
      </form>
    </div>
  );
};
export default Registro;
