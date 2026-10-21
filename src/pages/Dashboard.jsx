import { useSelector } from "react-redux";
import CambioPlan from "../components/CambioPlan";
import UsoPlan from "../components/UsoPlan";

const Dashboard = () => {
  const usuario = useSelector((s) => s.auth.usuario);
  return (
    <>
      <h1>Hola, {usuario?.nombreUsuario}</h1>
      <p className="suave">Resumen de tu cuenta.</p>
      <div className="grid-dos">
        <UsoPlan />
        <CambioPlan />
      </div>
    </>
  );
};
export default Dashboard;
