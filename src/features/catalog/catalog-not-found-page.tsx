import { useEffect, useState } from "react";
import { Link } from "react-router";
import type { ShopSettings } from "../../core/entities/shop-settings";
import { GetShopSettings } from "../../core/use-cases/get-shop-settings";
import { SupabaseShopSettingsRepository } from "../../infrastructure/repositories/supabase-shop-settings-repository";
import { supabase } from "../../infrastructure/supabase/supabase-client";
import { PublicPageShell } from "./public-page-shell";

const getShopSettings = new GetShopSettings(
  new SupabaseShopSettingsRepository(supabase),
);

export function CatalogNotFoundPage() {
  const [shopSettings, setShopSettings] = useState<ShopSettings | null>(null);

  useEffect(() => {
    let isActive = true;

    void getShopSettings.execute().then((settings) => {
      if (isActive) {
        setShopSettings(settings);
      }
    }).catch(() => {
      // The fallback brand remains available when settings cannot be loaded.
    });

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <PublicPageShell businessName={shopSettings?.businessName}>
      <main className="catalog-not-found" id="contenido-principal">
        <section className="catalog-not-found__content">
          <p className="catalog-eyebrow">404 · Fuera de colección</p>
          <h1>Esta página ya no está en el escaparate.</h1>
          <p>
            El enlace puede haber cambiado. La colección actual sigue
            disponible para que continúes explorando.
          </p>
          <Link className="catalog-primary-action" to="/">
            Volver a la colección
          </Link>
        </section>
      </main>
    </PublicPageShell>
  );
}
