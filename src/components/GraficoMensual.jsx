import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Leyenda, TooltipGrafico } from "./ElementosGrafico";
import { COLOR_EGRESOS, COLOR_GRILLA, COLOR_INGRESOS, compacto, ejeProps, pesos } from "../utils/grafico";

// Columnas agrupadas: ingresos vs egresos de cada mes, en pesos.
const GraficoMensual = ({ datos }) => {
  const [verTabla, setVerTabla] = useState(false);

  return (
    <section className="tarjeta grafico" aria-label="Ingresos y egresos por mes">
      <div className="grafico-cabecera">
        <h2>Ingresos y egresos por mes</h2>
        <button className="btn btn-sec" onClick={() => setVerTabla((v) => !v)}>
          {verTabla ? "Ver gráfico" : "Ver tabla"}
        </button>
      </div>
      <Leyenda items={[{ nombre: "Ingresos", color: COLOR_INGRESOS }, { nombre: "Egresos", color: COLOR_EGRESOS }]} />

      {verTabla ? (
        <table className="tabla-datos">
          <thead><tr><th>Mes</th><th>Ingresos</th><th>Egresos</th></tr></thead>
          <tbody>
            {datos.map((f) => (
              <tr key={f.mes}><td>{f.mes}</td><td>{pesos(f.ingresos)}</td><td>{pesos(f.egresos)}</td></tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="grafico-area" data-testid="grafico-mensual">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={datos} barGap={2} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke={COLOR_GRILLA} strokeWidth={1} />
              <XAxis dataKey="mes" axisLine={{ stroke: COLOR_GRILLA }} {...ejeProps} />
              <YAxis axisLine={false} width={52} tickFormatter={compacto} {...ejeProps} />
              <Tooltip content={<TooltipGrafico />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
              <Bar dataKey="ingresos" name="Ingresos" fill={COLOR_INGRESOS} radius={[4, 4, 0, 0]} maxBarSize={24} />
              <Bar dataKey="egresos" name="Egresos" fill={COLOR_EGRESOS} radius={[4, 4, 0, 0]} maxBarSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
};

export default GraficoMensual;
