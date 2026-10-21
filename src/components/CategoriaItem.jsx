import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actualizarCategoria, eliminarCategoria } from "../store/categoriasSlice";
import CategoriaFormulario from "./CategoriaFormulario";

const CategoriaItem = ({ categoria: c }) => {
  const dispatch = useDispatch();
  const usuario = useSelector((s) => s.auth.usuario);
  const [editando, setEditando] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const [error, setError] = useState(null);

  // Las del sistema solo las toca el admin; las propias, su dueño (misma regla que el backend).
  const puedeModificar = c.esDelSistema ? usuario?.tipo === "admin" : c.createdBy === usuario?.id;

  const guardar = async (datos) => {
    await dispatch(actualizarCategoria({ id: c._id, datos })).unwrap();
    setEditando(false);
  };

  const borrar = async () => {
    setError(null);
    try {
      await dispatch(eliminarCategoria(c._id)).unwrap();
    } catch (e) {
      setError(e); // por ejemplo: "No se puede eliminar: la categoría tiene 3 movimiento(s)"
      setConfirmando(false);
    }
  };

  if (editando) {
    return (
      <li className="cat editando">
        <CategoriaFormulario
          valoresIniciales={{ nombre: c.nombre, tipo: c.tipo }}
          onGuardar={guardar}
          onCancelar={() => setEditando(false)}
          textoBoton="Guardar"
        />
      </li>
    );
  }

  return (
    <li className="cat">
      <div className="cat-fila">
        <div className="mov-info">
          <span className={`tag ${c.tipo === "ingreso" ? "tag-ingreso" : "tag-egreso"}`}>
            {c.tipo === "ingreso" ? "Ingreso" : "Egreso"}
          </span>
          <strong>{c.nombre}</strong>
          {c.esDelSistema && <span className="tag tag-neutro">Del sistema</span>}
        </div>
        {puedeModificar && (
          <div className="acciones">
            <button className="btn btn-sec" onClick={() => setEditando(true)}>Editar</button>
            {confirmando ? (
              <>
                <button className="btn btn-peligro" onClick={borrar}>Confirmar</button>
                <button className="btn btn-sec" onClick={() => setConfirmando(false)}>No</button>
              </>
            ) : (
              <button className="btn btn-sec btn-borrar" onClick={() => setConfirmando(true)}>Eliminar</button>
            )}
          </div>
        )}
      </div>
      {error && <p className="error" role="alert">{error}</p>}
    </li>
  );
};

export default CategoriaItem;
