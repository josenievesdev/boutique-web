import type { Product } from "../entities/product";
import { NotFoundError } from "../errors/not-found-error";
import type { IdGenerator } from "../ports/id-generator";
import type {
  ProductImageExtension,
  ProductImageMimeType,
  ProductImageStorage,
} from "../ports/product-image-storage";
import type { ProductRepository } from "../repositories/product-repository";

export interface UploadProductImageInput {
  productId: string;
  extension: ProductImageExtension;
  contentType: ProductImageMimeType;
  data: ArrayBuffer;
  altText: string;
  position: number;
  isCover: boolean;
}

export interface UploadProductImageResult {
  product: Product;
  imageId: string;
  path: string;
  publicUrl: string;
}

export class UploadProductImage {
  private readonly productRepository:
    ProductRepository;

  private readonly productImageStorage:
    ProductImageStorage;

  private readonly idGenerator: IdGenerator;

  constructor(
    productRepository: ProductRepository,
    productImageStorage: ProductImageStorage,
    idGenerator: IdGenerator,
  ) {
    this.productRepository = productRepository;
    this.productImageStorage = productImageStorage;
    this.idGenerator = idGenerator;
  }

  async execute(
    input: UploadProductImageInput,
  ): Promise<UploadProductImageResult> {
    const product =
      await this.productRepository.findById(
        input.productId,
      );

    if (!product) {
      throw new NotFoundError(
        `No se encontró el producto "${input.productId}".`,
      );
    }

    const imageId = this.idGenerator.generate();

    const storedImage =
      await this.productImageStorage.upload({
        productId: input.productId,
        imageId,
        extension: input.extension,
        contentType: input.contentType,
        data: input.data,
      });

    try {
      product.addImage({
        id: imageId,
        path: storedImage.path,
        altText: input.altText.trim(),
        position: input.position,
        isCover: input.isCover,
      });

      await this.productRepository.update(product);
    } catch (error) {
      await this.productImageStorage.remove([
        storedImage.path,
      ]);

      throw error;
    }

    return {
      product,
      imageId,
      path: storedImage.path,
      publicUrl: storedImage.publicUrl,
    };
  }
}