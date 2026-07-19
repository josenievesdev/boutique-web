import { NotFoundError } from "../errors/not-found-error";
import type { ProductImageStorage } from "../ports/product-image-storage";
import type { ProductRepository } from "../repositories/product-repository";

export class DeleteProductPermanently {
  private readonly productRepository:
    ProductRepository;

  private readonly productImageStorage:
    ProductImageStorage;

  constructor(
    productRepository: ProductRepository,
    productImageStorage: ProductImageStorage,
  ) {
    this.productRepository = productRepository;
    this.productImageStorage = productImageStorage;
  }

  async execute(productId: string): Promise<void> {
    const product =
      await this.productRepository.findById(productId);

    if (!product) {
      throw new NotFoundError(
        `No se encontró el producto "${productId}".`,
      );
    }

    const imagePaths = product.images.map(
      (image) => image.path,
    );

    await this.productRepository.deletePermanently(
      productId,
    );

    await this.productImageStorage.remove(imagePaths);
  }
}