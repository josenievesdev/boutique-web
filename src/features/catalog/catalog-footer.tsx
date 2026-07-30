import { Link } from "react-router";

interface CatalogFooterProps {
  businessName?: string;
}

export function CatalogFooter({ businessName }: CatalogFooterProps) {
  const resolvedName = businessName?.trim() || "Boutique";
  const currentYear = new Date().getFullYear();

  return (
    <footer className="catalog-footer">
      <div className="catalog-footer__content">
        <div className="catalog-footer__brand">
          <strong translate="no">{resolvedName}</strong>
          <p>
            Prendas elegidas con intención y confeccionadas con atención al
            detalle.
          </p>
        </div>

        <nav
          className="catalog-footer__navigation"
          aria-label="Navegación del pie de página"
        >
          <a href="/#coleccion">Colección</a>
          <Link to="/solicitud">Mi selección</Link>
        </nav>

        <p className="catalog-footer__meta">
          © {currentYear} <span translate="no">{resolvedName}</span>
        </p>
      </div>
    </footer>
  );
}
