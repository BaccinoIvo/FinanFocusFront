import { configureStore } from "@reduxjs/toolkit";
import { setAlNoAutorizado } from "../api/api";
import authReducer, { logout } from "./authSlice";
import categoriasReducer from "./categoriasSlice";
import cotizacionesReducer from "./cotizacionesSlice";
import estadisticasReducer from "./estadisticasSlice";
import estudioReducer from "./estudioSlice";
import movimientosReducer from "./movimientosSlice";
import perfilReducer from "./perfilSlice";
import resumenReducer from "./resumenSlice";
import usoReducer from "./usoSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    categorias: categoriasReducer,
    estadisticas: estadisticasReducer,
    cotizaciones: cotizacionesReducer,
    resumen: resumenReducer,
    movimientos: movimientosReducer,
    uso: usoReducer,
    estudio: estudioReducer,
    perfil: perfilReducer,
  },
});

// Token vencido o inválido en cualquier petición: se cierra la sesión.
setAlNoAutorizado(() => store.dispatch(logout({ vencida: true })));
