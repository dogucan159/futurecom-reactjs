import { Popup, ToolbarItem } from "devextreme-react/popup";
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

function ConfirmationModalProvider(props) {
  const [showConfirmationModal, setShowConfirmationModal] = useState();
  const resolver = useRef();

  const handleShow = () => {
    setShowConfirmationModal(true);
    return new Promise(function (resolve) {
      resolver.current = resolve;
    });
  };

  const handleOk = () => {
    resolver.current && resolver.current(true);
    setShowConfirmationModal(false);
  };

  const handleCancel = () => {
    resolver.current && resolver.current(false);
    setShowConfirmationModal(false);
  };

  const getCancelButtonOptions = useCallback(
    () => ({
      icon: "close",
      stylingMode: "contained",
      text: "Cancel",
      onClick: handleCancel,
    }),
    []
  );

  const getConfirmButtonOptions = useCallback(
    () => ({
      icon: "check",
      stylingMode: "contained",
      text: "Confirm",
      onClick: handleOk,
    }),
    []
  );

  return (
    <ConfirmationModalContext.Provider value={{ showConfirmation: handleShow }}>
      {props.children}

      <Popup
        visible={showConfirmationModal}
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
    </ConfirmationModalContext.Provider>
  );
}

const ConfirmationModalContext = createContext({});
const useConfirmationModal = () => useContext(ConfirmationModalContext);

export { ConfirmationModalProvider, useConfirmationModal };
