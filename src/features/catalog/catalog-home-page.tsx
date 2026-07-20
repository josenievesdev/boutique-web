import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import type { Category } from "../../core/entities/category";
import type { Product } from "../../core/entities/product";
import type { ShopSettings } from "../../core/entities/shop-settings";
import { GetShopSettings } from "../../core/use-cases/get-shop-settings";
import { ListActiveCategories } from "../../core/use-cases/list-active-categories";
import { ListPublishedProducts } from "../../core/use-cases/list-published-products";
import { SupabaseCategoryRepository } from "../../infrastructure/repositories/supabase-category-repository";
import { SupabaseProductCatalogRepository } from "../../infrastructure/repositories/supabase-product-catalog-repository";
import { SupabaseShopSettingsRepository } from "../../infrastructure/repositories/supabase-shop-settings-repository";
import { SupabaseProductImageStorage } from "../../infrastructure/storage/supabase-product-image-storage";
import { supabase } from "../../infrastructure/supabase/supabase-client";
import { CatalogProductCard } from "./catalog-product-card";
import { CatalogProductImage } from "./catalog-product-image";
import { CatalogPublicState } from "./catalog-public-state";
import { filterCatalogProducts } from "./filter-catalog-products";
import { PublicPageShell } from "./public-page-shell";

const productCatalogRepository = new SupabaseProductCatalogRepository(
  supabase,
);
const categoryRepository = new SupabaseCategoryRepository(supabase);
const shopSettingsRepository = new SupabaseShopSettingsRepository(supabase);
const productImageStorage = new SupabaseProductImageStorage(supabase);
const listPublishedProducts = new ListPublishedProducts(
  productCatalogRepository,
);
const listActiveCategories = new ListActiveCategories(categoryRepository);
const getShopSettings = new GetShopSettings(shopSettingsRepository);

