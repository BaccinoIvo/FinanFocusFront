import { lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CambioPlan from "../components/CambioPlan";
import Cotizaciones from "../components/Cotizaciones";
import ResumenFiscal from "../components/ResumenFiscal";
import UsoPlan from "../components/UsoPlan";
import { leerInvitacion } from "../utils/invitacion";

// Recharts es pesado: se descarga recién cuando se abre el inicio.
const Estadisticas = lazy(() => import("../components/Estadisticas"));

const Dashboard = () => {
  const usuario = useSelector((s) => s.auth.usuario);
  const esEstudio = usuario?.tipo === "estudio";
  const invitacionPendiente = !esEstudio && leerInvitacion() !== null;
  return (
    <>
      <h1>Hola, {usuario?.nombreUsuario}</h1>
      <p className="suave">{esEstudio ? "Resumen de tu estudio." : "Resumen de tu cuenta."}</p>
      {invitacionPendiente && (
        <p className="aviso" role="status">Tenés una invitación de un estudio contable sin aceptar. <Link to="/invitacion">Revisarla</Link></p>
      )}
      <div className="grid-dos">
        <UsoPlan />
        <CambioPlan />
      </div>
      {esEstudio && (
        <section className="tarjeta" aria-label="Clientes">
          <h2>Tus clientes</h2>
          <p className="suave">Invitá clientes, creá perfiles sombra, revisá sus movimientos y exportá a Zeta o Memory.</p>
          <Link className="btn enlace-btn" to="/clientes">Ir a clientes</Link>
        </section>
      )}
      <Cotizaciones />
      {!esEstudio && (
        <>
          <ResumenFiscal />
          <Suspense fallback={<p className="suave">Cargando estadísticas...</p>}>
            <Estadisticas />
          </Suspense>
        </>
      )}
    </>
  );
};
export default Dashboard;
