import { createSlice } from "@reduxjs/toolkit";

const confirmationSlice = createSlice({
  name: "confirmation",
  initialState: {
    showConfirmationModal: false,
    confirmButtonOptions: {
        
    }
  },
  reducers: {
    setModalVisible(state, action) {
      state.showConfirmationModal = action.payload.isVisible;
    },
  },
});

export const confirmationActions = confirmationSlice.actions;

export default confirmationSlice;
