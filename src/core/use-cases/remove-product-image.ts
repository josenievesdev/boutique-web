import type { Product } from "../entities/product";
import { NotFoundError } from "../errors/not-found-error";
import type { ProductImageStorage } from "../ports/product-image-storage";
import type { ProductRepository } from "../repositories/product-repository";

export class RemoveProductImage {
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

  async execute(
    productId: string,
    imageId: string,
  ): Promise<Product> {
    const product =
      await this.productRepository.findById(productId);

    if (!product) {
      throw new NotFoundError(
        `No se encontró el producto "${productId}".`,
      );
    }

    const removedImage =
      product.removeImage(imageId);

    await this.productRepository.update(product);

    await this.productImageStorage.remove([
      removedImage.path,
    ]);

    return product;
  }
}