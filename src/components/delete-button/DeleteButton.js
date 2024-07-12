import { Button } from "devextreme-react/button";
import notify from "devextreme/ui/notify";
import { Fragment, useCallback } from "react";
import { Popup, ToolbarItem } from "devextreme-react/popup";
import { useSelector, useDispatch } from "react-redux";
import { confirmationActions } from "../../store/confirmation/confirmation-slice";

export const DeleteButton = (props) => {
  const dispatch = useDispatch();

  const visible = useSelector(
    (state) => state.confirmation.showConfirmationModal
  );

  const handleOnClick = async () => {
    const selectedRows = props.getSelectedRows();
    if (selectedRows && selectedRows.length > 0) {
      dispatch(confirmationActions.setModalVisible({ isVisible: true }));
    } else {
      notify(
        {
          message: "Please, select row(s) to delete",
          position: { at: "top center", my: "top center" },
        },
        "warning",
        1000
      );
    }
  };

  const handleCancel = useCallback(() => {
    dispatch(confirmationActions.setModalVisible({ isVisible: false }));
  }, [dispatch]);

  const getCancelButtonOptions = useCallback(
    () => ({
      icon: "close",
      stylingMode: "contained",
      text: "Cancel",
      onClick: handleCancel,
    }),
    [handleCancel]
  );

  const handleOk = useCallback(async () => {
    await props.onClick();
    dispatch(confirmationActions.setModalVisible({ isVisible: false }));
  }, [dispatch, props]);

  const getConfirmButtonOptions = useCallback(
    () => ({
      icon: "check",
      stylingMode: "contained",
      text: "Confirm",
      onClick: handleOk,
    }),
    [handleOk]
  );

  return (
    <Fragment>
      <Button icon="trash" onClick={handleOnClick}>
        {props.children}
      </Button>
      <Popup
        visible={visible}
        dragEnabled={false}
        hideOnOutsideClick={false}
        showCloseButton={false}
        showTitle={true}
        title="Warning"
        container=".dx-viewport"
        width={400}
        height={200}
      >
        <ToolbarItem
          widget="dxButton"
          toolbar="bottom"
          location="after"
          options={getCancelButtonOptions()}
        />
        <ToolbarItem
          widget="dxButton"
          toolbar="bottom"
          location="after"
          options={getConfirmButtonOptions()}
        />
        <p>Seçilen kayıtları silmek istediğinizden emin misiniz?</p>
      </Popup>
    </Fragment>
  );
};
