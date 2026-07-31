import { Link } from "react-router";
import type { ProductProps } from "../../core/entities/product";
import { CatalogProductImage } from "./catalog-product-image";

interface CatalogProductCardProps {
  product: ProductProps;
  imageUrl: string | null;
  imageAlt: string;
  imageLoading?: "eager" | "lazy";
  imageFetchPriority?: "high" | "low" | "auto";
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
  imageLoading = "lazy",
  imageFetchPriority = "auto",
}: CatalogProductCardProps) {
  return (
    <Link
      className="catalog-product-card"
      to={`/productos/${product.slug}`}
    >
      <div className="catalog-product-card__media">
        <CatalogProductImage
          source={imageUrl}
          alt={imageAlt}
          width={800}
          height={1000}
          loading={imageLoading}
          fetchPriority={imageFetchPriority}
        />
        <div className="catalog-product-card__media-overlay" aria-hidden="true">
          <span>Ver pieza</span>
        </div>
      </div>

      <div className="catalog-product-card__body">
        <div className="catalog-product-card__heading">
          <h3>{product.name}</h3>

          <div className="catalog-product-card__price">
            <strong>{currencyFormatter.format(product.priceInPesos)}</strong>
            {product.previousPriceInPesos ? (
              <del>
                {currencyFormatter.format(product.previousPriceInPesos)}
              </del>
            ) : null}
          </div>
        </div>

        {product.madeToOrder || product.customizable ? (
          <ul className="catalog-product-card__attributes">
            {product.madeToOrder ? <li>Sobre pedido</li> : null}
            {product.customizable ? <li>Personalizable</li> : null}
          </ul>
        ) : null}
      </div>
    </Link>
  );
}
