import { Link, NavLink, useLocation } from "react-router";
import { useCart } from "../cart/use-cart";

interface CatalogBrandProps {
  businessName?: string;
}

export interface CatalogHeaderCategory {
  id: string;
  name: string;
}

export interface CatalogHeaderControls {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  onClearSearch: () => void;
  categories: ReadonlyArray<CatalogHeaderCategory>;
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

interface CatalogHeaderProps extends CatalogBrandProps {
  controls?: CatalogHeaderControls;
}

const headerClass =
  "sticky top-0 z-[var(--catalog-z-sticky)] border-0 border-b border-solid border-boutique-line bg-boutique-canvas font-boutique-sans text-boutique-ink";

const headerContentClass =
  "catalog-container grid min-h-[70px] grid-cols-[minmax(150px,0.7fr)_minmax(280px,620px)_minmax(250px,0.86fr)] items-center gap-[clamp(20px,3vw,48px)] " +
  "max-[920.01px]:grid-cols-[minmax(132px,0.6fr)_minmax(260px,1fr)_auto] max-[920.01px]:gap-4 " +
  "max-[820.01px]:min-h-[92px] max-[820.01px]:grid-cols-[minmax(0,1fr)_auto] max-[820.01px]:gap-x-3 max-[820.01px]:gap-y-1";

const brandClass =
  "inline-flex min-h-11 min-w-0 max-w-full items-center no-underline";

const brandNameClass =
  "min-w-0 font-boutique-display text-[1.4rem] font-medium leading-[1.05] tracking-[-0.035em] [overflow-wrap:anywhere] max-[430.01px]:text-[1.08rem]";

const headerSearchAreaClass =
  "min-w-0 w-full max-w-[620px] justify-self-center max-[820.01px]:col-span-full max-[820.01px]:col-start-1 max-[820.01px]:row-start-2 max-[820.01px]:max-w-none";

const searchSurfaceClass =
  "relative flex min-h-[46px] min-w-0 w-full items-center rounded-boutique-control border border-solid border-boutique-line-strong bg-boutique-surface-raised pl-11 max-[820.01px]:min-h-11";

const searchFieldClass =
  `${searchSurfaceClass} transition-[border-color,box-shadow] duration-[160ms] ease-[ease] focus-within:border-boutique-focus focus-within:[box-shadow:0_0_0_3px_var(--catalog-color-focus)]`;

const searchLinkClass =
  `${searchSurfaceClass} group pr-4 text-[0.82rem] font-medium text-boutique-muted! no-underline! transition-[color,border-color,background-color] duration-[160ms] ease-[ease] hover:border-boutique-ink hover:bg-boutique-canvas-subtle hover:text-boutique-ink!`;

const searchIconClass =
  "absolute top-1/2 left-4 h-[14px] w-[14px] rounded-boutique-circle border-[1.5px] border-solid border-boutique-muted [transform:translateY(-58%)] " +
  "after:absolute after:right-[-5px] after:bottom-[-3px] after:h-[1.5px] after:w-[6px] after:origin-left after:bg-boutique-muted after:content-[''] after:[transform:rotate(45deg)]";

const searchInputClass =
  "min-h-11! min-w-0 w-full rounded-none! [border:0]! bg-transparent! px-3! py-0! text-[0.86rem]! [box-shadow:none]! [outline:0]! [&::-webkit-search-cancel-button]:hidden";

const searchClearButtonClass =
  "mr-1 min-h-11 min-w-11 flex-none border-0! border-l! border-solid! border-boutique-line! bg-transparent px-3 py-0 text-[0.75rem]! font-semibold! text-boutique-muted! hover:text-boutique-ink!";

const navigationClass =
  "flex min-w-0 items-center justify-end gap-[clamp(14px,2.4vw,32px)] max-[820.01px]:col-start-2 max-[820.01px]:row-start-1";

const navigationLinkBaseClass =
  "relative inline-flex min-h-11 items-center text-boutique-navigation whitespace-nowrap no-underline " +
  "after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:bg-boutique-brand after:content-[''] after:opacity-0 " +
  "after:[transform:scaleX(0.35)] after:transition-[opacity,transform] after:duration-[180ms] after:ease-[ease] " +
  "hover:text-boutique-ink! hover:after:opacity-100 hover:after:[transform:scaleX(1)]";

const collectionLinkClass = "max-[820.01px]:hidden";

const cartLinkClass =
  "gap-[6px]";

const cartCountBaseClass =
  "inline-grid h-6 min-w-6 place-items-center rounded-boutique-pill border border-solid px-[5px] text-[0.75rem] leading-none [font-variant-numeric:tabular-nums]";

const categoryRowClass =
  "border-0 border-t border-solid border-boutique-line bg-boutique-canvas";

const categoriesClass =
  "catalog-container catalog-category-nav flex min-h-[46px] snap-x snap-proximity items-stretch gap-[clamp(18px,2.4vw,32px)] overflow-x-auto overscroll-x-contain";

const categoryButtonBaseClass =
  "relative min-h-11 flex-none snap-start rounded-none border-0! bg-transparent px-0 py-0 text-[0.75rem]! leading-[1.25]! font-medium! whitespace-nowrap " +
  "after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:origin-left after:content-[''] after:transition-[background-color,transform] after:duration-[160ms] after:ease-[ease]";

const categoryButtonActiveClass =
  `${categoryButtonBaseClass} text-boutique-ink! after:bg-boutique-ink after:[transform:scaleX(1)]`;

const categoryButtonInactiveClass =
  `${categoryButtonBaseClass} text-boutique-muted! after:bg-boutique-line-strong after:[transform:scaleX(0)] hover:text-boutique-ink! hover:after:[transform:scaleX(1)]`;

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

function resolveCategoryButtonClass(isActive: boolean): string {
  return isActive
    ? categoryButtonActiveClass
    : categoryButtonInactiveClass;
}

function CatalogHeaderSearch({
  controls,
}: {
  controls?: CatalogHeaderControls;
}) {
  if (!controls) {
    return (
      <div className={headerSearchAreaClass}>
        <a className={searchLinkClass} href="/#coleccion">
          <span className={searchIconClass} aria-hidden="true" />
          <span>Buscar en la colección</span>
        </a>
      </div>
    );
  }

  return (
    <div className={headerSearchAreaClass}>
      <div
        className={searchFieldClass}
        role="search"
        aria-label="Buscar en la colección"
      >
        <label
          className="catalog-visually-hidden"
          htmlFor="catalog-header-search"
        >
          Buscar en la colección
        </label>
        <span className={searchIconClass} aria-hidden="true" />
        <input
          className={searchInputClass}
          id="catalog-header-search"
          type="search"
          name="catalog-search"
          autoComplete="off"
          value={controls.searchTerm}
          placeholder="Busca por nombre o descripción…"
          onChange={(event) => {
            controls.onSearchTermChange(event.target.value);
          }}
        />
        {controls.searchTerm ? (
          <button
            className={searchClearButtonClass}
            type="button"
            aria-label="Limpiar búsqueda"
            onClick={controls.onClearSearch}
          >
            Limpiar
          </button>
        ) : null}
      </div>
    </div>
  );
}

function CatalogHeaderCategories({
  controls,
}: {
  controls: CatalogHeaderControls;
}) {
  return (
    <div className={categoryRowClass}>
      <div
        className={categoriesClass}
        role="group"
        aria-label="Filtrar por categoría"
      >
        <button
          className={resolveCategoryButtonClass(
            controls.selectedCategoryId === null,
          )}
          type="button"
          aria-pressed={controls.selectedCategoryId === null}
          onClick={() => {
            controls.onSelectCategory(null);
          }}
        >
          Todo
        </button>

        {controls.categories.map((category) => (
          <button
            className={resolveCategoryButtonClass(
              controls.selectedCategoryId === category.id,
            )}
            key={category.id}
            type="button"
            aria-pressed={controls.selectedCategoryId === category.id}
            onClick={() => {
              controls.onSelectCategory(category.id);
            }}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export function CatalogHeader({
  businessName,
  controls,
}: CatalogHeaderProps) {
  const location = useLocation();
  const resolvedName = resolveBusinessName(businessName);

  const { totalItems } = useCart();
  const isCollectionActive = location.pathname === "/";

  const cartCountClass =
    totalItems > 0
      ? `${cartCountBaseClass} border-boutique-brand bg-boutique-brand text-boutique-inverse`
      : `${cartCountBaseClass} border-boutique-line-strong text-boutique-muted`;
  const cartLabel = `${totalItems} ${
    totalItems === 1 ? "pieza" : "piezas"
  }`;

  return (
    <header className={headerClass}>
      <div className={headerContentClass}>
        <Link className={brandClass} to="/">
          <span className={brandNameClass} translate="no">
            {resolvedName}
          </span>
        </Link>

        <CatalogHeaderSearch controls={controls} />

        <nav
          className={navigationClass}
          aria-label="Navegación principal"
        >
          <a
            className={`${resolveNavigationClass(
              isCollectionActive,
            )} ${collectionLinkClass}`}
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
            aria-label={`Mi selección, ${cartLabel}`}
          >
            <span>Mi selección</span>

            <span
              className={cartCountClass}
              aria-hidden="true"
            >
              {totalItems}
            </span>
          </NavLink>
        </nav>
      </div>

      {controls ? <CatalogHeaderCategories controls={controls} /> : null}
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
