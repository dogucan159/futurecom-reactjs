import "devextreme/dist/css/dx.common.css";
// import "./themes/generated/theme.base.css";
// import "./themes/generated/theme.additional.css";
import React, { useEffect } from "react";
import { HashRouter as Router } from "react-router-dom";
// import "./dx-styles.scss";
import "./styles.scss";
import LoadPanel from "devextreme-react/load-panel";
import { NavigationProvider } from "./contexts/navigation";
import { AuthProvider, useAuth } from "./contexts/auth";
import { useScreenSizeClass } from "./utils/media-query";
import { Content } from "./Content";
import { UnauthenticatedContent } from "./UnauthenticatedContent";
import "./components/theme/theme";
import { ConfirmationModalProvider } from "./contexts/confirmation";
import { useDispatch, useSelector } from "react-redux";
import { loadStylesImports } from "./store/theme-actions";
import { themeActions } from "./store/theme-slice";
// import { HomePage, ProfilePage, TasksPage } from "./pages";

function App() {
  const { user, token, loading } = useAuth();

  if (loading) {
    return <LoadPanel visible={true} />;
  }
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
      <AuthProvider>
        <NavigationProvider>
          <ConfirmationModalProvider>
            <div className={`app ${screenSizeClass}`}>
              <App />
            </div>
          </ConfirmationModalProvider>
        </NavigationProvider>
      </AuthProvider>
    </Router>
  );
}
