import { configureStore } from "@reduxjs/toolkit";
import themeSlice from "./theme/theme-slice";
import authSlice from "./auth/auth-slice";

const store = configureStore({
  reducer: { theme: themeSlice.reducer, auth: authSlice.reducer },
});

export default store;
