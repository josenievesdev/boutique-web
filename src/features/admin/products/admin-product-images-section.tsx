import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import type {
  Product,
  ProductImage,
} from "../../../core/entities/product";
import type {
  ProductImageExtension,
  ProductImageMimeType,
} from "../../../core/ports/product-image-storage";
import { RemoveProductImage } from "../../../core/use-cases/remove-product-image";
import { SetProductCoverImage } from "../../../core/use-cases/set-product-cover-image";
import { UploadProductImage } from "../../../core/use-cases/upload-product-image";
import { SupabaseProductRepository } from "../../../infrastructure/repositories/supabase-product-repository";
import { SupabaseProductImageStorage } from "../../../infrastructure/storage/supabase-product-image-storage";
import { CryptoIdGenerator } from "../../../infrastructure/system/crypto-id-generator";
import { supabase } from "../../../infrastructure/supabase/supabase-client";

const MAX_IMAGE_SIZE_BYTES =
  5 * 1024 * 1024;

const productRepository =
  new SupabaseProductRepository(supabase);

const productImageStorage =
  new SupabaseProductImageStorage(supabase);

const uploadProductImage =
  new UploadProductImage(
    productRepository,
    productImageStorage,
    new CryptoIdGenerator(),
  );

const removeProductImage =
  new RemoveProductImage(
    productRepository,
    productImageStorage,
  );

const setProductCoverImage =
  new SetProductCoverImage(
    productRepository,
  );

interface ImageConfiguration {
  extension: ProductImageExtension;
  contentType: ProductImageMimeType;
}

function getImageConfiguration(
  file: File,
): ImageConfiguration | null {
  switch (file.type) {
    case "image/jpeg":
      return {
        extension: "jpg",
        contentType: "image/jpeg",
      };

    case "image/png":
      return {
        extension: "png",
        contentType: "image/png",
      };

    case "image/webp":
      return {
        extension: "webp",
        contentType: "image/webp",
      };

    default:
      return null;
  }
}

interface ImageCardProps {
  image: ProductImage;
  publicUrl: string;
  isBusy: boolean;
  canRemove: boolean;
  onSetCover(): void;
  onRemove(): void;
}

function ImageCard({
  image,
  publicUrl,
  isBusy,
  canRemove,
  onSetCover,
  onRemove,
}: ImageCardProps) {
  const [hasFailed, setHasFailed] =
    useState(false);

  return (
    <article className="admin-image-card">
      <div className="admin-image-card__preview">
        {hasFailed ? (
          <div className="admin-image-card__fallback">
            Archivo no disponible
          </div>
        ) : (
          <img
            src={publicUrl}
            alt={image.altText}
            loading="lazy"
            onError={() => {
              setHasFailed(true);
            }}
          />
        )}

        {image.isCover ? (
          <span className="admin-image-card__cover">
            Portada
          </span>
        ) : null}
      </div>

      <div className="admin-image-card__body">
        <strong>
          {image.altText || "Imagen del producto"}
        </strong>

        <span>Posición {image.position}</span>
      </div>

      <div className="admin-image-card__actions">
        <button
          type="button"
          disabled={isBusy || image.isCover}
          onClick={onSetCover}
        >
          {image.isCover
            ? "Es portada"
            : "Usar de portada"}
        </button>

        <button
          className="admin-image-card__delete"
          type="button"
          disabled={isBusy || !canRemove}
          onClick={onRemove}
        >
          Eliminar
        </button>
      </div>
    </article>
  );
}

interface AdminProductImagesSectionProps {
  product: Product;
  onProductChange(product: Product): void;
}

