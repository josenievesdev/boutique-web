import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import type { Category } from "../../core/entities/category";
import type { Product, ProductProps } from "../../core/entities/product";
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

const heroClass =
  "mx-auto grid w-[calc(100%_-_48px)] max-w-boutique-standard grid-cols-[minmax(360px,0.94fr)_minmax(480px,1.06fr)] items-center gap-[clamp(42px,6vw,88px)] pt-[42px] pb-[46px] " +
  "max-[1024.01px]:grid-cols-[minmax(330px,0.94fr)_minmax(390px,1.06fr)] max-[1024.01px]:gap-[34px] " +
  "max-[820.01px]:grid-cols-[minmax(0,0.94fr)_minmax(300px,1.06fr)] max-[820.01px]:gap-[25px] max-[820.01px]:pt-8 max-[820.01px]:pb-[38px] " +
  "max-[700.01px]:w-[calc(100%_-_28px)] max-[700.01px]:grid-cols-1 max-[700.01px]:gap-6 max-[700.01px]:pt-[26px] max-[700.01px]:pb-8 " +
  "max-[430.01px]:w-[calc(100%_-_24px)] max-[430.01px]:pt-[22px]";

const heroContentClass =
  "min-w-0 animate-[catalog-reveal_320ms_ease-out_both] motion-reduce:animate-none! max-[700.01px]:max-w-[590px]";

const heroEyebrowClass =
  "m-0 text-boutique-label text-boutique-muted uppercase";

const heroTitleClass =
  "mt-[13px] mb-0 max-w-[590px] text-balance font-boutique-display text-boutique-display " +
  "max-[820.01px]:text-[clamp(2.55rem,6vw,3.1rem)] " +
  "max-[700.01px]:max-w-[560px] max-[700.01px]:text-[clamp(2.45rem,10vw,3.2rem)] " +
  "max-[430.01px]:mt-[10px] max-[430.01px]:text-[clamp(2.3rem,10.8vw,2.8rem)] " +
  "max-[359.01px]:text-[2.18rem]";

const heroDescriptionClass =
  "mt-4 mb-0 max-w-[520px] text-[clamp(0.86rem,1vw,0.96rem)] leading-[1.65] text-boutique-muted " +
  "max-[430.01px]:mt-3 max-[430.01px]:text-[0.78rem]";

const heroCollectionLinkClass =
  "group mt-[17px] inline-flex items-center gap-[10px] border-0 border-b border-solid border-boutique-line-strong pb-[3px] text-[0.7rem] font-semibold no-underline!";

const discoveryClass =
  "mt-6 grid max-w-[530px] gap-[10px] max-[430.01px]:mt-[18px]";

const discoveryHeadingClass =
  "flex items-baseline justify-between gap-[18px] text-[0.65rem] text-boutique-muted";

const searchClass =
  "relative flex min-h-[52px] min-w-0 items-center rounded-boutique-card border border-solid border-boutique-line-strong bg-boutique-surface-raised pl-[46px] " +
  "transition-[border-color,box-shadow] duration-[160ms] ease-[ease] focus-within:border-boutique-brand focus-within:[box-shadow:0_0_0_3px_var(--color-focus-ring)]";

const searchIconClass =
  "absolute top-1/2 left-[18px] h-[14px] w-[14px] rounded-boutique-circle border-[1.5px] border-solid border-boutique-muted [transform:translateY(-58%)] " +
  "after:absolute after:right-[-5px] after:bottom-[-3px] after:h-[1.5px] after:w-[6px] after:origin-left after:bg-boutique-muted after:content-[''] after:[transform:rotate(45deg)]";

const searchInputClass =
  "min-h-[46px]! min-w-0 w-full rounded-none! [border:0]! bg-transparent! px-[14px]! py-0! text-[0.83rem]! [box-shadow:none]! [outline:0]! [&::-webkit-search-cancel-button]:hidden";

const searchClearButtonClass =
  "mr-2 min-h-8 flex-none border-0! border-l! border-solid! border-boutique-line! bg-transparent px-[10px] py-0 text-[0.63rem]! font-semibold! text-boutique-muted! hover:text-boutique-ink!";

const categoriesClass =
  "flex min-w-0 flex-wrap gap-[6px] max-[430.01px]:flex-nowrap max-[430.01px]:overflow-x-auto max-[430.01px]:pb-[2px] max-[430.01px]:[scrollbar-width:none] max-[430.01px]:[&::-webkit-scrollbar]:hidden";

const categoryButtonBaseClass =
  "min-h-8 rounded-boutique-pill border! border-solid! px-3 py-0 text-[0.64rem]! font-medium! max-[430.01px]:flex-none";

