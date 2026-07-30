import { useRef } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { useCart } from "../cart/use-cart";
import { CloseIcon, SearchIcon, SelectionIcon } from "./catalog-icons";

interface CatalogHeaderProps {
  businessName?: string;
  searchControls?: CatalogHeaderSearchControls;
}

export interface CatalogHeaderSearchControls {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  onClearSearch: () => void;
}

function resolveBusinessName(businessName: string | undefined): string {
  return businessName?.trim() || "Boutique";
}

function CatalogHeaderSearch({
  controls,
}: {
  controls?: CatalogHeaderSearchControls;
}) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  if (!controls) {
    return (
      <a
        className="catalog-header__search-link"
        href="/#coleccion"
        aria-label="Buscar prendas en la colección"
      >
        <SearchIcon className="catalog-icon" />
        <span>Buscar prendas</span>
      </a>
    );
  }

  return (
    <div
      className="catalog-header__search"
      role="search"
      aria-label="Buscar en la colección"
    >
      <label className="catalog-visually-hidden" htmlFor="catalog-header-search">
        Buscar en la colección
      </label>
      <SearchIcon className="catalog-header__search-icon" />
      <input
        ref={searchInputRef}
        id="catalog-header-search"
        type="search"
        name="catalog-search"
        autoComplete="off"
        value={controls.searchTerm}
        placeholder="Buscar prendas…"
        onChange={(event) => {
          controls.onSearchTermChange(event.target.value);
        }}
      />
      {controls.searchTerm ? (
        <button
          className="catalog-header__search-clear"
          type="button"
          aria-label="Limpiar búsqueda"
          onClick={() => {
            controls.onClearSearch();
            searchInputRef.current?.focus();
          }}
        >
          <CloseIcon className="catalog-icon" />
        </button>
      ) : null}
    </div>
  );
}

export function CatalogHeader({
  businessName,
  searchControls,
}: CatalogHeaderProps) {
  const location = useLocation();
  const { totalItems } = useCart();
  const resolvedName = resolveBusinessName(businessName);
  const isCollectionActive = location.pathname === "/";
  const cartLabel = `${totalItems} ${
    totalItems === 1 ? "pieza" : "piezas"
  }`;

  return (
    <header
      className={`catalog-header ${
        searchControls
          ? "catalog-header--search"
          : "catalog-header--contextual"
      }`}
    >
      <div className="catalog-container catalog-header__content">
        <Link className="catalog-header__brand" to="/">
          <span translate="no">{resolvedName}</span>
        </Link>

        <CatalogHeaderSearch controls={searchControls} />

        <nav className="catalog-header__navigation" aria-label="Navegación principal">
          <a
            className={
              isCollectionActive
                ? "catalog-header__navigation-link catalog-header__navigation-link--active catalog-header__collection-link"
                : "catalog-header__navigation-link catalog-header__collection-link"
            }
            href="/#coleccion"
            aria-current={isCollectionActive ? "page" : undefined}
          >
            Colección
          </a>

          <NavLink
            className={({ isActive }) =>
              isActive
                ? "catalog-header__navigation-link catalog-header__navigation-link--active catalog-header__selection-link"
                : "catalog-header__navigation-link catalog-header__selection-link"
            }
            to="/solicitud"
            aria-label={`Mi selección, ${cartLabel}`}
          >
            <span className="catalog-header__selection-label">Mi selección</span>
            <SelectionIcon className="catalog-header__selection-icon" />
            <span
              className={
                totalItems > 0
                  ? "catalog-header__count catalog-header__count--filled"
                  : "catalog-header__count"
              }
              aria-hidden="true"
            >
              {totalItems}
            </span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
