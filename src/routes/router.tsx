import {
  createBrowserRouter,
} from "react-router";
import App from "../App";
import { AdminDashboardPage } from "../features/admin/admin-dashboard-page";
import { AdminLoginPage } from "../features/auth/admin-login-page";
import { ProtectedAdminRoute } from "../features/auth/protected-admin-route";
import { AdminProductsPage } from "../features/admin/products/admin-products-page";
import { AdminNewProductPage } from "../features/admin/products/admin-new-product-page";
import { AdminEditProductPage } from "../features/admin/products/admin-edit-product-page";
import { CatalogProductDetailPage } from "../features/catalog/catalog-product-detail-page";
import { AdminSettingsPage } from "../features/admin/admin-settings-page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/productos/:slug",
    element: <CatalogProductDetailPage />,
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
      element: <AdminDashboardPage />,
    },
    {
      path: "/admin/products",
      element: <AdminProductsPage />,
    },
    {
      path: "/admin/products/new",
      element: <AdminNewProductPage />,
    },
    {
      path: "/admin/products/:productId/edit",
      element: <AdminEditProductPage />,
    },
    {
      path: "/admin/settings",
      element: <AdminSettingsPage />,
    },
  ],
},
  {
    path: "*",
    element: (
      <main className="admin-status">
        <section className="admin-status__card">
          <p className="admin-eyebrow">
            Error 404
          </p>

          <h1>Página no encontrada</h1>
        </section>
      </main>
    ),
  },
]);