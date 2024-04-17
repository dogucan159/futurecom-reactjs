import { getUser } from "./utils/auth";

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
        path: `/profile/${getUser().baseEntityId}`,
      },
      {
        text: "User Logs",
        path: "/userlogs",
      },
    ],
  },
];
