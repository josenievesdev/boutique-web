import { describe, expect, it } from "vitest";
import { Product } from "../entities/product";
import { NotFoundError } from "../errors/not-found-error";
import { InMemoryProductRepository } from "../../infrastructure/repositories/in-memory-product-repository";
import { PublishProduct } from "./publish-product";

function createPublishableProduct(): Product {
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
    status: "draft",
    featured: false,
    customizable: true,
    madeToOrder: true,
    preparationDays: 8,
    images: [
      {
        id: "image-1",
        path: "products/product-1/cover.webp",
        altText: "Vestido Aurora visto de frente",
        position: 1,
        isCover: true,
      },
    ],
    createdAt: now,
    updatedAt: now,
  });
}

describe("PublishProduct", () => {
  it("publica y guarda un producto válido", async () => {
    const repository = new InMemoryProductRepository();
    const product = createPublishableProduct();

    await repository.create(product);

    const useCase = new PublishProduct(repository);

    const publishedProduct = await useCase.execute(
      product.id,
    );

    expect(publishedProduct.status).toBe("published");

    const storedProduct = await repository.findById(
      product.id,
    );

    expect(storedProduct?.status).toBe("published");
  });

  it("rechaza publicar un producto inexistente", async () => {
    const repository = new InMemoryProductRepository();
    const useCase = new PublishProduct(repository);

    await expect(
      useCase.execute("missing-product"),
    ).rejects.toThrowError(
      new NotFoundError(
        'No se encontró el producto "missing-product".',
      ),
    );
  });

  it("mantiene las validaciones del dominio", async () => {
    const repository = new InMemoryProductRepository();
    const product = createPublishableProduct();

    const productWithoutImages = new Product({
      ...product.toObject(),
      images: [],
    });

    await repository.create(productWithoutImages);

    const useCase = new PublishProduct(repository);

    await expect(
      useCase.execute(productWithoutImages.id),
    ).rejects.toThrow(
      "El producto necesita al menos una imagen antes de publicarse.",
    );
  });
});