import type { Category } from "../entities/category";
import { DomainError } from "../errors/domain-error";
import { NotFoundError } from "../errors/not-found-error";
import type { Clock } from "../ports/clock";
import type { CategoryManagementRepository } from "../repositories/category-management-repository";

export interface SetCategoryActiveStatusInput {
  categoryId: string;
  active: boolean;
}

export class SetCategoryActiveStatus {
  private readonly categoryRepository:
    CategoryManagementRepository;

  private readonly clock: Clock;

  constructor(
    categoryRepository:
      CategoryManagementRepository,
    clock: Clock,
  ) {
    this.categoryRepository =
      categoryRepository;

    this.clock = clock;
  }

  async execute(
    input: SetCategoryActiveStatusInput,
  ): Promise<Category> {
    const category =
      await this.categoryRepository.findById(
        input.categoryId,
      );

    if (!category) {
      throw new NotFoundError(
        `No se encontró la categoría "${input.categoryId}".`,
      );
    }

    if (
      category.active === input.active
    ) {
      return category;
    }

    if (!input.active) {
      const productCount =
        await this.categoryRepository.countProducts(
          category.id,
        );

      if (productCount > 0) {
        throw new DomainError(
          "No puedes desactivar una categoría que tiene productos asociados.",
        );
      }
    }

    const updatedCategory: Category = {
      ...category,
      active: input.active,
      updatedAt: new Date(
        this.clock.now(),
      ),
    };

    await this.categoryRepository.update(
      updatedCategory,
    );

    return updatedCategory;
  }
}