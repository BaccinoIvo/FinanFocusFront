import { useSelector } from "react-redux";

// Informe de uso. Usuario con tope (gratuito): % de los 4 movimientos del mes.
// Usuario sin tope: cantidad de movimientos. Estudio: clientes sobre la capacidad de su plan.
const UsoPlan = () => {
  const { datos, cargando, error } = useSelector((s) => s.uso);

  const barra = (porcentaje, lleno) => (
    <div className="barra" role="progressbar" aria-valuenow={porcentaje} aria-valuemin={0} aria-valuemax={100}>
      <div className={`barra-relleno ${lleno ? "lleno" : ""}`} style={{ width: `${porcentaje}%` }} />
    </div>
  );

  return (
    <section className="tarjeta" aria-label="Informe de uso">
      <h2>Informe de uso</h2>
      {error && <p className="error">{error}</p>}
      {!datos && !error && <p className="suave">{cargando ? "Cargando..." : ""}</p>}

      {datos?.tipo === "estudio" && (
        datos.limiteClientes ? (() => {
          const porcentaje = Math.min(Math.round((datos.clientes / datos.limiteClientes) * 100), 100);
          const lleno = datos.clientes >= datos.limiteClientes;
          return (
            <>
              <p className="numero-grande">{porcentaje}%</p>
              {barra(porcentaje, lleno)}
              <p className="suave">{datos.clientes} de {datos.limiteClientes} clientes (plan {datos.planNombre})</p>
              {lleno && <p className="aviso">Llegaste al máximo de clientes. Pasá a un plan mayor para sumar más.</p>}
            </>
          );
        })() : (
          <>
            <p className="numero-grande">{datos.clientes}</p>
            <p className="suave">clientes · sin límite (plan {datos.planNombre})</p>
          </>
        )
      )}

      {datos && datos.tipo !== "estudio" && !datos.limite && (
        <>
          <p className="numero-grande">{datos.total}</p>
          <p className="suave">movimientos registrados · sin límite (plan {datos.planNombre})</p>
        </>
      )}

      {datos && datos.tipo !== "estudio" && datos.limite && (() => {
        const lleno = datos.usados >= datos.limite;
        return (
          <>
            <p className="numero-grande">{datos.porcentaje}%</p>
            {barra(datos.porcentaje, lleno)}
            <p className="suave">{Math.min(datos.usados, datos.limite)} de {datos.limite} movimientos usados este mes (plan {datos.planNombre})</p>
            {lleno && <p className="aviso">Alcanzaste el límite del mes. Cambiá de plan para seguir registrando.</p>}
          </>
        );
      })()}
    </section>
  );
};

export default UsoPlan;
