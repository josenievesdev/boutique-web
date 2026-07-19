import { describe, expect, it } from "vitest";
import { Product } from "../entities/product";
import { NotFoundError } from "../errors/not-found-error";
import { InMemoryProductRepository } from "../../infrastructure/repositories/in-memory-product-repository";
import { GetAdminProduct } from "./get-admin-product";

function createProduct(): Product {
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
    status: "draft",
    featured: false,
    customizable: true,
    madeToOrder: true,
    preparationDays: 8,
    images: [],
    createdAt: now,
    updatedAt: now,
  });
}

describe("GetAdminProduct", () => {
  it("devuelve un producto existente", async () => {
    const repository =
      new InMemoryProductRepository();

    const product = createProduct();

    await repository.create(product);

    const useCase = new GetAdminProduct(
      repository,
    );

    const result = await useCase.execute(
      product.id,
    );

    expect(result).toBe(product);
  });

  it("rechaza consultar un producto inexistente", async () => {
    const repository =
      new InMemoryProductRepository();

    const useCase = new GetAdminProduct(
      repository,
    );

    await expect(
      useCase.execute("missing-product"),
    ).rejects.toThrowError(
      new NotFoundError(
        'No se encontró el producto "missing-product".',
      ),
    );
  });
});