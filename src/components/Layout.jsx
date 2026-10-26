import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { logout } from "../store/authSlice";
import { cargarCategorias } from "../store/categoriasSlice";
import { cargarUso } from "../store/usoSlice";
import { nombrePlan } from "../utils/planes";

const clase = ({ isActive }) => (isActive ? "enlace activo" : "enlace");

const Layout = () => {
  const usuario = useSelector((s) => s.auth.usuario);
  const esEstudio = usuario?.tipo === "estudio";
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
      <a href="#contenido" className="saltar">Saltar al contenido</a>
      <header className="navbar">
        <Link to="/" className="marca" aria-label="FinanFocus, inicio"><Logo /></Link>
        <nav className="nav-links">
          <NavLink to="/" end className={clase}>Inicio</NavLink>
          {esEstudio
            ? <NavLink to="/clientes" className={clase}>Clientes</NavLink>
            : <NavLink to="/movimientos" className={clase}>Movimientos</NavLink>}
          <NavLink to="/categorias" className={clase}>Categorías</NavLink>
          <NavLink to="/planes" className={clase}>Planes</NavLink>
        </nav>
        <div className="navbar-der">
          <span className="chip">{nombrePlan(usuario?.plan)}</span>
          <NavLink to="/perfil" className="usuario enlace-usuario" title="Mi perfil">{usuario?.nombreUsuario}</NavLink>
          <button className="btn btn-sec" onClick={cerrarSesion}>Cerrar sesión</button>
        </div>
      </header>
      <main id="contenido" className="contenido" tabIndex={-1}>
        <Outlet />
      </main>
    </div>
  );
};
export default Layout;
