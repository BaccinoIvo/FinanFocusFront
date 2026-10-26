import { useEffect, useId, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useSelector } from "react-redux";
import { extraerComprobante } from "../api/comprobantes";
import ComprobanteEscaner from "./ComprobanteEscaner";
import { comprimirImagen } from "../utils/imagen";
import { leerQrDeArchivo } from "../utils/qrCfe";
import { MAX_ARCHIVO_MB, MONEDAS, TIPOS_ARCHIVO, TIPOS_LEIBLES_IA } from "../utils/constantes";
import { valoresVacios } from "../utils/movimientoValores";

/**
 * Formulario reutilizado para el alta y para la edición en línea.
 * onGuardar recibe (payload, archivo) y devuelve una promesa: si rechaza, el mensaje
 * se muestra en el propio formulario. Con conComprobante (el alta) se puede elegir una
 * foto/PDF, leerlo con IA para autocompletar, y adjuntarlo al guardar.
 */
const FECHA_ISO = /^\d{4}-\d{2}-\d{2}$/;

const MovimientoFormulario = ({ valoresIniciales, onGuardar, onCancelar, textoBoton, bloqueado = false, mensajeBloqueo, conComprobante = false }) => {
  const categorias = useSelector((s) => s.categorias.items);
  const uid = useId();
  const id = (campo) => `${uid}-${campo}`;
  const [errorApi, setErrorApi] = useState(null);
  const [archivo, setArchivo] = useState(null);
  const [errorArchivo, setErrorArchivo] = useState(null);
  const [leyendo, setLeyendo] = useState(false);
  const [segundos, setSegundos] = useState(0); // tiempo que lleva la lectura con IA
  const [avisoIA, setAvisoIA] = useState(null); // { tipo: "ok" | "manual", texto }
  const [opcionalesAbierto, setOpcionalesAbierto] = useState(false);
  const [camposIA, setCamposIA] = useState([]); // campos que completó la IA y el usuario todavía no tocó
  const inputArchivo = useRef(null);
  const { register, handleSubmit, control, getValues, setValue, reset, formState: { errors, isValid, isSubmitting } } = useForm({
    mode: "onChange",
    defaultValues: valoresIniciales,
  });

  const tipo = useWatch({ control, name: "tipo" });
  const categoriasDelTipo = categorias.filter((c) => c.tipo === tipo);

  // Si se cambia el tipo y la categoría elegida ya no corresponde, se limpia.
  useEffect(() => {
    const actual = getValues("categoria");
    if (actual && categorias.length > 0 && !categoriasDelTipo.some((c) => c._id === actual)) {
      setValue("categoria", "", { shouldValidate: true });
    }
  }, [tipo]); // eslint-disable-line react-hooks/exhaustive-deps

  const elegirArchivo = (e) => {
    const elegido = e.target.files?.[0];
    e.target.value = ""; // permite volver a elegir el mismo archivo
    if (!elegido) return;
    setAvisoIA(null);
    // Validación en el frontend: no se manda al servidor lo que va a rechazar.
    if (!TIPOS_ARCHIVO.includes(elegido.type)) {
      setErrorArchivo("Formato no permitido. Usá JPG, PNG, WEBP, PDF o Word.");
      return;
    }
    if (elegido.size > MAX_ARCHIVO_MB * 1024 * 1024) {
      setErrorArchivo(`El archivo supera los ${MAX_ARCHIVO_MB} MB.`);
      return;
    }
    setErrorArchivo(null);
    setArchivo(elegido);
  };

  const quitarArchivo = () => { setArchivo(null); setErrorArchivo(null); setAvisoIA(null); setCamposIA([]); };

  // Si la persona modifica un campo marcado por la IA, deja de resaltarse: ya lo revisó.
  const tocado = (campo) => () => setCamposIA((c) => (c.includes(campo) ? c.filter((x) => x !== campo) : c));
  const claseIA = (campo) => (camposIA.includes(campo) ? "campo-ia" : undefined);

  // Completa el formulario con lo que la IA pudo leer. Lo que no leyó, queda como estaba.
  const aplicarDatos = (datos) => {
    const opciones = { shouldValidate: true, shouldDirty: true };
    const completados = [];
    const poner = (campo, valor) => { setValue(campo, valor, opciones); completados.push(campo); };
    if (datos.tipo === "ingreso" || datos.tipo === "egreso") poner("tipo", datos.tipo);
    if (typeof datos.monto === "number") poner("monto", String(datos.monto));
    if (MONEDAS.includes(datos.moneda)) poner("moneda", datos.moneda);
    if (FECHA_ISO.test(datos.fecha ?? "")) poner("fecha", datos.fecha);
    if (datos.numeroComprobante) poner("numeroComprobante", String(datos.numeroComprobante));
    if (datos.rutEmisor) poner("rutEmisor", String(datos.rutEmisor));
    if (typeof datos.montoIva === "number") poner("montoIva", String(datos.montoIva));
    if (datos.tipoCfe) poner("tipoCfe", String(datos.tipoCfe));
    if (datos.numeroComprobante || datos.rutEmisor || datos.tipoCfe || typeof datos.montoIva === "number") setOpcionalesAbierto(true);
    setCamposIA(completados);
    return completados.length;
  };

  const leerConIA = async () => {
    setLeyendo(true);
    setAvisoIA(null);
    setErrorArchivo(null);
    setSegundos(0);
    const reloj = setInterval(() => setSegundos((n) => n + 1), 1000);
    try {
      // El QR de la DGI se lee en el navegador, en paralelo con la IA: es más confiable que leer el texto
      // y sirve de respaldo si el servicio de IA está ocupado.
      const [lecturaIA, lecturaQr] = await Promise.allSettled([extraerComprobante(await comprimirImagen(archivo)), leerQrDeArchivo(archivo)]);
      const r = lecturaIA.status === "fulfilled" ? lecturaIA.value : null;
      const qr = lecturaQr.status === "fulfilled" ? lecturaQr.value : null;
      if (!r && !qr) throw lecturaIA.reason;

      const datos = r?.ai_processed && r.datosExtraidos ? { ...r.datosExtraidos } : {};
      let avisoMonto = "";
      if (qr) {
        // Lo que dice el QR de la DGI manda sobre lo que lee la IA.
        datos.rutEmisor = qr.rut;
        if (qr.serie) datos.numeroComprobante = `${qr.serie}${qr.numero}`;
        if (qr.fecha) datos.fecha = qr.fecha;
        if (typeof datos.monto === "number" && datos.moneda === "UYU" && qr.monto != null && Math.abs(datos.monto - qr.monto) > 1) {
          avisoMonto = ` Ojo: el QR indica un total de ${qr.monto} y la IA leyó ${datos.monto}; verificá el monto.`;
        }
      }
      const cantidad = aplicarDatos(datos);
      const origen = qr ? "la IA y el código QR de la DGI" : "la IA";
      if (cantidad > 0) {
        setAvisoIA({
          tipo: avisoMonto ? "manual" : "ok",
          texto: `${qr && !r?.ai_processed ? "Leímos el código QR de la DGI" : `Se completaron ${cantidad} ${cantidad === 1 ? "campo" : "campos"} con ${origen}`}${qr && !r?.ai_processed ? ` (${cantidad} ${cantidad === 1 ? "campo" : "campos"}); el monto y la categoría van a mano` : ""} (resaltados en verde). Revisalos y elegí la categoría antes de guardar.${avisoMonto}`,
        });
      } else if (r?.ai_processed) {
        setAvisoIA({ tipo: "manual", texto: "La IA no encontró datos legibles en el comprobante. Completá los datos a mano." });
      } else {
        setAvisoIA({ tipo: "manual", texto: "No pudimos leer el comprobante automáticamente (el servicio de IA puede estar ocupado). Probá de nuevo en unos segundos o completá los datos a mano." });
      }
    } catch (e) {
      setErrorArchivo(e.message);
    } finally {
      clearInterval(reloj);
      setLeyendo(false);
    }
  };

  const enviar = async (d) => {
    setErrorApi(null);
    const payload = {
      categoria: d.categoria,
      tipo: d.tipo,
      monto: Number(d.monto),
      moneda: d.moneda,
      fecha: d.fecha,
      descripcion: d.descripcion.trim(),
      esExportacionServicio: d.tipo === "ingreso" ? !!d.esExportacionServicio : false,
      numeroComprobante: d.numeroComprobante.trim(),
      rutEmisor: d.rutEmisor.trim(),
      tipoCfe: d.tipoCfe.trim(),
      montoIva: d.montoIva === "" ? null : Number(d.montoIva),
    };
    try {
      await onGuardar(payload, archivo);
      if (!onCancelar) { // en el alta se limpia todo; en la edición el padre cierra
        reset(valoresVacios());
        quitarArchivo();
        setOpcionalesAbierto(false);
      }
    } catch (e) {
      setErrorApi(e.message ?? String(e));
    }
  };

  return (
    <form className="form-mov" onSubmit={handleSubmit(enviar)} noValidate>
      {conComprobante && (
        <div className="comprobante-alta">
          <span className="etiqueta-comprobante">Comprobante (foto, PDF o Word · opcional)</span>
          <div className="acciones">
            <button type="button" className="btn btn-sec" onClick={() => inputArchivo.current?.click()} disabled={leyendo}>
              {archivo ? "Cambiar archivo" : "Elegir archivo"}
            </button>
            <input ref={inputArchivo} type="file" hidden accept={TIPOS_ARCHIVO.join(",")} onChange={elegirArchivo} />
            {archivo && (
              <>
                <span className="nombre-archivo">{archivo.name} <span className="suave">· {(archivo.size / 1024 / 1024).toFixed(2)} MB</span></span>
                <button type="button" className="btn btn-sec" onClick={quitarArchivo} disabled={leyendo}>Quitar</button>
                {TIPOS_LEIBLES_IA.includes(archivo.type) && (
                  <button type="button" className="btn" onClick={leerConIA} disabled={leyendo}>
                    {leyendo ? `Leyendo comprobante... ${segundos} s` : "Autocompletar con IA"}
                  </button>
                )}
              </>
            )}
          </div>
          {archivo && !TIPOS_LEIBLES_IA.includes(archivo.type) && (
            <small className="suave">Los documentos Word se adjuntan, pero no se leen automáticamente.</small>
          )}
          {archivo && <ComprobanteEscaner archivo={archivo} leyendo={leyendo} segundos={segundos} />}
          {errorArchivo && <p className="error" role="alert">{errorArchivo}</p>}
          {avisoIA && <p className={avisoIA.tipo === "ok" ? "exito" : "aviso"}>{avisoIA.texto}</p>}
        </div>
      )}

      <div className="grid-form">
        <div>
          <label htmlFor={id("tipo")}>Tipo</label>
          <select id={id("tipo")} className={claseIA("tipo")} {...register("tipo", { required: true, onChange: tocado("tipo") })}>
            <option value="egreso">Egreso</option>
            <option value="ingreso">Ingreso</option>
          </select>
        </div>

        <div>
          <label htmlFor={id("categoria")}>Categoría</label>
          <select id={id("categoria")} {...register("categoria", { required: "Elegí una categoría" })}>
            <option value="">Seleccionar...</option>
            {categoriasDelTipo.map((c) => <option key={c._id} value={c._id}>{c.nombre}</option>)}
          </select>
          {errors.categoria && <small className="error">{errors.categoria.message}</small>}
        </div>

        <div>
          <label htmlFor={id("monto")}>Monto</label>
          <input id={id("monto")} type="number" step="0.01" inputMode="decimal" className={claseIA("monto")}
            {...register("monto", {
              onChange: tocado("monto"),
              required: "El monto es obligatorio",
              validate: (v) => Number(v) > 0 || "El monto debe ser mayor a 0",
            })} />
          {errors.monto && <small className="error">{errors.monto.message}</small>}
        </div>

        <div>
          <label htmlFor={id("moneda")}>Moneda</label>
          <select id={id("moneda")} className={claseIA("moneda")} {...register("moneda", { required: true, onChange: tocado("moneda") })}>
            {MONEDAS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor={id("fecha")}>Fecha</label>
          <input id={id("fecha")} type="date" className={claseIA("fecha")} {...register("fecha", { required: "La fecha es obligatoria", onChange: tocado("fecha") })} />
          {errors.fecha && <small className="error">{errors.fecha.message}</small>}
        </div>

        <div className="col-completa">
          <label htmlFor={id("descripcion")}>Descripción (opcional)</label>
          <input id={id("descripcion")} maxLength={200} {...register("descripcion", { maxLength: { value: 200, message: "Máximo 200 caracteres" } })} />
          {errors.descripcion && <small className="error">{errors.descripcion.message}</small>}
        </div>
      </div>

      {tipo === "ingreso" && (
        <label className="check">
          <input type="checkbox" {...register("esExportacionServicio")} />
          Exportación de servicios (IVA exento)
        </label>
      )}

      <details className="opcionales" open={opcionalesAbierto} onToggle={(e) => setOpcionalesAbierto(e.currentTarget.open)}>
        <summary>Datos del comprobante (opcional)</summary>
        <div className="grid-form">
          <div>
            <label htmlFor={id("numeroComprobante")}>N.º de comprobante</label>
            <input id={id("numeroComprobante")} className={claseIA("numeroComprobante")} {...register("numeroComprobante", { maxLength: { value: 50, message: "Máximo 50 caracteres" }, onChange: tocado("numeroComprobante") })} />
            {errors.numeroComprobante && <small className="error">{errors.numeroComprobante.message}</small>}
          </div>
          <div>
            <label htmlFor={id("tipoCfe")}>Tipo de comprobante (CFE)</label>
            <input id={id("tipoCfe")} className={claseIA("tipoCfe")} placeholder="e-Ticket, e-Factura..." {...register("tipoCfe", { maxLength: { value: 60, message: "Máximo 60 caracteres" }, onChange: tocado("tipoCfe") })} />
            {errors.tipoCfe && <small className="error">{errors.tipoCfe.message}</small>}
          </div>
          <div>
            <label htmlFor={id("rutEmisor")}>RUT del emisor</label>
            <input id={id("rutEmisor")} className={claseIA("rutEmisor")} {...register("rutEmisor", { maxLength: { value: 20, message: "Máximo 20 caracteres" }, onChange: tocado("rutEmisor") })} />
            {errors.rutEmisor && <small className="error">{errors.rutEmisor.message}</small>}
          </div>
          <div>
            <label htmlFor={id("montoIva")}>IVA</label>
            <input id={id("montoIva")} type="number" step="0.01" inputMode="decimal" className={claseIA("montoIva")}
              {...register("montoIva", { onChange: tocado("montoIva"), validate: (v) => v === "" || Number(v) >= 0 || "El IVA no puede ser negativo" })} />
            {errors.montoIva && <small className="error">{errors.montoIva.message}</small>}
          </div>
        </div>
      </details>

      {bloqueado && mensajeBloqueo && <p className="aviso">{mensajeBloqueo}</p>}
      {errorApi && <p className="error" role="alert">{errorApi}</p>}

      <div className="acciones">
        <button className="btn" type="submit" disabled={!isValid || isSubmitting || bloqueado}>
          {isSubmitting ? "Guardando..." : textoBoton}
        </button>
        {onCancelar && <button className="btn btn-sec" type="button" onClick={onCancelar}>Cancelar</button>}
      </div>
    </form>
  );
};

export default MovimientoFormulario;
