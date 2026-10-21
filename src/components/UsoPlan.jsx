import { useSelector } from "react-redux";
import { LIMITE_PLUS } from "../utils/constantes";

// Informe de uso: % de los 4 movimientos para plus, cantidad total para premium.
const UsoPlan = () => {
  const plan = useSelector((s) => s.auth.usuario?.plan);
  const { total, cargando, error } = useSelector((s) => s.uso);

  return (
    <section className="tarjeta" aria-label="Informe de uso">
      <h2>Informe de uso</h2>
      {error && <p className="error">{error}</p>}
      {total === null && !error && <p className="suave">{cargando ? "Cargando..." : ""}</p>}

      {total !== null && plan === "premium" && (
        <>
          <p className="numero-grande">{total}</p>
          <p className="suave">movimientos registrados · sin límite</p>
        </>
      )}

      {total !== null && plan !== "premium" && (() => {
        const porcentaje = Math.min(Math.round((total / LIMITE_PLUS) * 100), 100);
        const lleno = total >= LIMITE_PLUS;
        return (
          <>
            <p className="numero-grande">{porcentaje}%</p>
            <div className="barra" role="progressbar" aria-valuenow={porcentaje} aria-valuemin={0} aria-valuemax={100}>
              <div className={`barra-relleno ${lleno ? "lleno" : ""}`} style={{ width: `${porcentaje}%` }} />
            </div>
            <p className="suave">{Math.min(total, LIMITE_PLUS)} de {LIMITE_PLUS} movimientos usados (plan plus)</p>
            {lleno && <p className="aviso">Alcanzaste el límite. Pasá a premium para seguir registrando.</p>}
          </>
        );
      })()}
    </section>
  );
};

export default UsoPlan;
