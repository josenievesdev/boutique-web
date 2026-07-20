import {
  describe,
  expect,
  it,
} from "vitest";
import type { Category } from "../entities/category";
import { InMemoryCategoryManagementRepository } from "../../infrastructure/repositories/in-memory-category-management-repository";
import { GetAdminCategory } from "./get-admin-category";

const category: Category = {
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
};

describe("GetAdminCategory", () => {
  it("devuelve una categoría existente", async () => {
    const repository =
      new InMemoryCategoryManagementRepository([
        category,
      ]);

    const useCase =
      new GetAdminCategory(repository);

    await expect(
      useCase.execute(category.id),
    ).resolves.toEqual(category);
  });

  it("rechaza una categoría inexistente", async () => {
    const repository =
      new InMemoryCategoryManagementRepository();

    const useCase =
      new GetAdminCategory(repository);

    await expect(
      useCase.execute("missing-category"),
    ).rejects.toThrow(
      'No se encontró la categoría "missing-category".',
    );
  });
});