import type { Product } from "../entities/product";

export interface ProductCatalogRepository {
  listPublished(): Promise<Product[]>;

  findPublishedBySlug(
    slug: string,
  ): Promise<Product | null>;
}