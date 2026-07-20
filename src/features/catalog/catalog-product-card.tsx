import { Link } from "react-router";
import type { ProductProps } from "../../core/entities/product";
import { CatalogProductImage } from "./catalog-product-image";

interface CatalogProductCardProps {
  product: ProductProps;
  imageUrl: string | null;
  imageAlt: string;
}

const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export function CatalogProductCard({
  product,
  imageUrl,
  imageAlt,
}: CatalogProductCardProps) {
  return (
    <Link
      className="catalog-product-card"
      to={`/productos/${product.slug}`}
    >
      <div className="catalog-product-card__media">
        <CatalogProductImage source={imageUrl} alt={imageAlt} />

        {product.featured ? (
          <span className="catalog-product-card__featured">Selección</span>
        ) : null}
      </div>

      <div className="catalog-product-card__body">
        <div className="catalog-product-card__heading">
          <h3>{product.name}</h3>

          <strong>{currencyFormatter.format(product.priceInPesos)}</strong>
        </div>

        <p>{product.shortDescription}</p>

        <div className="catalog-product-card__footer">
          <div className="catalog-product-card__tags">
            {product.madeToOrder ? <span>Sobre pedido</span> : null}
            {product.customizable ? <span>Personalizable</span> : null}
          </div>

          <span className="catalog-product-card__action">
            Ver pieza <span aria-hidden="true">↗</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
