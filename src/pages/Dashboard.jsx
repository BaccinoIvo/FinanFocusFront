import { useSelector } from "react-redux";

const Dashboard = () => {
  const usuario = useSelector((s) => s.auth.usuario);
  return (
    <section className="tarjeta">
      <h1>Hola, {usuario?.nombreUsuario}</h1>
      <p className="suave">Sesión iniciada con plan {usuario?.plan}. Próximo paso: movimientos.</p>
    </section>
  );
};
export default Dashboard;
