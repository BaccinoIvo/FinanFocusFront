// "sv-SE" devuelve YYYY-MM-DD en hora local: es el formato que necesita <input type="date">.
export const hoyISO = () => new Date().toLocaleDateString("sv-SE");

// Las fechas se guardan a medianoche UTC; se muestran en UTC para que no se corran de día.
export const fechaCorta = (f) =>
  new Date(f).toLocaleDateString("es-UY", { timeZone: "UTC", day: "2-digit", month: "2-digit", year: "numeric" });

const formatoNumero = new Intl.NumberFormat("es-UY", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const formatoMonto = (n) => formatoNumero.format(n);

// Los perfiles sombra llevan un sufijo hexadecimal para ser únicos: no se muestra.
export const nombreVisible = (c) => c.nombreUsuario.replace(/\.[0-9a-f]{6}$/, "");
