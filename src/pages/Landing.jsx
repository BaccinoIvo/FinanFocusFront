import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../components/Logo";
import Calculadora from "../components/landing/Calculadora";
import {
  Grabado, IconoCerrar, IconoCheck, IconoCruz, IconoGithub, IconoMenu, IconoRecibo, Ondas,
} from "../components/landing/Iconos";
import Precios from "../components/landing/Precios";
import RegistroRapido from "../components/landing/RegistroRapido";
import { LIMITE_GRATUITO, MAX_ARCHIVO_MB } from "../utils/constantes";
import "../styles/landing.css";

// Contenido fijo de la portada (lo que se repite se arma con map).
const SECCIONES = [
  { id: "producto", texto: "Producto" },
  { id: "calculadora", texto: "Calculadora" },
  { id: "estudios", texto: "Estudios contables" },
  { id: "nosotros", texto: "Nosotros" },
  { id: "precios", texto: "Precios" },
];
const COTIZACIONES = [["USD", "40,12"], ["EUR", "46,85"], ["BRL", "7,34"], ["ARS", "0,034"], ["UI", "6,3871"], ["UR", "1.820,00"]];
const ANTES = [
  "Buscar la cotización del día de cada cobro",
  "Boletas sueltas en la billetera y en el mail",
  "Pasarle todo a tu contador por WhatsApp",
  "No saber cuánto ganaste hasta que cierra el mes",
];
const DESPUES = [
  "La conversión a pesos se hace sola, con la cotización de ese día",
  "La foto o el PDF de cada boleta queda junto a su movimiento",
  "Filtrás por tipo, categoría, moneda o fechas en segundos",
  "Tu saldo real, en pesos, cualquier día del mes",
];
const FUNCIONES = [
  { n: "I.", titulo: "Siete monedas, un saldo", texto: "UYU, USD, EUR, BRL, ARS, UI y UR. Cada monto se guarda en su moneda original y en pesos, con la cotización del día." },
  { n: "II.", titulo: "Tus comprobantes, en orden", texto: "Adjuntá la foto o el PDF de cada boleta, con RUT del emisor, número de comprobante e IVA cuando los tengas." },
  { n: "III.", titulo: "Exportación de servicios", texto: "Marcá los cobros del exterior como exportación de servicios para tenerlos separados cuando hable tu contador." },
];
const CLIENTES = [
  ["lucia.ferreira", "38 mov. · al día"], ["martin.dev", "21 mov. · al día"],
  ["sofi.ilustra", "2 sin comprobante", true], ["nico.audiovisual", "12 mov. · al día"],
];
const EQUIPO = [
  { inicial: "I", nombre: "Ivo Baccino", rol: "Cofundador · Desarrollo Full Stack", github: "https://github.com/BaccinoIvo" },
  { inicial: "L", nombre: "Leonardo Paroli", rol: "Cofundador · Desarrollo Full Stack" },
];
const PREGUNTAS = [
  ["¿FinanFocus reemplaza a mi contador?", "No. Lo complementa: vos cargás y ordenás tus movimientos, y tu contador recibe todo listo. FinanFocus no da asesoramiento tributario."],
  ["¿De dónde salen las cotizaciones?", "Del BROU, a través de datosuruguay.com, actualizadas cada pocos minutos. Si esa fuente no responde, se usa un valor de referencia internacional. UI y UR salen de sus series oficiales."],
  ["¿Qué diferencia hay entre los planes?", `El plan Gratuito permite cargar hasta ${LIMITE_GRATUITO} movimientos por mes. Directo Premium (USD 9) no tiene tope, y Referido Seguro (USD 5) da el mismo acceso cuando tu contador te vincula a su estudio.`],
  ["¿Cómo se vincula mi contador?", "Tu contador te manda un enlace de un solo uso que vence en 48 horas y solo funciona con tu email. Si todavía no usás FinanFocus, puede cargar tus comprobantes desde un perfil sombra."],
  ["¿Qué comprobantes puedo adjuntar?", `Fotos JPG, PNG o WEBP y archivos PDF de hasta ${MAX_ARCHIVO_MB} MB por comprobante.`],
];

