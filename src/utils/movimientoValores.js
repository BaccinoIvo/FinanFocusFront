import { hoyISO } from "./formato";

export const valoresVacios = () => ({
  tipo: "egreso",
  categoria: "",
  monto: "",
  moneda: "UYU",
  fecha: hoyISO(),
  descripcion: "",
  esExportacionServicio: false,
  numeroComprobante: "",
  rutEmisor: "",
  montoIva: "",
});

// Convierte un movimiento del backend en los valores iniciales del formulario.
export const valoresDesdeMovimiento = (m) => ({
  tipo: m.tipo,
  categoria: m.categoria?._id ?? m.categoria ?? "",
  monto: String(m.monto),
  moneda: m.moneda,
  fecha: String(m.fecha).slice(0, 10),
  descripcion: m.descripcion ?? "",
  esExportacionServicio: !!m.esExportacionServicio,
  numeroComprobante: m.numeroComprobante ?? "",
  rutEmisor: m.rutEmisor ?? "",
  montoIva: m.montoIva ?? "",
});
