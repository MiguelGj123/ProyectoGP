import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/authService";

// Thunk asíncrono para manejar la petición HTTP y el LocalStorage
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const user = await authService.login(credentials);
      // Guardamos en LocalStorage al tener éxito
      window.localStorage.setItem("gameStoreUser", JSON.stringify(user));
      return user; // Este return se convierte en action.payload
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.[0] || "Credenciales inválidas",
      );
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null },
  reducers: {
    // Inicializa el estado desde LocalStorage al cargar la App
    initAuth: (state) => {
      const loggedUserJSON = window.localStorage.getItem("gameStoreUser");
      if (loggedUserJSON) {
        state.user = JSON.parse(loggedUserJSON);
      }
    },
    // Limpia el estado y el LocalStorage
    logout: (state) => {
      window.localStorage.removeItem("gameStoreUser");
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
});

export const { initAuth, logout } = authSlice.actions;
export default authSlice.reducer;
