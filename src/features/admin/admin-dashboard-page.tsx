import { Link } from "react-router";
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
        <Link
          className="admin-summary-card admin-summary-card--link"
          to="/admin/products"
        >
          <p>Productos</p>

          <strong>Gestionar catálogo</strong>

          <span>
            Consulta borradores, publicaciones,
            productos ocultos y archivados.
          </span>

          <span className="admin-summary-card__action">
            Ver productos →
          </span>
        </Link>

        <Link
          className="admin-summary-card admin-summary-card--link"
          to="/admin/categories"
        >
          <p>Categorías</p>

          <strong>Organizar catálogo</strong>

          <span>
            Crea y ordena las categorías utilizadas
            para clasificar los productos.
          </span>

          <span className="admin-summary-card__action">
            Gestionar categorías →
          </span>
        </Link>

        <Link
          className="admin-summary-card admin-summary-card--link"
          to="/admin/settings"
        >
          <p>Configuración</p>

          <strong>Datos de la boutique</strong>

          <span>
            Administra el nombre público y el
            número de contacto por WhatsApp.
          </span>

          <span className="admin-summary-card__action">
            Abrir configuración →
          </span>
        </Link>

        <article className="admin-summary-card">
          <p>Imágenes</p>

          <strong>Storage conectado</strong>

          <span>
            La carga y eliminación funcionan desde
            la administración de cada producto.
          </span>
        </article>
      </section>
    </main>
  );
}