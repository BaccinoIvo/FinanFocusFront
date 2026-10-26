import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cargarCotizaciones } from "../store/cotizacionesSlice";
import { formatoMonto } from "../utils/formato";

const MONEDAS_CAMBIO = [
  { codigo: "USD", nombre: "Dólar" },
  { codigo: "EUR", nombre: "Euro" },
  { codigo: "BRL", nombre: "Real" },
  { codigo: "ARS", nombre: "Peso arg." },
];
const UNIDADES = [
  { codigo: "UI", nombre: "Unidad indexada" },
  { codigo: "UR", nombre: "Unidad reajustable" },
];

const fechaDe = (iso) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d.toLocaleDateString("es-UY", { timeZone: "UTC", day: "2-digit", month: "2-digit", year: "numeric" });
};

// Cada moneda se muestra por separado: si una falla en el backend, las otras siguen visibles.
const Celda = ({ nombre, codigo, cot, children }) => (
  <div className="tile">
    <span className="tile-etiqueta">{nombre} <span className="cod">{codigo}</span></span>
    {!cot || cot.error ? <span className="suave">No disponible en este momento</span> : children}
  </div>
);

const Cotizaciones = () => {
  const dispatch = useDispatch();
  const { datos, cargando, error } = useSelector((s) => s.cotizaciones);

  useEffect(() => { dispatch(cargarCotizaciones()); }, [dispatch]);

  const hayReferencia = datos && MONEDAS_CAMBIO.some(({ codigo }) => datos[codigo]?.referencia);
  const fecha = datos ? fechaDe(Object.values(datos).find((c) => c && !c.error && c.fecha)?.fecha) : null;

  return (
    <section className="tarjeta" aria-label="Cotizaciones">
      <div className="grafico-cabecera">
        <h2>Cotizaciones del día</h2>
        <button className="btn btn-sec" onClick={() => dispatch(cargarCotizaciones())} disabled={cargando}>
          {cargando ? "Actualizando..." : "Actualizar"}
        </button>
      </div>
      <p className="suave nota-cot">Se usan para pasar tus movimientos a pesos uruguayos.{fecha && ` Datos al ${fecha}.`}</p>

      {hayReferencia && (
        <p className="suave nota-cot">
          El BROU no está informando en este momento: algunas monedas muestran un valor de referencia internacional, no la cotización de mostrador.
        </p>
      )}

      {error && <p className="error" role="alert">{error}</p>}
      {!datos && cargando && <p className="suave">Cargando cotizaciones...</p>}

      {datos && (
        <div className="cot-grid">
          {MONEDAS_CAMBIO.map(({ codigo, nombre }) => (
            <Celda key={codigo} codigo={codigo} nombre={nombre} cot={datos[codigo]}>
              <span className="tile-valor">$ {formatoMonto(datos[codigo]?.venta ?? datos[codigo]?.valor ?? 0)}</span>
              <small className="suave">
                {datos[codigo]?.referencia
                  ? "Valor de referencia"
                  : `Compra ${formatoMonto(datos[codigo]?.compra ?? 0)} · Venta ${formatoMonto(datos[codigo]?.venta ?? 0)}`}
              </small>
            </Celda>
          ))}
          {UNIDADES.map(({ codigo, nombre }) => (
            <Celda key={codigo} codigo={codigo} nombre={nombre} cot={datos[codigo]}>
              <span className="tile-valor">$ {formatoMonto(datos[codigo]?.valor ?? 0)}</span>
              <small className="suave">Valor vigente</small>
            </Celda>
          ))}
        </div>
      )}
    </section>
  );
};

export default Cotizaciones;
