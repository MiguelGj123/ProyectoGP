import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {
    // Aquí inyectaremos los reducers de autenticación e inventario más adelante
  },
});

export default store;
