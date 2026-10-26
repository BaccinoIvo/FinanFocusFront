import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../api/api";
import { logout } from "./authSlice";

// Para graficar hace falta ver todos los movimientos, no una página: se piden de a 100.
export const cargarEstadisticas = createAsyncThunk("estadisticas/cargar", async (_, { rejectWithValue }) => {
  try {
    const primera = await api("/movimientos?limit=100&page=1");
    let todos = primera.data;
    const totalPaginas = primera.paginacion.totalPaginas;
    if (totalPaginas > 1) {
      const resto = await Promise.all(
        Array.from({ length: totalPaginas - 1 }, (_, i) => api(`/movimientos?limit=100&page=${i + 2}`))
      );
      resto.forEach((r) => { todos = todos.concat(r.data); });
    }
    return todos;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

const ESTADO_INICIAL = { items: [], cargando: false, error: null, cargadoUnaVez: false };

const estadisticasSlice = createSlice({
  name: "estadisticas",
  initialState: ESTADO_INICIAL,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(logout, () => ESTADO_INICIAL)
      .addCase(cargarEstadisticas.pending, (state) => { state.cargando = true; state.error = null; })
      .addCase(cargarEstadisticas.fulfilled, (state, action) => {
        state.cargando = false; state.items = action.payload; state.cargadoUnaVez = true;
      })
      .addCase(cargarEstadisticas.rejected, (state, action) => { state.cargando = false; state.error = action.payload; });
  },
});

export default estadisticasSlice.reducer;
