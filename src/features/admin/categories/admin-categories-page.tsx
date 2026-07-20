import {
  useEffect,
  useState,
  type FormEvent,
} from "react";
import { Link } from "react-router";
import type { Category } from "../../../core/entities/category";
import { CreateCategory } from "../../../core/use-cases/create-category";
import { ListAdminCategories } from "../../../core/use-cases/list-admin-categories";
import { SupabaseCategoryRepository } from "../../../infrastructure/repositories/supabase-category-repository";
import { CryptoIdGenerator } from "../../../infrastructure/system/crypto-id-generator";
import { SystemClock } from "../../../infrastructure/system/system-clock";
import { supabase } from "../../../infrastructure/supabase/supabase-client";
import { slugify } from "../../../lib/slugify";

const categoryRepository =
  new SupabaseCategoryRepository(
    supabase,
  );

const listAdminCategories =
  new ListAdminCategories(
    categoryRepository,
  );

const createCategory =
  new CreateCategory(
    categoryRepository,
    new CryptoIdGenerator(),
    new SystemClock(),
  );

export function AdminCategoriesPage() {
  const [categories, setCategories] =
    useState<Category[]>([]);

  const [name, setName] =
    useState("");

  const [slug, setSlug] =
    useState("");

  const [slugWasEdited, setSlugWasEdited] =
    useState(false);

  const [description, setDescription] =
    useState("");

  const [position, setPosition] =
    useState("0");

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [message, setMessage] =
    useState<string | null>(null);

  const [reloadCounter, setReloadCounter] =
    useState(0);

  useEffect(() => {
    let isActive = true;

    async function loadCategories(): Promise<void> {
      setIsLoading(true);
      setError(null);

      try {
        const loadedCategories =
          await listAdminCategories.execute();

        if (isActive) {
          setCategories(
            loadedCategories,
          );
        }
      } catch (caughtError) {
        if (isActive) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "No fue posible cargar las categorías.",
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadCategories();

    return () => {
      isActive = false;
    };
  }, [reloadCounter]);

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
    setMessage(null);

    try {
      await createCategory.execute({
        name,
        slug,
        description,
        position: Number(position),
      });

      setName("");
      setSlug("");
      setSlugWasEdited(false);
      setDescription("");
      setPosition("0");

      setMessage(
        "La categoría se creó correctamente.",
      );

      setReloadCounter(
        (current) => current + 1,
      );
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "No fue posible crear la categoría.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="admin-categories">
      <header className="admin-categories__header">
        <div>
          <Link
            className="admin-back-link"
            to="/admin"
          >
            ← Volver al panel
          </Link>

          <p className="admin-eyebrow">
            Organización del catálogo
          </p>

          <h1>Categorías</h1>

          <p>
            Crea y ordena las categorías que
            aparecen en el catálogo público.
          </p>
        </div>
      </header>

      <div className="admin-categories__layout">
        <form
          className="admin-category-form"
          onSubmit={(event) => {
            void handleSubmit(event);
          }}
        >
          <div className="admin-form-section__heading">
            <h2>Nueva categoría</h2>

            <p>
              Se creará activa y aparecerá en los
              filtros públicos.
            </p>
          </div>

          <label className="admin-field">
            <span>Nombre</span>

            <input
              type="text"
              value={name}
              maxLength={100}
              required
              onChange={(event) => {
                handleNameChange(
                  event.target.value,
                );
              }}
            />
          </label>

          <label className="admin-field">
            <span>Slug</span>

            <input
              type="text"
              value={slug}
              required
              placeholder="vestidos-de-fiesta"
              onChange={(event) => {
                setSlugWasEdited(true);

                setSlug(
                  slugify(
                    event.target.value,
                  ),
                );
              }}
            />
          </label>

          <label className="admin-field">
            <span>Descripción</span>

            <textarea
              value={description}
              rows={4}
              onChange={(event) => {
                setDescription(
                  event.target.value,
                );
              }}
            />
          </label>

          <label className="admin-field">
            <span>Posición</span>

            <input
              type="number"
              value={position}
              min="0"
              step="1"
              required
              onChange={(event) => {
                setPosition(
                  event.target.value,
                );
              }}
            />

            <small>
              Las posiciones menores aparecen
              primero.
            </small>
          </label>

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

          <button
            type="submit"
            disabled={isSaving}
          >
            {isSaving
              ? "Creando..."
              : "Crear categoría"}
          </button>
        </form>

        <section className="admin-category-list">
          <header className="admin-category-list__heading">
            <div>
              <h2>
                Categorías existentes
              </h2>

              <p>
                {categories.length}{" "}
                {categories.length === 1
                  ? "categoría"
                  : "categorías"}
              </p>
            </div>
          </header>

          {isLoading ? (
            <div className="admin-products__state">
              <p>
                Cargando categorías...
              </p>
            </div>
          ) : null}

          {!isLoading &&
          categories.length === 0 ? (
            <div className="admin-products__state">
              <p>
                Todavía no hay categorías.
              </p>
            </div>
          ) : null}

          {!isLoading &&
          categories.length > 0 ? (
            <div className="admin-category-rows">
              {categories.map(
                (category) => (
                  <article
                    className="admin-category-row"
                    key={category.id}
                  >
                    <div className="admin-category-row__position">
                      {category.position}
                    </div>

                    <div className="admin-category-row__information">
                      <strong>
                        {category.name}
                      </strong>

                      <span>
                        /{category.slug}
                      </span>

                      {category.description ? (
                        <p>
                          {
                            category.description
                          }
                        </p>
                      ) : null}
                    </div>

                    <span
                      className={
                        category.active
                          ? "admin-category-status admin-category-status--active"
                          : "admin-category-status"
                      }
                    >
                      {category.active
                        ? "Activa"
                        : "Inactiva"}
                    </span>

                    <button
                      type="button"
                      disabled
                      title="La edición se añadirá en el siguiente bloque"
                    >
                      Editar
                    </button>
                  </article>
                ),
              )}
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}