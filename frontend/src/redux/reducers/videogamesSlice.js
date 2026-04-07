import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import videogameService from "../../services/videogameService";

export const fetchVideogames = createAsyncThunk(
  "videogames/fetchAll",
  async (_, { getState }) => {
    // Tomamos los filtros y la página directamente del estado global
    const { filters, currentPage } = getState().videogames;
    return await videogameService.getAll({ ...filters, page: currentPage });
  },
);

export const addVideogame = createAsyncThunk(
  "videogames/add",
  async (gameData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.user.token;
      return await videogameService.create(gameData, token);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.[0] || "Error al crear",
      );
    }
  },
);

export const editVideogame = createAsyncThunk(
  "videogames/edit",
  async ({ id, gameData }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.user.token;
      return await videogameService.update(id, gameData, token);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.[0] || "Error al editar",
      );
    }
  },
);

export const deleteVideogame = createAsyncThunk(
  "videogames/delete",
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.user.token;
      await videogameService.remove(id, token);
      return id; // Devolvemos el ID para filtrarlo en el reducer
    } catch (error) {
      return rejectWithValue("Error al eliminar");
    }
  },
);

const videogamesSlice = createSlice({
  name: "videogames",
  initialState: {
    items: [],
    loading: false,
    totalPages: 1,
    currentPage: 1,
    filters: { search: "", genero: "" },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;
      state.currentPage = 1;
    },
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideogames.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVideogames.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(addVideogame.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(editVideogame.fulfilled, (state, action) => {
        const index = state.items.findIndex((j) => j.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteVideogame.fulfilled, (state, action) => {
        state.items = state.items.filter((j) => j.id !== action.payload);
      });
  },
});

export const { setFilters, setPage } = videogamesSlice.actions;
export default videogamesSlice.reducer;
