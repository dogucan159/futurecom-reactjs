import React, { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./layouts/login/Root";
import LoginPage from "./pages/login/Login";
import ChangePasswordPage from "./pages/login/ChangePassword";
import ErrorPage from "./pages/error/Error";
// import CreateAccountPage from "./pages/login/CreateAccount";
// import ResetPasswordPage from "./pages/login/ResetPassword";

const CreateAccountPage = lazy(() => import("./pages/login/CreateAccount"));
const ResetPasswordPage = lazy(() => import("./pages/login/ResetPassword"));

export const UnauthenticatedContent = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <LoginPage />,
        },
        {
          path: "create-account",
          element: (
            <Suspense fallback={<p>Loading...</p>}>
              <CreateAccountPage />
            </Suspense>
          ),
        },
        {
          path: "send-reset-password-mail",
          element: (
            <Suspense fallback={<p>Loading...</p>}>
              <ResetPasswordPage />
            </Suspense>
          ),
        },
        {
          path: "change-password/:userId",
          element: (
            <Suspense fallback={<p>Loading...</p>}>
              <ChangePasswordPage />
            </Suspense>
          ),
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};
