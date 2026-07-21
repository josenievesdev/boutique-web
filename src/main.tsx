import {
  StrictMode,
  Suspense,
} from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";
import "./tailwind.css";
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
      <Suspense
        fallback={
          <main
            className="route-loading"
            aria-live="polite"
          >
            <div className="route-loading__indicator" />

            <p>Cargando contenido...</p>
          </main>
        }
      >
        <RouterProvider router={router} />
      </Suspense>
    </AuthProvider>
  </CartProvider>
</StrictMode>,
);
