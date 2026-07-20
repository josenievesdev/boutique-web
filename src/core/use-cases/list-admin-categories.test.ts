import {
  describe,
  expect,
  it,
} from "vitest";
import type { Category } from "../entities/category";
import type { AdminCategoryRepository } from "../repositories/admin-category-repository";
import { ListAdminCategories } from "./list-admin-categories";

describe("ListAdminCategories", () => {
  it("devuelve categorías activas e inactivas", async () => {
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
      {
        id: "category-2",
        name: "Archivo",
        slug: "archivo",
        description: null,
        active: false,
        position: 2,
        createdAt: new Date(
          "2026-07-19T12:00:00.000Z",
        ),
        updatedAt: new Date(
          "2026-07-19T12:00:00.000Z",
        ),
      },
    ];

    const repository:
      AdminCategoryRepository = {
        async listActive() {
          return categories.filter(
            (category) =>
              category.active,
          );
        },

        async listAll() {
          return categories;
        },

        async findBySlug() {
          return null;
        },

        async create() {
          // No se utiliza en esta prueba.
        },
      };

    const useCase =
      new ListAdminCategories(
        repository,
      );

    const result =
      await useCase.execute();

    expect(result).toEqual(categories);

    expect(
      result.some(
        (category) =>
          category.active === false,
      ),
    ).toBe(true);
  });
});