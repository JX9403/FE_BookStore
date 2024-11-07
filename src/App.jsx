import React, { useEffect } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/login";
import BookPage from "./pages/book";
import HomePage from "./pages/homepage";

import RegisterPage from "./pages/register";
import { useDispatch, useSelector } from "react-redux";
import { doGetAccountAction } from "./redux/account/accountSlice";
import { getAccount } from "./services/apiService";
import Loading from "./components/Loading";
import NotFound from "./components/NotFound";
import AdminPage from "./pages/admin";
import ProtectedRoute from "./components/ProtectedRoute";
import LayoutClient from "./components/Layout/LayoutClient";
import LayoutAdmin from "./components/Layout/LayoutAdmin";

import UserTable from "./components/Admin/User/UserTable";
import BookTable from "./components/Admin/Book/BookTable";
import CartPage from "./pages/cart";
import HistoryPage from "./pages/history";
import OrderTable from "./components/Admin/Order/OrderTable";

export default function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);

  const fetchAccount = async () => {
    if (
      window.location.pathname === "/login" ||
      window.location.pathname === "/register"
    ) {
      return;
    }

    const res = await getAccount();

    if (res && res.data) {
      dispatch(doGetAccountAction(res.data.user));
    }
  };

  useEffect(() => {
    fetchAccount();
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <LayoutClient />,
      errorElement: <NotFound />,
      children: [
        { index: true, element: <HomePage /> },
        {
          path: "book/:slug",
          element: <BookPage />,
        },
        {
          path: "cart",
          element: (
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "history",
          element: (
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "login",
          element: <LoginPage />,
        },
        {
          path: "register",
          element: <RegisterPage />,
        },
      ],
    },
    {
      path: "/admin",
      element: <LayoutAdmin />,
      errorElement: <NotFound />,
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "book",
          element: <BookTable />,
        },
        {
          path: "user",
          element: <UserTable />,
        },
        {
          path: "order",
          element: <OrderTable />,
        },
      ],
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
  ]);

  return (
    <>
      {isAuthenticated === true ||
      window.location.pathname === "/login" ||
      window.location.pathname === "/register" ||
      window.location.pathname === "/" ? (
        <RouterProvider router={router} />
      ) : (
        <Loading />
      )}
    </>
  );
}
