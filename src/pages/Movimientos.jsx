import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FiltrosMovimientos from "../components/FiltrosMovimientos";
import MovimientoFormulario from "../components/MovimientoFormulario";
import MovimientoItem from "../components/MovimientoItem";
import Paginacion from "../components/Paginacion";
import { cargarMovimientos, crearMovimiento, setPage, subirComprobante } from "../store/movimientosSlice";
import { valoresVacios } from "../utils/movimientoValores";

const Movimientos = () => {
  const dispatch = useDispatch();
  const { items, paginacion, filtros, page, cargando, error } = useSelector((s) => s.movimientos);
  const uso = useSelector((s) => s.uso.datos);
  const [mostrarAlta, setMostrarAlta] = useState(false);
  const [aviso, setAviso] = useState(null);

  const rangoInvalido = filtros.desde && filtros.hasta && filtros.desde > filtros.hasta;

  // Se recarga cada vez que cambian los filtros o la página.
  useEffect(() => {
    if (!rangoInvalido) dispatch(cargarMovimientos());
  }, [dispatch, filtros, page, rangoInvalido]);

  // Plan gratuito: al llegar al tope mensual no se permite el alta (el backend también lo valida).
  const limiteAlcanzado = Boolean(uso?.limite) && uso.usados >= uso.limite;

  // Primero se crea el movimiento; después, si hay archivo, se adjunta. Si falla solo el adjunto,
  // el movimiento ya existe: se avisa y no se vuelve a pedir el alta (evita duplicados).
  const crear = async (datos, archivo) => {
    setAviso(null);
    const creado = await dispatch(crearMovimiento(datos)).unwrap();
    if (archivo) {
      try {
        await dispatch(subirComprobante({ id: creado._id, archivo })).unwrap();
      } catch (e) {
        setAviso(`El movimiento se creó, pero no se pudo adjuntar el comprobante (${e}). Podés adjuntarlo desde su tarjeta.`);
      }
    }
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
            conComprobante
            bloqueado={limiteAlcanzado}
            mensajeBloqueo={`Alcanzaste el límite de ${uso?.limite} movimientos por mes del plan ${uso?.planNombre}. Cambiá de plan en la sección Planes para agregar más.`}
          />
        </section>
      )}

      {aviso && <p className="aviso" role="status">{aviso}</p>}

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
