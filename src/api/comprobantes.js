import { api } from "./api";

// Sube el comprobante al servidor para que la IA lea sus datos (hasta 55 s: Gemini puede demorar).
// Devuelve { ai_processed, fuente, datosExtraidos } — datosExtraidos es null si no se pudo leer.
export const extraerComprobante = (archivo) => {
  const formData = new FormData();
  formData.append("comprobante", archivo);
  return api("/comprobantes/extraer", { metodo: "POST", formData, timeoutMs: 55000 });
};
