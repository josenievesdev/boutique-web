import { describe, expect, it } from "vitest";
import { Product } from "../entities/product";
import { NotFoundError } from "../errors/not-found-error";
import { InMemoryProductRepository } from "../../infrastructure/repositories/in-memory-product-repository";
import { HideProduct } from "./hide-product";

function createPublishedProduct(): Product {
  const now = new Date("2026-07-18T12:00:00.000Z");

  return new Product({
    id: "product-1",
    name: "Vestido Aurora",
    slug: "vestido-aurora",
    shortDescription: "Vestido elegante.",
    description: "Vestido confeccionado sobre pedido.",
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
        path: "products/product-1/cover.webp",
        altText: "Vista frontal",
        position: 1,
        isCover: true,
      },
    ],
    createdAt: now,
    updatedAt: now,
  });
}

describe("HideProduct", () => {
  it("oculta un producto publicado", async () => {
    const repository = new InMemoryProductRepository();
    const product = createPublishedProduct();

    await repository.create(product);

    const useCase = new HideProduct(repository);

    const hiddenProduct = await useCase.execute(product.id);

    expect(hiddenProduct.status).toBe("hidden");

    const publicProducts =
      await repository.listPublished();

    expect(publicProducts).toHaveLength(0);
  });

  it("rechaza ocultar un producto inexistente", async () => {
    const repository = new InMemoryProductRepository();
    const useCase = new HideProduct(repository);

    await expect(
      useCase.execute("missing-product"),
    ).rejects.toThrowError(
      new NotFoundError(
        'No se encontró el producto "missing-product".',
      ),
    );
  });
});
