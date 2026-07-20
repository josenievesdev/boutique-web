import type { Category } from "../entities/category";
import type { CategoryRepository } from "./category-repository";

export interface AdminCategoryRepository
  extends CategoryRepository
{
  listAll(): Promise<Category[]>;

  findBySlug(
    slug: string,
  ): Promise<Category | null>;

  create(category: Category): Promise<void>;
}