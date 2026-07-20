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
import type { ShopSettings } from "../../core/entities/shop-settings";
import { GetShopSettings } from "../../core/use-cases/get-shop-settings";
import { ListActiveCategories } from "../../core/use-cases/list-active-categories";
import { ListPublishedProducts } from "../../core/use-cases/list-published-products";
import { SupabaseCategoryRepository } from "../../infrastructure/repositories/supabase-category-repository";
import { SupabaseProductCatalogRepository } from "../../infrastructure/repositories/supabase-product-catalog-repository";
import { SupabaseShopSettingsRepository } from "../../infrastructure/repositories/supabase-shop-settings-repository";
import { SupabaseProductImageStorage } from "../../infrastructure/storage/supabase-product-image-storage";
import { supabase } from "../../infrastructure/supabase/supabase-client";
import { buildProductWhatsAppUrl } from "../../lib/build-product-whatsapp-url";
import { useCart } from "../cart/use-cart";
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

const shopSettingsRepository =
  new SupabaseShopSettingsRepository(
    supabase,
  );

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

const getShopSettings =
  new GetShopSettings(
    shopSettingsRepository,
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

  const {
    items: cartItems,
    addItem,
  } = useCart();

  const [cartMessage, setCartMessage] =
    useState<string | null>(null);

  const [product, setProduct] =
    useState<Product | null>(null);

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [shopSettings, setShopSettings] =
    useState<ShopSettings | null>(null);

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
          loadedSettings,
        ] = await Promise.all([
          listPublishedProducts.execute(),
          listActiveCategories.execute(),
          getShopSettings.execute(),
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
        setShopSettings(loadedSettings);
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
        <CatalogHeader
          businessName={
            shopSettings?.businessName
          }
        />

        <main className="catalog-detail-state">
          <p>Cargando producto...</p>
        </main>

        <CatalogFooter
          businessName={
            shopSettings?.businessName
          }
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="catalog-site">
        <CatalogHeader
          businessName={
            shopSettings?.businessName
          }
        />

        <main className="catalog-detail-state">
          <p role="alert">{error}</p>

          <Link
            className="catalog-primary-action"
            to="/"
          >
            Volver al catálogo
          </Link>
        </main>

        <CatalogFooter
          businessName={
            shopSettings?.businessName
          }
        />
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="catalog-site">
        <CatalogHeader
          businessName={
            shopSettings?.businessName
          }
        />

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

        <CatalogFooter
          businessName={
            shopSettings?.businessName
          }
        />
      </div>
    );
  }

  const selectedImageUrl =
    selectedImage
      ? productImageStorage.getPublicUrl(
          selectedImage.path,
        )
      : null;

  const productPublicUrl =
    new URL(
      `/productos/${productData.slug}`,
      window.location.origin,
    ).toString();

const whatsappUrl =
  shopSettings?.whatsappNumber
    ? buildProductWhatsAppUrl({
        phoneNumber:
          shopSettings.whatsappNumber,
        productName:
          productData.name,
        priceInPesos:
          productData.priceInPesos,
        productUrl:
          productPublicUrl,
      })
    : null;

const cartQuantity =
  cartItems.find(
    (item) =>
      item.productId === productData.id,
  )?.quantity ?? 0;

function handleAddToCart(): void {
  const currentProductData =
    productData;

  if (!currentProductData) {
    return;
  }

  const coverImage =
    currentProductData.images.find(
      (image) => image.isCover,
    ) ??
    currentProductData.images[0] ??
    null;

  addItem({
    productId:
      currentProductData.id,
    slug:
      currentProductData.slug,
    name:
      currentProductData.name,
    priceInPesos:
      currentProductData.priceInPesos,
    imagePath:
      coverImage?.path ?? null,
    imageAltText:
      coverImage?.altText ||
      currentProductData.name,
  });

  setCartMessage(
    "El producto se agregó a tu solicitud.",
  );
}

  return (
    <div className="catalog-site">
      <CatalogHeader
        businessName={
          shopSettings?.businessName
        }
      />

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
    Agrégalo a tu solicitud para
    consultar varios productos en un
    solo mensaje.
  </p>

  <button
    className="catalog-request-add-button"
    type="button"
    onClick={handleAddToCart}
  >
    Agregar a mi solicitud
  </button>

  {cartQuantity > 0 ? (
    <p
      className="catalog-request-message"
      role="status"
    >
      Cantidad seleccionada:{" "}
      <strong>{cartQuantity}</strong>
    </p>
  ) : null}

  {cartMessage ? (
    <p
      className="catalog-request-message"
      role="status"
    >
      {cartMessage}
    </p>
  ) : null}

  <Link
    className="catalog-secondary-action"
    to="/solicitud"
  >
    Ver mi solicitud
  </Link>

  {whatsappUrl ? (
    <a
      className="catalog-whatsapp-secondary"
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
    >
      Consultar solo este producto
    </a>
  ) : null}
</aside>
          </section>
        </div>
      </main>

      <CatalogFooter
        businessName={
          shopSettings?.businessName
        }
      />
    </div>
  );
}