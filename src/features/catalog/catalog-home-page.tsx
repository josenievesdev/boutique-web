import { useEffect, useMemo, useState } from "react";
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
import { CatalogCategoryNavigation } from "./catalog-category-navigation";
import { CatalogProductCard } from "./catalog-product-card";
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
  const selectedCategoryName = categories.find(
    (category) => category.id === selectedCategoryId,
  )?.name;

  const resultSummary = isLoading
    ? "Preparando la colección…"
    : error
      ? "Colección no disponible"
      : `${visibleProducts.length} ${
          visibleProducts.length === 1
            ? "pieza"
            : "piezas"
        }`;
  const resultAnnouncement = [
    resultSummary,
    selectedCategoryName ? `Categoría: ${selectedCategoryName}.` : null,
    searchTerm.trim() ? `Búsqueda: ${searchTerm.trim()}.` : null,
  ]
    .filter(Boolean)
    .join(" ");

  function updateSearchTerm(value: string): void {
    setSearchTerm(value);
  }

  function clearSearch(): void {
    setSearchTerm("");
  }

  function selectCategory(categoryId: string | null): void {
    setSelectedCategoryId(categoryId);
  }

  function clearFilters(): void {
    setSearchTerm("");
    setSelectedCategoryId(null);
    window.requestAnimationFrame(() => {
      document.getElementById("catalog-header-search")?.focus();
    });
  }

  return (
    <PublicPageShell
      businessName={shopSettings?.businessName}
      headerSearchControls={{
        searchTerm,
        onSearchTermChange: updateSearchTerm,
        onClearSearch: clearSearch,
      }}
      skipTargetId="contenido-principal"
    >
      <main id="contenido-principal">
        <CatalogCategoryNavigation
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={selectCategory}
        />

        <section
          className="catalog-opening"
          aria-labelledby="catalog-opening-title"
        >
          <div className="catalog-container catalog-opening__content">
            <span className="catalog-opening__accent-line" aria-hidden="true" />

            <div className="catalog-opening__meta">
              <p className="catalog-eyebrow">Colección actual</p>

              <span className="catalog-opening__meta-separator" aria-hidden="true" />

              <p
                className="catalog-opening__result"
                aria-live="polite"
                role="status"
              >
                <span aria-hidden="true">{resultSummary}</span>
                <span className="catalog-visually-hidden">
                  {resultAnnouncement}
                </span>
              </p>
            </div>

            <h1 id="catalog-opening-title">La colección, a tu manera.</h1>

            <p className="catalog-opening__description">
              Piezas seleccionadas con atención al detalle.
            </p>
          </div>
        </section>

        <section
          className="catalog-collection"
          id="coleccion"
          aria-labelledby="catalog-grid-title"
          aria-busy={isLoading}
        >
          <h2 className="catalog-visually-hidden" id="catalog-grid-title">
            Productos de la colección
          </h2>

          <div className="catalog-results">
            {isLoading ? (
              <CatalogPublicState
                eyebrow="Actualizando"
                title="Preparando la colección"
                tone="mist"
              >
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
                    window.requestAnimationFrame(() => {
                      document
                        .querySelector<HTMLElement>("#coleccion .catalog-state")
                        ?.focus();
                    });
                  }}
                >
                  Intentar nuevamente
                </button>
              </CatalogPublicState>
            ) : null}

            {!isLoading && !error && products.length === 0 ? (
              <CatalogPublicState
                eyebrow="Colección"
                title="No hay piezas publicadas"
              />
            ) : null}

            {!isLoading &&
            !error &&
            products.length > 0 &&
            visibleProducts.length === 0 ? (
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
              <ul
                className={`catalog-product-grid${
                  visibleProducts.length <= 2
                    ? ` catalog-product-grid--${visibleProducts.length}`
                    : visibleProducts.length >= 4
                      ? " catalog-product-grid--4"
                      : ""
                }`}
              >
                {visibleProducts.map((product, index) => {
                  const productData = product.toObject();
                  const coverImage =
                    productData.images.find((image) => image.isCover) ??
                    productData.images[0];
                  const imageUrl = coverImage
                    ? productImageStorage.getPublicUrl(coverImage.path)
                    : null;

                  return (
                    <li key={productData.id}>
                      <CatalogProductCard
                        product={productData}
                        imageUrl={imageUrl}
                        imageAlt={coverImage?.altText || productData.name}
                        imageLoading={index === 0 ? "eager" : "lazy"}
                        imageFetchPriority={index === 0 ? "high" : "auto"}
                      />
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        </section>

        {!isLoading && !error && visibleProducts.length > 0 ? (
          <section
            className="catalog-process"
            aria-labelledby="catalog-process-title"
          >
            <div className="catalog-container catalog-process__content">
              <h2 id="catalog-process-title">Cómo preparar tu solicitud</h2>

              <ol className="catalog-process__steps">
                <li>
                  <span aria-hidden="true">01</span>
                  <strong>Elige una pieza.</strong>
                </li>
                <li>
                  <span aria-hidden="true">02</span>
                  <strong>Consulta personalización.</strong>
                </li>
                <li>
                  <span aria-hidden="true">03</span>
                  <strong>Confirma por WhatsApp.</strong>
                </li>
              </ol>
            </div>
          </section>
        ) : null}
      </main>
    </PublicPageShell>
  );
}
