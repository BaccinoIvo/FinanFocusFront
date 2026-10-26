import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../api/api";
import { guardarToken } from "../utils/token";
import { logout, tokenActualizado } from "./authSlice";
import { crearMovimiento } from "./movimientosSlice";

// Informe de uso: el backend calcula movimientos del mes (usuario) o clientes (estudio).
export const cargarUso = createAsyncThunk("uso/cargar", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api("/usuarios/uso");
    return data;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const cargarPlanes = createAsyncThunk("uso/planes", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api("/usuarios/planes");
    return data;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

// Las acciones que cambian el plan devuelven un token nuevo: se guarda para que sobreviva a un F5.
const aplicarToken = (respuesta, dispatch) => {
  if (respuesta.token) {
    guardarToken(respuesta.token);
    dispatch(tokenActualizado(respuesta.token));
  }
};

export const cambiarPlan = createAsyncThunk("uso/cambiarPlan", async (plan, { dispatch, rejectWithValue }) => {
  try {
    const respuesta = await api("/usuarios/plan", { metodo: "PATCH", body: { plan } });
    aplicarToken(respuesta, dispatch);
    await dispatch(cargarUso());
    return respuesta.data.plan;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const aceptarInvitacion = createAsyncThunk("uso/aceptarInvitacion", async (token, { dispatch, rejectWithValue }) => {
  try {
    const respuesta = await api("/usuarios/invitacion/aceptar", { metodo: "POST", body: { token } });
    aplicarToken(respuesta, dispatch);
    await dispatch(cargarUso());
    return respuesta.message;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const desvincularContador = createAsyncThunk("uso/desvincular", async (_, { dispatch, rejectWithValue }) => {
  try {
    const respuesta = await api("/usuarios/contador", { metodo: "DELETE" });
    aplicarToken(respuesta, dispatch);
    await dispatch(cargarUso());
    return respuesta.message;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

const ESTADO_INICIAL = { datos: null, planes: [], cargando: false, error: null, cambiando: false, errorPlan: null, mensajePlan: null };

const usoSlice = createSlice({
  name: "uso",
  initialState: ESTADO_INICIAL,
  reducers: {
    limpiarMensajePlan: (state) => { state.errorPlan = null; state.mensajePlan = null; },
  },
  extraReducers: (builder) => {
    const enCurso = (state) => { state.cambiando = true; state.errorPlan = null; state.mensajePlan = null; };
    const fallo = (state, action) => { state.cambiando = false; state.errorPlan = action.payload; };
    builder
      .addCase(logout, () => ESTADO_INICIAL)
      .addCase(cargarUso.pending, (state) => { state.cargando = true; state.error = null; })
      .addCase(cargarUso.fulfilled, (state, action) => { state.cargando = false; state.datos = action.payload; })
      .addCase(cargarUso.rejected, (state, action) => { state.cargando = false; state.error = action.payload; })
      .addCase(cargarPlanes.fulfilled, (state, action) => { state.planes = action.payload; })
      // El contador se mantiene al día sin volver a pedirlo al servidor.
      .addCase(crearMovimiento.fulfilled, (state) => {
        if (state.datos?.usados !== undefined) {
          state.datos.usados += 1;
          state.datos.total += 1;
          if (state.datos.limite) state.datos.porcentaje = Math.min(Math.round((state.datos.usados / state.datos.limite) * 100), 100);
        }
      })
      .addCase(cambiarPlan.pending, enCurso)
      .addCase(cambiarPlan.fulfilled, (state) => { state.cambiando = false; state.mensajePlan = "Plan actualizado."; })
      .addCase(cambiarPlan.rejected, fallo)
      .addCase(aceptarInvitacion.pending, enCurso)
      .addCase(aceptarInvitacion.fulfilled, (state, action) => { state.cambiando = false; state.mensajePlan = action.payload; })
      .addCase(aceptarInvitacion.rejected, fallo)
      .addCase(desvincularContador.pending, enCurso)
      .addCase(desvincularContador.fulfilled, (state, action) => { state.cambiando = false; state.mensajePlan = action.payload; })
      .addCase(desvincularContador.rejected, fallo);
  },
});

export const { limpiarMensajePlan } = usoSlice.actions;
export default usoSlice.reducer;
