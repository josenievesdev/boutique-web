import type { Category } from "../entities/category";
import type { AdminCategoryRepository } from "../repositories/admin-category-repository";

export class ListAdminCategories {
  private readonly categoryRepository:
    AdminCategoryRepository;

  constructor(
    categoryRepository:
      AdminCategoryRepository,
  ) {
    this.categoryRepository =
      categoryRepository;
  }

  async execute(): Promise<Category[]> {
    return this.categoryRepository.listAll();
  }
}