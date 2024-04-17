import React, { useState, createContext, useContext, useEffect } from "react";
import { getUser } from "../utils/auth";

const NavigationContext = createContext({});
const useNavigation = () => useContext(NavigationContext);

function NavigationProvider(props) {
  const [navigationData, setNavigationData] = useState({ currentPath: "" });

  return (
    <NavigationContext.Provider
      value={{ navigationData, setNavigationData }}
      {...props}
    />
  );
}

function withNavigationWatcher(Component, path) {
  const WrappedComponent = function (props) {
    const { setNavigationData } = useNavigation();

    useEffect(() => {
      const user = getUser();
      if (path.startsWith("/profile")) {
        const resultPath = path.replace(":selectedUserId", user.baseEntityId);
        setNavigationData({ currentPath: resultPath });
      } else {
        setNavigationData({ currentPath: path });
      }
    }, [setNavigationData]);

    return <Component {...props} />;
  };
  return <WrappedComponent />;
}

export { NavigationProvider, useNavigation, withNavigationWatcher };
