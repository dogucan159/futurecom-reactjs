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
        path: "/userlogs",
      },
      {
        text: "Parameters",
        icon: "folder",
        items: [
          // {
          //   text: "Config Groups",
          //   icon: "preferences",
          //   path: "/config-groups",
          // },
          {
            text: "Configs",
            icon: "preferences",
            path: "/configs",
          }, 
          {
            text: "Email Contents",
            icon: "email",
            path: "/email-contents",
          }                            
        ],
      },
    ],
  },
];
