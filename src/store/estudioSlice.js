import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../api/api";
import { logout } from "./authSlice";
import { cargarUso } from "./usoSlice";

export const CLIENTES_POR_PAGINA = 8;
export const MOVS_CLIENTE_POR_PAGINA = 8;

export const cargarClientes = createAsyncThunk("estudio/clientes", async (page = 1, { rejectWithValue }) => {
  try {
    return await api(`/estudio/usuarios?page=${page}&limit=${CLIENTES_POR_PAGINA}`);
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const cargarInvitaciones = createAsyncThunk("estudio/invitaciones", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api("/estudio/invitaciones");
    return data;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

// Después de sumar o quitar un cliente se vuelve a pedir la lista y el informe de uso (clientes usados).
const refrescar = async (dispatch, getState) => {
  await dispatch(cargarClientes(getState().estudio.page));
  dispatch(cargarUso());
};

export const invitarCliente = createAsyncThunk("estudio/invitar", async (email, { dispatch, rejectWithValue }) => {
  try {
    const { data } = await api("/estudio/invitaciones", { metodo: "POST", body: { email } });
    dispatch(cargarInvitaciones());
    return data;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const crearPerfilSombra = createAsyncThunk("estudio/sombra", async (nombre, { dispatch, getState, rejectWithValue }) => {
  try {
    const { data } = await api("/estudio/perfiles-sombra", { metodo: "POST", body: { nombre } });
    await refrescar(dispatch, getState);
    return data;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const quitarCliente = createAsyncThunk("estudio/quitar", async (id, { dispatch, getState, rejectWithValue }) => {
  try {
    await api(`/estudio/usuarios/${id}`, { metodo: "DELETE" });
    await refrescar(dispatch, getState);
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

// ---- Detalle de un cliente ----
export const cargarMovimientosCliente = createAsyncThunk("estudio/movsCliente", async ({ id, page = 1 }, { rejectWithValue }) => {
  try {
    return await api(`/estudio/usuarios/${id}/movimientos?page=${page}&limit=${MOVS_CLIENTE_POR_PAGINA}`);
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const crearMovimientoCliente = createAsyncThunk("estudio/crearMov", async ({ id, datos, archivo }, { dispatch, rejectWithValue }) => {
  try {
    const { data } = await api(`/estudio/usuarios/${id}/movimientos`, { metodo: "POST", body: datos });
    let avisoAdjunto = null;
    if (archivo) {
      try {
        const formData = new FormData();
        formData.append("comprobante", archivo);
        await api(`/estudio/usuarios/${id}/movimientos/${data._id}/imagenes`, { metodo: "POST", formData });
      } catch (e) {
        avisoAdjunto = `El movimiento se creó, pero no se pudo adjuntar el comprobante (${e.message}).`;
      }
    }
    await dispatch(cargarMovimientosCliente({ id }));
    return { avisoAdjunto };
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const eliminarMovimientoCliente = createAsyncThunk("estudio/eliminarMov", async ({ id, movId, page }, { dispatch, rejectWithValue }) => {
  try {
    await api(`/estudio/usuarios/${id}/movimientos/${movId}`, { metodo: "DELETE" });
    await dispatch(cargarMovimientosCliente({ id, page }));
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

const ESTADO_INICIAL = {
  clientes: [], paginacion: { page: 1, totalPaginas: 1, total: 0 }, page: 1, cargando: false, error: null,
  invitaciones: [], ultimaInvitacion: null, errorAccion: null, accionando: false,
  movsCliente: [], movsPaginacion: { page: 1, totalPaginas: 1, total: 0 }, cargandoMovs: false, errorMovs: null,
};

const estudioSlice = createSlice({
  name: "estudio",
  initialState: ESTADO_INICIAL,
  reducers: {
    limpiarAccion: (state) => { state.errorAccion = null; state.ultimaInvitacion = null; },
    limpiarDetalle: (state) => { state.movsCliente = []; state.errorMovs = null; state.movsPaginacion = ESTADO_INICIAL.movsPaginacion; },
  },
  extraReducers: (builder) => {
    const accion = (state) => { state.accionando = true; state.errorAccion = null; };
    const accionFallo = (state, action) => { state.accionando = false; state.errorAccion = action.payload; };
    builder
      .addCase(logout, () => ESTADO_INICIAL)
      .addCase(cargarClientes.pending, (state, action) => { state.cargando = true; state.error = null; state.page = action.meta.arg ?? 1; })
      .addCase(cargarClientes.fulfilled, (state, action) => { state.cargando = false; state.clientes = action.payload.data; state.paginacion = action.payload.paginacion ?? ESTADO_INICIAL.paginacion; })
      .addCase(cargarClientes.rejected, (state, action) => { state.cargando = false; state.error = action.payload; })
      .addCase(cargarInvitaciones.fulfilled, (state, action) => { state.invitaciones = action.payload; })
      .addCase(invitarCliente.pending, (state) => { accion(state); state.ultimaInvitacion = null; })
      .addCase(invitarCliente.fulfilled, (state, action) => { state.accionando = false; state.ultimaInvitacion = action.payload; })
      .addCase(invitarCliente.rejected, accionFallo)
      .addCase(crearPerfilSombra.pending, accion)
      .addCase(crearPerfilSombra.fulfilled, (state) => { state.accionando = false; })
      .addCase(crearPerfilSombra.rejected, accionFallo)
      .addCase(quitarCliente.pending, accion)
      .addCase(quitarCliente.fulfilled, (state) => { state.accionando = false; })
      .addCase(quitarCliente.rejected, accionFallo)
      .addCase(cargarMovimientosCliente.pending, (state) => { state.cargandoMovs = true; state.errorMovs = null; })
      .addCase(cargarMovimientosCliente.fulfilled, (state, action) => { state.cargandoMovs = false; state.movsCliente = action.payload.data; state.movsPaginacion = action.payload.paginacion ?? ESTADO_INICIAL.movsPaginacion; })
      .addCase(cargarMovimientosCliente.rejected, (state, action) => { state.cargandoMovs = false; state.errorMovs = action.payload; });
  },
});

export const { limpiarAccion, limpiarDetalle } = estudioSlice.actions;
export default estudioSlice.reducer;
