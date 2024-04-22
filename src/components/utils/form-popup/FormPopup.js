import "./FormPopup.scss";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { useScreenSize } from "../../../utils/media-query";
import { Button } from "devextreme-react";
import ValidationGroup from "devextreme-react/validation-group";
import { Popup, ToolbarItem } from "devextreme-react/popup";

export const FormPopup = forwardRef(
  (
    {
      title,
      visible,
      width = 480,
      height = "auto",
      onSave,
      setVisible,
      wrapperAttr = { class: "" },
      isSaveDisabled = false,
      children,
    },
    ref
  ) => {
    const { isXSmall } = useScreenSize();
    const validationGroup = useRef(null);

    useImperativeHandle(ref, () => {
      return {
        close() {
          validationGroup.current?.instance.reset();
          setVisible(false);     
        }
      }
    });    

    const close = useCallback(() => {
      validationGroup.current?.instance.reset();
      setVisible(false);
    }, [setVisible]);

    const onCancelClick = useCallback(() => {
      close();
    }, [close]);

    const onSaveClick = useCallback(() => {
      if (!validationGroup.current?.instance.validate().isValid) return;

      onSave && onSave();
      // close();
    }, [validationGroup, onSave]);

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
  }
);
