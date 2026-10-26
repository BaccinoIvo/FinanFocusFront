import { useDispatch, useSelector } from "react-redux";
import { generarResumen } from "../store/resumenSlice";
import { pesos } from "../utils/grafico";

const FUENTES = { groq: "Groq", gemini: "Gemini" };

// Si la IA no está disponible, el backend igual entrega los números; la frase se arma acá con reglas fijas.
const resumenPorReglas = (e) => {
  if (e.cantidadMovimientos === 0) return "Todavía no registraste movimientos.";
  const principal = Object.entries(e.egresosPorCategoria ?? {}).sort((a, b) => b[1] - a[1])[0];
  let texto = `Registraste ${e.cantidadMovimientos} movimiento(s): ingresos por ${pesos(e.totalIngresosUYU)} y egresos por ${pesos(e.totalEgresosUYU)}, con un saldo de ${pesos(e.saldoUYU)}.`;
  if (principal) texto += ` Tu mayor gasto está en ${principal[0]} (${pesos(principal[1])}).`;
  if (e.cantidadExportacionServicio > 0) texto += ` ${e.cantidadExportacionServicio} movimiento(s) están marcados como exportación de servicios.`;
  return texto;
};

const ResumenFiscal = () => {
  const dispatch = useDispatch();
  const { data, cargando, error } = useSelector((s) => s.resumen);

  const usaIA = data && data.resumenNarrado;

  return (
    <section className="tarjeta" aria-label="Resumen fiscal">
      <div className="grafico-cabecera">
        <h2>Resumen fiscal</h2>
        <button className="btn" onClick={() => dispatch(generarResumen())} disabled={cargando}>
          {cargando ? "Generando..." : data ? "Actualizar resumen" : "Generar resumen"}
        </button>
      </div>

      {!data && !cargando && !error && (
        <p className="suave">Un resumen de tu situación con tus movimientos actuales, redactado con IA.</p>
      )}
      {cargando && <p className="suave">Analizando tus movimientos. Puede tardar unos segundos...</p>}
      {error && <p className="error" role="alert">{error}</p>}

      {data && (
        <div className={cargando ? "recargando" : ""}>
          <p className="resumen-texto">{usaIA ? data.resumenNarrado : resumenPorReglas(data.estado)}</p>
          <p className="suave nota-fuente">
            {usaIA
              ? `Redactado con IA (${FUENTES[data.fuente] ?? data.fuente}) a partir de tus números.`
              : "La IA no está disponible en este momento: este resumen se arma con cálculo directo."}
            {" "}Es informativo; no constituye asesoramiento tributario.
          </p>
          <ul className="datos-resumen">
            <li><span className="suave">Ingresos</span><strong>{pesos(data.estado.totalIngresosUYU)}</strong></li>
            <li><span className="suave">Egresos</span><strong>{pesos(data.estado.totalEgresosUYU)}</strong></li>
            <li><span className="suave">Saldo</span><strong>{pesos(data.estado.saldoUYU)}</strong></li>
            <li><span className="suave">Exportación de servicios</span><strong>{data.estado.cantidadExportacionServicio}</strong></li>
          </ul>
        </div>
      )}
    </section>
  );
};

export default ResumenFiscal;
