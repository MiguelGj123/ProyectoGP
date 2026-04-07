import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./redux/reducers/authSlice";
import videogamesReducer from "./redux/reducers/videogamesSlice";
import userListReducer from "./redux/reducers/userListSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    videogames: videogamesReducer,
    userList: userListReducer,
  },
});

export default store;
