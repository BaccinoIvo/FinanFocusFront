import { useState } from "react";
import { Link } from "react-router-dom";
import { formatoMonto } from "../../utils/formato";

// Cotizaciones de ejemplo: la ruta /v1/cotizaciones del backend pide sesión,
// así que en la portada pública se usan valores fijos (se aclara en pantalla).
const COTIZACIONES_EJEMPLO = { USD: 40.12, EUR: 46.85, BRL: 7.34, ARS: 0.034 };
const MONEDAS = Object.keys(COTIZACIONES_EJEMPLO);

// Acepta "2500", "2.500" o "2.500,50" (formato uruguayo). Devuelve null si no es un número válido.
const leerMonto = (texto) => {
  const limpio = texto.trim().replace(/\./g, "").replace(",", ".");
  if (limpio === "" || !/^\d+(\.\d+)?$/.test(limpio)) return null;
  return Number(limpio);
};

const Calculadora = () => {
  const [monto, setMonto] = useState("2.500");
  const [moneda, setMoneda] = useState("USD");

  const valor = leerMonto(monto);
  const enPesos = valor === null ? null : valor * COTIZACIONES_EJEMPLO[moneda];

  return (
    <div className="calc">
      <div className="calc-row">
        <div className="field" style={{ flex: "2 1 220px" }}>
          <label htmlFor="calc-monto">Monto cobrado</label>
          <input id="calc-monto" inputMode="decimal" value={monto} maxLength={15}
            aria-invalid={valor === null} aria-describedby="calc-error"
            onChange={(e) => setMonto(e.target.value)} />
          {valor === null && <p id="calc-error" className="calc-error">Escribí un monto en números, por ejemplo 2.500</p>}
        </div>
        <div className="field" style={{ flex: "1 1 140px" }}>
          <span className="lab" id="calc-moneda">Moneda</span>
          <div className="seg" role="group" aria-labelledby="calc-moneda">
            {MONEDAS.map((m) => (
              <button key={m} type="button" aria-pressed={m === moneda} onClick={() => setMoneda(m)}>{m}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="result" aria-live="polite">
        <div className="k">En pesos uruguayos</div>
        <div className="big">$ {enPesos === null ? "—" : formatoMonto(enPesos)}</div>
        <div className="sub">1 {moneda} = {COTIZACIONES_EJEMPLO[moneda].toLocaleString("es-UY")} UYU · cotización de ejemplo</div>
      </div>
      <Link to="/registro" className="lbtn lbtn-gold">Guardar esto en mi cuenta</Link>
    </div>
  );
};

export default Calculadora;
