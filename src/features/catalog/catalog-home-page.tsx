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
  "catalog-container grid gap-1 py-4 max-[700.01px]:py-3 max-[359.01px]:gap-0 max-[359.01px]:py-1";

const openingEyebrowClass =
  "m-0 text-boutique-label text-boutique-muted uppercase";

const openingTitleClass =
  "m-0 max-w-[760px] text-balance font-boutique-display text-[clamp(2.35rem,3.6vw,3.25rem)] font-normal leading-none tracking-[-0.035em] text-boutique-ink " +
  "max-[700.01px]:max-w-[590px] max-[700.01px]:text-[clamp(1.9rem,8.7vw,2.5rem)] " +
  "max-[359.01px]:text-[1.72rem] max-[359.01px]:leading-[0.98]";

const openingDescriptionClass =
  "m-0 max-w-[65ch] text-[0.9rem] leading-[1.5] text-boutique-muted [text-wrap:pretty] " +
  "max-[430.01px]:text-[0.8rem] max-[430.01px]:leading-[1.4] max-[359.01px]:text-[0.75rem]";

const toolbarClass =
  "grid gap-1 border-0 border-b border-solid border-boutique-line pt-3 pb-2 max-[700.01px]:pt-2 max-[359.01px]:gap-0 max-[359.01px]:pt-1 max-[359.01px]:pb-1";

const toolbarTopClass =
  "grid grid-cols-[minmax(0,0.72fr)_minmax(360px,1fr)] items-end gap-[clamp(24px,5vw,72px)] " +
  "max-[700.01px]:grid-cols-1 max-[700.01px]:gap-1 max-[359.01px]:gap-0";

const toolbarHeadingClass =
  "flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-0";

const toolbarTitleClass =
  "m-0 font-boutique-display text-[clamp(1.75rem,2.5vw,2.2rem)] font-normal leading-none tracking-[-0.03em] text-boutique-ink";

const toolbarResultClass =
  "m-0 text-[0.78rem] font-medium text-boutique-muted [font-variant-numeric:tabular-nums]";

const searchClass =
  "relative flex min-h-12 min-w-0 items-center rounded-boutique-control border border-solid border-boutique-line-strong bg-boutique-surface-raised pl-[46px] " +
  "transition-[border-color,box-shadow] duration-[160ms] ease-[ease] focus-within:border-boutique-brand focus-within:[box-shadow:0_0_0_3px_var(--color-focus-ring)]";

const searchIconClass =
  "absolute top-1/2 left-[18px] h-[14px] w-[14px] rounded-boutique-circle border-[1.5px] border-solid border-boutique-muted [transform:translateY(-58%)] " +
  "after:absolute after:right-[-5px] after:bottom-[-3px] after:h-[1.5px] after:w-[6px] after:origin-left after:bg-boutique-muted after:content-[''] after:[transform:rotate(45deg)]";

const searchInputClass =
  "min-h-[46px]! min-w-0 w-full rounded-none! [border:0]! bg-transparent! px-[14px]! py-0! text-[0.86rem]! [box-shadow:none]! [outline:0]! [&::-webkit-search-cancel-button]:hidden";

const searchClearButtonClass =
  "mr-1 min-h-11 min-w-11 flex-none border-0! border-l! border-solid! border-boutique-line! bg-transparent px-3 py-0 text-[0.75rem]! font-semibold! text-boutique-muted! hover:text-boutique-ink!";

const categoriesClass =
  "flex min-w-0 snap-x snap-proximity gap-[clamp(16px,2.2vw,28px)] overflow-x-auto overscroll-x-contain [scrollbar-width:thin]";

const categoryButtonBaseClass =
  "relative min-h-11 flex-none snap-start rounded-none border-0! bg-transparent px-0 py-0 text-[0.75rem]! leading-[1.25]! font-medium! whitespace-nowrap " +
  "after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:content-[''] after:transition-[background-color,transform] after:duration-[160ms] after:ease-[ease]";

const categoryButtonActiveClass =
  `${categoryButtonBaseClass} text-boutique-ink! after:bg-boutique-ink after:[transform:scaleX(1)]`;

const categoryButtonInactiveClass =
  `${categoryButtonBaseClass} text-boutique-muted! after:bg-boutique-line-strong after:[transform:scaleX(0)] hover:text-boutique-ink! hover:after:[transform:scaleX(1)]`;

function resolveCategoryButtonClass(isActive: boolean): string {
  return isActive
    ? categoryButtonActiveClass
    : categoryButtonInactiveClass;
}

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

  function clearFilters(): void {
    setSearchTerm("");
    setSelectedCategoryId(null);
  }

  return (
    <PublicPageShell
      businessName={shopSettings?.businessName}
      skipTargetId="contenido-principal"
    >
      <main id="contenido-principal">
        <section
          className={openingClass}
          aria-labelledby="catalog-opening-title"
        >
          <p className={openingEyebrowClass}>Colección actual · Boutique</p>

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
          aria-labelledby="catalog-collection-title"
          aria-busy={isLoading}
        >
          <header className={toolbarClass}>
            <div className={toolbarTopClass}>
              <div className={toolbarHeadingClass}>
                <h2
                  className={toolbarTitleClass}
                  id="catalog-collection-title"
                >
                  La colección
                </h2>

                <p
                  className={toolbarResultClass}
                  aria-live="polite"
                  role="status"
                >
                  {resultSummary}
                </p>
              </div>

              <div className={searchClass}>
                <label
                  className="catalog-visually-hidden"
                  htmlFor="catalog-search"
                >
                  Buscar en la colección
                </label>
                <span className={searchIconClass} aria-hidden="true" />
                <input
                  className={searchInputClass}
                  id="catalog-search"
                  type="search"
                  name="catalog-search"
                  autoComplete="off"
                  value={searchTerm}
                  placeholder="Busca por nombre o descripción…"
                  onChange={(event) => {
                    setSearchTerm(event.target.value);
                  }}
                />
                {searchTerm ? (
                  <button
                    className={searchClearButtonClass}
                    type="button"
                    aria-label="Limpiar búsqueda"
                    onClick={() => {
                      setSearchTerm("");
                    }}
                  >
                    Limpiar
                  </button>
                ) : null}
              </div>
            </div>

            <div
              className={categoriesClass}
              role="group"
              aria-label="Filtrar por categoría"
            >
              <button
                className={resolveCategoryButtonClass(
                  selectedCategoryId === null,
                )}
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
                  className={resolveCategoryButtonClass(
                    selectedCategoryId === category.id,
                  )}
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
          </header>

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
