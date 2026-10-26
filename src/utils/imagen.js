// Achica una foto antes de mandarla a leer con IA: una foto de celular pesa 3-8 MB y casi todo el tiempo
// de espera es subirla. Con 1600 px de lado mayor el texto del comprobante sigue siendo legible.
// Si algo falla (formato raro, navegador sin canvas), se devuelve el archivo original.
const LADO_MAXIMO = 1600;
const CALIDAD = 0.82;
const UMBRAL_BYTES = 600 * 1024;

export const comprimirImagen = async (archivo) => {
  if (!archivo.type.startsWith("image/") || archivo.size < UMBRAL_BYTES) return archivo;
  try {
    const bitmap = await createImageBitmap(archivo);
    const escala = Math.min(1, LADO_MAXIMO / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * escala);
    canvas.height = Math.round(bitmap.height * escala);
    canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close?.();
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", CALIDAD));
    if (!blob || blob.size >= archivo.size) return archivo;
    return new File([blob], archivo.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return archivo;
  }
};
