import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { cambiarPlan, desvincularContador } from "../store/usoSlice";
import { nombrePlan } from "../utils/planes";

// Tarjeta de cambio rápido de plan (separada del informe de uso). El catálogo completo está en /planes.
const CambioPlan = () => {
  const dispatch = useDispatch();
  const usuario = useSelector((s) => s.auth.usuario);
  const { datos, cambiando, errorPlan, mensajePlan } = useSelector((s) => s.uso);
  const [accion, setAccion] = useState(null); // "directo" | "gratuito" | "desvincular"
  const plan = usuario?.plan;

  const confirmar = async () => {
    await dispatch(accion === "desvincular" ? desvincularContador() : cambiarPlan(accion));
    setAccion(null);
  };

  const confirmacion = (pregunta) => (
    <div className="acciones">
      <span className="suave">{pregunta}</span>
      <button className="btn" onClick={confirmar} disabled={cambiando}>{cambiando ? "Cambiando..." : "Sí, confirmar"}</button>
      <button className="btn btn-sec" onClick={() => setAccion(null)} disabled={cambiando}>Cancelar</button>
    </div>
  );

  return (
    <section className="tarjeta" aria-label="Plan">
      <h2>Tu plan</h2>
      <p><span className="chip">{nombrePlan(plan)}</span>{datos?.precioUSD > 0 && <span className="suave"> · USD {datos.precioUSD}/mes</span>}</p>

      {usuario?.tipo === "estudio" ? (
        <p className="suave">
          {datos?.diasRestantes !== null && datos?.diasRestantes !== undefined
            ? `Te quedan ${datos.diasRestantes} días de prueba. `
            : ""}
          Podés cambiar de plan según la cantidad de clientes que manejes.
        </p>
      ) : (
        <ul className="beneficios">
          <li>Gratuito: hasta 4 movimientos por mes</li>
          <li>Referido Seguro (USD 5): ilimitado, con un contador afiliado</li>
          <li>Directo Premium (USD 9): ilimitado</li>
        </ul>
      )}

      {errorPlan && <p className="error" role="alert">{errorPlan}</p>}
      {mensajePlan && <p className="exito" role="status">{mensajePlan}</p>}

      {accion ? (
        confirmacion(accion === "desvincular" ? "¿Desvincularte de tu contador?" : `¿Cambiar a ${nombrePlan(accion)}?`)
      ) : (
        <div className="acciones">
          {usuario?.tipo !== "estudio" && (plan === "gratuito" || plan === "plus") && (
            <button className="btn" onClick={() => setAccion("directo")}>Pasar a Directo Premium</button>
          )}
          {usuario?.tipo !== "estudio" && (plan === "directo" || plan === "premium") && !datos?.contador && (
            <button className="btn btn-sec" onClick={() => setAccion("gratuito")}>Volver a Gratuito</button>
          )}
          {usuario?.tipo !== "estudio" && datos?.contador && (
            <button className="btn btn-sec" onClick={() => setAccion("desvincular")}>Desvincularme de {datos.contador.nombreUsuario}</button>
          )}
          <Link to="/planes" className="btn btn-sec enlace-btn">Ver todos los planes</Link>
        </div>
      )}
    </section>
  );
};

export default CambioPlan;
