import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import useVideoScroll from "../../hooks/useVideoScroll";

/* Iconos de las cinco ventajas (trazo blanco, 34 px de diseño). */
const Ico = ({ children }) => (
  <svg className="vid-ico" viewBox="0 0 36 36" fill="none" stroke="#F9F9F9" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);
const ICONOS = {
  unico: <Ico><circle cx="18" cy="18" r="15.5" strokeDasharray="3.4 3" /><circle cx="18" cy="18" r="9.5" fill="#F9F9F9" stroke="none" /><path d="M8.5 18h19M18 8.5c-4 4.5-4 14.5 0 19M18 8.5c4 4.5 4 14.5 0 19" stroke="#101215" strokeWidth="1" /></Ico>,
  monedas: <Ico><circle cx="14" cy="14" r="9" /><circle cx="22" cy="22" r="9" fill="#101215" /><path d="M22 18v8M19.5 20h4a1.8 1.8 0 0 1 0 3.6h-3.2a1.8 1.8 0 0 0 0 3.6h4.2" strokeWidth="1.5" /></Ico>,
  lectura: <Ico><path d="M8 3.5h14l7 7V32H8z" /><path d="M22 3.5v7h7" /><path d="M12.5 18h12M12.5 22.5h12M12.5 27h7" strokeWidth="1.5" /></Ico>,
  estudio: <Ico><circle cx="13" cy="12" r="5" /><circle cx="25" cy="14" r="3.8" /><path d="M3.5 30c0-5.5 4.2-9 9.5-9s9.5 3.5 9.5 9M23 21.5c4.3.3 7.5 3 7.5 8" /></Ico>,
  gratis: <Ico><rect x="4" y="9" width="28" height="19" rx="2.5" /><path d="M4 15h28" /><path d="M10 22h6" strokeWidth="2.2" /></Ico>,
};

const VENTAJAS = [
  { icono: "unico", t1: "Todo en", t2: "un solo lugar", texto: "Ingresos, gastos y comprobantes de todas tus monedas en un mismo tablero, sin planillas sueltas." },
  { icono: "monedas", t1: "Dólares y pesos,", t2: "sin cuentas", texto: "Registrás cada cobro en la moneda en que lo recibiste y lo ves convertido, listo para declarar." },
  { icono: "lectura", t1: "Comprobantes", t2: "leídos por IA", texto: "Subís la foto o el PDF y se completan monto, fecha y RUT. Si el e-Ticket trae QR, lo leemos también." },
  { icono: "estudio", t1: "Pensado para", t2: "tu contador", texto: "Los estudios contables invitan a sus clientes y trabajan con los mismos datos, sin reenviar nada por WhatsApp." },
  { icono: "gratis", t1: "Empezás", t2: "gratis", texto: "El plan gratuito incluye hasta 4 movimientos por mes. Pasás a un plan pago solo cuando lo necesitás." },
];

const PERFILES = [
  ["Freelancers", "Cobran en dólares", "Registrás cada cobro y cada gasto con su comprobante, y sabés cuánto ganaste antes de que cierre el mes."],
  ["Estudios contables", "Varios clientes a la vez", "Un panel para ver los movimientos de cada cliente, con los comprobantes ya cargados y ordenados."],
  ["Equipos chicos", "Sin sistema contable propio", "Un lugar común para que todos suban sus gastos y el contador reciba todo junto, mes a mes."],
];

/**
 * Apertura de la portada: un video aéreo de Punta del Este que se recorre con el scroll
 * (la cámara avanza sobre la península mientras pasan el titular y las ventajas) y se funde en negro
 * al final. El video nunca se reproduce ni se anima por código: solo se mueve su instante (currentTime).
 */
const EscenaVideo = () => {
  const pista = useRef(null);
  const video = useRef(null);
  const ultimo = useRef(null);
  useVideoScroll(pista, video, ultimo);
  // Pantallas chicas o con "ahorro de datos" reciben la versión de 720p.
  const [calidad] = useState(() => (window.matchMedia("(max-width: 900px)").matches || navigator.connection?.saveData ? "720" : "1440"));

  return (
    <>
      <section ref={pista} className="vid-pista" aria-label="Vista aérea de Punta del Este, Uruguay">
        <div className="vid-escena">
          <video ref={video} className="vid-bg" src={`/hero/punta-${calidad}.mp4`} poster="/hero/punta-poster.jpg" muted playsInline preload="auto" disablePictureInPicture aria-hidden="true" tabIndex={-1} />
          <div className="vid-tinte" aria-hidden="true" />
          <div className="vid-velo" aria-hidden="true" />
          <div className="vid-baja" aria-hidden="true"><span>Deslizá</span><i /></div>
        </div>

        <div className="vid-contenido">
          <div className="vid-intro">
            <p className="vid-eyebrow">Por qué FinanFocus</p>
            <p className="vid-titular">
              <span>Tus finanzas</span><span>en foco,</span><span>en dólares</span><span>y en pesos.</span>
            </p>
          </div>

          {VENTAJAS.map((v, i) => (
            <div key={v.icono} ref={i === VENTAJAS.length - 1 ? ultimo : null} className={`vid-bloque vid-b${i + 1} ${i % 2 === 0 ? "izq" : "der"}`}>
              {ICONOS[v.icono]}
              <h3><span>{v.t1}</span><span>{v.t2}</span></h3>
              <p>{v.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="vid-cierre" aria-labelledby="vid-cierre-t">
        <div className="vid-cierre-in">
          <header className="vid-cierre-cab">
            <h2 id="vid-cierre-t">Pensado para<br />quien cobra afuera<br /><em>y declara acá.</em></h2>
            <div>
              <p>Un solo lugar para ordenar ingresos y gastos en varias monedas, con los comprobantes a mano para tu contador.</p>
              <div className="vid-cierre-botones">
                <Link to="/registro" className="lbtn lbtn-gold">Empezar gratis</Link>
                <a href="#producto" className="lbtn lbtn-ghost">Ver cómo funciona</a>
              </div>
            </div>
          </header>
          <ul className="vid-perfiles">
            {PERFILES.map(([quien, rol, texto]) => (
              <li key={quien}>
                <div><strong>{quien}</strong><span>{rol}</span></div>
                <p>{texto}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
};

export default EscenaVideo;
