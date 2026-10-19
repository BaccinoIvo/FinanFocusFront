import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

// Sin sesión no se puede entrar a las rutas hijas.
const RutaPrivada = () => {
  const token = useSelector((s) => s.auth.token);
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};
export default RutaPrivada;
