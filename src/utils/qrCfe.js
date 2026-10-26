import { dibujarPrimeraPagina } from "./pdf";

// Lectura del código QR que llevan los comprobantes fiscales electrónicos (CFE) de la DGI.
// El QR contiene una dirección de efactura.dgi.gub.uy con los datos del comprobante. Como el orden exacto de los
// datos no está documentado públicamente, se reconoce cada dato por su forma (RUT de 12 dígitos, fecha, serie...)
// y solo se aceptan códigos que apunten al sitio de la DGI.

const HOST_DGI = /(^|\.)dgi\.gub\.uy$/i;
const aISO = (f) => {
  const dma = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(f);
  if (dma) return `${dma[3]}-${dma[2]}-${dma[1]}`;
  return /^\d{4}-\d{2}-\d{2}/.test(f) ? f.slice(0, 10) : null;
};

export const parsearQrCfe = (texto) => {
  let url;
  try { url = new URL(String(texto).trim()); } catch { return null; }
  if (!HOST_DGI.test(url.hostname)) return null;

  const crudo = url.search.slice(1) || url.pathname;
  const tokens = decodeURIComponent(crudo)
    .split(/[,;|&]/)
    .map((t) => t.replace(/^[A-Za-z_]+=/, "").trim())
    .filter(Boolean);

  const resultado = { rut: null, serie: null, numero: null, fecha: null, monto: null };
  tokens.forEach((t, i) => {
    if (!resultado.rut && /^\d{12}$/.test(t)) resultado.rut = t;
    else if (!resultado.fecha && aISO(t)) resultado.fecha = aISO(t);
    else if (!resultado.monto && /^\d+[.,]\d{2}$/.test(t)) resultado.monto = Number(t.replace(",", "."));
    else if (!resultado.serie && /^[A-Za-z]{1,3}$/.test(t) && /^\d+$/.test(tokens[i + 1] ?? "")) {
      resultado.serie = t.toUpperCase();
      resultado.numero = tokens[i + 1];
    }
  });
  // Sin RUT del emisor no hay nada confiable que aprovechar.
  return resultado.rut ? resultado : null;
};

// Busca un QR en la imagen (o en la primera página del PDF). Devuelve los datos o null; nunca lanza error.
export const leerQrDeArchivo = async (archivo) => {
  try {
    const { default: jsQR } = await import("jsqr");
    const canvas = document.createElement("canvas");
    if (archivo.type === "application/pdf") {
      if (!(await dibujarPrimeraPagina(archivo, canvas, 1800))) return null;
    } else if (archivo.type.startsWith("image/")) {
      const bitmap = await createImageBitmap(archivo);
      const escala = Math.min(1, 2000 / Math.max(bitmap.width, bitmap.height));
      canvas.width = Math.round(bitmap.width * escala);
      canvas.height = Math.round(bitmap.height * escala);
      canvas.getContext("2d", { willReadFrequently: true }).drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      bitmap.close?.();
    } else {
      return null;
    }
    const datos = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
    const qr = jsQR(datos.data, datos.width, datos.height);
    return qr ? parsearQrCfe(qr.data) : null;
  } catch {
    return null;
  }
};
