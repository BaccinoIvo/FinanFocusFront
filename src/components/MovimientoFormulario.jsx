import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useSelector } from "react-redux";
import { MONEDAS } from "../utils/constantes";
import { valoresVacios } from "../utils/movimientoValores";

/**
 * Formulario reutilizado para el alta y para la edición en línea.
 * onGuardar recibe el payload listo para la API y devuelve una promesa:
 * si rechaza, el mensaje se muestra en el propio formulario.
 */
const MovimientoFormulario = ({ valoresIniciales, onGuardar, onCancelar, textoBoton, bloqueado = false, mensajeBloqueo }) => {
  const categorias = useSelector((s) => s.categorias.items);
  const [errorApi, setErrorApi] = useState(null);
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
      montoIva: d.montoIva === "" ? null : Number(d.montoIva),
    };
    try {
      await onGuardar(payload);
      if (!onCancelar) reset(valoresVacios()); // en el alta se limpia; en la edición el padre cierra
    } catch (e) {
      setErrorApi(e.message ?? String(e));
    }
  };

  return (
    <form className="form-mov" onSubmit={handleSubmit(enviar)} noValidate>
      <div className="grid-form">
        <div>
          <label>Tipo</label>
          <select {...register("tipo", { required: true })}>
            <option value="egreso">Egreso</option>
            <option value="ingreso">Ingreso</option>
          </select>
        </div>

        <div>
          <label>Categoría</label>
          <select {...register("categoria", { required: "Elegí una categoría" })}>
            <option value="">Seleccionar...</option>
            {categoriasDelTipo.map((c) => <option key={c._id} value={c._id}>{c.nombre}</option>)}
          </select>
          {errors.categoria && <small className="error">{errors.categoria.message}</small>}
        </div>

        <div>
          <label>Monto</label>
          <input type="number" step="0.01" inputMode="decimal"
            {...register("monto", {
              required: "El monto es obligatorio",
              validate: (v) => Number(v) > 0 || "El monto debe ser mayor a 0",
            })} />
          {errors.monto && <small className="error">{errors.monto.message}</small>}
        </div>

        <div>
          <label>Moneda</label>
          <select {...register("moneda", { required: true })}>
            {MONEDAS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        <div>
          <label>Fecha</label>
          <input type="date" {...register("fecha", { required: "La fecha es obligatoria" })} />
          {errors.fecha && <small className="error">{errors.fecha.message}</small>}
        </div>

        <div className="col-completa">
          <label>Descripción (opcional)</label>
          <input maxLength={200} {...register("descripcion", { maxLength: { value: 200, message: "Máximo 200 caracteres" } })} />
          {errors.descripcion && <small className="error">{errors.descripcion.message}</small>}
        </div>
      </div>

      {tipo === "ingreso" && (
        <label className="check">
          <input type="checkbox" {...register("esExportacionServicio")} />
          Exportación de servicios (IVA exento)
        </label>
      )}

      <details className="opcionales">
        <summary>Datos del comprobante (opcional)</summary>
        <div className="grid-form">
          <div>
            <label>N.º de comprobante</label>
            <input {...register("numeroComprobante", { maxLength: { value: 50, message: "Máximo 50 caracteres" } })} />
            {errors.numeroComprobante && <small className="error">{errors.numeroComprobante.message}</small>}
          </div>
          <div>
            <label>RUT del emisor</label>
            <input {...register("rutEmisor", { maxLength: { value: 20, message: "Máximo 20 caracteres" } })} />
            {errors.rutEmisor && <small className="error">{errors.rutEmisor.message}</small>}
          </div>
          <div>
            <label>IVA</label>
            <input type="number" step="0.01" inputMode="decimal"
              {...register("montoIva", { validate: (v) => v === "" || Number(v) >= 0 || "El IVA no puede ser negativo" })} />
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
