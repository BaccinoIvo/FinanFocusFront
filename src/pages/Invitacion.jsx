import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Logo from "../components/Logo";
import { aceptarInvitacion, limpiarMensajePlan } from "../store/usoSlice";
import { borrarInvitacion, guardarInvitacion, leerInvitacion } from "../utils/invitacion";

// Aceptar la invitación de un estudio. Si no hay sesión, el código se recuerda hasta iniciar sesión.
const Invitacion = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const usuario = useSelector((s) => s.auth.usuario);
  const { cambiando, errorPlan, mensajePlan } = useSelector((s) => s.uso);
  const [hecho, setHecho] = useState(false);
  const token = params.get("token") ?? leerInvitacion() ?? "";

  useEffect(() => {
    if (params.get("token")) guardarInvitacion(params.get("token"));
    return () => { dispatch(limpiarMensajePlan()); };
  }, [dispatch, params]);

  const aceptar = async () => {
    const r = await dispatch(aceptarInvitacion(token));
    if (!r.error) { borrarInvitacion(); setHecho(true); }
  };

  return (
    <div className="auth-fondo">
      <div className="tarjeta auth-tarjeta">
        <h1 className="marca grande"><Link to="/" aria-label="FinanFocus, inicio"><Logo grande /></Link></h1>
        <p className="suave">Invitación de un estudio contable</p>

        {!token && <p className="error" role="alert">Falta el código de la invitación. Pedile el enlace a tu contador.</p>}

        {token && !usuario && (
          <>
            <p>Para aceptar la invitación, iniciá sesión o creá tu cuenta con el mismo email al que te invitaron.</p>
            <Link className="btn enlace-btn" to="/login">Iniciar sesión</Link>
            <Link className="btn btn-sec enlace-btn" to="/registro">Crear cuenta</Link>
          </>
        )}

        {token && usuario?.tipo === "usuario" && !hecho && (
          <>
            <p>Al aceptar, tu contador podrá ver tus movimientos y exportarlos, y tu cuenta pasa al plan <b>Referido Seguro</b>.</p>
            {errorPlan && <p className="error" role="alert">{errorPlan}</p>}
            <button className="btn" onClick={aceptar} disabled={cambiando}>{cambiando ? "Vinculando..." : "Aceptar invitación"}</button>
            <Link className="btn btn-sec enlace-btn" to="/">Ahora no</Link>
          </>
        )}

        {hecho && (
          <>
            <p className="exito" role="status">{mensajePlan}</p>
            <button className="btn" onClick={() => navigate("/", { replace: true })}>Ir al inicio</button>
          </>
        )}

        {usuario && usuario.tipo !== "usuario" && <p className="error">Las cuentas de estudio no pueden aceptar invitaciones.</p>}
      </div>
    </div>
  );
};

export default Invitacion;
