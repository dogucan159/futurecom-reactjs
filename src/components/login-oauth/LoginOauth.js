import React from "react";

import Button from "devextreme-react/button";

import "./LoginOauth.scss";
import { useSelector } from "react-redux";

function getButtonStylingMode(theme) {
  return theme === "dark" ? "outlined" : "contained";
}

export const LoginOauth = () => {
  const currentTheme = useSelector((state) => state.theme.theme);
  return (
    <div className="oauth-button-container">
      <p>or</p>
      <Button
        width="100%"
        icon="icons/google-logo.svg"
        text="Login with Google"
        stylingMode={getButtonStylingMode(currentTheme)}
      />
      <Button
        width="100%"
        icon="icons/microsoft-logo.svg"
        text="Login with Microsoft"
        stylingMode={getButtonStylingMode(currentTheme)}
      />
    </div>
  );
};
