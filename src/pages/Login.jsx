import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Logo from "../components/Logo";
import { limpiarError, login } from "../store/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const { cargando, error, vencida } = useSelector((s) => s.auth);
  // mode "onChange": isValid se recalcula en cada tecla, así el botón reacciona al instante.
  const { register, handleSubmit, formState: { isValid } } = useForm({
    mode: "onChange",
    defaultValues: { nombreUsuario: "", password: "" },
  });

  useEffect(() => () => { dispatch(limpiarError()); }, [dispatch]);

  const onSubmit = (datos) => dispatch(login(datos));

  return (
    <div className="auth-fondo">
      <form className="tarjeta auth-tarjeta" onSubmit={handleSubmit(onSubmit)} noValidate>
        <h1 className="marca grande"><Link to="/" aria-label="FinanFocus, volver a la portada"><Logo grande /></Link></h1>
        <p className="suave">Ingresá a tu cuenta</p>
        {vencida && <p className="aviso" role="status">Tu sesión venció. Iniciá sesión de nuevo para seguir.</p>}

        <label htmlFor="nombreUsuario">Usuario</label>
        <input id="nombreUsuario" autoComplete="username"
          {...register("nombreUsuario", { required: true, validate: (v) => v.trim() !== "" })} />

        <label htmlFor="password">Contraseña</label>
        <input id="password" type="password" autoComplete="current-password"
          {...register("password", { required: true })} />

        {error && <p className="error" role="alert">{error}</p>}

        <button className="btn" type="submit" disabled={!isValid || cargando}>
          {cargando ? "Ingresando..." : "Ingresar"}
        </button>
        <p className="suave centro">¿No tenés cuenta? <Link to="/registro">Registrate</Link></p>
      </form>
    </div>
  );
};
export default Login;
