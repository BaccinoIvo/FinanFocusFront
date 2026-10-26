import { LIMITE_GRATUITO } from "./constantes";

// Nombres para mostrar. "plus" y "premium" son los nombres de las cuentas creadas antes de los planes nuevos.
export const NOMBRE_PLAN = {
  gratuito: "Gratuito", referido: "Referido Seguro", directo: "Directo Premium",
  trial: "Free Trial", independiente: "Independiente", boutique: "Estudio Boutique", escala: "Estudio Escala",
  plus: "Gratuito", premium: "Directo Premium",
};
export const nombrePlan = (id) => NOMBRE_PLAN[id] ?? id;

// Catálogo que muestra la portada (la app real lo pide al backend: GET /usuarios/planes).
export const PLANES_FREELANCER = [
  { id: "gratuito", precio: 0, quien: "Para empezar a ordenarte",
    beneficios: [`Hasta ${LIMITE_GRATUITO} movimientos por mes`, "7 monedas convertidas a pesos", "Categorías propias"], boton: "Empezar gratis" },
  { id: "referido", precio: 5, quien: "Si tu contador usa FinanFocus",
    beneficios: ["Movimientos ilimitados", "Comprobantes adjuntos con lectura por IA", "Se activa al vincularte con tu contador"], boton: "Crear cuenta" },
  { id: "directo", precio: 9, quien: "Para quien gestiona solo", destacado: true,
    beneficios: ["Movimientos ilimitados", "Comprobantes adjuntos con lectura por IA", "Resumen fiscal y estadísticas"], boton: "Probar Premium" },
];
export const PLANES_ESTUDIOS = [
  { id: "trial", precio: 0, quien: "30 días para probar", beneficios: ["Acceso completo a exportaciones", "Hasta 15 clientes", "Sin tarjeta"], boton: "Probar 30 días" },
  { id: "independiente", precio: 35, quien: "Asesores y autónomos", beneficios: ["1 usuario", "Hasta 15 clientes", "Exportación a Zeta y Memory"], boton: "Elegir Independiente" },
  { id: "boutique", precio: 89, quien: "Equipos en crecimiento", destacado: true, beneficios: ["Hasta 3 usuarios", "Hasta 50 clientes", "Perfiles sombra"], boton: "Elegir Boutique" },
  { id: "escala", precio: 149, quien: "Firmas con alto volumen", beneficios: ["Hasta 10 usuarios", "Clientes ilimitados", "Perfiles sombra"], boton: "Elegir Escala" },
];
