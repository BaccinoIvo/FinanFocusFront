// Decodifica el payload del JWT (sin verificar firma: eso lo hace el backend).
export const decodificarToken = (token) => {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(decodeURIComponent(escape(atob(payload))));
  } catch {
    return null;
  }
};

export const tokenVigente = (token) => {
  const datos = decodificarToken(token);
  return !!datos && (!datos.exp || datos.exp * 1000 > Date.now());
};

const CLAVE = "ff_token";

export const guardarToken = (token) => {
  try { localStorage.setItem(CLAVE, token); } catch { /* sin storage */ }
};
export const leerToken = () => {
  try {
    const t = localStorage.getItem(CLAVE);
    return t && tokenVigente(t) ? t : null;
  } catch { return null; }
};
export const borrarToken = () => {
  try { localStorage.removeItem(CLAVE); } catch { /* sin storage */ }
};
