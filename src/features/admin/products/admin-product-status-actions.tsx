import { useState } from "react";
import type {
  Product,
  ProductStatus,
} from "../../../core/entities/product";
import { HideProduct } from "../../../core/use-cases/hide-product";
import { PublishProduct } from "../../../core/use-cases/publish-product";
import { SupabaseProductRepository } from "../../../infrastructure/repositories/supabase-product-repository";
import { supabase } from "../../../infrastructure/supabase/supabase-client";

const productRepository =
  new SupabaseProductRepository(supabase);

const publishProduct =
  new PublishProduct(productRepository);

const hideProduct =
  new HideProduct(productRepository);

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

interface AdminProductStatusActionsProps {
  product: Product;
  onProductChange(product: Product): void;
}

export function AdminProductStatusActions({
  product,
  onProductChange,
}: AdminProductStatusActionsProps) {
  const [isProcessing, setIsProcessing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [message, setMessage] =
    useState<string | null>(null);

  async function handlePublish(): Promise<void> {
    setIsProcessing(true);
    setError(null);
    setMessage(null);

    try {
      const updatedProduct =
        await publishProduct.execute(product.id);

      onProductChange(updatedProduct);

      setMessage(
        "El producto ya está visible en el catálogo.",
      );
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "No fue posible publicar el producto.",
      );
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleHide(): Promise<void> {
    setIsProcessing(true);
    setError(null);
    setMessage(null);

    try {
      const updatedProduct =
        await hideProduct.execute(product.id);

      onProductChange(updatedProduct);

      setMessage(
        "El producto se ocultó del catálogo.",
      );
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "No fue posible ocultar el producto.",
      );
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <section className="admin-form-section admin-product-status-section">
      <div className="admin-form-section__heading">
        <h2>Publicación</h2>

        <p>
          Estado actual:{" "}
          <strong>
            {statusLabels[product.status]}
          </strong>
        </p>
      </div>

      <div className="admin-product-status-panel">
        <div>
          {product.status === "published" ? (
            <p>
              El producto está visible para todos los
              visitantes del catálogo.
            </p>
          ) : (
            <p>
              Para publicar necesita una categoría y
              al menos una fotografía.
            </p>
          )}
        </div>

        {product.status === "published" ? (
          <button
            type="button"
            disabled={isProcessing}
            onClick={() => {
              void handleHide();
            }}
          >
            {isProcessing
              ? "Ocultando..."
              : "Ocultar producto"}
          </button>
        ) : null}

        {product.status !== "published" &&
        product.status !== "archived" ? (
          <button
            type="button"
            disabled={isProcessing}
            onClick={() => {
              void handlePublish();
            }}
          >
            {isProcessing
              ? "Publicando..."
              : "Publicar producto"}
          </button>
        ) : null}

        {product.status === "archived" ? (
          <p>
            Los productos archivados no pueden
            publicarse directamente.
          </p>
        ) : null}
      </div>

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
    </section>
  );
}