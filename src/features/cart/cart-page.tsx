import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import type { ShopSettings } from "../../core/entities/shop-settings";
import { GetShopSettings } from "../../core/use-cases/get-shop-settings";
import { SupabaseShopSettingsRepository } from "../../infrastructure/repositories/supabase-shop-settings-repository";
import { SupabaseProductImageStorage } from "../../infrastructure/storage/supabase-product-image-storage";
import { supabase } from "../../infrastructure/supabase/supabase-client";
import { buildCartWhatsAppUrl } from "../../lib/build-cart-whatsapp-url";
import { CatalogProductImage } from "../catalog/catalog-product-image";
import { PublicPageShell } from "../catalog/public-page-shell";
import { useCart } from "./use-cart";

const settingsRepository = new SupabaseShopSettingsRepository(supabase);
const getShopSettings = new GetShopSettings(settingsRepository);
const productImageStorage = new SupabaseProductImageStorage(supabase);

const currencyFormatter = new Intl.NumberFormat("es-CO", {
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
  const [shopSettings, setShopSettings] = useState<ShopSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadSettings(): Promise<void> {
      try {
        const settings = await getShopSettings.execute();

        if (isActive) {
          setShopSettings(settings);
        }
      } catch {
        if (isActive) {
          setError("No fue posible cargar el contacto de la boutique.");
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
    if (!shopSettings?.whatsappNumber || items.length === 0) {
      return null;
    }

    return buildCartWhatsAppUrl({
      phoneNumber: shopSettings.whatsappNumber,
      items: items.map((item) => ({
        name: item.name,
        moldCode: item.moldCode,
        quantity: item.quantity,
        priceInPesos: item.priceInPesos,
        productUrl: new URL(
          `/productos/${item.slug}`,
          window.location.origin,
        ).toString(),
      })),
    });
  }, [items, shopSettings]);

  function handleClear(): void {
    const confirmed = window.confirm("¿Vaciar toda la solicitud?");

    if (confirmed) {
      clear();
    }
  }

  return (
    <PublicPageShell businessName={shopSettings?.businessName}>
      <main className="cart-page">
        <header className="cart-page__header">
          <div>
            <p className="catalog-eyebrow">
              Mi solicitud · {totalItems} {totalItems === 1 ? "pieza" : "piezas"}
            </p>
            <h1>Tu selección para consultar.</h1>
          </div>

          <div className="cart-page__introduction">
            <p>
              Ajusta las cantidades y envía una sola consulta por WhatsApp. La
              disponibilidad y los detalles se confirman con la boutique; aquí
              no se procesa el pago.
            </p>

            {items.length > 0 ? (
              <button
                className="cart-clear-button"
                type="button"
                onClick={handleClear}
              >
                Vaciar solicitud
              </button>
            ) : null}
          </div>
        </header>

        {items.length === 0 ? (
          <section className="cart-empty">
            <div>
              <p className="catalog-eyebrow">Selección vacía</p>
              <h2>Aún no agregaste ninguna pieza.</h2>
              <p>
                Explora la colección y guarda aquí los diseños que quieras
                consultar.
              </p>
            </div>
            <Link className="catalog-primary-action" to="/">
              Explorar la colección
            </Link>
          </section>
        ) : (
          <div className="cart-layout">
            <section className="cart-items" aria-labelledby="cart-items-title">
              <header className="cart-items__header">
                <h2 id="cart-items-title">Piezas seleccionadas</h2>
                <span>{totalItems} en total</span>
              </header>

              {items.map((item, index) => {
                const imageUrl = item.imagePath
                  ? productImageStorage.getPublicUrl(item.imagePath)
                  : null;

                return (
                  <article className="cart-item" key={item.productId}>
                    <span className="cart-item__index" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <Link
                      className="cart-item__image"
                      to={`/productos/${item.slug}`}
                    >
                      <CatalogProductImage
                        source={imageUrl}
                        alt={item.imageAltText}
                      />
                    </Link>

                    <div className="cart-item__information">
                      <div className="cart-item__title-row">
                        <div>
                          <Link to={`/productos/${item.slug}`}>
                            <h3>{item.name}</h3>
                          </Link>

                          {item.moldCode ? (
                            <p className="cart-item__mold-code">
                              Código de molde: {item.moldCode}
                            </p>
                          ) : null}
                        </div>

                        <strong>
                          {currencyFormatter.format(item.priceInPesos)}
                        </strong>
                      </div>

                      <div className="cart-item__controls">
                        <div
                          className="cart-quantity"
                          role="group"
                          aria-label={`Cantidad de ${item.name}`}
                        >
                          <button
                            type="button"
                            aria-label={`Reducir cantidad de ${item.name}`}
                            disabled={item.quantity <= 1}
                            onClick={() => {
                              setQuantity(item.productId, item.quantity - 1);
                            }}
                          >
                            −
                          </button>

                          <span>{item.quantity}</span>

                          <button
                            type="button"
                            aria-label={`Aumentar cantidad de ${item.name}`}
                            disabled={item.quantity >= 99}
                            onClick={() => {
                              setQuantity(item.productId, item.quantity + 1);
                            }}
                          >
                            +
                          </button>
                        </div>

                        <button
                          className="cart-item__remove"
                          type="button"
                          aria-label={`Eliminar ${item.name} de la solicitud`}
                          onClick={() => {
                            removeItem(item.productId);
                          }}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>

                    <div className="cart-item__subtotal">
                      <span>Subtotal</span>
                      <strong>
                        {currencyFormatter.format(
                          item.priceInPesos * item.quantity,
                        )}
                      </strong>
                    </div>
                  </article>
                );
              })}
            </section>

            <aside className="cart-summary">
              <div className="cart-summary__heading">
                <h2 className="catalog-eyebrow">Resumen de la solicitud</h2>
                <span>{totalItems} {totalItems === 1 ? "pieza" : "piezas"}</span>
              </div>

              <div className="cart-summary__row">
                <span>Piezas</span>
                <strong>{totalItems}</strong>
              </div>

              <div className="cart-summary__row cart-summary__row--total">
                <span>Valor de referencia</span>
                <strong>{currencyFormatter.format(totalPriceInPesos)}</strong>
              </div>

              <p className="cart-summary__note">
                El total es informativo y no implica un cobro. La disponibilidad,
                personalización y entrega se confirman por WhatsApp.
              </p>

              {isLoading ? (
                <p className="cart-summary__status">Cargando contacto…</p>
              ) : null}

              {error ? (
                <p className="catalog-inline-error" role="alert">
                  {error}
                </p>
              ) : null}

              {!isLoading && !error && whatsappUrl ? (
                <a
                  className="catalog-whatsapp-action"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Enviar por WhatsApp <span aria-hidden="true">↗</span>
                </a>
              ) : null}

              {!isLoading && !error && !whatsappUrl ? (
                <p className="cart-summary__status">
                  El número de WhatsApp aún no está configurado.
                </p>
              ) : null}

              <Link className="catalog-secondary-action" to="/">
                Seguir explorando
              </Link>
            </aside>
          </div>
        )}
      </main>
    </PublicPageShell>
  );
}
