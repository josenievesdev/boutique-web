import {
  describe,
  expect,
  it,
} from "vitest";
import type { Category } from "../entities/category";
import type { Clock } from "../ports/clock";
import type { IdGenerator } from "../ports/id-generator";
import type { AdminCategoryRepository } from "../repositories/admin-category-repository";
import { CreateCategory } from "./create-category";

class FixedIdGenerator
  implements IdGenerator
{
  generate(): string {
    return "category-created";
  }
}

class FixedClock implements Clock {
  now(): Date {
    return new Date(
      "2026-07-20T15:30:00.000Z",
    );
  }
}

class InMemoryAdminCategoryRepository
  implements AdminCategoryRepository
{
  private readonly categories:
    Category[];

  constructor(
    categories: Category[] = [],
  ) {
    this.categories = [...categories];
  }

  async listActive(): Promise<Category[]> {
    return this.categories.filter(
      (category) => category.active,
    );
  }

  async listAll(): Promise<Category[]> {
    return [...this.categories];
  }

  async findBySlug(
    slug: string,
  ): Promise<Category | null> {
    return (
      this.categories.find(
        (category) =>
          category.slug === slug,
      ) ?? null
    );
  }

  async create(
    category: Category,
  ): Promise<void> {
    this.categories.push(category);
  }
}

function createUseCase(
  repository =
    new InMemoryAdminCategoryRepository(),
): CreateCategory {
  return new CreateCategory(
    repository,
    new FixedIdGenerator(),
    new FixedClock(),
  );
}

describe("CreateCategory", () => {
  it("crea una categoría activa", async () => {
    const repository =
      new InMemoryAdminCategoryRepository();

    const useCase =
      createUseCase(repository);

    const category =
      await useCase.execute({
        name: " Blusas ",
        slug: " BLUSAS ",
        description:
          " Prendas superiores. ",
        position: 2,
      });

    expect(category).toEqual({
      id: "category-created",
      name: "Blusas",
      slug: "blusas",
      description:
        "Prendas superiores.",
      active: true,
      position: 2,
      createdAt: new Date(
        "2026-07-20T15:30:00.000Z",
      ),
      updatedAt: new Date(
        "2026-07-20T15:30:00.000Z",
      ),
    });

    await expect(
      repository.findBySlug("blusas"),
    ).resolves.toEqual(category);
  });

  it("rechaza un nombre vacío", async () => {
    const useCase = createUseCase();

    await expect(
      useCase.execute({
        name: "   ",
        slug: "blusas",
        description: "",
        position: 0,
      }),
    ).rejects.toThrow(
      "El nombre de la categoría es obligatorio.",
    );
  });

  it("rechaza un slug inválido", async () => {
    const useCase = createUseCase();

    await expect(
      useCase.execute({
        name: "Blusas",
        slug: "blusas bonitas!",
        description: "",
        position: 0,
      }),
    ).rejects.toThrow(
      "El slug de la categoría no es válido.",
    );
  });

  it("rechaza un slug duplicado", async () => {
    const existingCategory: Category = {
      id: "existing-category",
      name: "Blusas",
      slug: "blusas",
      description: null,
      active: true,
      position: 1,
      createdAt: new Date(
        "2026-07-19T12:00:00.000Z",
      ),
      updatedAt: new Date(
        "2026-07-19T12:00:00.000Z",
      ),
    };

    const repository =
      new InMemoryAdminCategoryRepository([
        existingCategory,
      ]);

    const useCase =
      createUseCase(repository);

    await expect(
      useCase.execute({
        name: "Otras blusas",
        slug: "BLUSAS",
        description: "",
        position: 2,
      }),
    ).rejects.toThrow(
      'Ya existe una categoría con el slug "blusas".',
    );
  });
});