import { configureStore } from "@reduxjs/toolkit";
import themeSlice from "./theme-slice";

const store = configureStore({
  reducer: { theme: themeSlice.reducer },
});


export default store;
