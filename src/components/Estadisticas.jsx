import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cargarEstadisticas } from "../store/estadisticasSlice";
import { calcularEstadisticas } from "../utils/estadisticas";
import { pesos } from "../utils/grafico";
import GraficoCategorias from "./GraficoCategorias";
import GraficoMensual from "./GraficoMensual";

const PERIODOS = [
  { valor: 3, texto: "Últimos 3 meses" },
  { valor: 6, texto: "Últimos 6 meses" },
  { valor: 12, texto: "Últimos 12 meses" },
];

const Tarjeta = ({ etiqueta, valor }) => (
  <div className="tile">
    <span className="tile-etiqueta">{etiqueta}</span>
    <span className="tile-valor">{valor}</span>
  </div>
);

// Filtro de período arriba (una sola fila) y todo lo de abajo se recalcula con el mismo corte.
const Estadisticas = () => {
  const dispatch = useDispatch();
  const { items, cargando, error, cargadoUnaVez } = useSelector((s) => s.estadisticas);
  const [meses, setMeses] = useState(6);

  useEffect(() => { dispatch(cargarEstadisticas()); }, [dispatch]);

  const datos = useMemo(() => calcularEstadisticas(items, meses), [items, meses]);

  return (
    <section aria-label="Estadísticas" className={cargando && cargadoUnaVez ? "recargando" : ""}>
      <div className="encabezado">
        <h2 className="titulo-seccion">Estadísticas</h2>
        <div>
          <label htmlFor="periodo" className="sr-only">Período</label>
          <select id="periodo" value={meses} onChange={(e) => setMeses(Number(e.target.value))}>
            {PERIODOS.map((p) => <option key={p.valor} value={p.valor}>{p.texto}</option>)}
          </select>
        </div>
      </div>

      {error && <p className="error" role="alert">{error}</p>}
      {!cargadoUnaVez && cargando && <p className="suave">Cargando estadísticas...</p>}

      {cargadoUnaVez && datos.cantidad === 0 && (
        <p className="vacio">Todavía no hay movimientos en este período.</p>
      )}

      {cargadoUnaVez && datos.cantidad > 0 && (
        <>
          <div className="tiles">
            <Tarjeta etiqueta="Ingresos" valor={pesos(datos.totales.ingresos)} />
            <Tarjeta etiqueta="Egresos" valor={pesos(datos.totales.egresos)} />
            <Tarjeta etiqueta="Balance" valor={pesos(datos.totales.balance)} />
          </div>
          {datos.sinCotizacion > 0 && (
            <p className="suave nota">
              {datos.sinCotizacion} movimiento(s) en otras monedas no se incluyen porque no hay cotización disponible.
              Los montos están expresados en pesos uruguayos.
            </p>
          )}
          <div className="grid-dos graficos">
            <GraficoMensual datos={datos.porMes} />
            <GraficoCategorias datos={datos.categorias} />
          </div>
        </>
      )}
    </section>
  );
};

export default Estadisticas;
