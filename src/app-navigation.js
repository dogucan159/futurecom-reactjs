export const navigation = [
  {
    text: "Home",
    path: "/home",
    icon: "home",
  },
  {
    text: "General",
    icon: "folder",
    items: [
      {
        text: "Profile",
        icon: "card",
        path: "/profile",
      },
      {
        text: "User Logs",
        icon: "textdocument",
        path: "/user-logs",
      },
      {
        text: "Parameters",
        icon: "folder",
        items: [
          {
            text: "Settings",
            icon: "preferences",
            path: "/app-settings",
          },
          {
            text: "Localizations",
            icon: "globe",
            path: "/localizations",
          },
          {
            text: "Email Contents",
            icon: "email",
            path: "/email-contents",
          },
        ],
      },
    ],
  },
];
