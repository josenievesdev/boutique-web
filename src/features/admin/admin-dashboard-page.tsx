import { useAuth } from "../auth/use-auth";

export function AdminDashboardPage() {
  const {
    user,
    signOut,
    isLoading,
  } = useAuth();

  async function handleSignOut(): Promise<void> {
    await signOut();
  }

  return (
    <main className="admin-dashboard">
      <header className="admin-dashboard__header">
        <div>
          <p className="admin-eyebrow">
            Panel administrativo
          </p>

          <h1>Boutique digital</h1>

          <p>
            Sesión activa como{" "}
            <strong>
              {user?.email ?? "administrador"}
            </strong>
          </p>
        </div>

        <button
          type="button"
          disabled={isLoading}
          onClick={() => {
            void handleSignOut();
          }}
        >
          Cerrar sesión
        </button>
      </header>

      <section className="admin-dashboard__content">
        <article className="admin-summary-card">
          <p>Productos</p>
          <strong>Próximo bloque</strong>
          <span>
            Aquí aparecerán borradores, publicados,
            ocultos y archivados.
          </span>
        </article>

        <article className="admin-summary-card">
          <p>Imágenes</p>
          <strong>Storage conectado</strong>
          <span>
            La carga y eliminación ya funcionan en
            Supabase Storage.
          </span>
        </article>
      </section>
    </main>
  );
}