import { Link } from "react-router";
import { useCart } from "../cart/use-cart";

interface CatalogBrandProps {
  businessName?: string;
}

function resolveBusinessName(
  businessName: string | undefined,
): string {
  return businessName?.trim() || "Boutique";
}

export function CatalogHeader({
  businessName,
}: CatalogBrandProps) {
  const resolvedName =
    resolveBusinessName(businessName);

  const { totalItems } = useCart();

  return (
    <header className="catalog-header">
      <div className="catalog-header__content">
        <Link
          className="catalog-brand"
          to="/"
        >
          <span>{resolvedName}</span>

          <strong>
            Diseños con identidad
          </strong>
        </Link>

        <nav
          className="catalog-navigation"
          aria-label="Navegación principal"
        >
          <Link to="/">Catálogo</Link>

          <a
            className="catalog-navigation__collection"
            href="/#coleccion"
          >
            Colección
          </a>

          <Link
            className="catalog-cart-link"
            to="/solicitud"
          >
            Mi solicitud

            <span>{totalItems}</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function CatalogFooter({
  businessName,
}: CatalogBrandProps) {
  const resolvedName =
    resolveBusinessName(businessName);

  return (
    <footer className="catalog-footer">
      <div className="catalog-footer__content">
        <div>
          <strong>{resolvedName}</strong>

          <p>
            Diseños seleccionados y prendas
            confeccionadas con dedicación.
          </p>
        </div>

        <Link to="/admin">
          Acceso administrativo
        </Link>
      </div>
    </footer>
  );
}