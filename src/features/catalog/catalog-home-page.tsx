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

const openingClass =
  "catalog-opening catalog-container grid gap-1 py-[14px] max-[820.01px]:py-2 max-[359.01px]:gap-0 max-[359.01px]:py-1";

const openingMetaClass =
  "flex min-w-0 flex-wrap items-center gap-x-3 gap-y-0";

const openingEyebrowClass =
  "m-0 text-boutique-label text-boutique-muted uppercase";

const openingResultClass =
  "m-0 text-[0.78rem] font-medium text-boutique-muted [font-variant-numeric:tabular-nums]";

const openingTitleClass =
  "m-0 max-w-[760px] text-balance font-boutique-display text-[clamp(2.15rem,3.2vw,2.9rem)] font-normal leading-none tracking-[-0.035em] text-boutique-ink " +
  "max-[820.01px]:max-w-[590px] max-[820.01px]:text-[clamp(1.75rem,7.2vw,2rem)] " +
  "max-[359.01px]:leading-[0.98]";

const openingDescriptionClass =
  "m-0 max-w-[65ch] text-[0.9rem] leading-[1.5] text-boutique-muted [text-wrap:pretty] " +
  "max-[430.01px]:text-[0.8rem] max-[430.01px]:leading-[1.4] max-[359.01px]:text-[0.75rem]";

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

  const resultSummary = isLoading
    ? "Preparando la colección…"
    : error
      ? "Colección no disponible"
      : `${visibleProducts.length} ${
          visibleProducts.length === 1
            ? "pieza"
            : "piezas"
        }`;

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
  }

  return (
    <PublicPageShell
      businessName={shopSettings?.businessName}
      headerControls={{
        searchTerm,
        onSearchTermChange: updateSearchTerm,
        onClearSearch: clearSearch,
        categories,
        selectedCategoryId,
        onSelectCategory: selectCategory,
      }}
      skipTargetId="contenido-principal"
    >
      <main id="contenido-principal">
        <section
          className={openingClass}
          aria-labelledby="catalog-opening-title"
        >
          <div className={openingMetaClass}>
            <p className={openingEyebrowClass}>Colección actual · Boutique</p>

            <p
              className={openingResultClass}
              aria-live="polite"
              role="status"
            >
              {resultSummary}
            </p>
          </div>

          <h1 className={openingTitleClass} id="catalog-opening-title">
            La colección, a tu manera.
          </h1>

          <p className={openingDescriptionClass}>
            Piezas seleccionadas con atención al detalle.
          </p>
        </section>

        <section
          className="catalog-collection"
          id="coleccion"
          aria-label="Productos de la colección"
          aria-busy={isLoading}
        >
          <div className="catalog-results">
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
                    <li key={productData.id}>
                      <CatalogProductCard
                        product={productData}
                        imageUrl={imageUrl}
                        imageAlt={coverImage?.altText || productData.name}
                      />
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        </section>

        {!isLoading && !error && products.length > 0 ? (
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
