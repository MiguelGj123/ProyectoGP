import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import usersService from "../../services/usersService";

export const fetchMyList = createAsyncThunk(
  "userList/fetchAll",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.user.token;
      return await usersService.getMyList(token);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.[0] || "Error al obtener tu lista",
      );
    }
  },
);

export const addToList = createAsyncThunk(
  "userList/add",
  async (videojuegoId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.user.token;
      await usersService.addToList(videojuegoId, token);
      return videojuegoId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.[0] || "Error al guardar en tu lista",
      );
    }
  },
);

export const removeFromList = createAsyncThunk(
  "userList/remove",
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.user.token;
      await usersService.removeFromList(id, token);
      return id; // Devolvemos el ID para filtrarlo localmente en el Reducer
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.[0] || "Error al eliminar",
      );
    }
  },
);

const userListSlice = createSlice({
  name: "userList",
  initialState: { items: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyList.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyList.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(removeFromList.fulfilled, (state, action) => {
        state.items = state.items.filter((j) => j.id !== action.payload);
      });
    // Nota: Al añadir un juego (addToList) no mutamos el array aquí directamente
    // porque solo tenemos el ID. La próxima vez que el usuario entre en "Mi Lista",
    // el fetchMyList descargará los datos completos (título, género, etc.).
  },
});

export default userListSlice.reducer;
