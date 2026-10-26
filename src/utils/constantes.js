export const MONEDAS = ["UYU", "USD", "EUR", "BRL", "ARS", "UI", "UR"];
// Tope mensual del plan gratuito (el backend lo valida; esto es solo para mostrarlo y avisar antes).
export const LIMITE_GRATUITO = 4;
export const MOVS_POR_PAGINA = 6;
export const MAX_ARCHIVO_MB = 10;
export const TIPOS_ARCHIVO = [
  "image/jpeg", "image/png", "image/webp", "application/pdf",
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
];
// La IA solo lee imágenes y PDF; Word se adjunta pero se completa a mano.
export const TIPOS_LEIBLES_IA = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
