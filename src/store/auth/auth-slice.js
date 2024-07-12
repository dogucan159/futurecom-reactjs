import { createSlice } from "@reduxjs/toolkit";
import { getToken, getUser } from "../../utils/auth";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: getUser(),
    token: getToken(),
    loading: false,
    popupVisible: false,
  },
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload.isLoading;
    },
    setPopupVisible(state, action) {
      state.popupVisible = action.payload.isVisible;
    },
    refreshToken(state, action) {
      state.token = action.payload.tokenData;
      state.popupVisible = false;
    },
    replaceUser(state, action) {
      state.user = action.payload.sessionUserData;
      state.token = action.payload.tokenData;
      state.loading = false;
    },
    clearUser(state) {
      state.user = undefined;
      state.token = undefined;
      state.popupVisible = false;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice;
