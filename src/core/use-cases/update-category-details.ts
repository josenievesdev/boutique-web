import type { Category } from "../entities/category";
import { ConflictError } from "../errors/conflict-error";
import { DomainError } from "../errors/domain-error";
import { NotFoundError } from "../errors/not-found-error";
import type { Clock } from "../ports/clock";
import type { CategoryManagementRepository } from "../repositories/category-management-repository";

export interface UpdateCategoryDetailsInput {
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  position: number;
}

export class UpdateCategoryDetails {
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
    input: UpdateCategoryDetailsInput,
  ): Promise<Category> {
    const existingCategory =
      await this.categoryRepository.findById(
        input.categoryId,
      );

    if (!existingCategory) {
      throw new NotFoundError(
        `No se encontró la categoría "${input.categoryId}".`,
      );
    }

    const name = input.name.trim();

    const slug =
      input.slug.trim().toLowerCase();

    const description =
      input.description.trim();

    if (!name) {
      throw new DomainError(
        "El nombre de la categoría es obligatorio.",
      );
    }

    if (name.length > 100) {
      throw new DomainError(
        "El nombre de la categoría no puede superar 100 caracteres.",
      );
    }

    if (!slug) {
      throw new DomainError(
        "El slug de la categoría es obligatorio.",
      );
    }

    if (
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(
        slug,
      )
    ) {
      throw new DomainError(
        "El slug de la categoría no es válido.",
      );
    }

    if (
      !Number.isInteger(input.position) ||
      input.position < 0
    ) {
      throw new DomainError(
        "La posición debe ser un número entero mayor o igual a cero.",
      );
    }

    const categoryWithSameSlug =
      await this.categoryRepository.findBySlug(
        slug,
      );

    if (
      categoryWithSameSlug &&
      categoryWithSameSlug.id !==
        existingCategory.id
    ) {
      throw new ConflictError(
        `Ya existe una categoría con el slug "${slug}".`,
      );
    }

    const updatedCategory: Category = {
      ...existingCategory,
      name,
      slug,
      description:
        description || null,
      position: input.position,
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