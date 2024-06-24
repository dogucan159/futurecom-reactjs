import { confirmationActions } from "./confirmation-slice";

export const handleShow = () => {
  return async (dispatch) => {
    dispatch(confirmationActions.setModalVisible({ isVisible: true }));
  };
};
