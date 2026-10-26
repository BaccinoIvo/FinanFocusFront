// Piezas compartidas por los gráficos. Colores validados contra la superficie oscura (#111111):
// azul claro = ingresos, naranja = egresos (colores de la marca; contraste ≥ 3:1).
export const COLOR_INGRESOS = "#8ea4f5";
export const COLOR_EGRESOS = "#e8965c";
export const COLOR_GRILLA = "#242424";
export const COLOR_TEXTO = "#a29e95";

// Abreviatura propia (1,5 k / 2 M): Intl "compact" mezcla "k" y "K" según el valor.
const un_decimal = new Intl.NumberFormat("es-UY", { maximumFractionDigits: 1 });
export const compacto = (n) => {
  const abs = Math.abs(n);
  if (abs >= 1e6) return `${un_decimal.format(n / 1e6)} M`;
  if (abs >= 1e3) return `${un_decimal.format(n / 1e3)} k`;
  return un_decimal.format(n);
};

export const pesos = (n) =>
  `$ ${new Intl.NumberFormat("es-UY", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)}`;

export const ejeProps = {
  tickLine: false,
  tick: { fill: COLOR_TEXTO, fontSize: 12 },
};
