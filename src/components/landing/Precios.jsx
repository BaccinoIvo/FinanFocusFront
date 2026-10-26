import { useState } from "react";
import { Link } from "react-router-dom";
import { NOMBRE_PLAN, PLANES_ESTUDIOS, PLANES_FREELANCER } from "../../utils/planes";

// Los 7 planes del modelo de negocio, en dos líneas: freelancers y estudios contables.
const Precios = () => {
  const [estudios, setEstudios] = useState(false);
  const planes = estudios ? PLANES_ESTUDIOS : PLANES_FREELANCER;
  const destino = estudios ? "/registro?tipo=estudio" : "/registro";

  return (
    <>
      <div className="price-head">
        <h2 className="h2">Precios claros.</h2>
        <div className="toggle" role="group" aria-label="Tipo de cuenta">
          <button type="button" aria-pressed={!estudios} onClick={() => setEstudios(false)}>Soy freelancer</button>
          <button type="button" aria-pressed={estudios} onClick={() => setEstudios(true)}>Soy contador o estudio</button>
        </div>
      </div>
      <div className={estudios ? "plans plans-4" : "plans plans-3"}>
        {planes.map((p) => (
          <div key={p.id} className={p.destacado ? "plan top" : "plan"}>
            {p.destacado && <span className="badge">Recomendado</span>}
            <div><h3>{NOMBRE_PLAN[p.id]}</h3><p className="who">{p.quien}</p></div>
            <div className="amt"><b>{p.precio === 0 ? "Gratis" : `USD ${p.precio}`}</b> {p.precio > 0 && <span>por mes</span>}</div>
            <ul>{p.beneficios.map((b) => <li key={b}>{b}</li>)}</ul>
            <Link to={destino} className={p.destacado ? "lbtn lbtn-gold" : "lbtn lbtn-ghost"}>{p.boton}</Link>
          </div>
        ))}
      </div>
    </>
  );
};

export default Precios;