const categoryButtonActiveClass =
  `${categoryButtonBaseClass} border-boutique-brand! bg-boutique-brand text-boutique-inverse!`;

const categoryButtonInactiveClass =
  `${categoryButtonBaseClass} border-boutique-line! bg-transparent text-boutique-muted! hover:border-boutique-line-strong! hover:bg-boutique-canvas-subtle hover:text-boutique-ink!`;

const showcaseClass =
  "relative grid h-[clamp(350px,33vw,430px)] min-w-0 grid-cols-[minmax(0,1.48fr)_minmax(150px,0.58fr)] [align-items:end] gap-[14px] pt-[18px] pr-[18px] pb-[18px] pl-0 " +
  "animate-[catalog-reveal_320ms_70ms_ease-out_both] motion-reduce:animate-none! " +
  "before:absolute before:top-0 before:right-0 before:z-[-1] before:h-[76%] before:w-[72%] before:rounded-boutique-panel before:bg-boutique-blush before:content-[''] " +
  "max-[1024.01px]:h-[390px] max-[1024.01px]:grid-cols-[minmax(0,1.35fr)_minmax(125px,0.56fr)] " +
  "max-[820.01px]:h-[390px] max-[820.01px]:grid-cols-1 max-[820.01px]:pr-[14px] " +
  "max-[700.01px]:h-[340px] max-[700.01px]:grid-cols-[minmax(0,1.45fr)_minmax(100px,0.55fr)] max-[700.01px]:gap-2 max-[700.01px]:pt-3 max-[700.01px]:pr-3 max-[700.01px]:pb-3 " +
  "max-[430.01px]:h-[310px] " +
  "max-[359.01px]:h-[290px] max-[359.01px]:grid-cols-1 max-[359.01px]:pr-[10px]";

const showcaseProductBaseClass =
  "group grid min-h-0 min-w-0 grid-rows-[minmax(0,1fr)_auto] overflow-hidden bg-boutique-surface-raised text-boutique-ink! no-underline!";

const showcasePrimaryProductClass = `${showcaseProductBaseClass} h-full`;

const showcaseSecondaryProductClass =
  `${showcaseProductBaseClass} mb-[2px] h-[70%] max-[820.01px]:hidden max-[700.01px]:grid max-[700.01px]:h-[66%] max-[359.01px]:hidden`;

const showcaseMediaBaseClass =
  "block min-h-0 min-w-0 overflow-hidden [&>img]:h-full! [&>img]:w-full [&>img]:object-contain [&>img]:transition-transform [&>img]:duration-[280ms] [&>img]:ease-[ease] [&>.catalog-product-image-fallback]:h-full [&>.catalog-product-image-fallback]:w-full group-hover:[&>img]:scale-[1.015]";

const showcasePrimaryMediaClass =
  `${showcaseMediaBaseClass} bg-boutique-mist`;

const showcaseSecondaryMediaClass =
  `${showcaseMediaBaseClass} bg-boutique-sage`;

const showcaseCaptionBaseClass =
  "grid min-h-[62px] gap-[7px] border-0 border-t border-solid border-boutique-line bg-boutique-surface-raised pt-[9px] pr-[11px] pb-[10px] pl-[11px] " +
  "max-[700.01px]:min-h-[57px] max-[700.01px]:p-[8px_9px]";

const showcasePrimaryCaptionClass =
  `${showcaseCaptionBaseClass} grid-cols-[minmax(0,1fr)_auto] [align-items:end] gap-[14px]`;

const showcaseSecondaryCaptionClass = showcaseCaptionBaseClass;

const showcaseCaptionContentClass = "grid min-w-0 gap-[2px]";

const showcasePrimaryLabelClass =
  "text-[0.55rem] font-semibold tracking-[0.08em] text-boutique-muted uppercase";

const showcaseSecondaryLabelClass =
  `${showcasePrimaryLabelClass} max-[700.01px]:hidden`;

const showcasePrimaryNameClass =
  "truncate font-boutique-display text-[1.08rem] font-medium leading-[1.05]";

const showcaseSecondaryNameClass =
  `${showcasePrimaryNameClass} max-[700.01px]:whitespace-normal max-[700.01px]:text-[0.9rem]`;

const showcasePrimaryPriceClass = "text-[0.66rem] font-semibold";

const showcaseSecondaryPriceClass =
  `${showcasePrimaryPriceClass} max-[700.01px]:hidden`;

