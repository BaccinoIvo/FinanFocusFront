import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { descargar } from "../api/api";
import MovimientoFormulario from "../components/MovimientoFormulario";
import Paginacion from "../components/Paginacion";
import {
  cargarClientes, cargarMovimientosCliente, crearMovimientoCliente, eliminarMovimientoCliente, limpiarDetalle,
} from "../store/estudioSlice";
import { fechaCorta, formatoMonto, nombreVisible } from "../utils/formato";
import { valoresVacios } from "../utils/movimientoValores";

// Movimientos de un cliente. En un perfil sombra el estudio puede cargar y borrar; en uno real solo ver y exportar.
const ClienteDetalle = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { clientes, movsCliente, movsPaginacion, cargandoMovs, errorMovs } = useSelector((s) => s.estudio);
  const cliente = clientes.find((c) => c._id === id);
  const [alta, setAlta] = useState(false);
  const [aviso, setAviso] = useState(null);
  const [errorExport, setErrorExport] = useState(null);
  const [exportando, setExportando] = useState(null);
  const [borrando, setBorrando] = useState(null);

  useEffect(() => {
    dispatch(cargarMovimientosCliente({ id }));
    return () => { dispatch(limpiarDetalle()); };
  }, [dispatch, id]);

  // La lista de clientes da el nombre y si es perfil sombra (también si se entra directo por la URL).
  useEffect(() => { dispatch(cargarClientes(1)); }, [dispatch]);

  const crear = async (datos, archivo) => {
    setAviso(null);
    const r = await dispatch(crearMovimientoCliente({ id, datos, archivo })).unwrap();
    if (r.avisoAdjunto) setAviso(r.avisoAdjunto);
    dispatch(cargarClientes(1));
    setAlta(false);
  };

  const exportar = async (formato) => {
    setErrorExport(null);
    setExportando(formato);
    try {
      await descargar(`/estudio/usuarios/${id}/exportar?formato=${formato}`, formato === "zeta" ? "Exportacion_ZetaSoftware.csv" : "Exportacion_MemoryConty.txt");
    } catch (e) {
      setErrorExport(e.message);
    } finally {
      setExportando(null);
    }
  };

  const esSombra = cliente?.esPerfilSombra;

  return (
    <>
      <p className="suave"><Link to="/clientes">← Clientes</Link></p>
      <div className="encabezado">
        <h1>{cliente ? nombreVisible(cliente) : "Cliente"}</h1>
        <div className="acciones">
          {esSombra && <button className="btn" onClick={() => setAlta((v) => !v)}>{alta ? "Cerrar" : "Nuevo movimiento"}</button>}
          <button className="btn btn-sec" onClick={() => exportar("zeta")} disabled={exportando !== null}>{exportando === "zeta" ? "Exportando..." : "Exportar a Zeta (CSV)"}</button>
          <button className="btn btn-sec" onClick={() => exportar("memory")} disabled={exportando !== null}>{exportando === "memory" ? "Exportando..." : "Exportar a Memory (TXT)"}</button>
        </div>
      </div>
      {esSombra && <p className="suave">Perfil sombra: cargás los movimientos y comprobantes en nombre de tu cliente.</p>}
      {errorExport && <p className="error" role="alert">{errorExport}</p>}
      {aviso && <p className="aviso" role="status">{aviso}</p>}

      {alta && esSombra && (
        <section className="tarjeta">
          <h2>Nuevo movimiento</h2>
          <MovimientoFormulario valoresIniciales={valoresVacios()} onGuardar={crear} textoBoton="Agregar movimiento" conComprobante />
        </section>
      )}

      {errorMovs && <p className="error" role="alert">{errorMovs}</p>}
      {cargandoMovs && movsCliente.length === 0 && <p className="suave">Cargando...</p>}
      {!cargandoMovs && !errorMovs && movsCliente.length === 0 && <p className="vacio">Este cliente todavía no tiene movimientos.</p>}

      <ul className="lista">
        {movsCliente.map((m) => {
          const esIngreso = m.tipo === "ingreso";
          return (
            <li key={m._id} className="mov">
              <div className="mov-fila">
                <div className="mov-info">
                  <span className={`tag ${esIngreso ? "tag-ingreso" : "tag-egreso"}`}>{esIngreso ? "Ingreso" : "Egreso"}</span>
                  <strong>{m.categoria?.nombre ?? "Sin categoría"}</strong>
                  <span className="suave">{fechaCorta(m.fecha)}</span>
                </div>
                <div className="mov-monto">
                  <span className={esIngreso ? "ingreso" : "egreso"}>{esIngreso ? "+" : "−"} {formatoMonto(m.monto)} {m.moneda}</span>
                  {m.moneda !== "UYU" && <small className="suave">{m.montoConvertidoUYU != null ? `≈ $ ${formatoMonto(m.montoConvertidoUYU)} UYU` : "Cotización no disponible"}</small>}
                </div>
              </div>
              {m.descripcion && <p className="mov-desc">{m.descripcion}</p>}
              <p className="comprobantes">
                {m.comprobantes?.length > 0
                  ? m.comprobantes.map((url, i) => <a key={url} href={url} target="_blank" rel="noreferrer">Comprobante {i + 1}</a>)
                  : <span className="tag tag-egreso">Sin comprobante</span>}
              </p>
              {esSombra && (
                <div className="acciones">
                  {borrando === m._id ? (
                    <>
                      <span className="suave">¿Eliminar este movimiento?</span>
                      <button className="btn btn-peligro" onClick={async () => { await dispatch(eliminarMovimientoCliente({ id, movId: m._id, page: movsPaginacion.page })); setBorrando(null); }}>Sí, eliminar</button>
                      <button className="btn btn-sec" onClick={() => setBorrando(null)}>No</button>
                    </>
                  ) : (
                    <button className="btn btn-sec btn-borrar" onClick={() => setBorrando(m._id)}>Eliminar</button>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <Paginacion page={movsPaginacion.page} totalPaginas={movsPaginacion.totalPaginas} onCambiar={(p) => dispatch(cargarMovimientosCliente({ id, page: p }))} />
    </>
  );
};

export default ClienteDetalle;
