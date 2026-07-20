import {
  Link,
  NavLink,
} from "react-router";
import { useCart } from "../cart/use-cart";

interface CatalogBrandProps {
  businessName?: string;
}

function resolveBusinessName(
  businessName: string | undefined,
): string {
  return businessName?.trim() || "Boutique";
}

function resolveNavigationClass(
  isActive: boolean,
): string {
  return isActive
    ? "catalog-navigation__link catalog-navigation__link--active"
    : "catalog-navigation__link";
}

export function CatalogHeader({
  businessName,
}: CatalogBrandProps) {
  const resolvedName =
    resolveBusinessName(businessName);

  const { totalItems } = useCart();

  const cartCountClass =
    totalItems > 0
      ? "catalog-cart-count catalog-cart-count--active"
      : "catalog-cart-count";

  const cartLinkClass =
    totalItems > 0
      ? " catalog-cart-link--populated"
      : "";

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
          <NavLink
            className={({ isActive }) =>
              resolveNavigationClass(isActive)
            }
            end
            to="/"
          >
            Catálogo
          </NavLink>

          <a
            className="catalog-navigation__link catalog-navigation__collection"
            href="/#coleccion"
          >
            Colección
          </a>

          <NavLink
            className={({ isActive }) =>
              `${resolveNavigationClass(isActive)} catalog-cart-link${cartLinkClass}`
            }
            to="/solicitud"
          >
            <span>Mi solicitud</span>

            <span
              className={cartCountClass}
              aria-label={`${totalItems} productos en la solicitud`}
            >
              {totalItems}
            </span>
          </NavLink>
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

  const currentYear =
    new Date().getFullYear();

  return (
    <footer className="catalog-footer">
      <div className="catalog-footer__content">
        <div className="catalog-footer__brand">
          <strong>{resolvedName}</strong>

          <p>
            Diseños seleccionados y prendas
            confeccionadas con dedicación.
          </p>
        </div>

        <nav
          className="catalog-footer__navigation"
          aria-label="Navegación del pie de página"
        >
          <span>Explorar</span>

          <Link to="/">Catálogo</Link>

          <a href="/#coleccion">
            Colección
          </a>

          <Link to="/solicitud">
            Mi solicitud
          </Link>
        </nav>

        <div className="catalog-footer__meta">
          <span>
            © {currentYear} {resolvedName}
          </span>

          <Link to="/admin">
            Acceso administrativo
          </Link>
        </div>
      </div>
    </footer>
  );
}
