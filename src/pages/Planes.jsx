import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cambiarPlan, cargarPlanes, cargarUso, limpiarMensajePlan } from "../store/usoSlice";
import { formatoMonto } from "../utils/formato";

const capacidad = (p, esEstudio) => {
  if (esEstudio) {
    return [
      `${p.usuarios} ${p.usuarios === 1 ? "usuario" : "usuarios"}`,
      p.clientes === null ? "Clientes ilimitados" : `Hasta ${p.clientes} clientes`,
      p.dias ? `${p.dias} días de prueba` : "Exportación a Zeta y Memory",
    ];
  }
  return [p.limiteMensual ? `Hasta ${p.limiteMensual} movimientos por mes` : "Movimientos ilimitados", p.descripcion];
};

// Catálogo completo de planes según el tipo de cuenta, con el cambio de plan con confirmación.
const Planes = () => {
  const dispatch = useDispatch();
  const usuario = useSelector((s) => s.auth.usuario);
  const { planes, datos, cambiando, errorPlan, mensajePlan } = useSelector((s) => s.uso);
  const [elegido, setElegido] = useState(null);
  const esEstudio = usuario?.tipo === "estudio";

  useEffect(() => {
    dispatch(cargarPlanes());
    dispatch(cargarUso());
    return () => { dispatch(limpiarMensajePlan()); };
  }, [dispatch]);

  const confirmar = async () => {
    await dispatch(cambiarPlan(elegido));
    setElegido(null);
  };

  const tieneContador = Boolean(datos?.contador);

  return (
    <>
      <h1>Planes</h1>
      <p className="suave">
        {esEstudio ? "Para contadores y estudios: el plan depende de cuántos clientes y usuarios manejes." : "Elegí el plan que se ajuste a cuánto cargás por mes."}
      </p>

      {errorPlan && <p className="error" role="alert">{errorPlan}</p>}
      {mensajePlan && <p className="exito" role="status">{mensajePlan}</p>}

      <div className="planes-grid">
        {planes.map((p) => {
          const actual = p.id === usuario?.plan || (p.id === "gratuito" && usuario?.plan === "plus") || (p.id === "directo" && usuario?.plan === "premium");
          const sinBoton = actual || p.id === "trial" || (!esEstudio && p.id === "referido") || (!esEstudio && p.id === "gratuito" && tieneContador);
          return (
            <article key={p.id} className={`plan-card ${actual ? "actual" : ""}`}>
              <h3>{p.nombre} {actual && <span className="chip">Tu plan</span>}</h3>
              <p className="plan-precio">{p.precioUSD === 0 ? "Gratis" : <>USD {formatoMonto(p.precioUSD).replace(",00", "")}<small> /mes</small></>}</p>
              <ul>{capacidad(p, esEstudio).map((t) => <li key={t}>{t}</li>)}</ul>

              {elegido === p.id ? (
                <div className="acciones">
                  <button className="btn" onClick={confirmar} disabled={cambiando}>{cambiando ? "Cambiando..." : "Confirmar cambio"}</button>
                  <button className="btn btn-sec" onClick={() => setElegido(null)} disabled={cambiando}>Cancelar</button>
                </div>
              ) : (
                !sinBoton && <button className="btn" onClick={() => setElegido(p.id)}>Elegir {p.nombre}</button>
              )}
              {!esEstudio && p.id === "referido" && !actual && (
                <small className="suave">Se activa cuando aceptás la invitación de un contador afiliado.</small>
              )}
              {!esEstudio && p.id === "gratuito" && !actual && tieneContador && (
                <small className="suave">Estás vinculado a un contador: desvinculate desde el inicio para volver acá.</small>
              )}
            </article>
          );
        })}
      </div>
      <p className="suave pie-planes">Los precios son de referencia: en esta versión no se realizan cobros.</p>
    </>
  );
};

export default Planes;
