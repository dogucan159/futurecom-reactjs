import { configureStore } from "@reduxjs/toolkit";
import themeSlice from "./theme/theme-slice";
import authSlice from "./auth/auth-slice";
import navigationSlice from "./navigation/navigation-slice";
import confirmationSlice from "./confirmation/confirmation-slice";

const store = configureStore({
  reducer: {
    theme: themeSlice.reducer,
    auth: authSlice.reducer,
    navigation: navigationSlice.reducer,
    confirmation: confirmationSlice.reducer,
  },
});

export default store;
