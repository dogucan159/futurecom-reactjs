import {
  HomePage,
  TasksPage,
  UserProfilePage,
  EmailContentPage,
  EmailContentsPage,
  UserLogsPage,
  AppSettingPage,
  AppSettingsPage,
  LocalizationsPage,
} from "./pages";

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
  {
    path: "/localizations",
    element: LocalizationsPage,
  },
];

export default routes.map((route) => {
  return {
    ...route,
    element: route.element,
  };
});
