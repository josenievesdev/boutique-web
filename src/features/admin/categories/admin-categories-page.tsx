import {
  useEffect,
  useState,
  type FormEvent,
} from "react";
import { Link } from "react-router";
import type { Category } from "../../../core/entities/category";
import { CreateCategory } from "../../../core/use-cases/create-category";
import { GetAdminCategory } from "../../../core/use-cases/get-admin-category";
import { ListAdminCategories } from "../../../core/use-cases/list-admin-categories";
import { SetCategoryActiveStatus } from "../../../core/use-cases/set-category-active-status";
import { UpdateCategoryDetails } from "../../../core/use-cases/update-category-details";
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

const getAdminCategory =
  new GetAdminCategory(
    categoryRepository,
  );

const updateCategoryDetails =
  new UpdateCategoryDetails(
    categoryRepository,
    new SystemClock(),
  );

const setCategoryActiveStatus =
  new SetCategoryActiveStatus(
    categoryRepository,
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

  const [
    editingCategory,
    setEditingCategory,
  ] = useState<Category | null>(null);

  const [editName, setEditName] =
    useState("");

  const [editSlug, setEditSlug] =
    useState("");

  const [
    editDescription,
    setEditDescription,
  ] = useState("");

  const [
    editPosition,
    setEditPosition,
  ] = useState("0");

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  const [isUpdating, setIsUpdating] =
    useState(false);

  const [
    loadingEditorId,
    setLoadingEditorId,
  ] = useState<string | null>(null);

  const [
    processingStatusId,
    setProcessingStatusId,
  ] = useState<string | null>(null);

  const [loadError, setLoadError] =
    useState<string | null>(null);

  const [createError, setCreateError] =
    useState<string | null>(null);

  const [editError, setEditError] =
    useState<string | null>(null);

  const [actionError, setActionError] =
    useState<string | null>(null);

  const [message, setMessage] =
    useState<string | null>(null);

  const [reloadCounter, setReloadCounter] =
    useState(0);

  useEffect(() => {
    let isActive = true;

    async function loadCategories(): Promise<void> {
      setIsLoading(true);
      setLoadError(null);

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
          setLoadError(
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

  async function handleCreateSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    setIsSaving(true);
    setCreateError(null);
    setActionError(null);
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
      setCreateError(
        caughtError instanceof Error
          ? caughtError.message
          : "No fue posible crear la categoría.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleStartEditing(
    categoryId: string,
  ): Promise<void> {
    setLoadingEditorId(categoryId);
    setEditError(null);
    setActionError(null);
    setMessage(null);

    try {
      const category =
        await getAdminCategory.execute(
          categoryId,
        );

      setEditingCategory(category);
      setEditName(category.name);
      setEditSlug(category.slug);

      setEditDescription(
        category.description ?? "",
      );

      setEditPosition(
        String(category.position),
      );
    } catch (caughtError) {
      setActionError(
        caughtError instanceof Error
          ? caughtError.message
          : "No fue posible cargar la categoría.",
      );
    } finally {
      setLoadingEditorId(null);
    }
  }

  function handleCancelEditing(): void {
    setEditingCategory(null);
    setEditName("");
    setEditSlug("");
    setEditDescription("");
    setEditPosition("0");
    setEditError(null);
  }

  async function handleEditSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (!editingCategory) {
      return;
    }

    setIsUpdating(true);
    setEditError(null);
    setActionError(null);
    setMessage(null);

    try {
      await updateCategoryDetails.execute({
        categoryId:
          editingCategory.id,
        name: editName,
        slug: editSlug,
        description:
          editDescription,
        position:
          Number(editPosition),
      });

      setMessage(
        "La categoría se actualizó correctamente.",
      );

      handleCancelEditing();

      setReloadCounter(
        (current) => current + 1,
      );
    } catch (caughtError) {
      setEditError(
        caughtError instanceof Error
          ? caughtError.message
          : "No fue posible actualizar la categoría.",
      );
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleToggleActive(
    category: Category,
  ): Promise<void> {
    const nextActiveState =
      !category.active;

    if (!nextActiveState) {
      const confirmed = window.confirm(
        `¿Desactivar "${category.name}"?\n\nSolo será posible si no tiene productos asociados.`,
      );

      if (!confirmed) {
        return;
      }
    }

    setProcessingStatusId(
      category.id,
    );

    setActionError(null);
    setCreateError(null);
    setEditError(null);
    setMessage(null);

    try {
      const updatedCategory =
        await setCategoryActiveStatus.execute({
          categoryId: category.id,
          active: nextActiveState,
        });

      setCategories(
        (currentCategories) =>
          currentCategories.map(
            (currentCategory) =>
              currentCategory.id ===
              updatedCategory.id
                ? updatedCategory
                : currentCategory,
          ),
      );

      setMessage(
        nextActiveState
          ? "La categoría se activó correctamente."
          : "La categoría se desactivó correctamente.",
      );

      if (
        editingCategory?.id ===
        updatedCategory.id
      ) {
        setEditingCategory(
          updatedCategory,
        );
      }
    } catch (caughtError) {
      setActionError(
        caughtError instanceof Error
          ? caughtError.message
          : "No fue posible cambiar el estado de la categoría.",
      );
    } finally {
      setProcessingStatusId(null);
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
            Crea, edita, activa y desactiva las
            categorías que organizan el catálogo
            público.
          </p>
        </div>
      </header>

      {message ? (
        <p
          className="admin-form__success admin-categories__message"
          role="status"
        >
          {message}
        </p>
      ) : null}

      {actionError ? (
        <p
          className="admin-form__error admin-categories__message"
          role="alert"
        >
          {actionError}
        </p>
      ) : null}

      <div className="admin-categories__layout">
        <form
          className="admin-category-form"
          onSubmit={(event) => {
            void handleCreateSubmit(event);
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

          {createError ? (
            <p
              className="admin-form__error"
              role="alert"
            >
              {createError}
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

        <div className="admin-categories__main">
          {editingCategory ? (
            <section className="admin-category-editor">
              <header className="admin-category-editor__header">
                <div>
                  <p className="admin-eyebrow">
                    Edición
                  </p>

                  <h2>
                    {editingCategory.name}
                  </h2>

                  <span
                    className={
                      editingCategory.active
                        ? "admin-category-status admin-category-status--active"
                        : "admin-category-status"
                    }
                  >
                    {editingCategory.active
                      ? "Activa"
                      : "Inactiva"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={
                    handleCancelEditing
                  }
                >
                  Cerrar
                </button>
              </header>

              <form
                className="admin-category-editor__form"
                onSubmit={(event) => {
                  void handleEditSubmit(
                    event,
                  );
                }}
              >
                <div className="admin-form-grid">
                  <label className="admin-field">
                    <span>Nombre</span>

                    <input
                      type="text"
                      value={editName}
                      maxLength={100}
                      required
                      onChange={(event) => {
                        setEditName(
                          event.target.value,
                        );
                      }}
                    />
                  </label>

                  <label className="admin-field">
                    <span>Slug</span>

                    <input
                      type="text"
                      value={editSlug}
                      required
                      onChange={(event) => {
                        setEditSlug(
                          slugify(
                            event.target.value,
                          ),
                        );
                      }}
                    />
                  </label>

                  <label className="admin-field admin-field--full">
                    <span>Descripción</span>

                    <textarea
                      value={
                        editDescription
                      }
                      rows={4}
                      onChange={(event) => {
                        setEditDescription(
                          event.target.value,
                        );
                      }}
                    />
                  </label>

                  <label className="admin-field">
                    <span>Posición</span>

                    <input
                      type="number"
                      value={editPosition}
                      min="0"
                      step="1"
                      required
                      onChange={(event) => {
                        setEditPosition(
                          event.target.value,
                        );
                      }}
                    />
                  </label>
                </div>

                {editError ? (
                  <p
                    className="admin-form__error"
                    role="alert"
                  >
                    {editError}
                  </p>
                ) : null}

                <footer className="admin-category-editor__actions">
                  <button
                    className="admin-category-editor__cancel"
                    type="button"
                    onClick={
                      handleCancelEditing
                    }
                  >
                    Cancelar
                  </button>

                  <button
                    className="admin-category-editor__save"
                    type="submit"
                    disabled={isUpdating}
                  >
                    {isUpdating
                      ? "Guardando..."
                      : "Guardar cambios"}
                  </button>
                </footer>
              </form>
            </section>
          ) : null}

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
            loadError ? (
              <div className="admin-products__state">
                <p role="alert">
                  {loadError}
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setReloadCounter(
                      (current) =>
                        current + 1,
                    );
                  }}
                >
                  Intentar nuevamente
                </button>
              </div>
            ) : null}

            {!isLoading &&
            !loadError &&
            categories.length === 0 ? (
              <div className="admin-products__state">
                <p>
                  Todavía no hay categorías.
                </p>
              </div>
            ) : null}

            {!isLoading &&
            !loadError &&
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

                      <div className="admin-category-row__actions">
                        <button
                          type="button"
                          disabled={
                            loadingEditorId ===
                            category.id
                          }
                          onClick={() => {
                            void handleStartEditing(
                              category.id,
                            );
                          }}
                        >
                          {loadingEditorId ===
                          category.id
                            ? "Cargando..."
                            : "Editar"}
                        </button>

                        <button
                          className={
                            category.active
                              ? "admin-category-toggle admin-category-toggle--deactivate"
                              : "admin-category-toggle admin-category-toggle--activate"
                          }
                          type="button"
                          disabled={
                            processingStatusId ===
                            category.id
                          }
                          onClick={() => {
                            void handleToggleActive(
                              category,
                            );
                          }}
                        >
                          {processingStatusId ===
                          category.id
                            ? "Procesando..."
                            : category.active
                              ? "Desactivar"
                              : "Activar"}
                        </button>
                      </div>
                    </article>
                  ),
                )}
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </main>
  );
}