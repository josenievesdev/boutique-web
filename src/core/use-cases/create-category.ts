import type { Category } from "../entities/category";
import { ConflictError } from "../errors/conflict-error";
import { DomainError } from "../errors/domain-error";
import type { Clock } from "../ports/clock";
import type { IdGenerator } from "../ports/id-generator";
import type { AdminCategoryRepository } from "../repositories/admin-category-repository";

export interface CreateCategoryInput {
  name: string;
  slug: string;
  description: string;
  position: number;
}

export class CreateCategory {
  private readonly categoryRepository:
    AdminCategoryRepository;

  private readonly idGenerator:
    IdGenerator;

  private readonly clock: Clock;

  constructor(
    categoryRepository:
      AdminCategoryRepository,
    idGenerator: IdGenerator,
    clock: Clock,
  ) {
    this.categoryRepository =
      categoryRepository;

    this.idGenerator = idGenerator;
    this.clock = clock;
  }

  async execute(
    input: CreateCategoryInput,
  ): Promise<Category> {
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

    const existingCategory =
      await this.categoryRepository.findBySlug(
        slug,
      );

    if (existingCategory) {
      throw new ConflictError(
        `Ya existe una categoría con el slug "${slug}".`,
      );
    }

    const now = this.clock.now();

    const category: Category = {
      id: this.idGenerator.generate(),
      name,
      slug,
      description:
        description || null,
      active: true,
      position: input.position,
      createdAt: new Date(now),
      updatedAt: new Date(now),
    };

    await this.categoryRepository.create(
      category,
    );

    return category;
  }
}