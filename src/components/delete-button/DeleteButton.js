import { Button } from "devextreme-react/button";
import { useConfirmationModal } from "../../contexts/confirmation";
import notify from "devextreme/ui/notify";

export const DeleteButton = (props) => {
  const { showConfirmation } = useConfirmationModal();
  const handleOnClick = async () => {
    const selectedRows = props.getSelectedRows();
    if (selectedRows && selectedRows.length > 0) {
      var result = await showConfirmation();
      result && props.onClick();
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

  return (
    <Button icon="trash" onClick={handleOnClick}>
      {props.children}
    </Button>
  );
};
