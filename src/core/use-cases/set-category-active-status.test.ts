import {
  describe,
  expect,
  it,
} from "vitest";
import type { Category } from "../entities/category";
import type { Clock } from "../ports/clock";
import { InMemoryCategoryManagementRepository } from "../../infrastructure/repositories/in-memory-category-management-repository";
import { SetCategoryActiveStatus } from "./set-category-active-status";

class FixedClock implements Clock {
  now(): Date {
    return new Date(
      "2026-07-21T15:30:00.000Z",
    );
  }
}

function createCategory(
  active = true,
): Category {
  return {
    id: "category-1",
    name: "Vestidos",
    slug: "vestidos",
    description: null,
    active,
    position: 1,
    createdAt: new Date(
      "2026-07-19T12:00:00.000Z",
    ),
    updatedAt: new Date(
      "2026-07-19T12:00:00.000Z",
    ),
  };
}

function createUseCase(
  repository:
    InMemoryCategoryManagementRepository,
): SetCategoryActiveStatus {
  return new SetCategoryActiveStatus(
    repository,
    new FixedClock(),
  );
}

describe("SetCategoryActiveStatus", () => {
  it("desactiva una categoría sin productos", async () => {
    const category = createCategory();

    const repository =
      new InMemoryCategoryManagementRepository([
        category,
      ]);

    const result =
      await createUseCase(
        repository,
      ).execute({
        categoryId: category.id,
        active: false,
      });

    expect(result.active).toBe(false);
  });

  it("impide desactivar una categoría con productos", async () => {
    const category = createCategory();

    const repository =
      new InMemoryCategoryManagementRepository(
        [category],
        {
          [category.id]: 2,
        },
      );

    await expect(
      createUseCase(
        repository,
      ).execute({
        categoryId: category.id,
        active: false,
      }),
    ).rejects.toThrow(
      "No puedes desactivar una categoría que tiene productos asociados.",
    );
  });

  it("activa una categoría inactiva", async () => {
    const category =
      createCategory(false);

    const repository =
      new InMemoryCategoryManagementRepository([
        category,
      ]);

    const result =
      await createUseCase(
        repository,
      ).execute({
        categoryId: category.id,
        active: true,
      });

    expect(result.active).toBe(true);
  });

  it("mantiene el estado si ya coincide", async () => {
    const category = createCategory();

    const repository =
      new InMemoryCategoryManagementRepository([
        category,
      ]);

    const result =
      await createUseCase(
        repository,
      ).execute({
        categoryId: category.id,
        active: true,
      });

    expect(result).toBe(category);
  });

  it("rechaza una categoría inexistente", async () => {
    const repository =
      new InMemoryCategoryManagementRepository();

    await expect(
      createUseCase(
        repository,
      ).execute({
        categoryId: "missing-category",
        active: false,
      }),
    ).rejects.toThrow(
      'No se encontró la categoría "missing-category".',
    );
  });
});