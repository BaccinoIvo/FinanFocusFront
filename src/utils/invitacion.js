// El código de invitación se recuerda mientras la persona inicia sesión o se registra.
const CLAVE = "ff_invitacion";
export const guardarInvitacion = (t) => { try { sessionStorage.setItem(CLAVE, t); } catch { /* sin storage: se usa solo la URL */ } };
export const leerInvitacion = () => { try { return sessionStorage.getItem(CLAVE); } catch { return null; } };
export const borrarInvitacion = () => { try { sessionStorage.removeItem(CLAVE); } catch { /* nada que borrar */ } };
