import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../api/api";
import { logout } from "./authSlice";

// Trae todas las categorías visibles para el usuario (del sistema + propias).
export const cargarCategorias = createAsyncThunk("categorias/cargar", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api("/categorias?limit=100");
    return data;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const crearCategoria = createAsyncThunk("categorias/crear", async (datos, { dispatch, rejectWithValue }) => {
  try {
    await api("/categorias", { metodo: "POST", body: datos });
    await dispatch(cargarCategorias());
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const actualizarCategoria = createAsyncThunk("categorias/actualizar", async ({ id, datos }, { dispatch, rejectWithValue }) => {
  try {
    await api(`/categorias/${id}`, { metodo: "PUT", body: datos });
    await dispatch(cargarCategorias());
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const eliminarCategoria = createAsyncThunk("categorias/eliminar", async (id, { dispatch, rejectWithValue }) => {
  try {
    await api(`/categorias/${id}`, { metodo: "DELETE" });
    await dispatch(cargarCategorias());
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

const ESTADO_INICIAL = { items: [], cargando: false, error: null };

const categoriasSlice = createSlice({
  name: "categorias",
  initialState: ESTADO_INICIAL,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(logout, () => ESTADO_INICIAL)
      .addCase(cargarCategorias.pending, (state) => { state.cargando = true; state.error = null; })
      .addCase(cargarCategorias.fulfilled, (state, action) => { state.cargando = false; state.items = action.payload; })
      .addCase(cargarCategorias.rejected, (state, action) => { state.cargando = false; state.error = action.payload; });
  },
});

export default categoriasSlice.reducer;
