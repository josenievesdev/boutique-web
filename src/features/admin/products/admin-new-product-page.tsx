import {
  useEffect,
  useState,
  type FormEvent,
} from "react";
import {
  Link,
  useNavigate,
} from "react-router";
import type { Category } from "../../../core/entities/category";
import { CreateProduct } from "../../../core/use-cases/create-product";
import { ListActiveCategories } from "../../../core/use-cases/list-active-categories";
import { SupabaseCategoryRepository } from "../../../infrastructure/repositories/supabase-category-repository";
import { SupabaseProductRepository } from "../../../infrastructure/repositories/supabase-product-repository";
import { CryptoIdGenerator } from "../../../infrastructure/system/crypto-id-generator";
import { SystemClock } from "../../../infrastructure/system/system-clock";
import { supabase } from "../../../infrastructure/supabase/supabase-client";
import { slugify } from "../../../lib/slugify";

const productRepository =
  new SupabaseProductRepository(supabase);

const categoryRepository =
  new SupabaseCategoryRepository(supabase);

const createProduct = new CreateProduct(
  productRepository,
  new CryptoIdGenerator(),
  new SystemClock(),
);

const listActiveCategories =
  new ListActiveCategories(
    categoryRepository,
  );

export function AdminNewProductPage() {
  const navigate = useNavigate();

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [moldCode, setMoldCode] = useState("");
  const [slugWasEdited, setSlugWasEdited] =
    useState(false);

  const [
    shortDescription,
    setShortDescription,
  ] = useState("");

  const [description, setDescription] =
    useState("");

  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] =
    useState("");

  const [
    preparationDays,
    setPreparationDays,
  ] = useState("");

  const [featured, setFeatured] =
    useState(false);

  const [customizable, setCustomizable] =
    useState(false);

  const [madeToOrder, setMadeToOrder] =
    useState(false);

  const [isLoadingCategories, setIsLoadingCategories] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadCategories(): Promise<void> {
      try {
        const loadedCategories =
          await listActiveCategories.execute();

        if (isActive) {
          setCategories(loadedCategories);
        }
      } catch {
        if (isActive) {
          setError(
            "No fue posible cargar las categorías.",
          );
        }
      } finally {
        if (isActive) {
          setIsLoadingCategories(false);
        }
      }
    }

    void loadCategories();

    return () => {
      isActive = false;
    };
  }, []);

  function handleNameChange(
    nextName: string,
  ): void {
    setName(nextName);

    if (!slugWasEdited) {
      setSlug(slugify(nextName));
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    setIsSaving(true);
    setError(null);

    try {
      if (!price.trim()) {
        throw new Error(
          "El precio del producto es obligatorio.",
        );
      }

      const parsedPrice = Number(price);

      const parsedPreparationDays =
        preparationDays.trim()
          ? Number(preparationDays)
          : null;

      await createProduct.execute({
        name,
        slug,
        moldCode,
        shortDescription,
        description,
        priceInPesos: parsedPrice,
        categoryId: categoryId || null,
        featured,
        customizable,
        madeToOrder,
        preparationDays:
          parsedPreparationDays,
      });

      navigate("/admin/products", {
        replace: true,
      });
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "No fue posible crear el producto.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="admin-product-form-page">
      <header className="admin-product-form-page__header">
        <div>
          <Link
            className="admin-back-link"
            to="/admin/products"
          >
            ← Volver a productos
          </Link>

          <p className="admin-eyebrow">
            Nuevo producto
          </p>

          <h1>Crear borrador</h1>

          <p>
            Guarda la información básica. Las imágenes
            y la publicación se añadirán después.
          </p>
        </div>
      </header>

      <form
        className="admin-product-form"
        onSubmit={(event) => {
          void handleSubmit(event);
        }}
      >
        <section className="admin-form-section">
          <div className="admin-form-section__heading">
            <h2>Información principal</h2>

            <p>
              Nombre, enlace y descripción del producto.
            </p>
          </div>

          <div className="admin-form-grid">
            <label className="admin-field admin-field--full">
              <span>Nombre del producto</span>

              <input
                type="text"
                value={name}
                maxLength={150}
                required
                autoFocus
                onChange={(event) => {
                  handleNameChange(
                    event.target.value,
                  );
                }}
              />
            </label>

            <label className="admin-field admin-field--full">
              <span>Slug</span>

              <input
                type="text"
                value={slug}
                required
                placeholder="vestido-aurora"
                onChange={(event) => {
                  setSlugWasEdited(true);
                  setSlug(
                    slugify(event.target.value),
                  );
                }}
              />

              <small>
                Dirección pública: /productos/{slug ||
                  "nombre-del-producto"}
              </small>
            </label>

            <label className="admin-field">
              <span>Código de molde</span>

              <input
                type="text"
                value={moldCode}
                maxLength={40}
                placeholder="V-024"
                onChange={(event) => {
                  setMoldCode(event.target.value);
                }}
              />
            </label>

            <label className="admin-field admin-field--full">
              <span>Descripción corta</span>

              <input
                type="text"
                value={shortDescription}
                maxLength={250}
                required
                onChange={(event) => {
                  setShortDescription(
                    event.target.value,
                  );
                }}
              />
            </label>

            <label className="admin-field admin-field--full">
              <span>Descripción completa</span>

              <textarea
                value={description}
                rows={6}
                required
                onChange={(event) => {
                  setDescription(
                    event.target.value,
                  );
                }}
              />
            </label>
          </div>
        </section>

        <section className="admin-form-section">
          <div className="admin-form-section__heading">
            <h2>Precio y clasificación</h2>

            <p>
              El producto se guardará inicialmente como
              borrador.
            </p>
          </div>

          <div className="admin-form-grid">
            <label className="admin-field">
              <span>Precio en pesos</span>

              <input
                type="number"
                value={price}
                min="0"
                step="1"
                inputMode="numeric"
                required
                onChange={(event) => {
                  setPrice(event.target.value);
                }}
              />
            </label>

            <label className="admin-field">
              <span>Categoría</span>

              <select
                value={categoryId}
                disabled={isLoadingCategories}
                onChange={(event) => {
                  setCategoryId(
                    event.target.value,
                  );
                }}
              >
                <option value="">
                  Sin categoría
                </option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="admin-field">
              <span>Días de elaboración</span>

              <input
                type="number"
                value={preparationDays}
                min="1"
                step="1"
                inputMode="numeric"
                onChange={(event) => {
                  setPreparationDays(
                    event.target.value,
                  );
                }}
              />
            </label>
          </div>
        </section>

        <section className="admin-form-section">
          <div className="admin-form-section__heading">
            <h2>Características</h2>
          </div>

          <div className="admin-checkbox-grid">
            <label className="admin-checkbox">
              <input
                type="checkbox"
                checked={featured}
                onChange={(event) => {
                  setFeatured(
                    event.target.checked,
                  );
                }}
              />

              <span>
                <strong>Producto destacado</strong>
                Aparecerá en espacios principales.
              </span>
            </label>

            <label className="admin-checkbox">
              <input
                type="checkbox"
                checked={customizable}
                onChange={(event) => {
                  setCustomizable(
                    event.target.checked,
                  );
                }}
              />

              <span>
                <strong>Personalizable</strong>
                Permite solicitar cambios o medidas.
              </span>
            </label>

            <label className="admin-checkbox">
              <input
                type="checkbox"
                checked={madeToOrder}
                onChange={(event) => {
                  setMadeToOrder(
                    event.target.checked,
                  );
                }}
              />

              <span>
                <strong>Sobre pedido</strong>
                Se confecciona después de confirmar.
              </span>
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

        <footer className="admin-product-form__actions">
          <Link
            className="admin-secondary-link"
            to="/admin/products"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            disabled={isSaving}
          >
            {isSaving
              ? "Guardando..."
              : "Guardar borrador"}
          </button>
        </footer>
      </form>
    </main>
  );
}
