import React, { useState, useRef, useCallback } from "react";

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
import notify from "devextreme/ui/notify";

import "./LoginForm.scss";
import { useAuth } from "../../contexts/auth";
import { LoginOauth } from "../login-oauth/LoginOauth";
import { useSelector } from "react-redux";

function getButtonStylingMode(theme) {
  return theme === "dark" ? "outlined" : "contained";
}

export const LoginForm = ({ resetLink, createAccountLink }) => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const formData = useRef({ email: "", password: "" });
  const currentTheme = useSelector((state) => state.theme.theme);

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const { identificationNumber, password } = formData.current;
      setLoading(true);

      const result = await signIn(identificationNumber, password);
      if (!result.isOk) {
        setLoading(false);
        notify(result.message, "error", 2000);
      }
    },
    [signIn]
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
