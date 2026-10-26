import { pesos } from "../utils/grafico";

// Leyenda: siempre presente con 2 o más series. La muestra imita la marca (rectángulo).
export const Leyenda = ({ items }) => (
  <ul className="leyenda">
    {items.map((i) => (
      <li key={i.nombre}><span className="muestra" style={{ background: i.color }} />{i.nombre}</li>
    ))}
  </ul>
);

// Tooltip: el valor manda (grande), el nombre acompaña. Clave de serie = trazo corto, no caja.
export const TooltipGrafico = ({ active, payload, label, titulo }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="tooltip-grafico" role="status">
      <div className="tooltip-titulo">{titulo ?? label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="tooltip-fila">
          <span className="clave" style={{ background: p.color ?? p.payload?.fill }} />
          <strong>{pesos(p.value)}</strong>
          {p.name && p.name !== "monto" && <span className="suave">{p.name}</span>}
        </div>
      ))}
    </div>
  );
};