const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export function CatalogHomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [shopSettings, setShopSettings] = useState<ShopSettings | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    string | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadCounter, setReloadCounter] = useState(0);

  useEffect(() => {
    let isActive = true;

    async function loadCatalog(): Promise<void> {
      setIsLoading(true);
      setError(null);

      try {
        const [loadedProducts, loadedCategories, loadedSettings] =
          await Promise.all([
            listPublishedProducts.execute(),
            listActiveCategories.execute(),
            getShopSettings.execute(),
          ]);

        if (!isActive) {
          return;
        }

        setProducts(loadedProducts);
        setCategories(loadedCategories);
        setShopSettings(loadedSettings);
      } catch {
        if (isActive) {
          setError("No fue posible cargar el catálogo.");
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
        categoryId: selectedCategoryId,
      }),
    [products, searchTerm, selectedCategoryId],
  );

  const showcaseProducts = useMemo(() => {
    const productData = products.map((product) => product.toObject());
    const orderedProducts = [
      ...productData.filter((product) => product.featured),
      ...productData.filter((product) => !product.featured),
    ];
    const productIds = new Set<string>();

    return orderedProducts
      .filter((product) => {
        if (productIds.has(product.id)) {
          return false;
        }

        productIds.add(product.id);
        return true;
      })
      .slice(0, 2);
  }, [products]);

  const resultSummary = isLoading
    ? "Preparando la colección…"
    : error
      ? "Colección no disponible"
      : `${visibleProducts.length} ${
          visibleProducts.length === 1
            ? "pieza encontrada"
            : "piezas encontradas"
        }`;

  function clearFilters(): void {
    setSearchTerm("");
    setSelectedCategoryId(null);
  }

  return (
    <PublicPageShell businessName={shopSettings?.businessName}>
      <main>
        <section className="catalog-hero" aria-labelledby="catalog-hero-title">
          <div className="catalog-hero__content">
            <p className="catalog-eyebrow">Colección actual · Boutique</p>

            <h1 id="catalog-hero-title">
              Una forma más personal de elegir lo que vistes.
            </h1>

            <p className="catalog-hero__description">
              Descubre prendas seleccionadas, diseños personalizables y piezas
              confeccionadas con atención a cada detalle.
            </p>

            <a className="catalog-hero__collection-link" href="#coleccion">
              Explorar la colección <span aria-hidden="true">↓</span>
            </a>

            <div className="catalog-discovery">
              <div className="catalog-discovery__heading">
                <span>Descubrir</span>
                <small aria-live="polite" role="status">
                  {resultSummary}
                </small>
              </div>

              <label className="catalog-search">
                <span className="catalog-visually-hidden">
                  Buscar en la colección
                </span>
                <span className="catalog-search__icon" aria-hidden="true" />
                <input
                  type="search"
                  value={searchTerm}
                  placeholder="Busca por nombre o descripción"
                  onChange={(event) => {
                    setSearchTerm(event.target.value);
                  }}
                />
                {searchTerm ? (
                  <button
                    type="button"
                    aria-label="Limpiar búsqueda"
                    onClick={() => {
                      setSearchTerm("");
                    }}
                  >
                    Limpiar
                  </button>
                ) : null}
              </label>

              <div className="catalog-categories" aria-label="Filtrar por categoría">
                <button
                  className={
                    selectedCategoryId === null
                      ? "catalog-category-button catalog-category-button--active"
                      : "catalog-category-button"
                  }
                  type="button"
                  aria-pressed={selectedCategoryId === null}
                  onClick={() => {
                    setSelectedCategoryId(null);
                  }}
                >
                  Todo
                </button>

                {categories.map((category) => (
                  <button
                    className={
                      selectedCategoryId === category.id
                        ? "catalog-category-button catalog-category-button--active"
                        : "catalog-category-button"
                    }
                    key={category.id}
                    type="button"
                    aria-pressed={selectedCategoryId === category.id}
                    onClick={() => {
                      setSelectedCategoryId(category.id);
                    }}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div
            className={`catalog-showcase catalog-showcase--${showcaseProducts.length}`}
            role="group"
            aria-label={
              showcaseProducts.length > 0
                ? "Selección de la colección"
                : "La colección estará disponible próximamente"
            }
          >
            {showcaseProducts.map((product, index) => {
              const coverImage =
                product.images.find((image) => image.isCover) ??
                product.images[0];
              const imageUrl = coverImage
                ? productImageStorage.getPublicUrl(coverImage.path)
                : null;

              return (
                <Link
                  className={`catalog-showcase__product catalog-showcase__product--${
                    index + 1
                  }`}
                  key={product.id}
                  to={`/productos/${product.slug}`}
                >
                  <span className="catalog-showcase__media">
                    <CatalogProductImage source={imageUrl} alt="" />
                  </span>
                  <span className="catalog-showcase__caption">
                    <span>
                      <small>{index === 0 ? "Pieza destacada" : "Otra pieza"}</small>
                      <strong>{product.name}</strong>
                    </span>
                    <b>{currencyFormatter.format(product.priceInPesos)}</b>
                  </span>
                </Link>
              );
            })}

            {showcaseProducts.length === 0 ? (
              <div className="catalog-showcase__empty" aria-hidden="true">
                <span>Colección en preparación</span>
              </div>
            ) : null}
          </div>
        </section>

        <section
          className="catalog-collection"
          id="coleccion"
          aria-labelledby="catalog-collection-title"
        >
          <header className="catalog-collection__header">
            <div>
              <p className="catalog-eyebrow">Edición disponible</p>
              <h2 id="catalog-collection-title">La colección</h2>
            </div>

            {!isLoading && !error ? <p>{resultSummary}</p> : null}
          </header>

          {isLoading ? (
            <CatalogPublicState eyebrow="Actualizando" tone="mist">
              <p>Cargando las piezas disponibles…</p>
            </CatalogPublicState>
          ) : null}

          {!isLoading && error ? (
            <CatalogPublicState
              eyebrow="No disponible"
              title="La colección no pudo cargarse"
              tone="error"
            >
              <p role="alert">{error}</p>
              <button
                type="button"
                onClick={() => {
                  setReloadCounter((current) => current + 1);
                }}
              >
                Intentar nuevamente
              </button>
            </CatalogPublicState>
          ) : null}

          {!isLoading && !error && visibleProducts.length === 0 ? (
            <CatalogPublicState
              eyebrow="Sin coincidencias"
              title="Probemos otra búsqueda"
            >
              <p>No encontramos piezas con los filtros seleccionados.</p>
              <button type="button" onClick={clearFilters}>
                Limpiar filtros
              </button>
            </CatalogPublicState>
          ) : null}

          {!isLoading && !error && visibleProducts.length > 0 ? (
            <div
              className={`catalog-product-grid catalog-product-grid--${Math.min(
                visibleProducts.length,
                4,
              )}`}
            >
              {visibleProducts.map((product) => {
                const productData = product.toObject();
                const coverImage =
                  productData.images.find((image) => image.isCover) ??
                  productData.images[0];
                const imageUrl = coverImage
                  ? productImageStorage.getPublicUrl(coverImage.path)
                  : null;

                return (
                  <CatalogProductCard
                    key={productData.id}
                    product={productData}
                    imageUrl={imageUrl}
                    imageAlt={coverImage?.altText || productData.name}
                  />
                );
              })}
            </div>
          ) : null}
        </section>
      </main>
    </PublicPageShell>
  );
}
