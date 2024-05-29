import {
  HomePage,
  TasksPage,
  UserProfilePage,
  EmailContentPage,
  EmailContentsPage,
  UserLogsPage,
  AppSettingPage,
  AppSettingsPage,
} from "./pages";
import { withNavigationWatcher } from "./contexts/navigation";

const routes = [
  {
    path: "/home",
    element: HomePage,
  },
  {
    path: "/profile/:selectedUserId",
    element: UserProfilePage,
  },
  {
    path: "/tasks",
    element: TasksPage,
  },
  {
    path: "/app-settings",
    element: AppSettingsPage,
  },
  {
    path: "/email-contents",
    element: EmailContentsPage,
  },
  {
    path: "/user-logs",
    element: UserLogsPage,
  },
  {
    path: "/app-setting/new",
    element: AppSettingPage,
  },
  {
    path: "/app-setting/:selectedAppSettingId",
    element: AppSettingPage,
  },
  {
    path: "/email-content/new",
    element: EmailContentPage,
  },
  {
    path: "/email-content/:selectedEmailContentId",
    element: EmailContentPage,
  },
];

export default routes.map((route) => {
  return {
    ...route,
    element: withNavigationWatcher(route.element, route.path),
  };
});
