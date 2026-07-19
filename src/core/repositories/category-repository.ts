import type { Category } from "../entities/category";

export interface CategoryRepository {
  listActive(): Promise<Category[]>;
}