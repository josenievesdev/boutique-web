import type { Product } from "../entities/product";
import { NotFoundError } from "../errors/not-found-error";
import type { ProductRepository } from "../repositories/product-repository";

export class GetAdminProduct {
  private readonly productRepository:
    ProductRepository;

  constructor(
    productRepository: ProductRepository,
  ) {
    this.productRepository = productRepository;
  }

  async execute(productId: string): Promise<Product> {
    const product =
      await this.productRepository.findById(productId);

    if (!product) {
      throw new NotFoundError(
        `No se encontró el producto "${productId}".`,
      );
    }

    return product;
  }
}