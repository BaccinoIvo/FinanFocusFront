import { leerToken } from "../utils/token";

const BASE = import.meta.env.VITE_API_URL ?? "https://finan-focus.vercel.app/v1";

// Convierte cualquier respuesta de error del backend en un texto legible.
// El backend devuelve { message } y, en validaciones Joi, { error: [{ message }] }.
const extraerMensaje = (datos, status) => {
  if (Array.isArray(datos?.error) && datos.error.length) {
    return datos.error.map((e) => e.message).join(". ");
  }
  if (datos?.message) return datos.message;
  if (status === 429) return "Demasiadas peticiones. Probá de nuevo en unos minutos.";
  return "Ocurrió un error inesperado";
};

// Callback que registra el store: si el servidor responde 401 con un token enviado
// (vencido o inválido), se cierra la sesión automáticamente.
let alNoAutorizado = null;
export const setAlNoAutorizado = (fn) => { alNoAutorizado = fn; };

export class ErrorApi extends Error {
  constructor(mensaje, status) {
    super(mensaje);
    this.status = status;
  }
}

// Wrapper único de fetch: agrega el token y normaliza errores.
export const api = async (ruta, { metodo = "GET", body, formData } = {}) => {
  const headers = {};
  const token = leerToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body) headers["Content-Type"] = "application/json";

  let respuesta;
  try {
    respuesta = await fetch(`${BASE}${ruta}`, {
      method: metodo,
      headers,
      body: formData ?? (body ? JSON.stringify(body) : undefined),
    });
  } catch {
    throw new ErrorApi("No se pudo conectar con el servidor. Revisá tu conexión.", 0);
  }

  const datos = await respuesta.json().catch(() => null);
  if (!respuesta.ok) {
    if (respuesta.status === 401 && token && alNoAutorizado) alNoAutorizado();
    throw new ErrorApi(extraerMensaje(datos, respuesta.status), respuesta.status);
  }
  return datos;
};
