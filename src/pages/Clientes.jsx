import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Paginacion from "../components/Paginacion";
import {
  cargarClientes, cargarInvitaciones, crearPerfilSombra, invitarCliente, limpiarAccion, quitarCliente,
} from "../store/estudioSlice";
import { fechaCorta, nombreVisible } from "../utils/formato";
import { nombrePlan } from "../utils/planes";

const PATRON_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Panel del estudio: cartera de clientes, invitaciones de un solo uso y perfiles sombra.
const Clientes = () => {
  const dispatch = useDispatch();
  const { clientes, paginacion, page, cargando, error, invitaciones, ultimaInvitacion, errorAccion, accionando } = useSelector((s) => s.estudio);
  const [panel, setPanel] = useState(null); // "invitar" | "sombra"
  const [quitando, setQuitando] = useState(null);
  const [copiado, setCopiado] = useState(false);

  const invitar = useForm({ mode: "onChange", defaultValues: { email: "" } });
  const sombra = useForm({ mode: "onChange", defaultValues: { nombre: "" } });

  useEffect(() => {
    dispatch(cargarClientes(1));
    dispatch(cargarInvitaciones());
    return () => { dispatch(limpiarAccion()); };
  }, [dispatch]);

  const abrir = (nombre) => { dispatch(limpiarAccion()); setCopiado(false); setPanel((p) => (p === nombre ? null : nombre)); };

  const enviarInvitacion = async ({ email }) => {
    const r = await dispatch(invitarCliente(email.trim().toLowerCase()));
    if (!r.error) invitar.reset();
  };
  const enviarSombra = async ({ nombre }) => {
    const r = await dispatch(crearPerfilSombra(nombre.trim()));
    if (!r.error) { sombra.reset(); setPanel(null); }
  };

  const enlace = ultimaInvitacion ? `${window.location.origin}/invitacion?token=${ultimaInvitacion.token}` : "";
  const copiar = async () => {
    try { await navigator.clipboard.writeText(enlace); setCopiado(true); } catch { setCopiado(false); }
  };

  return (
    <>
      <div className="encabezado">
        <h1>Clientes</h1>
        <div className="acciones">
          <button className="btn" onClick={() => abrir("invitar")}>Invitar cliente</button>
          <button className="btn btn-sec" onClick={() => abrir("sombra")}>Nuevo perfil sombra</button>
        </div>
      </div>
      <p className="suave">Tu cartera: los clientes que aceptaron tu invitación y los perfiles sombra que cargás en su nombre.</p>

      {errorAccion && <p className="error" role="alert">{errorAccion}</p>}

      {panel === "invitar" && (
        <section className="tarjeta" aria-label="Invitar cliente">
          <h2>Invitar a un cliente</h2>
          <p className="suave">Generás un enlace de un solo uso que vence en 48 horas. Solo sirve para la cuenta con ese email.</p>
          <form onSubmit={invitar.handleSubmit(enviarInvitacion)} noValidate>
            <label htmlFor="inv-email">Email del cliente</label>
            <input id="inv-email" type="email" autoComplete="off"
              {...invitar.register("email", { required: "El email es obligatorio", pattern: { value: PATRON_EMAIL, message: "Formato de email inválido" } })} />
            {invitar.formState.errors.email && <small className="error">{invitar.formState.errors.email.message}</small>}
            <button className="btn" type="submit" disabled={!invitar.formState.isValid || accionando}>{accionando ? "Generando..." : "Generar invitación"}</button>
          </form>
          {ultimaInvitacion && (
            <div className="invitacion-nueva" role="status">
              <p><b>Invitación lista para {ultimaInvitacion.email}.</b> Copiá el enlace y mandáselo (por mail o WhatsApp): FinanFocus no lo envía solo. Por seguridad se muestra una única vez.</p>
              <input readOnly value={enlace} aria-label="Enlace de invitación" onFocus={(e) => e.target.select()} />
              <div className="acciones">
                <button className="btn btn-sec" onClick={copiar}>{copiado ? "¡Copiado!" : "Copiar enlace"}</button>
                <span className="suave">Vence el {fechaCorta(ultimaInvitacion.expiraEl)}</span>
              </div>
            </div>
          )}
        </section>
      )}

      {panel === "sombra" && (
        <section className="tarjeta" aria-label="Nuevo perfil sombra">
          <h2>Nuevo perfil sombra</h2>
          <p className="suave">Para un cliente que todavía no usa FinanFocus: vos cargás sus comprobantes. El perfil no tiene acceso propio.</p>
          <form onSubmit={sombra.handleSubmit(enviarSombra)} noValidate>
            <label htmlFor="sombra-nombre">Nombre del cliente</label>
            <input id="sombra-nombre" autoComplete="off"
              {...sombra.register("nombre", { required: "El nombre es obligatorio", minLength: { value: 2, message: "Mínimo 2 caracteres" }, maxLength: { value: 40, message: "Máximo 40 caracteres" } })} />
            {sombra.formState.errors.nombre && <small className="error">{sombra.formState.errors.nombre.message}</small>}
            <button className="btn" type="submit" disabled={!sombra.formState.isValid || accionando}>{accionando ? "Creando..." : "Crear perfil"}</button>
          </form>
        </section>
      )}

      {error && <p className="error" role="alert">{error}</p>}
      {cargando && clientes.length === 0 && <p className="suave">Cargando...</p>}
      {!cargando && !error && clientes.length === 0 && <p className="vacio">Todavía no tenés clientes. Invitá a uno o creá un perfil sombra.</p>}

      <ul className="lista">
        {clientes.map((c) => (
          <li key={c._id} className="cat">
            <div className="cat-fila">
              <div className="mov-info">
                <strong>{nombreVisible(c)}</strong>
                {c.esPerfilSombra ? <span className="tag tag-neutro">Perfil sombra</span> : <span className="tag tag-neutro">{nombrePlan(c.plan)}</span>}
                <span className="suave">{c.movimientos} {c.movimientos === 1 ? "movimiento" : "movimientos"}</span>
                {c.sinComprobante > 0 && <span className="tag tag-egreso">{c.sinComprobante} sin comprobante</span>}
              </div>
              <div className="acciones">
                <Link className="btn btn-sec enlace-btn" to={`/clientes/${c._id}`}>Ver movimientos</Link>
                {!c.esPerfilSombra && (quitando === c._id ? (
                  <>
                    <button className="btn btn-peligro" onClick={async () => { await dispatch(quitarCliente(c._id)); setQuitando(null); }}>Sí, quitar</button>
                    <button className="btn btn-sec" onClick={() => setQuitando(null)}>No</button>
                  </>
                ) : (
                  <button className="btn btn-sec btn-borrar" onClick={() => setQuitando(c._id)}>Quitar</button>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>
      <Paginacion page={page} totalPaginas={paginacion.totalPaginas} onCambiar={(p) => dispatch(cargarClientes(p))} />

      {invitaciones.length > 0 && (
        <section className="tarjeta" aria-label="Invitaciones">
          <h2>Invitaciones recientes</h2>
          <ul className="lista-simple">
            {invitaciones.map((i) => (
              <li key={i._id}><span>{i.email}</span><span className={`tag ${i.estado === "pendiente" ? "tag-ingreso" : "tag-neutro"}`}>{i.estado}</span></li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
};

export default Clientes;
