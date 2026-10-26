import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

// Restringe un grupo de rutas a un tipo de cuenta ("usuario" o "estudio"); el resto va al inicio.
const RutaTipo = ({ tipo }) => {
  const actual = useSelector((s) => s.auth.usuario?.tipo);
  return actual === tipo ? <Outlet /> : <Navigate to="/" replace />;
};
export default RutaTipo;
