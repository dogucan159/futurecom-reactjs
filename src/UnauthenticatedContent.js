import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./layouts/login/Root";
import LoginPage from "./pages/login/Login";
import CreateAccountPage from "./pages/login/CreateAccount";
import ResetPasswordPage from "./pages/login/ResetPassword";

export const UnauthenticatedContent = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          index: true,
          element: <LoginPage />,
        },
        {
          path: "create-account",
          element: <CreateAccountPage />,
        },
        {
          path: "send-reset-password-mail",
          element: <ResetPasswordPage />
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};
