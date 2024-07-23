import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { SideNavOuterToolbar as SideNavBarLayout } from "./layouts";
import {
  AppSettingPage,
  AppSettingsPage,
  EmailContentPage,
  EmailContentsPage,
  HomePage,
  LocalizationsPage,
  TasksPage,
  UserLogsPage,
  UserProfilePage,
} from "./pages";
import AppSettingsRootPage from "./pages/app-settings/AppSettingsRoot";
import EmailContentsRootPage from "./pages/email-contents/EmailContentsRoot";
import { loader as localizationLoader } from "./pages/localizations/localizations";
import ErrorPage from "./pages/error/Error";

// function withNavigationWatcher(Component, path) {
//   const WrappedComponent = (props) => {
//     const dispatch = useDispatch();

//     useEffect(() => {
//       const user = getUser();
//       if (path.startsWith("/profile")) {
//         const resultPath = path.replace(":selectedUserId", user.baseEntityId);
//         dispatch(
//           navigationActions.replaceNavigationData({
//             data: { currentPath: resultPath },
//           })
//         );
//       } else {
//         dispatch(
//           navigationActions.replaceNavigationData({
//             data: { currentPath: path },
//           })
//         );
//       }
//     }, [dispatch]);

//     return <Component {...props} />;
//   };

//   return <WrappedComponent />;
// }

export const Content = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <SideNavBarLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: "profile/:selectedUserId",
          element: <UserProfilePage />,
        },
        {
          path: "tasks",
          element: <TasksPage />,
        },
        {
          path: "app-settings",
          element: <AppSettingsRootPage />,
          children: [
            {
              index: true,
              element: <AppSettingsPage />,
            },
            {
              path: ":selectedAppSettingId",
              element: <AppSettingPage />,
            },
            {
              path: "new",
              element: <AppSettingPage />,
            },
          ],
        },
        {
          path: "email-contents",
          element: <EmailContentsRootPage />,
          children: [
            {
              index: true,
              element: <EmailContentsPage />,
            },
            {
              path: ":selectedEmailContentId",
              element: <EmailContentPage />,
            },
            {
              path: "new",
              element: <EmailContentPage />,
            },
          ],
        },
        {
          path: "user-logs",
          element: <UserLogsPage />,
        },
        {
          path: "localizations",
          element: <LocalizationsPage />,
          loader: localizationLoader,
        },
      ],
    },
  ]);
  // const [routes, setRoutes] = useState([]);
  // useEffect(() => {
  //   const result = appRoutes.map(({ path, element }) => {
  //     return {
  //       path,
  //       element: withNavigationWatcher(element, path),
  //     };
  //   });
  //   setRoutes(result);
  // }, []);

  return (
    // <SideNavBarLayout title={appInfo.title}>
    //   <Routes>
    //     {routes.map(({ path, element }) => (
    //       <Route key={path} path={path} element={element} />
    //     ))}
    //     <Route path="*" element={<Navigate to="/home" />} />
    //   </Routes>
    // </SideNavBarLayout>
    <RouterProvider router={router} />
  );
};
