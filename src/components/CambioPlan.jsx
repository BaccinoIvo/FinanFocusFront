import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cambiarPlan } from "../store/usoSlice";

const CambioPlan = () => {
  const dispatch = useDispatch();
  const plan = useSelector((s) => s.auth.usuario?.plan);
  const { cambiando, errorPlan } = useSelector((s) => s.uso);
  const [confirmando, setConfirmando] = useState(false);

  const confirmar = async () => {
    await dispatch(cambiarPlan());
    setConfirmando(false);
  };

  return (
    <section className="tarjeta" aria-label="Plan">
      <h2>Tu plan</h2>
      <p><span className="chip">{plan}</span></p>

      {plan === "premium" ? (
        <p className="suave">Ya tenés el plan premium: movimientos ilimitados.</p>
      ) : (
        <>
          <ul className="beneficios">
            <li>Plus: hasta 4 movimientos</li>
            <li>Premium: movimientos ilimitados</li>
          </ul>
          {errorPlan && <p className="error" role="alert">{errorPlan}</p>}
          {confirmando ? (
            <div className="acciones">
              <span className="suave">¿Cambiar a premium?</span>
              <button className="btn" onClick={confirmar} disabled={cambiando}>
                {cambiando ? "Cambiando..." : "Sí, cambiar"}
              </button>
              <button className="btn btn-sec" onClick={() => setConfirmando(false)} disabled={cambiando}>Cancelar</button>
            </div>
          ) : (
            <button className="btn" onClick={() => setConfirmando(true)}>Pasar a premium</button>
          )}
        </>
      )}
    </section>
  );
};

export default CambioPlan;
