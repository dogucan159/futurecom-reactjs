export const navigation = [
  {
    text: "Home",
    path: "/",
    icon: "home",
  },
  {
    text: "General",
    icon: "folder",
    items: [
      {
        text: "Profile",
        icon: "card",
        path: "profile",
      },
      {
        text: "User Logs",
        icon: "textdocument",
        path: "user-logs",
      },
      {
        text: "Parameters",
        icon: "toolbox",
        items: [
          {
            text: "Settings",
            icon: "preferences",
            path: "/app-settings",
          },
          {
            text: "Localizations",
            icon: "globe",
            path: "localizations",
          },
          {
            text: "Email Contents",
            icon: "email",
            path: "email-contents",
          },
        ],
      },
      {
        text: "Library",
        icon: "folder",
        items : [
          {
            text: "Processes",
            icon: "product",
            path: "processes"
          }
        ]
      }
    ],
  },
];
