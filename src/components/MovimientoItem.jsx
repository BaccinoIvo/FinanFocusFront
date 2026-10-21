import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { actualizarMovimiento, eliminarMovimiento, subirComprobante } from "../store/movimientosSlice";
import { MAX_ARCHIVO_MB, TIPOS_ARCHIVO } from "../utils/constantes";
import { fechaCorta, formatoMonto } from "../utils/formato";
import { valoresDesdeMovimiento } from "../utils/movimientoValores";
import MovimientoFormulario from "./MovimientoFormulario";

const MovimientoItem = ({ movimiento: m }) => {
  const dispatch = useDispatch();
  const [editando, setEditando] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState(null);
  const inputArchivo = useRef(null);

  const guardar = async (datos) => {
    await dispatch(actualizarMovimiento({ id: m._id, datos })).unwrap();
    setEditando(false);
  };

  const borrar = async () => {
    setError(null);
    try {
      await dispatch(eliminarMovimiento(m._id)).unwrap();
    } catch (e) {
      setError(e);
      setConfirmando(false);
    }
  };

  const adjuntar = async (e) => {
    const archivo = e.target.files?.[0];
    e.target.value = ""; // permite volver a elegir el mismo archivo
    if (!archivo) return;
    setError(null);
    // Validación en el frontend para no mandar al servidor lo que va a rechazar.
    if (!TIPOS_ARCHIVO.includes(archivo.type)) {
      setError("Formato no permitido. Usá JPG, PNG, WEBP o PDF.");
      return;
    }
    if (archivo.size > MAX_ARCHIVO_MB * 1024 * 1024) {
      setError(`El archivo supera los ${MAX_ARCHIVO_MB} MB.`);
      return;
    }
    setSubiendo(true);
    try {
      await dispatch(subirComprobante({ id: m._id, archivo })).unwrap();
    } catch (err) {
      setError(err);
    } finally {
      setSubiendo(false);
    }
  };

  if (editando) {
    return (
      <li className="mov editando">
        <MovimientoFormulario
          valoresIniciales={valoresDesdeMovimiento(m)}
          onGuardar={guardar}
          onCancelar={() => setEditando(false)}
          textoBoton="Guardar cambios"
        />
      </li>
    );
  }

  const esIngreso = m.tipo === "ingreso";
  return (
    <li className="mov">
      <div className="mov-fila">
        <div className="mov-info">
          <span className={`tag ${esIngreso ? "tag-ingreso" : "tag-egreso"}`}>{esIngreso ? "Ingreso" : "Egreso"}</span>
          <strong>{m.categoria?.nombre ?? "Sin categoría"}</strong>
          <span className="suave">{fechaCorta(m.fecha)}</span>
        </div>
        <div className="mov-monto">
          <span className={esIngreso ? "ingreso" : "egreso"}>
            {esIngreso ? "+" : "−"} {formatoMonto(m.monto)} {m.moneda}
          </span>
          {m.moneda !== "UYU" && (
            <small className="suave">
              {m.montoConvertidoUYU != null ? `≈ $ ${formatoMonto(m.montoConvertidoUYU)} UYU` : "Cotización no disponible"}
            </small>
          )}
        </div>
      </div>

      {m.descripcion && <p className="mov-desc">{m.descripcion}</p>}
      {m.esExportacionServicio && <span className="tag tag-neutro">Exportación de servicios</span>}

      {m.comprobantes?.length > 0 && (
        <p className="comprobantes">
          {m.comprobantes.map((url, i) => (
            <a key={url} href={url} target="_blank" rel="noreferrer">Comprobante {i + 1}</a>
          ))}
        </p>
      )}

      {error && <p className="error" role="alert">{error}</p>}

      <div className="acciones">
        <button className="btn btn-sec" onClick={() => setEditando(true)}>Editar</button>
        <button className="btn btn-sec" onClick={() => inputArchivo.current?.click()} disabled={subiendo}>
          {subiendo ? "Subiendo..." : "Adjuntar comprobante"}
        </button>
        <input ref={inputArchivo} type="file" hidden accept={TIPOS_ARCHIVO.join(",")} onChange={adjuntar} />
        {confirmando ? (
          <>
            <span className="suave">¿Eliminar este movimiento?</span>
            <button className="btn btn-peligro" onClick={borrar}>Sí, eliminar</button>
            <button className="btn btn-sec" onClick={() => setConfirmando(false)}>No</button>
          </>
        ) : (
          <button className="btn btn-sec btn-borrar" onClick={() => setConfirmando(true)}>Eliminar</button>
        )}
      </div>
    </li>
  );
};

export default MovimientoItem;
