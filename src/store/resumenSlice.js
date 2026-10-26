import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../api/api";
import { logout } from "./authSlice";

// Se pide solo cuando el usuario lo pide: la IA tarda unos segundos y no hace falta en cada visita.
export const generarResumen = createAsyncThunk("resumen/generar", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api("/resumen-fiscal", { timeoutMs: 55000 });
    return data; // { estado, resumenNarrado | null, fuente: "groq" | "gemini" | "reglas" }
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

const ESTADO_INICIAL = { data: null, cargando: false, error: null };

const resumenSlice = createSlice({
  name: "resumen",
  initialState: ESTADO_INICIAL,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(logout, () => ESTADO_INICIAL)
      .addCase(generarResumen.pending, (state) => { state.cargando = true; state.error = null; })
      .addCase(generarResumen.fulfilled, (state, action) => { state.cargando = false; state.data = action.payload; })
      .addCase(generarResumen.rejected, (state, action) => { state.cargando = false; state.error = action.payload; });
  },
});

export default resumenSlice.reducer;
