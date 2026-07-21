import { Link, NavLink } from "react-router";
import { useCart } from "../cart/use-cart";

interface CatalogBrandProps {
  businessName?: string;
}

const headerClass =
  "sticky top-0 z-[var(--z-sticky)] border-0 border-b border-solid border-boutique-line bg-boutique-overlay font-boutique-sans text-boutique-ink backdrop-blur-[14px]";

const headerContentClass =
  "mx-auto grid min-h-[72px] w-[calc(100%_-_48px)] max-w-boutique-standard grid-cols-[auto_minmax(0,1fr)] items-center gap-[clamp(32px,5vw,72px)] " +
  "max-[820.01px]:min-h-[96px] max-[820.01px]:grid-cols-[minmax(0,1fr)_auto] max-[820.01px]:gap-x-[18px] max-[820.01px]:gap-y-0 max-[820.01px]:pt-[10px] " +
  "max-[700.01px]:w-[calc(100%_-_28px)] max-[430.01px]:w-[calc(100%_-_24px)]";

const brandClass =
  "grid w-fit gap-[2px] no-underline max-[820.01px]:self-start";

const brandNameClass =
  "font-boutique-display text-[1.34rem] font-medium leading-none tracking-[-0.035em] max-[430.01px]:text-[1.14rem]";

const brandSubtitleClass =
  "text-boutique-muted text-[0.54rem] font-semibold leading-[1.35] tracking-[0.13em] uppercase max-[359.01px]:hidden";

const navigationClass =
  "flex min-w-0 items-center justify-end gap-[clamp(22px,3vw,42px)] " +
  "max-[820.01px]:col-span-full max-[820.01px]:w-full max-[820.01px]:self-end max-[820.01px]:justify-start max-[820.01px]:gap-6 " +
  "max-[430.01px]:gap-4 max-[359.01px]:gap-[11px]";

const navigationLinkBaseClass =
  "relative inline-flex min-h-[72px] items-center text-boutique-navigation no-underline uppercase " +
  "after:absolute after:inset-x-0 after:-bottom-px after:h-px after:origin-left after:bg-boutique-brand after:content-[''] after:opacity-0 " +
  "after:[transform:scaleX(0.35)] after:transition-[opacity,transform] after:duration-[220ms] after:ease-[ease] " +
  "hover:text-boutique-ink! hover:after:opacity-100 hover:after:[transform:scaleX(1)] " +
  "max-[820.01px]:min-h-[43px] max-[430.01px]:text-[0.6rem] max-[430.01px]:tracking-[0.055em] max-[359.01px]:text-[0.56rem]";

const cartLinkClass =
  "gap-2 max-[820.01px]:ml-auto max-[359.01px]:gap-[5px]";

const cartCountBaseClass =
  "inline-grid h-5 min-w-5 place-items-center rounded-boutique-pill border border-solid px-[5px] text-[0.58rem] leading-none";

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
  const resolvedName =
    resolveBusinessName(businessName);

  const { totalItems } = useCart();

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
          <strong className={brandSubtitleClass}>
            Diseños con identidad
          </strong>
        </Link>

        <nav
          className={navigationClass}
          aria-label="Navegación principal"
        >
          <NavLink
            className={({ isActive }) =>
              resolveNavigationClass(isActive)
            }
            end
            to="/"
          >
            Descubrir
          </NavLink>

          <a
            className={`${navigationLinkBaseClass} text-boutique-muted!`}
            href="/#coleccion"
          >
            Colección
          </a>

          <NavLink
            className={({ isActive }) =>
              `${resolveNavigationClass(isActive)} ${cartLinkClass}`
            }
            to="/solicitud"
          >
            <span>Solicitud</span>

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
