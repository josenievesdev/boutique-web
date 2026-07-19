import {
  useEffect,
  useState,
  type FormEvent,
} from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router";
import type { Category } from "../../../core/entities/category";
import type {
  Product,
  ProductStatus,
} from "../../../core/entities/product";
import { GetAdminProduct } from "../../../core/use-cases/get-admin-product";
import { ListActiveCategories } from "../../../core/use-cases/list-active-categories";
import { UpdateProductDetails } from "../../../core/use-cases/update-product-details";
import { SupabaseCategoryRepository } from "../../../infrastructure/repositories/supabase-category-repository";
import { SupabaseProductRepository } from "../../../infrastructure/repositories/supabase-product-repository";
import { SystemClock } from "../../../infrastructure/system/system-clock";
import { supabase } from "../../../infrastructure/supabase/supabase-client";
import { slugify } from "../../../lib/slugify";
import { AdminProductImagesSection } from "./admin-product-images-section";
import { AdminProductStatusActions } from "./admin-product-status-actions";

const productRepository =
  new SupabaseProductRepository(supabase);

const categoryRepository =
  new SupabaseCategoryRepository(supabase);

const getAdminProduct =
  new GetAdminProduct(productRepository);

const listActiveCategories =
  new ListActiveCategories(
    categoryRepository,
  );

const updateProductDetails =
  new UpdateProductDetails(
    productRepository,
    new SystemClock(),
  );

const statusLabels: Record<
  ProductStatus,
  string
> = {
  draft: "Borrador",
  published: "Publicado",
  hidden: "Oculto",
  out_of_stock: "Agotado",
  archived: "Archivado",
};

export function AdminEditProductPage() {
  const { productId } =
    useParams<{ productId: string }>();

  const navigate = useNavigate();

  const [product, setProduct] =
    useState<Product | null>(null);

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

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

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadData(): Promise<void> {
      if (!productId) {
        setError(
          "No se recibió el identificador del producto.",
        );
        setIsLoading(false);
        return;
      }

      try {
        const [
          loadedProduct,
          loadedCategories,
        ] = await Promise.all([
          getAdminProduct.execute(productId),
          listActiveCategories.execute(),
        ]);

        if (!isActive) {
          return;
        }

        const productData =
          loadedProduct.toObject();

        setProduct(loadedProduct);
        setCategories(loadedCategories);
        setName(productData.name);
        setSlug(productData.slug);

        setShortDescription(
          productData.shortDescription,
        );

        setDescription(
          productData.description,
        );

        setPrice(
          String(productData.priceInPesos),
        );

        setCategoryId(
          productData.categoryId ?? "",
        );

        setPreparationDays(
          productData.preparationDays === null
            ? ""
            : String(
                productData.preparationDays,
              ),
        );

        setFeatured(productData.featured);

        setCustomizable(
          productData.customizable,
        );

        setMadeToOrder(
          productData.madeToOrder,
        );
      } catch (caughtError) {
        if (isActive) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "No fue posible cargar el producto.",
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      isActive = false;
    };
  }, [productId]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (!productId) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const parsedPrice = Number(price);

      const parsedPreparationDays =
        preparationDays.trim()
          ? Number(preparationDays)
          : null;

      await updateProductDetails.execute({
        productId,
        name,
        slug,
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
          : "No fue posible actualizar el producto.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <main className="admin-product-form-page">
        <section className="admin-products__state">
          <p>Cargando producto...</p>
        </section>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="admin-product-form-page">
        <section className="admin-products__state">
          <p role="alert">
            {error ??
              "No fue posible encontrar el producto."}
          </p>

          <Link
            className="admin-secondary-link"
            to="/admin/products"
          >
            Volver a productos
          </Link>
        </section>
      </main>
    );
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
            Editar producto
          </p>

          <div className="admin-edit-heading">
            <h1>{product.name}</h1>

            <span
              className={`admin-status-badge admin-status-badge--${product.status}`}
            >
              {statusLabels[product.status]}
            </span>
          </div>

          <p>
            Actualiza la información del producto.
            Las fotografías se gestionarán en el
            siguiente bloque.
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
              Nombre, enlace y descripción pública.
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
                  setName(event.target.value);
                }}
              />
            </label>

            <label className="admin-field admin-field--full">
              <span>Slug</span>

              <input
                type="text"
                value={slug}
                required
                onChange={(event) => {
                  setSlug(
                    slugify(event.target.value),
                  );
                }}
              />

              <small>
                Dirección pública: /productos/{slug}
              </small>
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
              : "Guardar cambios"}
          </button>
        </footer>
      </form>

      <AdminProductImagesSection
        product={product}
        onProductChange={setProduct}
      />

      <AdminProductStatusActions
        product={product}
        onProductChange={setProduct}
      />
    </main>
  );
}