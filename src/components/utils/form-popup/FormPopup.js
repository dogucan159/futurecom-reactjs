import './FormPopup.scss';
import { useCallback, useRef } from "react";
import { useScreenSize } from "../../../utils/media-query";
import { Button } from 'devextreme-react';
import ValidationGroup from 'devextreme-react/validation-group';
import { Popup, ToolbarItem } from 'devextreme-react/popup';

export const FormPopup = ({
  title,
  visible,
  width = 480,
  height = "auto",
  onSave,
  setVisible,
  wrapperAttr = { class: "" },
  isSaveDisabled = false,
  children,
}) => {
  const { isXSmall } = useScreenSize();
  const validationGroup = useRef(null);

  const close = () => {
    validationGroup.current?.instance.reset();
    setVisible(false);
  };

  const onCancelClick = useCallback(() => {
    close();
  }, [close, validationGroup]);

  const onSaveClick = useCallback(() => {
    if (!validationGroup.current?.instance.validate().isValid) return;

    onSave && onSave();
    close();
  }, [validationGroup]);

  return (
    <Popup
      title={title}
      visible={visible}
      fullScreen={isXSmall}
      width={width}
      wrapperAttr={{
        ...wrapperAttr,
        class: `${wrapperAttr?.class} form-popup`,
      }}
      height={height}
    >
      <ToolbarItem toolbar="bottom" location="center">
        <div
          className={`form-popup-buttons-container ${
            width <= 360 ? "flex-buttons" : ""
          }`}
        >
          <Button
            text="Cancel"
            stylingMode="outlined"
            type="normal"
            onClick={onCancelClick}
          />
          <Button
            text="Save"
            stylingMode="contained"
            type="default"
            disabled={isSaveDisabled}
            onClick={onSaveClick}
          />
        </div>
      </ToolbarItem>
      <ValidationGroup ref={validationGroup}>{children}</ValidationGroup>
    </Popup>
  );
};