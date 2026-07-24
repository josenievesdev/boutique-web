import { describe, expect, it } from "vitest";
import { Product } from "../entities/product";
import { NotFoundError } from "../errors/not-found-error";
import { InMemoryProductRepository } from "../../infrastructure/repositories/in-memory-product-repository";
import { ArchiveProduct } from "./archive-product";

function createProduct(): Product {
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
    status: "hidden",
    featured: false,
    customizable: true,
    madeToOrder: true,
    preparationDays: 8,
    images: [],
    createdAt: now,
    updatedAt: now,
  });
}

describe("ArchiveProduct", () => {
  it("archiva un producto", async () => {
    const repository = new InMemoryProductRepository();
    const product = createProduct();

    await repository.create(product);

    const useCase = new ArchiveProduct(repository);

    const archivedProduct = await useCase.execute(
      product.id,
    );

    expect(archivedProduct.status).toBe("archived");

    const storedProduct = await repository.findById(
      product.id,
    );

    expect(storedProduct?.status).toBe("archived");
  });

  it("rechaza archivar un producto inexistente", async () => {
    const repository = new InMemoryProductRepository();
    const useCase = new ArchiveProduct(repository);

    await expect(
      useCase.execute("missing-product"),
    ).rejects.toThrowError(
      new NotFoundError(
        'No se encontró el producto "missing-product".',
      ),
    );
  });
});
