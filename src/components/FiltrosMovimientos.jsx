import { useDispatch, useSelector } from "react-redux";
import { limpiarFiltros, setFiltros } from "../store/movimientosSlice";
import { MONEDAS } from "../utils/constantes";

// Los filtros viven en Redux: se conservan al cambiar de página o de sección.
const FiltrosMovimientos = () => {
  const dispatch = useDispatch();
  const filtros = useSelector((s) => s.movimientos.filtros);
  const categorias = useSelector((s) => s.categorias.items);

  const cambiar = (e) => {
    const { name, value } = e.target;
    // Si se cambia el tipo, la categoría elegida puede dejar de corresponder.
    dispatch(setFiltros(name === "tipo" ? { tipo: value, categoria: "" } : { [name]: value }));
  };

  const categoriasVisibles = filtros.tipo ? categorias.filter((c) => c.tipo === filtros.tipo) : categorias;
  const rangoInvalido = filtros.desde && filtros.hasta && filtros.desde > filtros.hasta;
  const hayFiltros = Object.values(filtros).some(Boolean);

  return (
    <section className="tarjeta filtros" aria-label="Filtros">
      <div className="grid-form">
        <div>
          <label htmlFor="f-tipo">Tipo</label>
          <select id="f-tipo" name="tipo" value={filtros.tipo} onChange={cambiar}>
            <option value="">Todos</option>
            <option value="ingreso">Ingreso</option>
            <option value="egreso">Egreso</option>
          </select>
        </div>
        <div>
          <label htmlFor="f-categoria">Categoría</label>
          <select id="f-categoria" name="categoria" value={filtros.categoria} onChange={cambiar}>
            <option value="">Todas</option>
            {categoriasVisibles.map((c) => <option key={c._id} value={c._id}>{c.nombre}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="f-moneda">Moneda</label>
          <select id="f-moneda" name="moneda" value={filtros.moneda} onChange={cambiar}>
            <option value="">Todas</option>
            {MONEDAS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="f-desde">Desde</label>
          <input id="f-desde" type="date" name="desde" value={filtros.desde} onChange={cambiar} />
        </div>
        <div>
          <label htmlFor="f-hasta">Hasta</label>
          <input id="f-hasta" type="date" name="hasta" value={filtros.hasta} onChange={cambiar} />
        </div>
      </div>
      {rangoInvalido && <p className="error">La fecha "desde" no puede ser posterior a "hasta".</p>}
      {hayFiltros && (
        <button className="btn btn-sec" onClick={() => dispatch(limpiarFiltros())}>Limpiar filtros</button>
      )}
    </section>
  );
};

export default FiltrosMovimientos;
