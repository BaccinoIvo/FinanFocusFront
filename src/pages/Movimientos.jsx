import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FiltrosMovimientos from "../components/FiltrosMovimientos";
import MovimientoFormulario from "../components/MovimientoFormulario";
import MovimientoItem from "../components/MovimientoItem";
import Paginacion from "../components/Paginacion";
import { cargarMovimientos, crearMovimiento, setPage } from "../store/movimientosSlice";
import { LIMITE_PLUS } from "../utils/constantes";
import { valoresVacios } from "../utils/movimientoValores";

const Movimientos = () => {
  const dispatch = useDispatch();
  const { items, paginacion, filtros, page, cargando, error } = useSelector((s) => s.movimientos);
  const plan = useSelector((s) => s.auth.usuario?.plan);
  const totalUso = useSelector((s) => s.uso.total);
  const [mostrarAlta, setMostrarAlta] = useState(false);

  const rangoInvalido = filtros.desde && filtros.hasta && filtros.desde > filtros.hasta;

  // Se recarga cada vez que cambian los filtros o la página.
  useEffect(() => {
    if (!rangoInvalido) dispatch(cargarMovimientos());
  }, [dispatch, filtros, page, rangoInvalido]);

  // Plan plus: al llegar a 4 no se permite el alta (el backend también lo valida).
  const limiteAlcanzado = plan !== "premium" && totalUso !== null && totalUso >= LIMITE_PLUS;

  const crear = async (datos) => {
    await dispatch(crearMovimiento(datos)).unwrap();
    setMostrarAlta(false);
  };

  return (
    <>
      <div className="encabezado">
        <h1>Movimientos</h1>
        <button className="btn" onClick={() => setMostrarAlta((v) => !v)}>
          {mostrarAlta ? "Cerrar" : "Nuevo movimiento"}
        </button>
      </div>

      {mostrarAlta && (
        <section className="tarjeta">
          <h2>Nuevo movimiento</h2>
          <MovimientoFormulario
            valoresIniciales={valoresVacios()}
            onGuardar={crear}
            textoBoton="Agregar movimiento"
            bloqueado={limiteAlcanzado}
            mensajeBloqueo={`Alcanzaste el límite de ${LIMITE_PLUS} movimientos del plan plus. Pasá a premium desde el inicio para agregar más.`}
          />
        </section>
      )}

      <FiltrosMovimientos />

      {error && <p className="error" role="alert">{error}</p>}
      {cargando && items.length === 0 && <p className="suave">Cargando...</p>}
      {!cargando && !error && items.length === 0 && (
        <p className="vacio">No hay movimientos para mostrar.</p>
      )}

      <ul className="lista">
        {items.map((m) => <MovimientoItem key={m._id} movimiento={m} />)}
      </ul>

      <Paginacion
        page={page}
        totalPaginas={paginacion.totalPaginas}
        onCambiar={(p) => dispatch(setPage(p))}
      />
    </>
  );
};

export default Movimientos;
