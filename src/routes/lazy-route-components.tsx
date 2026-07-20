import { lazy } from "react";

export const App = lazy(
  () => import("../App"),
);

export const CatalogProductDetailPage =
  lazy(async () => {
    const module = await import(
      "../features/catalog/catalog-product-detail-page"
    );

    return {
      default:
        module.CatalogProductDetailPage,
    };
  });

export const CartPage = lazy(
  async () => {
    const module = await import(
      "../features/cart/cart-page"
    );

    return {
      default: module.CartPage,
    };
  },
);

export const AdminLoginPage = lazy(
  async () => {
    const module = await import(
      "../features/auth/admin-login-page"
    );

    return {
      default: module.AdminLoginPage,
    };
  },
);

export const AdminDashboardPage = lazy(
  async () => {
    const module = await import(
      "../features/admin/admin-dashboard-page"
    );

    return {
      default:
        module.AdminDashboardPage,
    };
  },
);

export const AdminProductsPage = lazy(
  async () => {
    const module = await import(
      "../features/admin/products/admin-products-page"
    );

    return {
      default:
        module.AdminProductsPage,
    };
  },
);

export const AdminNewProductPage = lazy(
  async () => {
    const module = await import(
      "../features/admin/products/admin-new-product-page"
    );

    return {
      default:
        module.AdminNewProductPage,
    };
  },
);

export const AdminEditProductPage = lazy(
  async () => {
    const module = await import(
      "../features/admin/products/admin-edit-product-page"
    );

    return {
      default:
        module.AdminEditProductPage,
    };
  },
);

export const AdminSettingsPage = lazy(
  async () => {
    const module = await import(
      "../features/admin/admin-settings-page"
    );

    return {
      default:
        module.AdminSettingsPage,
    };
  },
);

export const AdminCategoriesPage = lazy(
  async () => {
    const module = await import(
      "../features/admin/categories/admin-categories-page"
    );

    return {
      default:
        module.AdminCategoriesPage,
    };
  },
);