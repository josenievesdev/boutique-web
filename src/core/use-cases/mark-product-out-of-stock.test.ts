import { describe, expect, it } from "vitest";
import { Product } from "../entities/product";
import { NotFoundError } from "../errors/not-found-error";
import { InMemoryProductRepository } from "../../infrastructure/repositories/in-memory-product-repository";
import { MarkProductOutOfStock } from "./mark-product-out-of-stock";

function createPublishedProduct(): Product {
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
    status: "published",
    featured: false,
    customizable: true,
    madeToOrder: true,
    preparationDays: 8,
    images: [
      {
        id: "image-1",
        path: "product-1/cover.webp",
        altText: "Vista frontal",
        position: 1,
        isCover: true,
      },
    ],
    createdAt: now,
    updatedAt: now,
  });
}

describe("MarkProductOutOfStock", () => {
  it("marca y guarda un producto como agotado", async () => {
    const repository =
      new InMemoryProductRepository();

    const product =
      createPublishedProduct();

    await repository.create(product);

    const useCase =
      new MarkProductOutOfStock(repository);

    const updatedProduct =
      await useCase.execute(product.id);

    expect(updatedProduct.status).toBe(
      "out_of_stock",
    );

    const storedProduct =
      await repository.findById(product.id);

    expect(storedProduct?.status).toBe(
      "out_of_stock",
    );
  });

  it("rechaza un producto inexistente", async () => {
    const repository =
      new InMemoryProductRepository();

    const useCase =
      new MarkProductOutOfStock(repository);

    await expect(
      useCase.execute("missing-product"),
    ).rejects.toThrowError(
      new NotFoundError(
        'No se encontró el producto "missing-product".',
      ),
    );
  });
});
