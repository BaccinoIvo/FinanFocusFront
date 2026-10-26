import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../api/api";
import { logout } from "./authSlice";

// El backend responde { USD: {...}, EUR: {...}, ... }; una moneda caída viene como { moneda, error }
// y no afecta a las demás.
export const cargarCotizaciones = createAsyncThunk("cotizaciones/cargar", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api("/cotizaciones", { timeoutMs: 30000 });
    return data;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

const ESTADO_INICIAL = { datos: null, cargando: false, error: null };

const cotizacionesSlice = createSlice({
  name: "cotizaciones",
  initialState: ESTADO_INICIAL,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(logout, () => ESTADO_INICIAL)
      .addCase(cargarCotizaciones.pending, (state) => { state.cargando = true; state.error = null; })
      .addCase(cargarCotizaciones.fulfilled, (state, action) => { state.cargando = false; state.datos = action.payload; })
      .addCase(cargarCotizaciones.rejected, (state, action) => { state.cargando = false; state.error = action.payload; });
  },
});

export default cotizacionesSlice.reducer;