const Landing = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const cerrarMenu = () => setMenuAbierto(false);
  // Vuelve al principio de la página sin recargarla (la ruta "/" ya es esta misma portada).
  const irArriba = (e) => {
    e.preventDefault();
    cerrarMenu();
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  return (
    <div className="landing">
      {/* Menú fijo: queda visible mientras se recorre la portada (solo existe sin sesión iniciada). */}
      <div className="topbar">
        <header className={`wrap nav ${menuAbierto ? "abierto" : ""}`}>
          <a href="#inicio" onClick={irArriba} aria-label="FinanFocus, volver al inicio de la página"><Logo /></a>
          <nav className="nav-menu" aria-label="Principal">
            <a href="#inicio" className="nav-link" onClick={irArriba}>Inicio</a>
            {SECCIONES.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="nav-link" onClick={cerrarMenu}>{s.texto}</a>
            ))}
            <Link to="/login" className="nav-link">Ingresar</Link>
            <Link to="/registro" className="lbtn lbtn-gold">Crear cuenta</Link>
          </nav>
          <button type="button" className="menu-btn" aria-expanded={menuAbierto}
            aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"} onClick={() => setMenuAbierto((v) => !v)}>
            {menuAbierto ? <IconoCerrar /> : <IconoMenu />}
          </button>
        </header>
      </div>

      {/* ---------- Portada ---------- */}
      <section id="inicio" className="hero">
        <Grabado className="grabado" />

        <div className="wrap hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Tus finanzas en foco, tu contabilidad sin burocracia</p>
            <h1>Cobrás en dólares.<br />Tu contador piensa en pesos.<br /><em>FinanFocus traduce.</em></h1>
            <p className="lead">Cada ingreso y cada gasto, en la moneda que sea, convertido a UYU con la cotización del día. Con la boleta adjunta y todo listo para tu contador.</p>
            <RegistroRapido id="empezar" />
            <p className="fine">Gratis con el plan Gratuito. Pasás a Directo Premium cuando quieras.</p>
          </div>

          {/* Ilustración de la app con datos de ejemplo */}
          <div className="shot" role="img" aria-label="Vista de ejemplo de la app: saldo del mes y últimos movimientos">
            <div className="card">
              <div className="card-h"><b>Octubre 2026</b><span>SALDO EN UYU</span></div>
              <div className="card-saldo">
                <div className="saldo">$ 71.156<span>,00</span></div>
                <div className="legend">
                  <span><i style={{ background: "var(--in)" }} />Ingresos 96.216</span>
                  <span><i style={{ background: "var(--out)" }} />Egresos 25.060</span>
                </div>
              </div>
              <svg className="barras" aria-hidden="true" viewBox="0 0 400 120">
                <line x1="0" y1="110" x2="400" y2="110" stroke="#2A2A2A" />
                <rect x="20" y="18" width="34" height="92" fill="#8EA4F5" /><rect x="58" y="88" width="34" height="22" fill="#E8965C" />
                <rect x="120" y="104" width="34" height="6" fill="#8EA4F5" /><rect x="158" y="78" width="34" height="32" fill="#E8965C" />
                <rect x="220" y="80" width="34" height="30" fill="#8EA4F5" /><rect x="258" y="96" width="34" height="14" fill="#E8965C" />
                <rect x="320" y="106" width="34" height="4" fill="#8EA4F5" /><rect x="358" y="100" width="34" height="10" fill="#E8965C" />
              </svg>
              <div className="rows">
                <div><span>Factura cliente Austin <small>USD 1.800</small></span><span className="in">+72.216,00</span></div>
                <div><span>Alquiler oficina <small>UR 8,5</small></span><span className="out">−15.470,00</span></div>
                <div><span>Coworking <small>UYU</small></span><span className="out">−6.500,00</span></div>
              </div>
            </div>
            <div className="chip-recibo">
              <div className="chip-t"><IconoRecibo />Comprobante adjunto</div>
              <dl>
                <div><dt>RUT</dt><dd>21 456789 0012</dd></div>
                <div><dt>e-Ticket</dt><dd>A 0004521</dd></div>
                <div><dt>IVA</dt><dd>557,21</dd></div>
                <div><dt>Total</dt><dd className="total">UYU 3.090,00</dd></div>
              </dl>
            </div>
          </div>
        </div>

        <div className="rail" aria-label="Cotizaciones de ejemplo">
          <div className="wrap">
            <div className="lbl">7 monedas · a UYU</div>
            {COTIZACIONES.map(([m, v]) => <div key={m}><span className="k">{m}</span> {v}</div>)}
          </div>
        </div>
      </section>

      {/* ---------- Antes / después ---------- */}
      <section id="producto" className="sec">
        <div className="wrap">
          <div className="split-head">
            <h2 className="h2">Fin de mes, sin la planilla de Excel ni el chat con tu contador.</h2>
            <p className="lead">Cobros del exterior, gastos en pesos, alquiler en UR. Hoy eso vive en cinco lugares distintos. Con FinanFocus queda en uno.</p>
          </div>
          <div className="compare">
            <div className="before">
              <p className="tag">Antes</p>
              <ul>{ANTES.map((t) => <li key={t}><IconoCruz />{t}</li>)}</ul>
            </div>
            <div className="after">
              <p className="tag">Con FinanFocus</p>
              <ul>{DESPUES.map((t) => <li key={t}><IconoCheck />{t}</li>)}</ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Calculadora ---------- */}
      <section id="calculadora" className="sec sec-alt">
        <div className="wrap calc-grid">
          <div>
            <p className="eyebrow">Probalo acá mismo</p>
            <h2 className="h2">¿Cuánto cobraste este mes, en pesos?</h2>
            <p className="lead" style={{ margin: "24px 0 0", maxWidth: 440 }}>Escribí lo que te pagaron y en qué moneda. Así funciona FinanFocus con cada movimiento.</p>
          </div>
          <Calculadora />
        </div>
      </section>

      {/* ---------- Funciones ---------- */}
      <section className="sec">
        <div className="wrap">
          <h2 className="h2" style={{ maxWidth: 820 }}>Tres cosas que tu planilla no hace.</h2>
          <div className="feats">
            {FUNCIONES.map((f) => (
              <article key={f.n}><div className="n">{f.n}</div><h3>{f.titulo}</h3><p>{f.texto}</p></article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Estudios contables ---------- */}
      <section id="estudios" className="sec sec-alt">
        <div className="wrap est">
          <div>
            <p className="eyebrow">Para estudios contables</p>
            <h2>Dejá de perseguir boletas. Tus clientes las cargan solos.</h2>
            <p className="lead" style={{ margin: "24px 0 0", maxWidth: 500 }}>Un panel con todos tus clientes freelance, sus movimientos con comprobante adjunto y exportación por cliente.</p>
            <div className="acts">
              <Link to="/registro?tipo=estudio" className="lbtn lbtn-ghost">Probar 30 días gratis</Link>
            </div>
          </div>
          <div className="panel" role="img" aria-label="Vista de ejemplo del panel para estudios contables">
            <div className="panel-h">Estudio Castro &amp; Asoc.<span>4 clientes</span></div>
            {CLIENTES.map(([u, estado, alerta]) => (
              <div key={u} className="panel-r"><span>{u}</span><span className={alerta ? "warn" : ""}>{estado}</span></div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Quiénes somos ---------- */}
      <section id="nosotros" className="sec">
        <div className="wrap team">
          <div className="team-copy">
            <p className="eyebrow">Quiénes somos</p>
            <h2>Somos dos estudiantes uruguayos construyendo la herramienta que queríamos usar.</h2>
            <p className="lead" style={{ margin: "24px 0 0", maxWidth: 500 }}>Estudiamos la carrera de Analista en Tecnologías de la Información en la Universidad ORT Uruguay. FinanFocus nace como nuestro proyecto: ordenar los números de los freelancers que cobran en varias monedas, sin planillas y sin burocracia.</p>
            <div className="uni"><b>Universidad ORT Uruguay</b><span>Analista en Tecnologías de la Información</span></div>
          </div>
          <div className="people">
            {EQUIPO.map((p) => (
              <article key={p.inicial} className="person">
                <div className="photo"><span className="ini">{p.inicial}</span></div>
                <div className="person-body">
                  <h3>{p.nombre}</h3>
                  <p className="role">{p.rol}</p>
                  <div className="person-links">
                    {p.github && <a href={p.github} target="_blank" rel="noreferrer"><IconoGithub />GitHub</a>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Precios ---------- */}
      <section id="precios" className="sec">
        <div className="wrap"><Precios /></div>
      </section>

      {/* ---------- Preguntas frecuentes ---------- */}
      <section className="sec sec-alt">
        <div className="wrap faq">
          <h2>Preguntas frecuentes</h2>
          <div className="faq-list">
            {PREGUNTAS.map(([p, r]) => (
              <details key={p}><summary>{p}<span className="plus" aria-hidden="true">+</span></summary><p>{r}</p></details>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Cierre ---------- */}
      <section className="cta">
        <Ondas className="ondas" />
        <div className="wrap in">
          <h2>Este mes, cerralo en orden.</h2>
          <p>Creá tu cuenta en un minuto y cargá tu primer movimiento hoy.</p>
          <Link to="/registro" className="lbtn lbtn-gold">Crear cuenta gratis</Link>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <Logo />
          <span>Tus finanzas en foco, tu contabilidad sin burocracia. No brinda asesoramiento tributario.</span>
          <div className="foot-links"><Link to="/login">Ingresar</Link><Link to="/registro">Crear cuenta</Link><span>© 2026</span></div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
