import { useState } from "react";
import { useNavigate } from "react-router";
import type {
  Product,
  ProductStatus,
} from "../../../core/entities/product";
import { ArchiveProduct } from "../../../core/use-cases/archive-product";
import { DeleteProductPermanently } from "../../../core/use-cases/delete-product-permanently";
import { HideProduct } from "../../../core/use-cases/hide-product";
import { MarkProductOutOfStock } from "../../../core/use-cases/mark-product-out-of-stock";
import { PublishProduct } from "../../../core/use-cases/publish-product";
import { RestoreProduct } from "../../../core/use-cases/restore-product";
import { SupabaseProductRepository } from "../../../infrastructure/repositories/supabase-product-repository";
import { SupabaseProductImageStorage } from "../../../infrastructure/storage/supabase-product-image-storage";
import { supabase } from "../../../infrastructure/supabase/supabase-client";

const productRepository =
  new SupabaseProductRepository(supabase);

const productImageStorage =
  new SupabaseProductImageStorage(supabase);

const publishProduct =
  new PublishProduct(productRepository);

const hideProduct =
  new HideProduct(productRepository);

const markProductOutOfStock =
  new MarkProductOutOfStock(
    productRepository,
  );

const archiveProduct =
  new ArchiveProduct(productRepository);

const restoreProduct =
  new RestoreProduct(productRepository);

const deleteProductPermanently =
  new DeleteProductPermanently(
    productRepository,
    productImageStorage,
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

interface AdminProductStatusActionsProps {
  product: Product;
  onProductChange(product: Product): void;
}

export function AdminProductStatusActions({
  product,
  onProductChange,
}: AdminProductStatusActionsProps) {
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [message, setMessage] =
    useState<string | null>(null);

  async function executeAction(
    action: () => Promise<Product>,
    successMessage: string,
  ): Promise<void> {
    setIsProcessing(true);
    setError(null);
    setMessage(null);

    try {
      const updatedProduct = await action();

      onProductChange(updatedProduct);
      setMessage(successMessage);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "No fue posible cambiar el estado del producto.",
      );
    } finally {
      setIsProcessing(false);
    }
  }

  async function handlePublish(): Promise<void> {
    await executeAction(
      () => publishProduct.execute(product.id),
      "El producto ya está visible en el catálogo.",
    );
  }

  async function handleHide(): Promise<void> {
    await executeAction(
      () => hideProduct.execute(product.id),
      "El producto se ocultó del catálogo.",
    );
  }

  async function handleOutOfStock(): Promise<void> {
    await executeAction(
      () =>
        markProductOutOfStock.execute(
          product.id,
        ),
      "El producto se marcó como agotado.",
    );
  }

  async function handleArchive(): Promise<void> {
    const confirmed = window.confirm(
      `¿Archivar "${product.name}"? Podrás restaurarlo después.`,
    );

    if (!confirmed) {
      return;
    }

    await executeAction(
      () => archiveProduct.execute(product.id),
      "El producto fue archivado.",
    );
  }

  async function handleRestore(): Promise<void> {
    await executeAction(
      () => restoreProduct.execute(product.id),
      "El producto se restauró como borrador.",
    );
  }

  async function handleDelete(): Promise<void> {
    const typedName = window.prompt(
      `Esta acción es definitiva.\n\nEscribe exactamente "${product.name}" para eliminar el producto y sus imágenes.`,
    );

    if (typedName === null) {
      return;
    }

    if (typedName.trim() !== product.name) {
      setMessage(null);
      setError(
        "El nombre escrito no coincide. El producto no fue eliminado.",
      );
      return;
    }

    setIsProcessing(true);
    setError(null);
    setMessage(null);

    try {
      await deleteProductPermanently.execute(
        product.id,
      );

      navigate("/admin/products", {
        replace: true,
      });
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "No fue posible eliminar el producto.",
      );

      setIsProcessing(false);
    }
  }

  const canPublish =
    product.status === "draft" ||
    product.status === "hidden" ||
    product.status === "out_of_stock";

  return (
    <section className="admin-form-section admin-product-status-section">
      <div className="admin-form-section__heading">
        <h2>Estado del producto</h2>

        <p>
          Estado actual:{" "}
          <strong>
            {statusLabels[product.status]}
          </strong>
        </p>
      </div>

      <div className="admin-product-status-panel">
        <div className="admin-product-status-panel__summary">
          {product.status === "published" ? (
            <p>
              Está visible en el catálogo público.
              Puedes ocultarlo, marcarlo como agotado
              o archivarlo.
            </p>
          ) : null}

          {product.status === "draft" ? (
            <p>
              Sigue siendo un borrador. Para publicarlo
              necesita categoría y al menos una imagen.
            </p>
          ) : null}

          {product.status === "hidden" ? (
            <p>
              Está oculto para los visitantes, pero
              conserva toda su información.
            </p>
          ) : null}

          {product.status === "out_of_stock" ? (
            <p>
              Está marcado como agotado. Puedes volver
              a publicarlo cuando esté disponible.
            </p>
          ) : null}

          {product.status === "archived" ? (
            <p>
              Está archivado y fuera del catálogo.
              Puedes restaurarlo o eliminarlo
              definitivamente.
            </p>
          ) : null}
        </div>

        <div className="admin-product-status-actions">
          {product.status === "published" ? (
            <>
              <button
                className="admin-action-button admin-action-button--secondary"
                type="button"
                disabled={isProcessing}
                onClick={() => {
                  void handleOutOfStock();
                }}
              >
                Marcar agotado
              </button>

              <button
                className="admin-action-button admin-action-button--secondary"
                type="button"
                disabled={isProcessing}
                onClick={() => {
                  void handleHide();
                }}
              >
                Ocultar
              </button>
            </>
          ) : null}

          {canPublish ? (
            <button
              className="admin-action-button"
              type="button"
              disabled={isProcessing}
              onClick={() => {
                void handlePublish();
              }}
            >
              {product.status === "draft"
                ? "Publicar producto"
                : "Volver a publicar"}
            </button>
          ) : null}

          {product.status !== "archived" ? (
            <button
              className="admin-action-button admin-action-button--danger-outline"
              type="button"
              disabled={isProcessing}
              onClick={() => {
                void handleArchive();
              }}
            >
              Archivar
            </button>
          ) : null}

          {product.status === "archived" ? (
            <>
              <button
                className="admin-action-button"
                type="button"
                disabled={isProcessing}
                onClick={() => {
                  void handleRestore();
                }}
              >
                Restaurar como borrador
              </button>

              <button
                className="admin-action-button admin-action-button--danger"
                type="button"
                disabled={isProcessing}
                onClick={() => {
                  void handleDelete();
                }}
              >
                Eliminar definitivamente
              </button>
            </>
          ) : null}
        </div>
      </div>

      {isProcessing ? (
        <p
          className="admin-product-status-progress"
          role="status"
        >
          Procesando cambio...
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