import { describe, expect, it } from "vitest";
import type { Category } from "../entities/category";
import type { CategoryRepository } from "../repositories/category-repository";
import { ListActiveCategories } from "./list-active-categories";

describe("ListActiveCategories", () => {
  it("devuelve las categorías proporcionadas por el repositorio", async () => {
    const categories: Category[] = [
      {
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
      },
    ];

    const repository: CategoryRepository = {
      async listActive(): Promise<Category[]> {
        return categories;
      },
    };

    const useCase =
      new ListActiveCategories(repository);

    const result = await useCase.execute();

    expect(result).toEqual(categories);
  });
});