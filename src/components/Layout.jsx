import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";
import { cargarCategorias } from "../store/categoriasSlice";
import { cargarUso } from "../store/usoSlice";

const clase = ({ isActive }) => (isActive ? "enlace activo" : "enlace");

const Layout = () => {
  const usuario = useSelector((s) => s.auth.usuario);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Datos que usan varias secciones: se cargan una sola vez al entrar.
  useEffect(() => {
    dispatch(cargarCategorias());
    dispatch(cargarUso());
  }, [dispatch]);

  const cerrarSesion = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <div className="app">
      <header className="navbar">
        <span className="marca">Finan<b>Focus</b></span>
        <nav className="nav-links">
          <NavLink to="/" end className={clase}>Inicio</NavLink>
          <NavLink to="/movimientos" className={clase}>Movimientos</NavLink>
          <NavLink to="/categorias" className={clase}>Categorías</NavLink>
        </nav>
        <div className="navbar-der">
          <span className="chip">{usuario?.plan}</span>
          <span className="usuario">{usuario?.nombreUsuario}</span>
          <button className="btn btn-sec" onClick={cerrarSesion}>Cerrar sesión</button>
        </div>
      </header>
      <main className="contenido">
        <Outlet />
      </main>
    </div>
  );
};
export default Layout;
