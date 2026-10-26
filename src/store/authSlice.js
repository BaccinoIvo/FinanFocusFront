import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../api/api";
import { borrarToken, decodificarToken, guardarToken, leerToken } from "../utils/token";

const usuarioDesdeToken = (token) => {
  const d = decodificarToken(token);
  return d ? { id: d.id, nombreUsuario: d.nombreUsuario, tipo: d.tipo, plan: d.plan } : null;
};

export const login = createAsyncThunk("auth/login", async (credenciales, { rejectWithValue }) => {
  try {
    const { token } = await api("/auth/login", { metodo: "POST", body: credenciales });
    guardarToken(token);
    return token;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

// Registro con auto-login: el backend devuelve el token al registrar.
export const registrar = createAsyncThunk("auth/registrar", async (datos, { rejectWithValue }) => {
  try {
    const { token } = await api("/auth/register", { metodo: "POST", body: datos });
    guardarToken(token);
    return token;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

const tokenInicial = leerToken();

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: tokenInicial,
    usuario: tokenInicial ? usuarioDesdeToken(tokenInicial) : null,
    cargando: false,
    error: null,
    vencida: false,
  },
  reducers: {
    // logout({ vencida: true }) lo dispara el aviso global de 401: se explica en la pantalla de login.
    logout: {
      reducer: (state, action) => {
        borrarToken();
        state.token = null;
        state.usuario = null;
        state.error = null;
        state.vencida = Boolean(action.payload?.vencida);
      },
      prepare: (opciones) => ({ payload: opciones ?? {} }),
    },
    limpiarError: (state) => {
      state.error = null;
    },
    // Se usa cuando el usuario pasa a premium (el plan está dentro del JWT, no se re-emite).
    planActualizado: (state, action) => {
      if (state.usuario) state.usuario.plan = action.payload;
    },
    // Reemplaza el token por uno nuevo (por ejemplo, tras cambiar de plan).
    tokenActualizado: (state, action) => {
      state.token = action.payload;
      state.usuario = usuarioDesdeToken(action.payload);
    },
  },
  extraReducers: (builder) => {
    const pendiente = (state) => { state.cargando = true; state.error = null; state.vencida = false; };
    const exito = (state, action) => {
      state.cargando = false;
      state.token = action.payload;
      state.usuario = usuarioDesdeToken(action.payload);
    };
    const fallo = (state, action) => { state.cargando = false; state.error = action.payload; };
    builder
      .addCase(login.pending, pendiente).addCase(login.fulfilled, exito).addCase(login.rejected, fallo)
      .addCase(registrar.pending, pendiente).addCase(registrar.fulfilled, exito).addCase(registrar.rejected, fallo);
  },
});

export const { logout, limpiarError, planActualizado, tokenActualizado } = authSlice.actions;
export default authSlice.reducer;
