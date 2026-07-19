import type {
  ProductImageStorage,
  StoredProductImage,
  UploadProductImageInput,
} from "../../core/ports/product-image-storage";

export class InMemoryProductImageStorage
  implements ProductImageStorage
{
  private readonly files = new Map<
    string,
    ArrayBuffer
  >();

  async upload(
    input: UploadProductImageInput,
  ): Promise<StoredProductImage> {
    const normalizedExtension =
      input.extension === "jpeg"
        ? "jpg"
        : input.extension;

    const path =
      `${input.productId}/${input.imageId}.${normalizedExtension}`;

    if (this.files.has(path)) {
      throw new Error(
        `Ya existe un archivo en la ruta "${path}".`,
      );
    }

    this.files.set(path, input.data);

    return {
      path,
      publicUrl: this.getPublicUrl(path),
    };
  }

  async remove(paths: string[]): Promise<void> {
    for (const path of paths) {
      this.files.delete(path);
    }
  }

  getPublicUrl(path: string): string {
    return `memory://product-images/${path}`;
  }

  has(path: string): boolean {
    return this.files.has(path);
  }

  count(): number {
    return this.files.size;
  }
}