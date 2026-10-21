import { useDispatch, useSelector } from "react-redux";
import CategoriaFormulario from "../components/CategoriaFormulario";
import CategoriaItem from "../components/CategoriaItem";
import { crearCategoria } from "../store/categoriasSlice";

const Categorias = () => {
  const dispatch = useDispatch();
  const { items, cargando, error } = useSelector((s) => s.categorias);

  const crear = (datos) => dispatch(crearCategoria(datos)).unwrap();

  return (
    <>
      <h1>Categorías</h1>
      <section className="tarjeta">
        <h2>Nueva categoría</h2>
        <CategoriaFormulario onGuardar={crear} textoBoton="Agregar" />
      </section>

      {error && <p className="error" role="alert">{error}</p>}
      {cargando && items.length === 0 && <p className="suave">Cargando...</p>}
      {!cargando && !error && items.length === 0 && <p className="vacio">Todavía no hay categorías.</p>}

      <ul className="lista">
        {items.map((c) => <CategoriaItem key={c._id} categoria={c} />)}
      </ul>
    </>
  );
};

export default Categorias;
