import React, { useRef, useCallback } from "react";

import { Link, useNavigate } from "react-router-dom";

import Button from "devextreme-react/button";
import Form, {
  Item,
  Label,
  ButtonItem,
  ButtonOptions,
  RequiredRule,
} from "devextreme-react/form";
import LoadIndicator from "devextreme-react/load-indicator";

import "./LoginForm.scss";
import { LoginOauth } from "../login-oauth/LoginOauth";
import { useSelector, useDispatch } from "react-redux";
import { signIn } from "../../store/auth/auth-actions";

function getButtonStylingMode(theme) {
  return theme === "dark" ? "outlined" : "contained";
}

export const LoginForm = ({ resetLink, createAccountLink }) => {
  const navigate = useNavigate();
  const formData = useRef({ email: "", password: "" });
  const currentTheme = useSelector((state) => state.theme.theme);

  const loading = useSelector((state) => state.auth.loading);
  const dispatch = useDispatch();

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const { identificationNumber, password } = formData.current;
      dispatch(signIn(identificationNumber, password));
    },
    [dispatch]
  );

  const onCreateAccountClick = useCallback(() => {
    navigate(createAccountLink);
  }, [navigate, createAccountLink]);

  return (
    <form className="login-form" onSubmit={onSubmit}>
      <Form
        formData={formData.current}
        disabled={loading}
        showColonAfterLabel
        showRequiredMark={false}
      >
        <Item
          dataField="identificationNumber"
          editorType="dxTextBox"
          editorOptions={emailEditorOptions}
        >
          <RequiredRule message="Identification Number is required" />
          {/* <EmailRule message="Email is invalid" /> */}
          <Label visible={false} />
        </Item>
        <Item
          dataField="password"
          editorType="dxTextBox"
          editorOptions={passwordEditorOptions}
        >
          <RequiredRule message="Password is required" />
          <Label visible={false} />
        </Item>
        <Item
          dataField="rememberMe"
          editorType="dxCheckBox"
          editorOptions={rememberMeEditorOptions}
        >
          <Label visible={false} />
        </Item>
        <ButtonItem>
          <ButtonOptions width="100%" type="default" useSubmitBehavior>
            <span className="dx-button-text">
              {loading ? (
                <LoadIndicator width="24px" height="24px" visible />
              ) : (
                "Sign In"
              )}
            </span>
          </ButtonOptions>
        </ButtonItem>
      </Form>
      <div className="reset-link">
        <Link to={resetLink}>Forgot password?</Link>
      </div>

      <Button
        className="btn-create-account"
        text="Create an account"
        width="100%"
        onClick={onCreateAccountClick}
        stylingMode={getButtonStylingMode(currentTheme)}
      />

      <LoginOauth />
    </form>
  );
};

const emailEditorOptions = {
  stylingMode: "filled",
  placeholder: "Identitification Number",
  mode: "identificationNumber",
};
const passwordEditorOptions = {
  stylingMode: "filled",
  placeholder: "Password",
  mode: "password",
};
const rememberMeEditorOptions = {
  text: "Remember me",
  elementAttr: { class: "form-text" },
};
