import "devextreme/dist/css/dx.common.css";
// import "./themes/generated/theme.base.css";
// import "./themes/generated/theme.additional.css";
import React, { useEffect } from "react";
import { HashRouter as Router } from "react-router-dom";
// import "./dx-styles.scss";
import "./styles.scss";
import { NavigationProvider } from "./contexts/navigation";
import { useScreenSizeClass } from "./utils/media-query";
import { Content } from "./Content";
import { UnauthenticatedContent } from "./UnauthenticatedContent";
import { ConfirmationModalProvider } from "./contexts/confirmation";
import { useDispatch, useSelector } from "react-redux";
import { themeActions } from "./store/theme/theme-slice";
import { loadStylesImports } from "./store/theme/theme-actions";

function App() {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  // const loading = useSelector((state) => state.auth.loading);

  // if (loading) {
  //   return <LoadPanel visible={true} />;
  // }

  if (user && token && token.access_token && token.access_token !== "EXPIRED") {
    return <Content />;
  }

  return <UnauthenticatedContent />;
}

export default function Root() {
  const screenSizeClass = useScreenSizeClass();
  const dispatch = useDispatch();
  const loaded = useSelector((state) => state.theme.isLoaded);
  const currentTheme = useSelector((state) => state.theme.theme);

  useEffect(() => {
    dispatch(loadStylesImports());
  }, [dispatch]);

  useEffect(() => {
    loaded && dispatch(themeActions.setAppTheme({ newTheme: currentTheme }));
  }, [loaded, currentTheme, dispatch]);

  return (
    <Router>
      <NavigationProvider>
        <ConfirmationModalProvider>
          <div className={`app ${screenSizeClass}`}>
            <App />
          </div>
        </ConfirmationModalProvider>
      </NavigationProvider>
    </Router>
  );
}
