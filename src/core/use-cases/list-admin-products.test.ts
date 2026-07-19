import { describe, expect, it } from "vitest";
import { Product } from "../entities/product";
import { InMemoryProductRepository } from "../../infrastructure/repositories/in-memory-product-repository";
import { ListAdminProducts } from "./list-admin-products";

function createProduct(
  id: string,
  slug: string,
  status: "draft" | "published",
): Product {
  const now = new Date(
    "2026-07-19T12:00:00.000Z",
  );

  return new Product({
    id,
    name: slug,
    slug,
    shortDescription: "Descripción corta.",
    description: "Descripción completa.",
    priceInPesos: 100_000,
    previousPriceInPesos: null,
    categoryId: "category-1",
    collectionId: null,
    status,
    featured: false,
    customizable: false,
    madeToOrder: false,
    preparationDays: null,
    images: [],
    createdAt: now,
    updatedAt: now,
  });
}

describe("ListAdminProducts", () => {
  it("devuelve productos de todos los estados", async () => {
    const repository =
      new InMemoryProductRepository();

    await repository.create(
      createProduct(
        "product-1",
        "producto-publicado",
        "published",
      ),
    );

    await repository.create(
      createProduct(
        "product-2",
        "producto-borrador",
        "draft",
      ),
    );

    const useCase = new ListAdminProducts(
      repository,
    );

    const products = await useCase.execute();

    expect(products).toHaveLength(2);

    expect(
      products.map((product) => product.status),
    ).toEqual(
      expect.arrayContaining([
        "published",
        "draft",
      ]),
    );
  });

  it("devuelve una lista vacía cuando no hay productos", async () => {
    const repository =
      new InMemoryProductRepository();

    const useCase = new ListAdminProducts(
      repository,
    );

    const products = await useCase.execute();

    expect(products).toEqual([]);
  });
});