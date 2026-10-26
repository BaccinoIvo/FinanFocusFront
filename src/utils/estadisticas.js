const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const redondear = (n) => Math.round(n * 100) / 100;

// Últimos N meses (el actual incluido), del más viejo al más nuevo.
export const mesesRecientes = (cantidad, hoy = new Date()) => {
  const lista = [];
  for (let i = cantidad - 1; i >= 0; i--) {
    const d = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
    lista.push({
      clave: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      etiqueta: `${MESES[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`,
    });
  }
  return lista;
};

// Todo se compara en pesos. Si no hay cotización (montoConvertidoUYU null), no se puede sumar.
const enPesos = (m) => (m.moneda === "UYU" ? m.monto : m.montoConvertidoUYU);

/**
 * Agrega los movimientos de los últimos `cantidadMeses` meses:
 *  - porMes: ingresos y egresos de cada mes (para el gráfico de columnas)
 *  - categorias: egresos por categoría, de mayor a menor (las menores se agrupan en "Otras")
 *  - totales y cantidad de movimientos que quedaron afuera por no tener cotización
 */
export const calcularEstadisticas = (movimientos, cantidadMeses, hoy = new Date(), maxCategorias = 6) => {
  const meses = mesesRecientes(cantidadMeses, hoy);
  const indice = new Map(meses.map((m, i) => [m.clave, i]));
  const porMes = meses.map((m) => ({ mes: m.etiqueta, ingresos: 0, egresos: 0 }));
  const porCategoria = new Map();
  let sinCotizacion = 0;
  let cantidad = 0;

  for (const m of movimientos) {
    // La fecha viene como ISO en UTC ("2026-10-04T00:00:00.000Z"): los 7 primeros caracteres son el mes.
    const posicion = indice.get(String(m.fecha).slice(0, 7));
    if (posicion === undefined) continue;
    cantidad += 1;
    const pesos = enPesos(m);
    if (pesos == null) { sinCotizacion += 1; continue; }
    if (m.tipo === "ingreso") {
      porMes[posicion].ingresos += pesos;
    } else {
      porMes[posicion].egresos += pesos;
      const nombre = m.categoria?.nombre ?? "Sin categoría";
      porCategoria.set(nombre, (porCategoria.get(nombre) ?? 0) + pesos);
    }
  }

  porMes.forEach((f) => { f.ingresos = redondear(f.ingresos); f.egresos = redondear(f.egresos); });

  let categorias = [...porCategoria.entries()]
    .map(([nombre, monto]) => ({ nombre, monto: redondear(monto) }))
    .sort((a, b) => b.monto - a.monto);
  if (categorias.length > maxCategorias) {
    const resto = categorias.slice(maxCategorias - 1).reduce((s, c) => s + c.monto, 0);
    categorias = [...categorias.slice(0, maxCategorias - 1), { nombre: "Otras", monto: redondear(resto) }];
  }

  const ingresos = redondear(porMes.reduce((s, f) => s + f.ingresos, 0));
  const egresos = redondear(porMes.reduce((s, f) => s + f.egresos, 0));
  return { porMes, categorias, totales: { ingresos, egresos, balance: redondear(ingresos - egresos) }, sinCotizacion, cantidad };
};
