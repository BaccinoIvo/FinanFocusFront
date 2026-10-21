import { configureStore } from "@reduxjs/toolkit";
import { setAlNoAutorizado } from "../api/api";
import authReducer, { logout } from "./authSlice";
import categoriasReducer from "./categoriasSlice";
import movimientosReducer from "./movimientosSlice";
import usoReducer from "./usoSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    categorias: categoriasReducer,
    movimientos: movimientosReducer,
    uso: usoReducer,
  },
});

// Token vencido o inválido en cualquier petición: se cierra la sesión.
setAlNoAutorizado(() => store.dispatch(logout()));
