import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link } from "react-router";
import type { Category } from "../../core/entities/category";
import type { Product } from "../../core/entities/product";
import { ListActiveCategories } from "../../core/use-cases/list-active-categories";
import { ListPublishedProducts } from "../../core/use-cases/list-published-products";
import { SupabaseCategoryRepository } from "../../infrastructure/repositories/supabase-category-repository";
import { SupabaseProductCatalogRepository } from "../../infrastructure/repositories/supabase-product-catalog-repository";
import { SupabaseProductImageStorage } from "../../infrastructure/storage/supabase-product-image-storage";
import { supabase } from "../../infrastructure/supabase/supabase-client";
import {
  CatalogFooter,
  CatalogHeader,
} from "./catalog-header";
import { CatalogProductImage } from "./catalog-product-image";
import { filterCatalogProducts } from "./filter-catalog-products";

const productCatalogRepository =
  new SupabaseProductCatalogRepository(
    supabase,
  );

const categoryRepository =
  new SupabaseCategoryRepository(supabase);

const productImageStorage =
  new SupabaseProductImageStorage(supabase);

const listPublishedProducts =
  new ListPublishedProducts(
    productCatalogRepository,
  );

const listActiveCategories =
  new ListActiveCategories(
    categoryRepository,
  );

const currencyFormatter =
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });

export function CatalogHomePage() {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [
    selectedCategoryId,
    setSelectedCategoryId,
  ] = useState<string | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [reloadCounter, setReloadCounter] =
    useState(0);

  useEffect(() => {
    let isActive = true;

    async function loadCatalog(): Promise<void> {
      setIsLoading(true);
      setError(null);

      try {
        const [
          loadedProducts,
          loadedCategories,
        ] = await Promise.all([
          listPublishedProducts.execute(),
          listActiveCategories.execute(),
        ]);

        if (!isActive) {
          return;
        }

        setProducts(loadedProducts);
        setCategories(loadedCategories);
      } catch {
        if (isActive) {
          setError(
            "No fue posible cargar el catálogo.",
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadCatalog();

    return () => {
      isActive = false;
    };
  }, [reloadCounter]);

  const visibleProducts = useMemo(
    () =>
      filterCatalogProducts(products, {
        searchTerm,
        categoryId:
          selectedCategoryId,
      }),
    [
      products,
      searchTerm,
      selectedCategoryId,
    ],
  );

  return (
    <div className="catalog-site">
      <CatalogHeader />

      <main>
        <section className="catalog-hero">
          <div className="catalog-hero__content">
            <p className="catalog-eyebrow">
              Diseño y confección
            </p>

            <h1>
              Prendas pensadas para sentirse
              verdaderamente tuyas.
            </h1>

            <p className="catalog-hero__description">
              Explora piezas seleccionadas,
              diseños personalizables y prendas
              elaboradas con atención a cada
              detalle.
            </p>

            <div className="catalog-hero__actions">
              <a
                className="catalog-primary-action"
                href="#coleccion"
              >
                Ver colección
              </a>

              <span>
                {products.length}{" "}
                {products.length === 1
                  ? "diseño disponible"
                  : "diseños disponibles"}
              </span>
            </div>
          </div>

          <div
            className="catalog-hero__visual"
            aria-hidden="true"
          >
            <div className="catalog-hero__shape">
              <span>Diseños únicos</span>
            </div>
          </div>
        </section>

        <section
          className="catalog-collection"
          id="coleccion"
        >
          <header className="catalog-section-heading">
            <div>
              <p className="catalog-eyebrow">
                Colección
              </p>

              <h2>Encuentra tu próximo diseño</h2>
            </div>

            <p>
              Consulta las piezas publicadas y
              abre cada producto para conocer sus
              detalles.
            </p>
          </header>

          <div className="catalog-toolbar">
            <label className="catalog-search">
              <span>Buscar</span>

              <input
                type="search"
                value={searchTerm}
                placeholder="Vestido, blusa, diseño..."
                onChange={(event) => {
                  setSearchTerm(
                    event.target.value,
                  );
                }}
              />
            </label>

            <div
              className="catalog-categories"
              aria-label="Filtrar por categoría"
            >
              <button
                className={
                  selectedCategoryId === null
                    ? "catalog-category-button catalog-category-button--active"
                    : "catalog-category-button"
                }
                type="button"
                onClick={() => {
                  setSelectedCategoryId(null);
                }}
              >
                Todos
              </button>

              {categories.map((category) => (
                <button
                  className={
                    selectedCategoryId ===
                    category.id
                      ? "catalog-category-button catalog-category-button--active"
                      : "catalog-category-button"
                  }
                  key={category.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategoryId(
                      category.id,
                    );
                  }}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div className="catalog-results-heading">
            <strong>
              {visibleProducts.length}
            </strong>

            <span>
              {visibleProducts.length === 1
                ? "producto encontrado"
                : "productos encontrados"}
            </span>
          </div>

          {isLoading ? (
            <section className="catalog-state">
              <p>Cargando colección...</p>
            </section>
          ) : null}

          {!isLoading && error ? (
            <section className="catalog-state">
              <p role="alert">{error}</p>

              <button
                type="button"
                onClick={() => {
                  setReloadCounter(
                    (current) =>
                      current + 1,
                  );
                }}
              >
                Intentar nuevamente
              </button>
            </section>
          ) : null}

          {!isLoading &&
          !error &&
          visibleProducts.length === 0 ? (
            <section className="catalog-state">
              <p>
                No encontramos productos con esos
                filtros.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategoryId(null);
                }}
              >
                Limpiar filtros
              </button>
            </section>
          ) : null}

          {!isLoading &&
          !error &&
          visibleProducts.length > 0 ? (
            <div className="catalog-product-grid">
              {visibleProducts.map(
                (product) => {
                  const productData =
                    product.toObject();

                  const coverImage =
                    productData.images.find(
                      (image) =>
                        image.isCover,
                    ) ??
                    productData.images[0];

                  const imageUrl = coverImage
                    ? productImageStorage.getPublicUrl(
                        coverImage.path,
                      )
                    : null;

                  return (
                    <Link
                      className="catalog-product-card"
                      key={productData.id}
                      to={`/productos/${productData.slug}`}
                    >
                      <div className="catalog-product-card__media">
                        <CatalogProductImage
                          source={imageUrl}
                          alt={
                            coverImage?.altText ||
                            productData.name
                          }
                        />

                        {productData.featured ? (
                          <span className="catalog-product-card__featured">
                            Destacado
                          </span>
                        ) : null}
                      </div>

                      <div className="catalog-product-card__body">
                        <div className="catalog-product-card__heading">
                          <h3>
                            {productData.name}
                          </h3>

                          <strong>
                            {currencyFormatter.format(
                              productData.priceInPesos,
                            )}
                          </strong>
                        </div>

                        <p>
                          {
                            productData.shortDescription
                          }
                        </p>

                        <div className="catalog-product-card__tags">
                          {productData.madeToOrder ? (
                            <span>
                              Sobre pedido
                            </span>
                          ) : null}

                          {productData.customizable ? (
                            <span>
                              Personalizable
                            </span>
                          ) : null}
                        </div>

                        <span className="catalog-product-card__action">
                          Ver producto →
                        </span>
                      </div>
                    </Link>
                  );
                },
              )}
            </div>
          ) : null}
        </section>
      </main>

      <CatalogFooter />
    </div>
  );
}