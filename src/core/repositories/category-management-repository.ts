import type { Category } from "../entities/category";
import type { AdminCategoryRepository } from "./admin-category-repository";

export interface CategoryManagementRepository
  extends AdminCategoryRepository
{
  findById(
    categoryId: string,
  ): Promise<Category | null>;

  update(category: Category): Promise<void>;

  countProducts(
    categoryId: string,
  ): Promise<number>;
}