import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";
import "./index.css";
import "./catalog.css";
import "./admin.css";
import { AuthProvider } from "./features/auth/auth-provider";
import { CartProvider } from "./features/cart/cart-provider";
import { router } from "./routes/router";

createRoot(
  document.getElementById("root")!,
).render(
<StrictMode>
  <CartProvider>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </CartProvider>
</StrictMode>,
);