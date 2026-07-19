import { describe, expect, it } from "vitest";
import { Product } from "../entities/product";
import { InMemoryProductRepository } from "../../infrastructure/repositories/in-memory-product-repository";
import { ListPublishedProducts } from "./list-published-products";

function createProduct(
  id: string,
  slug: string,
  status: "draft" | "published",
): Product {
  const now = new Date("2026-07-18T12:00:00.000Z");

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

describe("ListPublishedProducts", () => {
  it("devuelve únicamente productos publicados", async () => {
    const repository = new InMemoryProductRepository();

    await repository.create(
      createProduct(
        "product-1",
        "vestido-publicado",
        "published",
      ),
    );

    await repository.create(
      createProduct(
        "product-2",
        "vestido-borrador",
        "draft",
      ),
    );

    const useCase = new ListPublishedProducts(repository);

    const products = await useCase.execute();

    expect(products).toHaveLength(1);
    expect(products[0]?.id).toBe("product-1");
  });
});