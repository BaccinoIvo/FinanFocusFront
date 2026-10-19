import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";

const Layout = () => {
  const usuario = useSelector((s) => s.auth.usuario);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cerrarSesion = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <div className="app">
      <header className="navbar">
        <span className="marca">Finan<b>Focus</b></span>
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
