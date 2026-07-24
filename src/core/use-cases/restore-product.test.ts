import { describe, expect, it } from "vitest";
import { Product } from "../entities/product";
import { NotFoundError } from "../errors/not-found-error";
import { InMemoryProductRepository } from "../../infrastructure/repositories/in-memory-product-repository";
import { RestoreProduct } from "./restore-product";

function createProduct(
  status: "draft" | "archived" = "archived",
): Product {
  const now = new Date(
    "2026-07-19T12:00:00.000Z",
  );

  return new Product({
    id: "product-1",
    name: "Vestido Aurora",
    slug: "vestido-aurora",
    shortDescription: "Vestido elegante.",
    description: "Confeccionado sobre pedido.",
    priceInPesos: 180_000,
    previousPriceInPesos: null,
    categoryId: "category-dresses",
    collectionId: null,
    moldCode: null,
    status,
    featured: false,
    customizable: true,
    madeToOrder: true,
    preparationDays: 8,
    images: [],
    createdAt: now,
    updatedAt: now,
  });
}

describe("RestoreProduct", () => {
  it("restaura y guarda un producto archivado", async () => {
    const repository =
      new InMemoryProductRepository();

    const product = createProduct();

    await repository.create(product);

    const useCase =
      new RestoreProduct(repository);

    const restoredProduct =
      await useCase.execute(product.id);

    expect(restoredProduct.status).toBe("draft");

    const storedProduct =
      await repository.findById(product.id);

    expect(storedProduct?.status).toBe("draft");
  });

  it("rechaza restaurar un producto no archivado", async () => {
    const repository =
      new InMemoryProductRepository();

    const product = createProduct("draft");

    await repository.create(product);

    const useCase =
      new RestoreProduct(repository);

    await expect(
      useCase.execute(product.id),
    ).rejects.toThrow(
      "Solo un producto archivado puede restaurarse.",
    );
  });

  it("rechaza un producto inexistente", async () => {
    const repository =
      new InMemoryProductRepository();

    const useCase =
      new RestoreProduct(repository);

    await expect(
      useCase.execute("missing-product"),
    ).rejects.toThrowError(
      new NotFoundError(
        'No se encontró el producto "missing-product".',
      ),
    );
  });
});
