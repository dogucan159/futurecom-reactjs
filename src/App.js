import "devextreme/dist/css/dx.common.css";
// import "devextreme/dist/css/dx.light.css";
import "devexpress-richedit/dist/dx.richedit.css";

// import "./themes/generated/theme.base.css";
// import "./themes/generated/theme.additional.css";
import React, { useEffect } from "react";
// import "./dx-styles.scss";
import "./styles.scss";
import { useScreenSizeClass } from "./utils/media-query";
import { Content } from "./Content";
import { UnauthenticatedContent } from "./UnauthenticatedContent";
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
    // <Router>
    //   <div className={`app ${screenSizeClass}`}>
    //     <App />
    //   </div>
    // </Router>
    <div className={`app ${screenSizeClass}`}>
      <App />
    </div>
  );
}
