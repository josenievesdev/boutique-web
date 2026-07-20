import {
  describe,
  expect,
  it,
} from "vitest";
import type { Category } from "../entities/category";
import type { Clock } from "../ports/clock";
import { InMemoryCategoryManagementRepository } from "../../infrastructure/repositories/in-memory-category-management-repository";
import { UpdateCategoryDetails } from "./update-category-details";

class FixedClock implements Clock {
  now(): Date {
    return new Date(
      "2026-07-21T15:30:00.000Z",
    );
  }
}

function createCategory(
  overrides: Partial<Category> = {},
): Category {
  return {
    id: "category-1",
    name: "Vestidos",
    slug: "vestidos",
    description: null,
    active: true,
    position: 1,
    createdAt: new Date(
      "2026-07-19T12:00:00.000Z",
    ),
    updatedAt: new Date(
      "2026-07-19T12:00:00.000Z",
    ),
    ...overrides,
  };
}

function createUseCase(
  repository:
    InMemoryCategoryManagementRepository,
): UpdateCategoryDetails {
  return new UpdateCategoryDetails(
    repository,
    new FixedClock(),
  );
}

describe("UpdateCategoryDetails", () => {
  it("actualiza la categoría", async () => {
    const category = createCategory();

    const repository =
      new InMemoryCategoryManagementRepository([
        category,
      ]);

    const useCase =
      createUseCase(repository);

    const result =
      await useCase.execute({
        categoryId: category.id,
        name: " Vestidos de fiesta ",
        slug: " VESTIDOS-DE-FIESTA ",
        description:
          " Diseños para ocasiones especiales. ",
        position: 3,
      });

    expect(result.name).toBe(
      "Vestidos de fiesta",
    );

    expect(result.slug).toBe(
      "vestidos-de-fiesta",
    );

    expect(result.description).toBe(
      "Diseños para ocasiones especiales.",
    );

    expect(result.position).toBe(3);

    expect(
      result.updatedAt.toISOString(),
    ).toBe(
      "2026-07-21T15:30:00.000Z",
    );

    await expect(
      repository.findById(category.id),
    ).resolves.toEqual(result);
  });

  it("permite conservar el mismo slug", async () => {
    const category = createCategory();

    const repository =
      new InMemoryCategoryManagementRepository([
        category,
      ]);

    const useCase =
      createUseCase(repository);

    await expect(
      useCase.execute({
        categoryId: category.id,
        name: "Vestidos renovados",
        slug: "vestidos",
        description: "",
        position: 1,
      }),
    ).resolves.toMatchObject({
      slug: "vestidos",
    });
  });

  it("rechaza utilizar el slug de otra categoría", async () => {
    const firstCategory =
      createCategory();

    const secondCategory =
      createCategory({
        id: "category-2",
        name: "Blusas",
        slug: "blusas",
      });

    const repository =
      new InMemoryCategoryManagementRepository([
        firstCategory,
        secondCategory,
      ]);

    const useCase =
      createUseCase(repository);

    await expect(
      useCase.execute({
        categoryId: firstCategory.id,
        name: "Vestidos",
        slug: "BLUSAS",
        description: "",
        position: 1,
      }),
    ).rejects.toThrow(
      'Ya existe una categoría con el slug "blusas".',
    );
  });

  it("rechaza un nombre vacío", async () => {
    const category = createCategory();

    const repository =
      new InMemoryCategoryManagementRepository([
        category,
      ]);

    const useCase =
      createUseCase(repository);

    await expect(
      useCase.execute({
        categoryId: category.id,
        name: "   ",
        slug: "vestidos",
        description: "",
        position: 1,
      }),
    ).rejects.toThrow(
      "El nombre de la categoría es obligatorio.",
    );
  });

  it("rechaza una categoría inexistente", async () => {
    const repository =
      new InMemoryCategoryManagementRepository();

    const useCase =
      createUseCase(repository);

    await expect(
      useCase.execute({
        categoryId: "missing-category",
        name: "Vestidos",
        slug: "vestidos",
        description: "",
        position: 1,
      }),
    ).rejects.toThrow(
      'No se encontró la categoría "missing-category".',
    );
  });
});