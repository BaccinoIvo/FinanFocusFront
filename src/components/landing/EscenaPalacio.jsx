import { useRef } from "react";
import { Link } from "react-router-dom";
import useProgresoEscena from "../../hooks/useProgresoEscena";

/**
 * Apertura de la portada. El Palacio Salvo queda fijo mientras se scrollea:
 *   capa 1 (fondo)  → la foto completa
 *   capa 2          → el título, que sube y se desvanece detrás del edificio
 *   capa 3 (frente) → la misma foto con el cielo transparente (el edificio y la plaza tapan el título)
 *   capa 4          → un velo que va "anocheciendo" la escena hasta fundirla con el resto del sitio
 *   capa 5          → mensaje y botones que aparecen en la segunda mitad
 */
const EscenaPalacio = () => {
  const ref = useRef(null);
  useProgresoEscena(ref);

  return (
    <section ref={ref} className="escena" data-fase="1" aria-label="Plaza Independencia y Palacio Salvo, Montevideo">
      <div className="escena-pin">
        <img className="escena-capa" src="/hero/plaza-fondo-1920.webp" srcSet="/hero/plaza-fondo-1280.webp 1280w, /hero/plaza-fondo-1920.webp 1920w, /hero/plaza-fondo-2880.webp 2880w" sizes="max(100vw, 133svh)" alt="" width="1920" height="1440" fetchPriority="high" decoding="async" />
        <p className="escena-titulo" aria-hidden="true">Tus finanzas<br />en foco</p>
        <img className="escena-capa escena-frente" src="/hero/palacio-recorte-1920.webp" srcSet="/hero/palacio-recorte-1280.webp 1280w, /hero/palacio-recorte-1920.webp 1920w, /hero/palacio-recorte-2880.webp 2880w" sizes="max(100vw, 133svh)" alt="" width="1920" height="1440" decoding="async" />
        <div className="escena-velo" aria-hidden="true" />
        <div className="escena-luz" aria-hidden="true" />

        <div className="escena-cta">
          <p className="eyebrow">Hecho en Uruguay</p>
          <p className="escena-frase">Para quien cobra en dólares y declara en pesos.</p>
          <div className="escena-botones">
            <Link to="/registro" className="lbtn lbtn-gold">Empezar gratis</Link>
            <a href="#producto" className="lbtn lbtn-ghost">Ver cómo funciona</a>
          </div>
        </div>

        <div className="escena-baja" aria-hidden="true"><span>Deslizá</span><i /></div>
      </div>
    </section>
  );
};

export default EscenaPalacio;
