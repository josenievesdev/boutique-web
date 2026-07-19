import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Link,
  useParams,
} from "react-router";
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

export function CatalogProductDetailPage() {
  const { slug } =
    useParams<{ slug: string }>();

  const [product, setProduct] =
    useState<Product | null>(null);

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [
    selectedImageId,
    setSelectedImageId,
  ] = useState<string | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadProduct(): Promise<void> {
      if (!slug) {
        setError(
          "No se recibió el producto solicitado.",
        );
        setIsLoading(false);
        return;
      }

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

        const normalizedSlug =
          slug.trim().toLowerCase();

        const foundProduct =
          loadedProducts.find(
            (currentProduct) =>
              currentProduct.slug ===
              normalizedSlug,
          ) ?? null;

        setCategories(loadedCategories);
        setProduct(foundProduct);

        if (foundProduct) {
          const productData =
            foundProduct.toObject();

          const coverImage =
            productData.images.find(
              (image) => image.isCover,
            ) ??
            productData.images[0];

          setSelectedImageId(
            coverImage?.id ?? null,
          );
        }
      } catch {
        if (isActive) {
          setError(
            "No fue posible cargar el producto.",
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadProduct();

    return () => {
      isActive = false;
    };
  }, [slug]);

  const productData = useMemo(
    () => product?.toObject() ?? null,
    [product],
  );

  const selectedImage = useMemo(() => {
    if (!productData) {
      return null;
    }

    return (
      productData.images.find(
        (image) =>
          image.id === selectedImageId,
      ) ??
      productData.images.find(
        (image) => image.isCover,
      ) ??
      productData.images[0] ??
      null
    );
  }, [
    productData,
    selectedImageId,
  ]);

  const category = useMemo(() => {
    if (!productData?.categoryId) {
      return null;
    }

    return (
      categories.find(
        (currentCategory) =>
          currentCategory.id ===
          productData.categoryId,
      ) ?? null
    );
  }, [
    categories,
    productData,
  ]);

  if (isLoading) {
    return (
      <div className="catalog-site">
        <CatalogHeader />

        <main className="catalog-detail-state">
          <p>Cargando producto...</p>
        </main>

        <CatalogFooter />
      </div>
    );
  }

  if (error) {
    return (
      <div className="catalog-site">
        <CatalogHeader />

        <main className="catalog-detail-state">
          <p role="alert">{error}</p>

          <Link
            className="catalog-primary-action"
            to="/"
          >
            Volver al catálogo
          </Link>
        </main>

        <CatalogFooter />
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="catalog-site">
        <CatalogHeader />

        <main className="catalog-detail-state">
          <p className="catalog-eyebrow">
            Producto no encontrado
          </p>

          <h1>
            Este diseño no está disponible
          </h1>

          <p>
            Puede haber sido retirado, ocultado o
            todavía no estar publicado.
          </p>

          <Link
            className="catalog-primary-action"
            to="/"
          >
            Explorar catálogo
          </Link>
        </main>

        <CatalogFooter />
      </div>
    );
  }

  const selectedImageUrl =
    selectedImage
      ? productImageStorage.getPublicUrl(
          selectedImage.path,
        )
      : null;

  return (
    <div className="catalog-site">
      <CatalogHeader />

      <main className="catalog-product-detail">
        <Link
          className="catalog-detail-back"
          to="/"
        >
          ← Volver al catálogo
        </Link>

        <div className="catalog-product-detail__layout">
          <section className="catalog-product-gallery">
            <div className="catalog-product-gallery__main">
              <CatalogProductImage
                source={selectedImageUrl}
                alt={
                  selectedImage?.altText ||
                  productData.name
                }
              />
            </div>

            {productData.images.length > 1 ? (
              <div className="catalog-product-gallery__thumbnails">
                {productData.images.map(
                  (image) => (
                    <button
                      className={
                        image.id ===
                        selectedImage?.id
                          ? "catalog-thumbnail catalog-thumbnail--active"
                          : "catalog-thumbnail"
                      }
                      key={image.id}
                      type="button"
                      aria-label={`Mostrar ${image.altText}`}
                      aria-pressed={
                        image.id ===
                        selectedImage?.id
                      }
                      onClick={() => {
                        setSelectedImageId(
                          image.id,
                        );
                      }}
                    >
                      <CatalogProductImage
                        source={productImageStorage.getPublicUrl(
                          image.path,
                        )}
                        alt={image.altText}
                      />
                    </button>
                  ),
                )}
              </div>
            ) : null}
          </section>

          <section className="catalog-product-information">
            <p className="catalog-eyebrow">
              {category?.name ??
                "Diseño de boutique"}
            </p>

            <h1>{productData.name}</h1>

            <div className="catalog-detail-price">
              <strong>
                {currencyFormatter.format(
                  productData.priceInPesos,
                )}
              </strong>

              {productData.previousPriceInPesos ? (
                <del>
                  {currencyFormatter.format(
                    productData.previousPriceInPesos,
                  )}
                </del>
              ) : null}
            </div>

            <p className="catalog-detail-summary">
              {productData.shortDescription}
            </p>

            <div className="catalog-detail-tags">
              {productData.featured ? (
                <span>Diseño destacado</span>
              ) : null}

              {productData.customizable ? (
                <span>Personalizable</span>
              ) : null}

              {productData.madeToOrder ? (
                <span>Sobre pedido</span>
              ) : null}
            </div>

            <div className="catalog-detail-description">
              <h2>Detalles del producto</h2>

              <p>{productData.description}</p>
            </div>

            <dl className="catalog-detail-facts">
              <div>
                <dt>Disponibilidad</dt>

                <dd>Disponible</dd>
              </div>

              {productData.preparationDays ? (
                <div>
                  <dt>
                    Tiempo estimado de elaboración
                  </dt>

                  <dd>
                    {
                      productData.preparationDays
                    }{" "}
                    {productData.preparationDays ===
                    1
                      ? "día"
                      : "días"}
                  </dd>
                </div>
              ) : null}

              <div>
                <dt>Referencia</dt>

                <dd>{productData.slug}</dd>
              </div>
            </dl>

            <aside className="catalog-detail-contact">
              <strong>
                ¿Te interesa este diseño?
              </strong>

              <p>
                En el siguiente bloque conectaremos
                esta ficha con una solicitud directa
                por WhatsApp.
              </p>

              <Link
                className="catalog-secondary-action"
                to="/"
              >
                Seguir explorando
              </Link>
            </aside>
          </section>
        </div>
      </main>

      <CatalogFooter />
    </div>
  );
}