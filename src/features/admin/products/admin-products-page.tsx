import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link } from "react-router";
import type {
  Product,
  ProductStatus,
} from "../../../core/entities/product";
import { ListAdminProducts } from "../../../core/use-cases/list-admin-products";
import { SupabaseProductRepository } from "../../../infrastructure/repositories/supabase-product-repository";
import { SupabaseProductImageStorage } from "../../../infrastructure/storage/supabase-product-image-storage";
import { supabase } from "../../../infrastructure/supabase/supabase-client";

const productRepository =
  new SupabaseProductRepository(supabase);

const productImageStorage =
  new SupabaseProductImageStorage(supabase);

const listAdminProducts =
  new ListAdminProducts(productRepository);

type ProductStatusFilter =
  | "all"
  | ProductStatus;

const statusLabels: Record<
  ProductStatus,
  string
> = {
  draft: "Borrador",
  published: "Publicado",
  hidden: "Oculto",
  out_of_stock: "Agotado",
  archived: "Archivado",
};

const currencyFormatter =
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });

const dateFormatter =
  new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

interface ProductThumbnailProps {
  source: string | null;
  alt: string;
}

function ProductThumbnail({
  source,
  alt,
}: ProductThumbnailProps) {
  const [hasFailed, setHasFailed] =
    useState(false);

  if (!source || hasFailed) {
    return (
      <div className="admin-product-row__placeholder">
        Sin imagen
      </div>
    );
  }

  return (
    <img
      src={source}
      alt={alt}
      loading="lazy"
      onError={() => {
        setHasFailed(true);
      }}
    />
  );
}

export function AdminProductsPage() {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<ProductStatusFilter>("all");

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [reloadCounter, setReloadCounter] =
    useState(0);

  useEffect(() => {
    let isActive = true;

    async function loadProducts(): Promise<void> {
      setIsLoading(true);
      setError(null);

      try {
        const loadedProducts =
          await listAdminProducts.execute();

        if (isActive) {
          setProducts(loadedProducts);
        }
      } catch {
        if (isActive) {
          setError(
            "No fue posible cargar los productos.",
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadProducts();

    return () => {
      isActive = false;
    };
  }, [reloadCounter]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch =
      searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const matchesStatus =
        statusFilter === "all" ||
        product.status === statusFilter;

      const matchesSearch =
        !normalizedSearch ||
        product.name
          .toLowerCase()
          .includes(normalizedSearch) ||
        product.slug
          .toLowerCase()
          .includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  }, [
    products,
    searchTerm,
    statusFilter,
  ]);

  return (
    <main className="admin-products">
      <header className="admin-products__header">
        <div>
          <Link
            className="admin-back-link"
            to="/admin"
          >
            ← Volver al panel
          </Link>

          <p className="admin-eyebrow">
            Catálogo administrativo
          </p>

          <h1>Productos</h1>

          <p>
            Administra borradores, publicaciones,
            productos ocultos y archivados.
          </p>
        </div>

        <button
          type="button"
          disabled
          title="Disponible en el próximo bloque"
        >
          Nuevo producto
        </button>
      </header>

      <section className="admin-products__toolbar">
        <label className="admin-products__search">
          <span>Buscar producto</span>

          <input
            type="search"
            value={searchTerm}
            placeholder="Nombre o slug"
            onChange={(event) => {
              setSearchTerm(
                event.target.value,
              );
            }}
          />
        </label>

        <label className="admin-products__filter">
          <span>Estado</span>

          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(
                event.target
                  .value as ProductStatusFilter,
              );
            }}
          >
            <option value="all">
              Todos
            </option>

            <option value="draft">
              Borradores
            </option>

            <option value="published">
              Publicados
            </option>

            <option value="hidden">
              Ocultos
            </option>

            <option value="out_of_stock">
              Agotados
            </option>

            <option value="archived">
              Archivados
            </option>
          </select>
        </label>
      </section>

      <section className="admin-products__summary">
        <strong>
          {filteredProducts.length}
        </strong>

        <span>
          {filteredProducts.length === 1
            ? "producto encontrado"
            : "productos encontrados"}
        </span>
      </section>

      {isLoading ? (
        <section className="admin-products__state">
          <p>Cargando productos...</p>
        </section>
      ) : null}

      {!isLoading && error ? (
        <section className="admin-products__state">
          <p role="alert">{error}</p>

          <button
            type="button"
            onClick={() => {
              setReloadCounter(
                (current) => current + 1,
              );
            }}
          >
            Intentar nuevamente
          </button>
        </section>
      ) : null}

      {!isLoading &&
      !error &&
      filteredProducts.length === 0 ? (
        <section className="admin-products__state">
          <p>
            No hay productos que coincidan con
            los filtros.
          </p>
        </section>
      ) : null}

      {!isLoading &&
      !error &&
      filteredProducts.length > 0 ? (
        <section className="admin-products__list">
          {filteredProducts.map((product) => {
            const productData =
              product.toObject();

            const coverImage =
              product.images.find(
                (image) => image.isCover,
              ) ?? product.images[0];

            const coverUrl = coverImage
              ? productImageStorage.getPublicUrl(
                  coverImage.path,
                )
              : null;

            return (
              <article
                className="admin-product-row"
                key={product.id}
              >
                <div className="admin-product-row__image">
                  <ProductThumbnail
                    source={coverUrl}
                    alt={
                      coverImage?.altText ||
                      product.name
                    }
                  />
                </div>

                <div className="admin-product-row__main">
                  <strong>
                    {product.name}
                  </strong>

                  <span>
                    /{product.slug}
                  </span>
                </div>

                <div className="admin-product-row__price">
                  <span>Precio</span>

                  <strong>
                    {currencyFormatter.format(
                      product.priceInPesos,
                    )}
                  </strong>
                </div>

                <div className="admin-product-row__status">
                  <span
                    className={`admin-status-badge admin-status-badge--${product.status}`}
                  >
                    {
                      statusLabels[
                        product.status
                      ]
                    }
                  </span>
                </div>

                <div className="admin-product-row__date">
                  <span>Actualizado</span>

                  <strong>
                    {dateFormatter.format(
                      productData.updatedAt,
                    )}
                  </strong>
                </div>

                <div className="admin-product-row__actions">
                  <button
                    type="button"
                    disabled
                    title="La edición se implementará en el próximo bloque"
                  >
                    Editar
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      ) : null}
    </main>
  );
}