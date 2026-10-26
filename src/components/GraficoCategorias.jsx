import { useState } from "react";
import { Bar, BarChart, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { TooltipGrafico } from "./ElementosGrafico";
import { COLOR_EGRESOS, COLOR_TEXTO, compacto, ejeProps, pesos } from "../utils/grafico";

// Barras horizontales: en qué categorías se va el dinero. Una sola serie: sin caja de leyenda,
// el título dice qué se mide; el valor va en la punta de cada barra.
const GraficoCategorias = ({ datos }) => {
  const [verTabla, setVerTabla] = useState(false);

  return (
    <section className="tarjeta grafico" aria-label="Egresos por categoría">
      <div className="grafico-cabecera">
        <h2>Egresos por categoría</h2>
        {datos.length > 0 && (
          <button className="btn btn-sec" onClick={() => setVerTabla((v) => !v)}>
            {verTabla ? "Ver gráfico" : "Ver tabla"}
          </button>
        )}
      </div>

      {datos.length === 0 && <p className="vacio">No hay egresos en este período.</p>}

      {datos.length > 0 && verTabla && (
        <table className="tabla-datos">
          <thead><tr><th>Categoría</th><th>Egresos</th></tr></thead>
          <tbody>
            {datos.map((c) => <tr key={c.nombre}><td>{c.nombre}</td><td>{pesos(c.monto)}</td></tr>)}
          </tbody>
        </table>
      )}

      {datos.length > 0 && !verTabla && (
        <div className="grafico-area" data-testid="grafico-categorias">
          <ResponsiveContainer width="100%" height={datos.length * 44 + 16}>
            <BarChart data={datos} layout="vertical" margin={{ top: 0, right: 64, left: 0, bottom: 0 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="nombre" width={112} axisLine={false} {...ejeProps} />
              <Tooltip content={<TooltipGrafico />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
              <Bar dataKey="monto" name="Egresos" fill={COLOR_EGRESOS} radius={[0, 4, 4, 0]} maxBarSize={18}>
                <LabelList dataKey="monto" position="right" formatter={compacto} fill={COLOR_TEXTO} fontSize={12} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
};

export default GraficoCategorias;
