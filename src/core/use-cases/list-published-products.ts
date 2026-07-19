import type { Product } from "../entities/product";
import type { ProductCatalogRepository } from "../repositories/product-catalog-repository";

export class ListPublishedProducts {
  private readonly productCatalogRepository:
    ProductCatalogRepository;

  constructor(
    productCatalogRepository: ProductCatalogRepository,
  ) {
    this.productCatalogRepository =
      productCatalogRepository;
  }

  async execute(): Promise<Product[]> {
    return this.productCatalogRepository.listPublished();
  }
}