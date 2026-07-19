import type { Product } from "../entities/product";

export interface ProductRepository {
  create(product: Product): Promise<void>;
  update(product: Product): Promise<void>;
  findById(id: string): Promise<Product | null>;
  findBySlug(slug: string): Promise<Product | null>;
  listAll(): Promise<Product[]>;
  listPublished(): Promise<Product[]>;
  deletePermanently(id: string): Promise<void>;
}