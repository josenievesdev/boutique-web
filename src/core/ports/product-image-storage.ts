export type ProductImageExtension =
  | "jpg"
  | "jpeg"
  | "png"
  | "webp";

export type ProductImageMimeType =
  | "image/jpeg"
  | "image/png"
  | "image/webp";

export interface UploadProductImageInput {
  productId: string;
  imageId: string;
  extension: ProductImageExtension;
  contentType: ProductImageMimeType;
  data: ArrayBuffer;
}

export interface StoredProductImage {
  path: string;
  publicUrl: string;
}

export interface ProductImageStorage {
  upload(
    input: UploadProductImageInput,
  ): Promise<StoredProductImage>;

  remove(paths: string[]): Promise<void>;

  getPublicUrl(path: string): string;
}