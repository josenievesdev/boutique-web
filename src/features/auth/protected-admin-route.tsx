import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router";
import { useAuth } from "./use-auth";

export function ProtectedAdminRoute() {
  const location = useLocation();

  const {
    session,
    isAdmin,
    isLoading,
    signOut,
  } = useAuth();

  if (isLoading) {
    return (
      <main className="admin-status">
        <p>Comprobando sesión...</p>
      </main>
    );
  }

  if (!session) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  if (!isAdmin) {
    async function handleSignOut(): Promise<void> {
      await signOut();
    }

    return (
      <main className="admin-status">
        <section className="admin-status__card">
          <p className="admin-eyebrow">
            Acceso restringido
          </p>

          <h1>Esta cuenta no es administradora</h1>

          <p>
            La sesión existe, pero no tiene permisos
            para administrar la boutique.
          </p>

          <button
            type="button"
            onClick={() => {
              void handleSignOut();
            }}
          >
            Cerrar sesión
          </button>
        </section>
      </main>
    );
  }

  return <Outlet />;
}