import { useState } from "react";
import { useForm } from "react-hook-form";

// Alta y edición de categorías. onGuardar devuelve una promesa; si rechaza se muestra el error.
const CategoriaFormulario = ({ valoresIniciales = { nombre: "", tipo: "egreso" }, onGuardar, onCancelar, textoBoton }) => {
  const [errorApi, setErrorApi] = useState(null);
  const { register, handleSubmit, reset, formState: { errors, isValid, isSubmitting } } = useForm({
    mode: "onChange",
    defaultValues: valoresIniciales,
  });

  const enviar = async (d) => {
    setErrorApi(null);
    try {
      await onGuardar({ nombre: d.nombre.trim(), tipo: d.tipo });
      if (!onCancelar) reset({ nombre: "", tipo: d.tipo });
    } catch (e) {
      setErrorApi(e.message ?? String(e));
    }
  };

  return (
    <form className="form-cat" onSubmit={handleSubmit(enviar)} noValidate>
      <div className="fila-form">
        <div className="crece">
          <label>Nombre</label>
          <input maxLength={40}
            {...register("nombre", {
              required: "El nombre es obligatorio",
              validate: (v) => v.trim().length >= 2 || "Mínimo 2 caracteres",
              maxLength: { value: 40, message: "Máximo 40 caracteres" },
            })} />
          {errors.nombre && <small className="error">{errors.nombre.message}</small>}
        </div>
        <div>
          <label>Tipo</label>
          <select {...register("tipo", { required: true })}>
            <option value="egreso">Egreso</option>
            <option value="ingreso">Ingreso</option>
          </select>
        </div>
        <div className="acciones">
          <button className="btn" type="submit" disabled={!isValid || isSubmitting}>
            {isSubmitting ? "Guardando..." : textoBoton}
          </button>
          {onCancelar && <button className="btn btn-sec" type="button" onClick={onCancelar}>Cancelar</button>}
        </div>
      </div>
      {errorApi && <p className="error" role="alert">{errorApi}</p>}
    </form>
  );
};

export default CategoriaFormulario;
