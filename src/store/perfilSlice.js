import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../api/api";
import { guardarToken } from "../utils/token";
import { logout, tokenActualizado } from "./authSlice";

export const cargarPerfil = createAsyncThunk("perfil/cargar", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api("/usuarios/perfil");
    return data;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

// El nombre de usuario viaja dentro del token: el backend devuelve uno nuevo y se reemplaza.
export const guardarPerfil = createAsyncThunk("perfil/guardar", async (datos, { dispatch, rejectWithValue }) => {
  try {
    const respuesta = await api("/usuarios/perfil", { metodo: "PATCH", body: datos });
    if (respuesta.token) {
      guardarToken(respuesta.token);
      dispatch(tokenActualizado(respuesta.token));
    }
    return respuesta.data;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const cambiarPassword = createAsyncThunk("perfil/password", async (datos, { rejectWithValue }) => {
  try {
    const respuesta = await api("/usuarios/password", { metodo: "PATCH", body: datos });
    return respuesta.message;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

const ESTADO_INICIAL = {
  datos: null, cargando: false, error: null,
  guardando: false, errorGuardar: null, mensajeGuardar: null,
  cambiandoPassword: false, errorPassword: null, mensajePassword: null,
};

const perfilSlice = createSlice({
  name: "perfil",
  initialState: ESTADO_INICIAL,
  reducers: {
    limpiarMensajes: (state) => {
      state.errorGuardar = null; state.mensajeGuardar = null; state.errorPassword = null; state.mensajePassword = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logout, () => ESTADO_INICIAL)
      .addCase(cargarPerfil.pending, (state) => { state.cargando = true; state.error = null; })
      .addCase(cargarPerfil.fulfilled, (state, action) => { state.cargando = false; state.datos = action.payload; })
      .addCase(cargarPerfil.rejected, (state, action) => { state.cargando = false; state.error = action.payload; })
      .addCase(guardarPerfil.pending, (state) => { state.guardando = true; state.errorGuardar = null; state.mensajeGuardar = null; })
      .addCase(guardarPerfil.fulfilled, (state, action) => { state.guardando = false; state.datos = action.payload; state.mensajeGuardar = "Datos actualizados."; })
      .addCase(guardarPerfil.rejected, (state, action) => { state.guardando = false; state.errorGuardar = action.payload; })
      .addCase(cambiarPassword.pending, (state) => { state.cambiandoPassword = true; state.errorPassword = null; state.mensajePassword = null; })
      .addCase(cambiarPassword.fulfilled, (state) => { state.cambiandoPassword = false; state.mensajePassword = "Contraseña actualizada."; })
      .addCase(cambiarPassword.rejected, (state, action) => { state.cambiandoPassword = false; state.errorPassword = action.payload; });
  },
});

export const { limpiarMensajes } = perfilSlice.actions;
export default perfilSlice.reducer;
