import "./ChangeProfilePasswordForm.scss";
import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import notify from "devextreme/ui/notify";
import Form, { Item, Label } from "devextreme-react/form";
import { FormPopup } from "../utils/form-popup/FormPopup";
import { PasswordTextBox } from "../../components/password-textbox/PasswordTextbox";
import { updatePassword } from "../../api/user";
import { getToken } from "../../utils/auth";

export const ChangeProfilePasswordForm = ({
  visible,
  setVisible,
  currentUserId,
}) => {
  const childRef = useRef();
  const confirmField = useRef(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [currentPasswordValid, setCurrentPasswordValid] = useState(false);
  const [newPasswordValid, setNewPasswordValid] = useState(false);
  const [confirmedPasswordValid, setConfirmedPasswordValid] = useState(false);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);

  const newPasswordValidators = useMemo(() => {
    return [
      {
        type: "stringLength",
        message: "Password must be at least 8 characters",
        min: 8,
      },
    ];
  }, []);
  const confirmPasswordValidators = useMemo(() => {
    return [
      {
        type: "compare",
        message: "Passwords do not match",
        comparisonTarget: () => newPassword,
      },
    ];
  }, [newPassword]);

  useEffect(() => {
    const formValues = [currentPassword, newPassword, confirmedPassword];
    const validity = [
      currentPasswordValid,
      newPasswordValid,
      confirmedPasswordValid,
    ];

    setIsSaveDisabled(
      formValues.some((value) => !value) || validity.some((value) => !value)
    );
  }, [
    currentPassword,
    newPassword,
    confirmedPassword,
    currentPasswordValid,
    newPasswordValid,
    confirmedPasswordValid,
  ]);

  const checkConfirm = useCallback(() => {
    confirmField.current?.instance.validate();
  }, []);

  const onCurrentPasswordValidated = useCallback((e) => {
    setCurrentPasswordValid(!!e.isValid);
  }, []);

  const onConfirmedPasswordValidated = useCallback((e) => {
    setConfirmedPasswordValid(!!e.isValid);
  }, []);

  const onNewPasswordValidated = useCallback((e) => {
    setNewPasswordValid(!!e.isValid);
  }, []);

  const onNewPasswordChange = useCallback(
    (value) => {
      setNewPassword(value);

      checkConfirm();
    },
    [checkConfirm]
  );

  const saveNewPassword = useCallback(
    async (currentPassword, newPassword, confirmedPassword) => {
      try {
        const token = getToken();
        await updatePassword(
          currentUserId,
          currentPassword,
          newPassword,
          confirmedPassword,
          token.access_token
        );
        notify(
          {
            message: "Password Changed",
            position: { at: "bottom center", my: "bottom center" },
          },
          "success"
        );
        childRef.current.close();
      } catch (error) {
        const message = `An error occurred while updating the password:  ${error.message}`;
        notify(message, "error", 7000);
      }
    },
    [currentUserId]
  );

  return (
    <FormPopup
      ref={childRef}
      title="Change Password"
      visible={visible}
      width={360}
      height={410}
      wrapperAttr={{ class: "change-profile-password-popup" }}
      isSaveDisabled={isSaveDisabled}
      onSave={() => {
        saveNewPassword(currentPassword, newPassword, confirmedPassword);
      }}
      setVisible={setVisible}
    >
      <Form
        id="form"
        labelMode="outside"
        showColonAfterLabelF
        labelLocation="top"
      >
        <Item>
          <Label text="Current Password" />
          <PasswordTextBox
            value={currentPassword}
            placeholder="Current Password"
            onValueChange={setCurrentPassword}
            onValueValidated={onCurrentPasswordValidated}
          />
        </Item>

        <Item>
          <div className="h-separator" />
        </Item>

        <Item>
          <Label text="Password" />
          <PasswordTextBox
            value={newPassword}
            placeholder="Password"
            validators={newPasswordValidators}
            onValueChange={onNewPasswordChange}
            onValueValidated={onNewPasswordValidated}
          />
        </Item>

        <Item>
          <Label text="Confirm Password" />
          <PasswordTextBox
            ref={confirmField}
            value={confirmedPassword}
            placeholder="Confirm Password"
            validators={confirmPasswordValidators}
            onValueChange={setConfirmedPassword}
            onValueValidated={onConfirmedPasswordValidated}
          />
        </Item>
      </Form>
    </FormPopup>
  );
};
