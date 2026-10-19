import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

// Con sesión iniciada, login y registro redirigen a la app.
const RutaPublica = () => {
  const token = useSelector((s) => s.auth.token);
  return token ? <Navigate to="/" replace /> : <Outlet />;
};
export default RutaPublica;
