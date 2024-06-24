import appInfo from "./app-info";
import { Routes, Route, Navigate } from "react-router-dom";
import appRoutes from "./app-routes";
import { SideNavOuterToolbar as SideNavBarLayout } from "./layouts";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { navigationActions } from "./store/navigation/navigation-slice";
import { getUser } from "./utils/auth";

function withNavigationWatcher(Component, path) {
  const WrappedComponent = (props) => {
    const dispatch = useDispatch();

    useEffect(() => {
      const user = getUser();
      if (path.startsWith("/profile")) {
        const resultPath = path.replace(":selectedUserId", user.baseEntityId);
        dispatch(
          navigationActions.replaceNavigationData({
            data: { currentPath: resultPath },
          })
        );
      } else {
        dispatch(
          navigationActions.replaceNavigationData({
            data: { currentPath: path },
          })
        );
      }
    }, [dispatch]);

    return <Component {...props} />;
  };

  return <WrappedComponent />;
}

export const Content = () => {
  const [routes, setRoutes] = useState([]);
  useEffect(() => {
    const result = appRoutes.map(({ path, element }) => {
      return {
        path,
        element: withNavigationWatcher(element, path),
      };
    });
    setRoutes(result);
  }, []);

  return (
    <SideNavBarLayout title={appInfo.title}>
      <Routes>
        {routes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </SideNavBarLayout>
  );
};