const showcaseEmptyClass =
  "col-span-full grid h-full [place-items:end_start] bg-[linear-gradient(135deg,var(--color-pastel-mist),var(--color-pastel-blush))] p-6 font-boutique-display text-[1.35rem] text-boutique-muted";

type ShowcasePlacement = "primary" | "secondary";

interface CatalogShowcaseProductProps {
  product: ProductProps;
  placement: ShowcasePlacement;
}

function resolveCategoryButtonClass(isActive: boolean): string {
  return isActive
    ? categoryButtonActiveClass
    : categoryButtonInactiveClass;
}

function CatalogShowcaseProduct({
  product,
  placement,
}: CatalogShowcaseProductProps) {
  const coverImage =
    product.images.find((image) => image.isCover) ?? product.images[0];
  const imageUrl = coverImage
    ? productImageStorage.getPublicUrl(coverImage.path)
    : null;
  const isPrimary = placement === "primary";

  return (
    <Link
      className={
        isPrimary
          ? showcasePrimaryProductClass
          : showcaseSecondaryProductClass
      }
      to={`/productos/${product.slug}`}
    >
      <span
        className={
          isPrimary ? showcasePrimaryMediaClass : showcaseSecondaryMediaClass
        }
      >
        <CatalogProductImage source={imageUrl} alt="" />
      </span>
      <span
        className={
          isPrimary
            ? showcasePrimaryCaptionClass
            : showcaseSecondaryCaptionClass
        }
      >
        <span className={showcaseCaptionContentClass}>
          <small
            className={
              isPrimary
                ? showcasePrimaryLabelClass
                : showcaseSecondaryLabelClass
            }
          >
            {isPrimary ? "Pieza destacada" : "Otra pieza"}
          </small>
          <strong
            className={
              isPrimary
                ? showcasePrimaryNameClass
                : showcaseSecondaryNameClass
            }
          >
            {product.name}
          </strong>
        </span>
        <b
          className={
            isPrimary
              ? showcasePrimaryPriceClass
              : showcaseSecondaryPriceClass
          }
        >
          {currencyFormatter.format(product.priceInPesos)}
        </b>
      </span>
    </Link>
  );
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

  const [primaryShowcaseProduct, secondaryShowcaseProduct] =
    showcaseProducts;

  function clearFilters(): void {
    setSearchTerm("");
    setSelectedCategoryId(null);
  }

  return (
    <PublicPageShell businessName={shopSettings?.businessName}>
      <main>
        <section className={heroClass} aria-labelledby="catalog-hero-title">
          <div className={heroContentClass}>
            <p className={heroEyebrowClass}>Colección actual · Boutique</p>

            <h1 className={heroTitleClass} id="catalog-hero-title">
              Una forma más personal de elegir lo que vistes.
            </h1>

            <p className={heroDescriptionClass}>
              Descubre prendas seleccionadas, diseños personalizables y piezas
              confeccionadas con atención a cada detalle.
            </p>

            <a className={heroCollectionLinkClass} href="#coleccion">
              Explorar la colección{" "}
              <span
                className="transition-transform duration-[220ms] ease-[ease] group-hover:translate-y-[2px]"
                aria-hidden="true"
              >
                ↓
              </span>
            </a>

            <div className={discoveryClass}>
              <div className={discoveryHeadingClass}>
                <span className="font-semibold tracking-[0.08em] text-boutique-ink">
                  Descubrir
                </span>
                <small
                  className="text-[inherit] max-[430.01px]:max-w-[148px] max-[430.01px]:truncate"
                  aria-live="polite"
                  role="status"
                >
                  {resultSummary}
                </small>
              </div>

              <label className={searchClass}>
                <span className="catalog-visually-hidden">
                  Buscar en la colección
                </span>
                <span className={searchIconClass} aria-hidden="true" />
                <input
                  className={searchInputClass}
                  type="search"
                  value={searchTerm}
                  placeholder="Busca por nombre o descripción"
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
              </label>

              <div className={categoriesClass} aria-label="Filtrar por categoría">
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
            </div>
          </div>

          <div
            className={showcaseClass}
            role="group"
            aria-label={
              showcaseProducts.length > 0
                ? "Selección de la colección"
                : "La colección estará disponible próximamente"
            }
          >
            {primaryShowcaseProduct ? (
              <CatalogShowcaseProduct
                product={primaryShowcaseProduct}
                placement="primary"
              />
            ) : null}

            {secondaryShowcaseProduct ? (
              <CatalogShowcaseProduct
                product={secondaryShowcaseProduct}
                placement="secondary"
              />
            ) : null}

            {showcaseProducts.length === 0 ? (
              <div className={showcaseEmptyClass} aria-hidden="true">
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
