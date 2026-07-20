import type { Category } from "../entities/category";
import { NotFoundError } from "../errors/not-found-error";
import type { CategoryManagementRepository } from "../repositories/category-management-repository";

export class GetAdminCategory {
  private readonly categoryRepository:
    CategoryManagementRepository;

  constructor(
    categoryRepository:
      CategoryManagementRepository,
  ) {
    this.categoryRepository =
      categoryRepository;
  }

  async execute(
    categoryId: string,
  ): Promise<Category> {
    const category =
      await this.categoryRepository.findById(
        categoryId,
      );

    if (!category) {
      throw new NotFoundError(
        `No se encontró la categoría "${categoryId}".`,
      );
    }

    return category;
  }
}