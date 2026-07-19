import {
  createBrowserRouter,
} from "react-router";
import App from "../App";
import { AdminDashboardPage } from "../features/admin/admin-dashboard-page";
import { AdminLoginPage } from "../features/auth/admin-login-page";
import { ProtectedAdminRoute } from "../features/auth/protected-admin-route";
import { AdminProductsPage } from "../features/admin/products/admin-products-page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
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