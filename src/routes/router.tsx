import { createBrowserRouter } from "react-router";
import { ProtectedAdminRoute } from "../features/auth/protected-admin-route";
import {
  AdminCategoriesPage,
  AdminDashboardPage,
  AdminEditProductPage,
  AdminLoginPage,
  AdminNewProductPage,
  AdminProductsPage,
  AdminSettingsPage,
  App,
  CartPage,
  CatalogNotFoundPage,
  CatalogProductDetailPage,
} from "./lazy-route-components";

export const router =
  createBrowserRouter([
    {
      path: "/",
      element: <App />,
    },
    {
      path: "/productos/:slug",
      element:
        <CatalogProductDetailPage />,
    },
    {
      path: "/solicitud",
      element: <CartPage />,
    },
    {
      path: "/admin/login",
      element: <AdminLoginPage />,
    },
    {
      element: <ProtectedAdminRoute />,
      children: [
        {
          path: "/admin",
          element:
            <AdminDashboardPage />,
        },
        {
          path: "/admin/products",
          element:
            <AdminProductsPage />,
        },
        {
          path: "/admin/products/new",
          element:
            <AdminNewProductPage />,
        },
        {
          path:
            "/admin/products/:productId/edit",
          element:
            <AdminEditProductPage />,
        },
        {
          path: "/admin/settings",
          element:
            <AdminSettingsPage />,
        },
        {
          path: "/admin/categories",
          element:
            <AdminCategoriesPage />,
        },
      ],
    },
    {
      path: "*",
      element: <CatalogNotFoundPage />,
    },
  ]);
