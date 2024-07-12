import { createSlice } from "@reduxjs/toolkit";

const confirmationSlice = createSlice({
  name: "confirmation",
  initialState: {
    showConfirmationModal: false
  },
  reducers: {
    setModalVisible(state, action) {
      state.showConfirmationModal = action.payload.isVisible;
    },
  },
});

export const confirmationActions = confirmationSlice.actions;

export default confirmationSlice;
