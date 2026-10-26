import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { cambiarPassword, cargarPerfil, guardarPerfil, limpiarMensajes } from "../store/perfilSlice";
import { fechaCorta } from "../utils/formato";

// Mismas reglas que el Joi del backend.
const reglas = {
  nombreUsuario: {
    required: "El nombre de usuario es obligatorio",
    validate: (v) => v.trim().length >= 3 || "Mínimo 3 caracteres",
    maxLength: { value: 30, message: "Máximo 30 caracteres" },
  },
  email: {
    required: "El email es obligatorio",
    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Formato de email inválido" },
  },
  passwordNueva: {
    deps: ["repetir"],
    required: "La contraseña nueva es obligatoria",
    minLength: { value: 6, message: "Mínimo 6 caracteres" },
    pattern: { value: /^(?=.*[a-zA-Z])(?=.*\d)/, message: "Debe tener al menos una letra y un número" },
  },
};

// Perfil: datos de la cuenta (editables) y cambio de contraseña.
const Perfil = () => {
  const dispatch = useDispatch();
  const p = useSelector((s) => s.perfil);

  const datos = useForm({ mode: "onChange", values: p.datos ? { nombreUsuario: p.datos.nombreUsuario, email: p.datos.email } : { nombreUsuario: "", email: "" } });
  const clave = useForm({ mode: "onChange", defaultValues: { passwordActual: "", passwordNueva: "", repetir: "" } });

  useEffect(() => {
    dispatch(cargarPerfil());
    return () => { dispatch(limpiarMensajes()); };
  }, [dispatch]);

  const guardar = async ({ nombreUsuario, email }) => {
    dispatch(limpiarMensajes());
    await dispatch(guardarPerfil({ nombreUsuario: nombreUsuario.trim(), email: email.trim() }));
  };
  const nuevaClave = async ({ passwordActual, passwordNueva }) => {
    dispatch(limpiarMensajes());
    const r = await dispatch(cambiarPassword({ passwordActual, passwordNueva }));
    if (!r.error) clave.reset();
  };

  const d = p.datos;
  return (
    <>
      <h1>Mi perfil</h1>
      <p className="suave">Los datos de tu cuenta y tu contraseña.</p>
      {p.error && <p className="error" role="alert">{p.error}</p>}
      {p.cargando && !d && <p className="suave">Cargando...</p>}

      {d && (
        <section className="tarjeta" aria-label="Resumen de la cuenta">
          <h2>Tu cuenta</h2>
          <ul className="datos-resumen">
            <li><span className="suave">Tipo de cuenta</span><strong>{d.tipo === "estudio" ? "Contador o estudio" : d.tipo === "admin" ? "Administrador" : "Freelancer"}</strong></li>
            <li><span className="suave">Plan</span><strong>{d.planNombre}</strong></li>
            <li><span className="suave">Miembro desde</span><strong>{d.creadoEl ? fechaCorta(d.creadoEl) : "—"}</strong></li>
            {d.contador && <li><span className="suave">Tu contador</span><strong>{d.contador}</strong></li>}
          </ul>
        </section>
      )}

      <div className="grid-dos">
        <section className="tarjeta" aria-label="Editar datos">
          <h2>Mis datos</h2>
          <form onSubmit={datos.handleSubmit(guardar)} noValidate>
            <label htmlFor="perfil-usuario">Usuario</label>
            <input id="perfil-usuario" autoComplete="username" {...datos.register("nombreUsuario", reglas.nombreUsuario)} />
            {datos.formState.errors.nombreUsuario && <small className="error">{datos.formState.errors.nombreUsuario.message}</small>}

            <label htmlFor="perfil-email">Email</label>
            <input id="perfil-email" type="email" autoComplete="email" {...datos.register("email", reglas.email)} />
            {datos.formState.errors.email && <small className="error">{datos.formState.errors.email.message}</small>}

            {p.errorGuardar && <p className="error" role="alert">{p.errorGuardar}</p>}
            {p.mensajeGuardar && <p className="exito" role="status">{p.mensajeGuardar}</p>}
            <button className="btn" type="submit" disabled={!datos.formState.isValid || !datos.formState.isDirty || p.guardando}>
              {p.guardando ? "Guardando..." : "Guardar cambios"}
            </button>
          </form>
        </section>

        <section className="tarjeta" aria-label="Cambiar contraseña">
          <h2>Cambiar contraseña</h2>
          <form onSubmit={clave.handleSubmit(nuevaClave)} noValidate>
            <label htmlFor="perfil-actual">Contraseña actual</label>
            <input id="perfil-actual" type="password" autoComplete="current-password"
              {...clave.register("passwordActual", { required: "Escribí tu contraseña actual" })} />
            {clave.formState.errors.passwordActual && <small className="error">{clave.formState.errors.passwordActual.message}</small>}

            <label htmlFor="perfil-nueva">Contraseña nueva</label>
            <input id="perfil-nueva" type="password" autoComplete="new-password" {...clave.register("passwordNueva", reglas.passwordNueva)} />
            {clave.formState.errors.passwordNueva && <small className="error">{clave.formState.errors.passwordNueva.message}</small>}

            <label htmlFor="perfil-repetir">Repetir contraseña nueva</label>
            <input id="perfil-repetir" type="password" autoComplete="new-password"
              {...clave.register("repetir", {
                required: "Repetí la contraseña nueva",
                validate: (v) => v === clave.getValues("passwordNueva") || "Las contraseñas no coinciden",
              })} />
            {clave.formState.errors.repetir && <small className="error">{clave.formState.errors.repetir.message}</small>}

            {p.errorPassword && <p className="error" role="alert">{p.errorPassword}</p>}
            {p.mensajePassword && <p className="exito" role="status">{p.mensajePassword}</p>}
            <button className="btn" type="submit" disabled={!clave.formState.isValid || p.cambiandoPassword}>
              {p.cambiandoPassword ? "Cambiando..." : "Cambiar contraseña"}
            </button>
          </form>
        </section>
      </div>
    </>
  );
};

export default Perfil;
