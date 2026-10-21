import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../api/api";
import { logout } from "./authSlice";
import { MOVS_POR_PAGINA } from "../utils/constantes";

export const FILTROS_INICIALES = { tipo: "", categoria: "", moneda: "", desde: "", hasta: "" };

// Lee filtros y página desde el store, así cualquier componente puede pedir "recargar".
export const cargarMovimientos = createAsyncThunk("movimientos/cargar", async (_, { getState, rejectWithValue }) => {
  const { filtros, page } = getState().movimientos;
  const params = new URLSearchParams({ page, limit: MOVS_POR_PAGINA });
  Object.entries(filtros).forEach(([clave, valor]) => { if (valor) params.set(clave, valor); });
  try {
    return await api(`/movimientos?${params}`);
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const crearMovimiento = createAsyncThunk("movimientos/crear", async (datos, { dispatch, rejectWithValue }) => {
  try {
    const { data } = await api("/movimientos", { metodo: "POST", body: datos });
    await dispatch(cargarMovimientos());
    return data;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const actualizarMovimiento = createAsyncThunk("movimientos/actualizar", async ({ id, datos }, { dispatch, rejectWithValue }) => {
  try {
    await api(`/movimientos/${id}`, { metodo: "PUT", body: datos });
    await dispatch(cargarMovimientos());
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const eliminarMovimiento = createAsyncThunk("movimientos/eliminar", async (id, { dispatch, rejectWithValue }) => {
  try {
    await api(`/movimientos/${id}`, { metodo: "DELETE" });
    await dispatch(cargarMovimientos());
    return id;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

// El archivo viaja como multipart/form-data con el campo "comprobante" (así lo espera multer).
export const subirComprobante = createAsyncThunk("movimientos/subirComprobante", async ({ id, archivo }, { dispatch, rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("comprobante", archivo);
    await api(`/movimientos/${id}/imagenes`, { metodo: "POST", formData });
    await dispatch(cargarMovimientos());
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

const ESTADO_INICIAL = {
  items: [],
  paginacion: { page: 1, totalPaginas: 1, total: 0 },
  filtros: FILTROS_INICIALES,
  page: 1,
  cargando: false,
  error: null,
};

const movimientosSlice = createSlice({
  name: "movimientos",
  initialState: ESTADO_INICIAL,
  reducers: {
    setFiltros: (state, action) => {
      state.filtros = { ...state.filtros, ...action.payload };
      state.page = 1; // al cambiar un filtro se vuelve a la primera página
    },
    limpiarFiltros: (state) => {
      state.filtros = FILTROS_INICIALES;
      state.page = 1;
    },
    setPage: (state, action) => { state.page = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logout, () => ESTADO_INICIAL)
      .addCase(cargarMovimientos.pending, (state) => { state.cargando = true; state.error = null; })
      .addCase(cargarMovimientos.fulfilled, (state, action) => {
        state.cargando = false;
        state.items = action.payload.data;
        state.paginacion = action.payload.paginacion;
        // Si se borró el último de una página, se retrocede a la última existente.
        if (action.payload.data.length === 0 && state.page > 1) {
          state.page = Math.max(action.payload.paginacion.totalPaginas, 1);
        }
      })
      .addCase(cargarMovimientos.rejected, (state, action) => { state.cargando = false; state.error = action.payload; });
  },
});

export const { setFiltros, limpiarFiltros, setPage } = movimientosSlice.actions;
export default movimientosSlice.reducer;
