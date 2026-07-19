import type { Category } from "../entities/category";
import type { CategoryRepository } from "../repositories/category-repository";

export class ListActiveCategories {
  private readonly categoryRepository:
    CategoryRepository;

  constructor(
    categoryRepository: CategoryRepository,
  ) {
    this.categoryRepository = categoryRepository;
  }

  async execute(): Promise<Category[]> {
    return this.categoryRepository.listActive();
  }
}