import { Link, NavLink, useLocation } from "react-router";
import { useCart } from "../cart/use-cart";

interface CatalogBrandProps {
  businessName?: string;
}

const headerClass =
  "sticky top-0 z-[var(--catalog-z-sticky)] border-0 border-b border-solid border-boutique-line bg-boutique-overlay font-boutique-sans text-boutique-ink backdrop-blur-[10px]";

const headerContentClass =
  "catalog-container flex min-h-[66px] items-center justify-between gap-[clamp(8px,2vw,24px)]";

const brandClass =
  "inline-flex min-h-11 min-w-0 max-w-[min(52vw,32rem)] items-center no-underline max-[430.01px]:max-w-[34vw]";

const brandNameClass =
  "font-boutique-display text-[1.35rem] font-medium leading-[1.05] tracking-[-0.035em] [overflow-wrap:anywhere] max-[430.01px]:text-[1.05rem]";

const navigationClass =
  "flex flex-none items-center justify-end gap-[clamp(10px,2.5vw,32px)]";

const navigationLinkBaseClass =
  "relative inline-flex min-h-[66px] items-center text-boutique-navigation whitespace-nowrap no-underline " +
  "after:absolute after:inset-x-0 after:-bottom-px after:h-px after:origin-left after:bg-boutique-brand after:content-[''] after:opacity-0 " +
  "after:[transform:scaleX(0.35)] after:transition-[opacity,transform] after:duration-[180ms] after:ease-[ease] " +
  "hover:text-boutique-ink! hover:after:opacity-100 hover:after:[transform:scaleX(1)] " +
  "max-[430.01px]:text-[0.75rem] max-[430.01px]:tracking-[0.02em]";

const cartLinkClass =
  "gap-[6px]";

const cartCountBaseClass =
  "inline-grid h-6 min-w-6 place-items-center rounded-boutique-pill border border-solid px-[5px] text-[0.75rem] leading-none [font-variant-numeric:tabular-nums]";

function resolveBusinessName(
  businessName: string | undefined,
): string {
  return businessName?.trim() || "Boutique";
}

function resolveNavigationClass(
  isActive: boolean,
): string {
  return isActive
    ? `${navigationLinkBaseClass} text-boutique-ink! after:opacity-100 after:[transform:scaleX(1)]`
    : `${navigationLinkBaseClass} text-boutique-muted!`;
}

export function CatalogHeader({
  businessName,
}: CatalogBrandProps) {
  const location = useLocation();
  const resolvedName =
    resolveBusinessName(businessName);

  const { totalItems } = useCart();
  const isCollectionActive = location.pathname === "/";

  const cartCountClass =
    totalItems > 0
      ? `${cartCountBaseClass} border-boutique-brand bg-boutique-brand text-boutique-inverse`
      : `${cartCountBaseClass} border-boutique-line-strong text-boutique-muted`;

  return (
    <header className={headerClass}>
      <div className={headerContentClass}>
        <Link
          className={brandClass}
          to="/"
        >
          <span className={brandNameClass}>
            {resolvedName}
          </span>
        </Link>

        <nav
          className={navigationClass}
          aria-label="Navegación principal"
        >
          <a
            className={resolveNavigationClass(isCollectionActive)}
            href="/#coleccion"
            aria-current={isCollectionActive ? "page" : undefined}
          >
            Colección
          </a>

          <NavLink
            className={({ isActive }) =>
              `${resolveNavigationClass(isActive)} ${cartLinkClass}`
            }
            to="/solicitud"
          >
            <span>Mi selección</span>

            <span
              className={cartCountClass}
              aria-label={`${totalItems} piezas en Mi selección`}
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
            Prendas elegidas con intención y
            confeccionadas con atención al detalle.
          </p>
        </div>

        <nav
          className="catalog-footer__navigation"
          aria-label="Navegación del pie de página"
        >
          <span>Explorar</span>

          <Link to="/">Descubrir</Link>

          <a href="/#coleccion">
            Colección
          </a>

          <Link to="/solicitud">
            Solicitud
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
