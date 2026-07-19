import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  ProductImageStorage,
  StoredProductImage,
  UploadProductImageInput,
} from "../../core/ports/product-image-storage";
import type { Database } from "../supabase/database.types";

const PRODUCT_IMAGES_BUCKET = "product-images";

export class SupabaseProductImageStorage
  implements ProductImageStorage
{
  private readonly client: SupabaseClient<Database>;

  constructor(client: SupabaseClient<Database>) {
    this.client = client;
  }

  async upload(
    input: UploadProductImageInput,
  ): Promise<StoredProductImage> {
    this.validateInput(input);

    const normalizedExtension =
      input.extension === "jpeg"
        ? "jpg"
        : input.extension;

    const path =
      `${input.productId}/${input.imageId}.${normalizedExtension}`;

    const { data, error } = await this.client.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .upload(path, input.data, {
        contentType: input.contentType,
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw new Error(
        `No fue posible subir la imagen: ${error.message}`,
      );
    }

    return {
      path: data.path,
      publicUrl: this.getPublicUrl(data.path),
    };
  }

  async remove(paths: string[]): Promise<void> {
    if (paths.length === 0) {
      return;
    }

    const uniquePaths = [...new Set(paths)];

    const { error } = await this.client.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .remove(uniquePaths);

    if (error) {
      throw new Error(
        `No fue posible eliminar las imágenes: ${error.message}`,
      );
    }
  }

  getPublicUrl(path: string): string {
    const normalizedPath = path.trim();

    if (!normalizedPath) {
      throw new Error(
        "La ruta de la imagen es obligatoria.",
      );
    }

    const { data } = this.client.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .getPublicUrl(normalizedPath);

    return data.publicUrl;
  }

  private validateInput(
    input: UploadProductImageInput,
  ): void {
    if (!input.productId.trim()) {
      throw new Error(
        "El identificador del producto es obligatorio.",
      );
    }

    if (!input.imageId.trim()) {
      throw new Error(
        "El identificador de la imagen es obligatorio.",
      );
    }

    if (input.data.byteLength === 0) {
      throw new Error(
        "La imagen no puede estar vacía.",
      );
    }

    const extensionMatchesMimeType =
      (input.contentType === "image/jpeg" &&
        (input.extension === "jpg" ||
          input.extension === "jpeg")) ||
      (input.contentType === "image/png" &&
        input.extension === "png") ||
      (input.contentType === "image/webp" &&
        input.extension === "webp");

    if (!extensionMatchesMimeType) {
      throw new Error(
        "La extensión no coincide con el tipo de imagen.",
      );
    }
  }
}