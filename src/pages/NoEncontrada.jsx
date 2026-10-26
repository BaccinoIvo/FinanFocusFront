import { Link } from "react-router-dom";
import Logo from "../components/Logo";

const NoEncontrada = () => (
  <div className="auth-fondo">
    <div className="tarjeta auth-tarjeta">
      <h1 className="marca grande"><Link to="/" aria-label="FinanFocus, inicio"><Logo grande /></Link></h1>
      <p className="numero-grande centro">404</p>
      <p className="suave">No encontramos esa página. Puede que el enlace esté mal escrito o que ya no exista.</p>
      <Link className="btn enlace-btn" to="/">Volver al inicio</Link>
    </div>
  </div>
);

export default NoEncontrada;
