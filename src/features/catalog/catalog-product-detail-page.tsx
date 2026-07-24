import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
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
import { CatalogProductImage } from "./catalog-product-image";
import { CatalogPublicState } from "./catalog-public-state";
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

export function CatalogProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { items: cartItems, addItem } = useCart();
  const [cartMessage, setCartMessage] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [shopSettings, setShopSettings] = useState<ShopSettings | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadProduct(): Promise<void> {
      if (!slug) {
        setError("No se recibió el producto solicitado.");
        setIsLoading(false);
        return;
      }

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

        const normalizedSlug = slug.trim().toLowerCase();
        const foundProduct =
          loadedProducts.find(
            (currentProduct) => currentProduct.slug === normalizedSlug,
          ) ?? null;

        setCategories(loadedCategories);
        setShopSettings(loadedSettings);
        setProduct(foundProduct);

        if (foundProduct) {
          const productData = foundProduct.toObject();
          const coverImage =
            productData.images.find((image) => image.isCover) ??
            productData.images[0];

          setSelectedImageId(coverImage?.id ?? null);
        }
      } catch {
        if (isActive) {
          setError("No fue posible cargar el producto.");
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

  const productData = useMemo(() => product?.toObject() ?? null, [product]);

  const selectedImage = useMemo(() => {
    if (!productData) {
      return null;
    }

    return (
      productData.images.find((image) => image.id === selectedImageId) ??
      productData.images.find((image) => image.isCover) ??
      productData.images[0] ??
      null
    );
  }, [productData, selectedImageId]);

  const category = useMemo(() => {
    if (!productData?.categoryId) {
      return null;
    }

    return (
      categories.find(
        (currentCategory) => currentCategory.id === productData.categoryId,
      ) ?? null
    );
  }, [categories, productData]);

  if (isLoading) {
    return (
      <PublicPageShell businessName={shopSettings?.businessName}>
        <main className="catalog-detail-state">
          <CatalogPublicState eyebrow="Cargando" tone="mist">
            <p>Preparando los detalles de la pieza…</p>
          </CatalogPublicState>
        </main>
      </PublicPageShell>
    );
  }

  if (error) {
    return (
      <PublicPageShell businessName={shopSettings?.businessName}>
        <main className="catalog-detail-state">
          <CatalogPublicState
            eyebrow="No disponible"
            title="No pudimos abrir esta pieza"
            tone="error"
          >
            <p role="alert">{error}</p>
            <Link className="catalog-primary-action" to="/">
              Volver a la colección
            </Link>
          </CatalogPublicState>
        </main>
      </PublicPageShell>
    );
  }

  if (!productData) {
    return (
      <PublicPageShell businessName={shopSettings?.businessName}>
        <main className="catalog-detail-state">
          <CatalogPublicState
            eyebrow="Producto no encontrado"
            title="Este diseño no está disponible"
          >
            <p>Puede haber sido retirado, ocultado o aún no estar publicado.</p>
            <Link className="catalog-primary-action" to="/">
              Explorar la colección
            </Link>
          </CatalogPublicState>
        </main>
      </PublicPageShell>
    );
  }

  const selectedImageUrl = selectedImage
    ? productImageStorage.getPublicUrl(selectedImage.path)
    : null;
  const selectedImagePosition = Math.max(
    productData.images.findIndex((image) => image.id === selectedImage?.id) + 1,
    1,
  );
  const productPublicUrl = new URL(
    `/productos/${productData.slug}`,
    window.location.origin,
  ).toString();
  const whatsappUrl = shopSettings?.whatsappNumber
    ? buildProductWhatsAppUrl({
        phoneNumber: shopSettings.whatsappNumber,
        productName: productData.name,
        priceInPesos: productData.priceInPesos,
        productUrl: productPublicUrl,
      })
    : null;
  const cartQuantity =
    cartItems.find((item) => item.productId === productData.id)?.quantity ?? 0;

  function handleAddToCart(): void {
    if (!productData) {
      return;
    }

    const coverImage =
      productData.images.find((image) => image.isCover) ??
      productData.images[0] ??
      null;

    addItem({
      productId: productData.id,
      slug: productData.slug,
      name: productData.name,
      priceInPesos: productData.priceInPesos,
      imagePath: coverImage?.path ?? null,
      imageAltText: coverImage?.altText || productData.name,
    });
    setCartMessage("La pieza se agregó a tu solicitud.");
  }

  return (
    <PublicPageShell businessName={shopSettings?.businessName}>
      <main className="catalog-product-detail">
        <nav className="catalog-detail-back" aria-label="Ruta de navegación">
          <Link to="/">Colección</Link>
          <span aria-hidden="true">/</span>
          <span>{category?.name ?? "Pieza"}</span>
        </nav>

        <div className="catalog-product-detail__layout">
          <section
            className={`catalog-product-gallery${
              productData.images.length > 1
                ? " catalog-product-gallery--multiple"
                : ""
            }`}
            aria-label={`Galería de ${productData.name}`}
          >
            {productData.images.length > 1 ? (
              <div className="catalog-product-gallery__thumbnails">
                {productData.images.map((image, index) => (
                  <button
                    className={
                      image.id === selectedImage?.id
                        ? "catalog-thumbnail catalog-thumbnail--active"
                        : "catalog-thumbnail"
                    }
                    key={image.id}
                    type="button"
                    aria-label={`Mostrar imagen ${index + 1}: ${image.altText}`}
                    aria-pressed={image.id === selectedImage?.id}
                    onClick={() => {
                      setSelectedImageId(image.id);
                    }}
                  >
                    <CatalogProductImage
                      source={productImageStorage.getPublicUrl(image.path)}
                      alt=""
                    />
                  </button>
                ))}
              </div>
            ) : null}

            <figure className="catalog-product-gallery__main">
              <CatalogProductImage
                source={selectedImageUrl}
                alt={selectedImage?.altText || productData.name}
              />
              {productData.images.length > 1 ? (
                <figcaption>
                  {String(selectedImagePosition).padStart(2, "0")} / {" "}
                  {String(productData.images.length).padStart(2, "0")}
                </figcaption>
              ) : null}
            </figure>
          </section>

          <section className="catalog-product-information">
            <p className="catalog-eyebrow">
              {category?.name ?? "Diseño de boutique"}
            </p>

            <div className="catalog-product-information__heading">
              <h1>{productData.name}</h1>

              <div className="catalog-detail-price">
                <strong>
                  {currencyFormatter.format(productData.priceInPesos)}
                </strong>
                {productData.previousPriceInPesos ? (
                  <del>
                    {currencyFormatter.format(
                      productData.previousPriceInPesos,
                    )}
                  </del>
                ) : null}
              </div>
            </div>

            <p className="catalog-detail-summary">
              {productData.shortDescription}
            </p>

            <div className="catalog-detail-tags">
              {productData.featured ? <span>Selección</span> : null}
              {productData.customizable ? <span>Personalizable</span> : null}
              {productData.madeToOrder ? <span>Sobre pedido</span> : null}
            </div>

            <aside className="catalog-detail-contact">
              <div>
                <h2>Consulta esta pieza</h2>
                <p>
                  Agrégala a tu selección o pregunta directamente por WhatsApp.
                </p>
              </div>

              <button
                className="catalog-request-add-button"
                type="button"
                onClick={handleAddToCart}
              >
                Agregar a mi solicitud <span aria-hidden="true">+</span>
              </button>

              {cartQuantity > 0 ? (
                <p className="catalog-request-message" role="status">
                  Cantidad seleccionada: <strong>{cartQuantity}</strong>
                </p>
              ) : null}

              {cartMessage ? (
                <p className="catalog-request-message" role="status">
                  {cartMessage}
                </p>
              ) : null}

              <div className="catalog-detail-contact__links">
                <Link className="catalog-secondary-action" to="/solicitud">
                  Ver mi solicitud <span aria-hidden="true">→</span>
                </Link>

                {whatsappUrl ? (
                  <a
                    className="catalog-whatsapp-secondary"
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Consultar solo esta pieza <span aria-hidden="true">↗</span>
                  </a>
                ) : null}
              </div>
            </aside>

            <section className="catalog-detail-description">
              <h2>Sobre la pieza</h2>
              <p>{productData.description}</p>
            </section>

            <dl className="catalog-detail-facts">
              <div>
                <dt>Disponibilidad</dt>
                <dd>Disponible</dd>
              </div>

              {productData.preparationDays ? (
                <div>
                  <dt>Tiempo estimado de elaboración</dt>
                  <dd>
                    {productData.preparationDays} {" "}
                    {productData.preparationDays === 1 ? "día" : "días"}
                  </dd>
                </div>
              ) : null}

              <div>
                <dt>Personalización</dt>
                <dd>{productData.customizable ? "Disponible" : "No disponible"}</dd>
              </div>
            </dl>
          </section>
        </div>
      </main>
    </PublicPageShell>
  );
}
