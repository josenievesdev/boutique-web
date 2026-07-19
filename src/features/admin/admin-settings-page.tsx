import {
  useEffect,
  useState,
  type FormEvent,
} from "react";
import { Link } from "react-router";
import { GetShopSettings } from "../../core/use-cases/get-shop-settings";
import { UpdateShopSettings } from "../../core/use-cases/update-shop-settings";
import { SupabaseShopSettingsRepository } from "../../infrastructure/repositories/supabase-shop-settings-repository";
import { supabase } from "../../infrastructure/supabase/supabase-client";

const settingsRepository =
  new SupabaseShopSettingsRepository(
    supabase,
  );

const getShopSettings =
  new GetShopSettings(
    settingsRepository,
  );

const updateShopSettings =
  new UpdateShopSettings(
    settingsRepository,
  );

export function AdminSettingsPage() {
  const [
    businessName,
    setBusinessName,
  ] = useState("");

  const [
    whatsappNumber,
    setWhatsappNumber,
  ] = useState("");

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [message, setMessage] =
    useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadSettings(): Promise<void> {
      try {
        const settings =
          await getShopSettings.execute();

        if (!isActive) {
          return;
        }

        setBusinessName(
          settings.businessName,
        );

        setWhatsappNumber(
          settings.whatsappNumber ?? "",
        );
      } catch (caughtError) {
        if (isActive) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "No fue posible cargar la configuración.",
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

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    setIsSaving(true);
    setError(null);
    setMessage(null);

    try {
      const settings =
        await updateShopSettings.execute({
          businessName,
          whatsappNumber,
        });

      setBusinessName(
        settings.businessName,
      );

      setWhatsappNumber(
        settings.whatsappNumber ?? "",
      );

      setMessage(
        "La configuración se guardó correctamente.",
      );
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "No fue posible guardar la configuración.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <main className="admin-product-form-page">
        <section className="admin-products__state">
          <p>
            Cargando configuración...
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-product-form-page">
      <header className="admin-product-form-page__header">
        <Link
          className="admin-back-link"
          to="/admin"
        >
          ← Volver al panel
        </Link>

        <p className="admin-eyebrow">
          Configuración
        </p>

        <h1>Datos de la boutique</h1>

        <p>
          Define el nombre público y el número
          que recibirá las consultas desde el
          catálogo.
        </p>
      </header>

      <form
        className="admin-product-form"
        onSubmit={(event) => {
          void handleSubmit(event);
        }}
      >
        <section className="admin-form-section">
          <div className="admin-form-section__heading">
            <h2>Identidad</h2>

            <p>
              Este nombre aparecerá en el
              encabezado y pie de la página.
            </p>
          </div>

          <div className="admin-form-grid">
            <label className="admin-field admin-field--full">
              <span>
                Nombre de la boutique
              </span>

              <input
                type="text"
                value={businessName}
                maxLength={120}
                required
                onChange={(event) => {
                  setBusinessName(
                    event.target.value,
                  );
                }}
              />
            </label>
          </div>
        </section>

        <section className="admin-form-section">
          <div className="admin-form-section__heading">
            <h2>WhatsApp</h2>

            <p>
              Los visitantes usarán este número
              para consultar productos.
            </p>
          </div>

          <div className="admin-form-grid">
            <label className="admin-field admin-field--full">
              <span>
                Número con código de país
              </span>

              <input
                type="tel"
                value={whatsappNumber}
                inputMode="tel"
                placeholder="+57 300 123 4567"
                onChange={(event) => {
                  setWhatsappNumber(
                    event.target.value,
                  );
                }}
              />

              <small>
                Ejemplo para Colombia:
                573001234567. Puedes escribir
                espacios o el signo +; el sistema
                los eliminará al guardar.
              </small>
            </label>
          </div>
        </section>

        {error ? (
          <p
            className="admin-form__error"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        {message ? (
          <p
            className="admin-form__success"
            role="status"
          >
            {message}
          </p>
        ) : null}

        <footer className="admin-product-form__actions">
          <Link
            className="admin-secondary-link"
            to="/admin"
          >
            Volver
          </Link>

          <button
            type="submit"
            disabled={isSaving}
          >
            {isSaving
              ? "Guardando..."
              : "Guardar configuración"}
          </button>
        </footer>
      </form>
    </main>
  );
}