export function AdminProductImagesSection({
  product,
  onProductChange,
}: AdminProductImagesSectionProps) {
  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [previewUrl, setPreviewUrl] =
    useState<string | null>(null);

  const [altText, setAltText] =
    useState("");

  const [makeCover, setMakeCover] =
    useState(false);

  const [isUploading, setIsUploading] =
    useState(false);

  const [activeImageId, setActiveImageId] =
    useState<string | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const [message, setMessage] =
    useState<string | null>(null);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const nextPreviewUrl =
      URL.createObjectURL(selectedFile);

    setPreviewUrl(nextPreviewUrl);

    return () => {
      URL.revokeObjectURL(nextPreviewUrl);
    };
  }, [selectedFile]);

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>,
  ): void {
    const file =
      event.target.files?.[0] ?? null;

    setError(null);
    setMessage(null);

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (!getImageConfiguration(file)) {
      setSelectedFile(null);
      event.target.value = "";

      setError(
        "Solo se permiten imágenes JPEG, PNG o WebP.",
      );

      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setSelectedFile(null);
      event.target.value = "";

      setError(
        "La imagen no puede pesar más de 5 MB.",
      );

      return;
    }

    setSelectedFile(file);
    setAltText(product.name);
    setMakeCover(product.imageCount === 0);
  }

  async function handleUpload(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (!selectedFile) {
      setError(
        "Selecciona una imagen antes de subirla.",
      );

      return;
    }

    const configuration =
      getImageConfiguration(selectedFile);

    if (!configuration) {
      setError(
        "El tipo de imagen no es válido.",
      );

      return;
    }

    setIsUploading(true);
    setError(null);
    setMessage(null);

    try {
      const currentPositions =
        product.images.map(
          (image) => image.position,
        );

      const nextPosition =
        currentPositions.length === 0
          ? 1
          : Math.max(...currentPositions) + 1;

      const result =
        await uploadProductImage.execute({
          productId: product.id,
          extension:
            configuration.extension,
          contentType:
            configuration.contentType,
          data:
            await selectedFile.arrayBuffer(),
          altText:
            altText.trim() || product.name,
          position: nextPosition,
          isCover:
            product.imageCount === 0 ||
            makeCover,
        });

      onProductChange(result.product);

      setSelectedFile(null);
      setAltText("");
      setMakeCover(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setMessage(
        "La imagen se subió correctamente.",
      );
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "No fue posible subir la imagen.",
      );
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSetCover(
    imageId: string,
  ): Promise<void> {
    setActiveImageId(imageId);
    setError(null);
    setMessage(null);

    try {
      const updatedProduct =
        await setProductCoverImage.execute(
          product.id,
          imageId,
        );

      onProductChange(updatedProduct);

      setMessage(
        "La portada se actualizó correctamente.",
      );
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "No fue posible cambiar la portada.",
      );
    } finally {
      setActiveImageId(null);
    }
  }

  async function handleRemove(
    imageId: string,
  ): Promise<void> {
    const confirmed = window.confirm(
      "¿Eliminar esta imagen definitivamente?",
    );

    if (!confirmed) {
      return;
    }

    setActiveImageId(imageId);
    setError(null);
    setMessage(null);

    try {
      const updatedProduct =
        await removeProductImage.execute(
          product.id,
          imageId,
        );

      onProductChange(updatedProduct);

      setMessage(
        "La imagen se eliminó correctamente.",
      );
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "No fue posible eliminar la imagen.",
      );
    } finally {
      setActiveImageId(null);
    }
  }

  const canRemoveImages =
    product.status !== "published" ||
    product.imageCount > 1;

  return (
    <section className="admin-form-section admin-product-images-section">
      <div className="admin-form-section__heading">
        <h2>Fotografías</h2>

        <p>
          Sube imágenes JPEG, PNG o WebP de hasta
          5 MB. La primera se convierte en portada.
        </p>
      </div>

      {product.imageCount > 0 ? (
        <div className="admin-images-grid">
          {product.images.map((image) => (
            <ImageCard
              key={image.id}
              image={image}
              publicUrl={
                productImageStorage.getPublicUrl(
                  image.path,
                )
              }
              isBusy={
                activeImageId === image.id
              }
              canRemove={canRemoveImages}
              onSetCover={() => {
                void handleSetCover(image.id);
              }}
              onRemove={() => {
                void handleRemove(image.id);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="admin-images-empty">
          Este producto todavía no tiene fotografías.
        </div>
      )}

      <form
        className="admin-image-upload"
        onSubmit={(event) => {
          void handleUpload(event);
        }}
      >
        <div className="admin-image-upload__preview">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Vista previa de la imagen"
            />
          ) : (
            <span>Vista previa</span>
          )}
        </div>

        <div className="admin-image-upload__fields">
          <label className="admin-field">
            <span>Archivo</span>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
            />
          </label>

          <label className="admin-field">
            <span>Texto alternativo</span>

            <input
              type="text"
              value={altText}
              maxLength={180}
              placeholder={product.name}
              onChange={(event) => {
                setAltText(event.target.value);
              }}
            />
          </label>

          <label className="admin-checkbox admin-image-upload__checkbox">
            <input
              type="checkbox"
              checked={makeCover}
              disabled={product.imageCount === 0}
              onChange={(event) => {
                setMakeCover(
                  event.target.checked,
                );
              }}
            />

            <span>
              <strong>Usar como portada</strong>
              Reemplaza la portada actual.
            </span>
          </label>

          <button
            type="submit"
            disabled={
              isUploading || !selectedFile
            }
          >
            {isUploading
              ? "Subiendo..."
              : "Subir imagen"}
          </button>
        </div>
      </form>

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