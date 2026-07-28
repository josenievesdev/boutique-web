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
        <CatalogProductImage
          source={imageUrl}
          alt={imageAlt}
          width={800}
          height={1000}
        />
      </div>

      <div className="catalog-product-card__body">
        <div className="catalog-product-card__heading">
          <h3>{product.name}</h3>

          <strong>{currencyFormatter.format(product.priceInPesos)}</strong>
        </div>

        <p className="catalog-product-card__description">
          {product.shortDescription}
        </p>

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
