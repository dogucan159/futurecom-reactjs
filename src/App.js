import "devextreme/dist/css/dx.common.css";
// import "./themes/generated/theme.base.css";
// import "./themes/generated/theme.additional.css";
import React from "react";
import { HashRouter as Router } from "react-router-dom";
// import "./dx-styles.scss";
import "./styles.scss";
import LoadPanel from "devextreme-react/load-panel";
import { NavigationProvider } from "./contexts/navigation";
import { AuthProvider, useAuth } from "./contexts/auth";
import { useScreenSizeClass } from "./utils/media-query";
import { Content } from './Content';
import { UnauthenticatedContent } from './UnauthenticatedContent';
import './components/theme/theme';
import { ThemeContext, useThemeContext } from "./components/theme/theme";
// import { HomePage, ProfilePage, TasksPage } from "./pages";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadPanel visible={true} />;
  }

  if (user) {
    return <Content />;
  }

  return <UnauthenticatedContent />;
}

export default function Root() {
  const screenSizeClass = useScreenSizeClass();
  const themeContext = useThemeContext();
  return (
    <Router>
      <ThemeContext.Provider value={themeContext}>
        <AuthProvider>
          <NavigationProvider>
            <div className={`app ${screenSizeClass}`}>
              <App />
            </div>
          </NavigationProvider>
        </AuthProvider>
      </ThemeContext.Provider>
    </Router>
  );
}
