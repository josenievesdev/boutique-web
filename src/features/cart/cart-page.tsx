import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link } from "react-router";
import type { ShopSettings } from "../../core/entities/shop-settings";
import { GetShopSettings } from "../../core/use-cases/get-shop-settings";
import { SupabaseShopSettingsRepository } from "../../infrastructure/repositories/supabase-shop-settings-repository";
import { SupabaseProductImageStorage } from "../../infrastructure/storage/supabase-product-image-storage";
import { supabase } from "../../infrastructure/supabase/supabase-client";
import { buildCartWhatsAppUrl } from "../../lib/build-cart-whatsapp-url";
import {
  CatalogFooter,
  CatalogHeader,
} from "../catalog/catalog-header";
import { CatalogProductImage } from "../catalog/catalog-product-image";
import { useCart } from "./use-cart";

const settingsRepository =
  new SupabaseShopSettingsRepository(
    supabase,
  );

const getShopSettings =
  new GetShopSettings(
    settingsRepository,
  );

const productImageStorage =
  new SupabaseProductImageStorage(
    supabase,
  );

const currencyFormatter =
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });

export function CartPage() {
  const {
    items,
    totalItems,
    totalPriceInPesos,
    setQuantity,
    removeItem,
    clear,
  } = useCart();

  const [shopSettings, setShopSettings] =
    useState<ShopSettings | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadSettings(): Promise<void> {
      try {
        const settings =
          await getShopSettings.execute();

        if (isActive) {
          setShopSettings(settings);
        }
      } catch {
        if (isActive) {
          setError(
            "No fue posible cargar el contacto de la boutique.",
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadSettings();

    return () => {
      isActive = false;
    };
  }, []);

  const whatsappUrl = useMemo(() => {
    if (
      !shopSettings?.whatsappNumber ||
      items.length === 0
    ) {
      return null;
    }

    return buildCartWhatsAppUrl({
      phoneNumber:
        shopSettings.whatsappNumber,
      items: items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        priceInPesos:
          item.priceInPesos,
        productUrl: new URL(
          `/productos/${item.slug}`,
          window.location.origin,
        ).toString(),
      })),
    });
  }, [
    items,
    shopSettings,
  ]);

  function handleClear(): void {
    const confirmed = window.confirm(
      "¿Vaciar toda la solicitud?",
    );

    if (confirmed) {
      clear();
    }
  }

  return (
    <div className="catalog-site">
      <CatalogHeader
        businessName={
          shopSettings?.businessName
        }
      />

      <main className="cart-page">
        <header className="cart-page__header">
          <div>
            <p className="catalog-eyebrow">
              Mi solicitud
            </p>

            <h1>Productos seleccionados</h1>

            <p>
              Revisa las prendas y envía una
              sola consulta por WhatsApp.
            </p>
          </div>

          {items.length > 0 ? (
            <button
              className="cart-clear-button"
              type="button"
              onClick={handleClear}
            >
              Vaciar solicitud
            </button>
          ) : null}
        </header>

        {items.length === 0 ? (
          <section className="cart-empty">
            <h2>
              Todavía no seleccionaste productos
            </h2>

            <p>
              Explora el catálogo y agrega los
              diseños que quieras consultar.
            </p>

            <Link
              className="catalog-primary-action"
              to="/"
            >
              Explorar catálogo
            </Link>
          </section>
        ) : (
          <div className="cart-layout">
            <section className="cart-items">
              {items.map((item) => {
                const imageUrl =
                  item.imagePath
                    ? productImageStorage.getPublicUrl(
                        item.imagePath,
                      )
                    : null;

                return (
                  <article
                    className="cart-item"
                    key={item.productId}
                  >
                    <Link
                      className="cart-item__image"
                      to={`/productos/${item.slug}`}
                    >
                      <CatalogProductImage
                        source={imageUrl}
                        alt={
                          item.imageAltText
                        }
                      />
                    </Link>

                    <div className="cart-item__information">
                      <Link
                        to={`/productos/${item.slug}`}
                      >
                        <h2>{item.name}</h2>
                      </Link>

                      <strong>
                        {currencyFormatter.format(
                          item.priceInPesos,
                        )}
                      </strong>

                      <div className="cart-quantity">
                        <button
                          type="button"
                          aria-label={`Reducir cantidad de ${item.name}`}
                          disabled={
                            item.quantity <= 1
                          }
                          onClick={() => {
                            setQuantity(
                              item.productId,
                              item.quantity - 1,
                            );
                          }}
                        >
                          −
                        </button>

                        <span>
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          aria-label={`Aumentar cantidad de ${item.name}`}
                          disabled={
                            item.quantity >= 99
                          }
                          onClick={() => {
                            setQuantity(
                              item.productId,
                              item.quantity + 1,
                            );
                          }}
                        >
                          +
                        </button>
                      </div>

                      <button
                        className="cart-item__remove"
                        type="button"
                        onClick={() => {
                          removeItem(
                            item.productId,
                          );
                        }}
                      >
                        Eliminar
                      </button>
                    </div>

                    <strong className="cart-item__subtotal">
                      {currencyFormatter.format(
                        item.priceInPesos *
                          item.quantity,
                      )}
                    </strong>
                  </article>
                );
              })}
            </section>

            <aside className="cart-summary">
              <p className="catalog-eyebrow">
                Resumen
              </p>

              <div className="cart-summary__row">
                <span>Productos</span>

                <strong>
                  {totalItems}
                </strong>
              </div>

              <div className="cart-summary__row cart-summary__row--total">
                <span>
                  Valor de referencia
                </span>

                <strong>
                  {currencyFormatter.format(
                    totalPriceInPesos,
                  )}
                </strong>
              </div>

              <p className="cart-summary__note">
                Este valor es informativo. La
                disponibilidad, personalización y
                entrega se confirman por WhatsApp.
              </p>

              {isLoading ? (
                <p>
                  Cargando contacto...
                </p>
              ) : null}

              {error ? (
                <p
                  className="admin-form__error"
                  role="alert"
                >
                  {error}
                </p>
              ) : null}

              {!isLoading &&
              !error &&
              whatsappUrl ? (
                <a
                  className="catalog-whatsapp-action"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Enviar solicitud por WhatsApp
                </a>
              ) : null}

              {!isLoading &&
              !error &&
              !whatsappUrl ? (
                <p>
                  El número de WhatsApp todavía
                  no está configurado.
                </p>
              ) : null}

              <Link
                className="catalog-secondary-action"
                to="/"
              >
                Seguir explorando
              </Link>
            </aside>
          </div>
        )}
      </main>

      <CatalogFooter
        businessName={
          shopSettings?.businessName
        }
      />
    </div>
  );
}