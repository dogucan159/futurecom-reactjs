import { createSlice } from "@reduxjs/toolkit";

const navigationSlice = createSlice({
  name: "navigation",
  initialState: {
    navigationData: { currentPath: "" },
  },
  reducers: {
    replaceNavigationData(state, action) {
      state.navigationData = action.payload.data;
    },
  },
});

export const navigationActions = navigationSlice.actions;

export default navigationSlice;
