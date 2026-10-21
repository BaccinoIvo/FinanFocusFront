import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../api/api";
import { guardarToken } from "../utils/token";
import { logout, planActualizado, tokenActualizado } from "./authSlice";
import { crearMovimiento, eliminarMovimiento } from "./movimientosSlice";

// Total de movimientos del usuario (sin filtros): se pide 1 solo para leer paginacion.total.
export const cargarUso = createAsyncThunk("uso/cargar", async (_, { rejectWithValue }) => {
  try {
    const { paginacion } = await api("/movimientos?limit=1");
    return paginacion.total;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const cambiarPlan = createAsyncThunk("uso/cambiarPlan", async (_, { dispatch, rejectWithValue }) => {
  try {
    const respuesta = await api("/usuarios/plan", { metodo: "PATCH" });
    // Si el backend devuelve un token nuevo (con el plan actualizado), se usa: así el plan
    // sobrevive a un F5. Si no, se actualiza solo en memoria.
    if (respuesta.token) {
      guardarToken(respuesta.token);
      dispatch(tokenActualizado(respuesta.token));
    } else {
      dispatch(planActualizado("premium"));
    }
    return respuesta.data.plan;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

const ESTADO_INICIAL = { total: null, cargando: false, error: null, cambiando: false, errorPlan: null };

const usoSlice = createSlice({
  name: "uso",
  initialState: ESTADO_INICIAL,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(logout, () => ESTADO_INICIAL)
      .addCase(cargarUso.pending, (state) => { state.cargando = true; state.error = null; })
      .addCase(cargarUso.fulfilled, (state, action) => { state.cargando = false; state.total = action.payload; })
      .addCase(cargarUso.rejected, (state, action) => { state.cargando = false; state.error = action.payload; })
      // El contador se mantiene al día sin volver a pedirlo al servidor.
      .addCase(crearMovimiento.fulfilled, (state) => { if (state.total !== null) state.total += 1; })
      .addCase(eliminarMovimiento.fulfilled, (state) => { if (state.total !== null) state.total = Math.max(state.total - 1, 0); })
      .addCase(cambiarPlan.pending, (state) => { state.cambiando = true; state.errorPlan = null; })
      .addCase(cambiarPlan.fulfilled, (state) => { state.cambiando = false; })
      .addCase(cambiarPlan.rejected, (state, action) => { state.cambiando = false; state.errorPlan = action.payload; });
  },
});

export default usoSlice.reducer;
