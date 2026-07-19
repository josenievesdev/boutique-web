import type { Product } from "../entities/product";
import type { ProductRepository } from "../repositories/product-repository";

export class ListPublishedProducts {
  private readonly productRepository: ProductRepository;

  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }

  async execute(): Promise<Product[]> {
    return this.productRepository.listPublished();
  }
}