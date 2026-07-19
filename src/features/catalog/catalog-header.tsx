import { Link } from "react-router";

export function CatalogHeader() {
  return (
    <header className="catalog-header">
      <div className="catalog-header__content">
        <Link
          className="catalog-brand"
          to="/"
        >
          <span>Boutique</span>
          <strong>Diseños con identidad</strong>
        </Link>

        <nav
          className="catalog-navigation"
          aria-label="Navegación principal"
        >
          <Link to="/">Catálogo</Link>

          <a href="/#coleccion">
            Colección
          </a>
        </nav>
      </div>
    </header>
  );
}

export function CatalogFooter() {
  return (
    <footer className="catalog-footer">
      <div className="catalog-footer__content">
        <div>
          <strong>Boutique</strong>

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