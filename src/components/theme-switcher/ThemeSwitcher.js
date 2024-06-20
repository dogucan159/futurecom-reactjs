import React, { useCallback, useContext } from "react";
import Button from "devextreme-react/button";
import { useDispatch, useSelector } from "react-redux";
import { themeActions } from "../../store/theme-slice";

export const ThemeSwitcher = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);

  const onButtonClick = useCallback(() => {
    dispatch(themeActions.switchTheme());
  }, [dispatch]);

  return (
    <div>
      <Button
        className="theme-button"
        stylingMode="text"
        icon={`${theme !== "dark" ? "moon" : "sun"}`}
        onClick={onButtonClick}
      />
    </div>
  );
};
