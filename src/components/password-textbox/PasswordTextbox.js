import TextBox, { Button } from 'devextreme-react/text-box';
import Validator from 'devextreme-react/validator';
import { forwardRef, useCallback, useMemo, useState } from "react";

export const PasswordTextBox = forwardRef(
  (
    {
      value = "",
      onValueChange,
      placeholder,
      stylingMode = "filled",
      validators,
      onValueValidated,
    },
    ref
  ) => {
    const [isPasswordMode, setIsPasswordMode] = useState(true);
    const buttonStylingMode = "text";

    const validationRules = useMemo(
      () =>
        validators || [
          {
            type: "required",
            message: "Password is required",
          },
        ],
      [validators]
    );

    const switchMode = useCallback(() => {
      setIsPasswordMode(!isPasswordMode);
    }, [isPasswordMode]);

    const buttonOptions = useMemo(
      () => ({
        visible: value?.length > 0,
        icon: isPasswordMode ? "eyeopen" : "eyeclose",
        hoverStateEnabled: false,
        activeStateEnabled: false,
        stylingMode: buttonStylingMode,
        onClick: switchMode,
      }),
      [value, switchMode]
    );

    return (
      <TextBox
        value={value}
        stylingMode={stylingMode}
        valueChangeEvent="keyup input change"
        placeholder={placeholder}
        mode={isPasswordMode ? "password" : "text"}
        onValueChange={onValueChange}
      >
        <Button name="today" location="after" options={buttonOptions} />
        <Validator
          ref={ref}
          validationRules={validationRules}
          onValidated={onValueValidated}
        />
      </TextBox>
    );
  }
);
