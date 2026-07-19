import { describe, expect, it } from "vitest";
import { Product } from "../entities/product";
import { NotFoundError } from "../errors/not-found-error";
import { InMemoryProductRepository } from "../../infrastructure/repositories/in-memory-product-repository";
import { SetProductCoverImage } from "./set-product-cover-image";

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
    images: [
      {
        id: "image-1",
        path: "product-1/front.webp",
        altText: "Vista frontal",
        position: 1,
        isCover: true,
      },
      {
        id: "image-2",
        path: "product-1/back.webp",
        altText: "Vista posterior",
        position: 2,
        isCover: false,
      },
    ],
    createdAt: now,
    updatedAt: now,
  });
}

describe("SetProductCoverImage", () => {
  it("cambia y guarda la imagen de portada", async () => {
    const repository =
      new InMemoryProductRepository();

    const product = createProduct();

    await repository.create(product);

    const useCase =
      new SetProductCoverImage(repository);

    const updatedProduct =
      await useCase.execute(
        product.id,
        "image-2",
      );

    expect(
      updatedProduct.images.find(
        (image) => image.id === "image-1",
      )?.isCover,
    ).toBe(false);

    expect(
      updatedProduct.images.find(
        (image) => image.id === "image-2",
      )?.isCover,
    ).toBe(true);

    const storedProduct =
      await repository.findById(product.id);

    expect(
      storedProduct?.images.find(
        (image) => image.id === "image-2",
      )?.isCover,
    ).toBe(true);
  });

  it("rechaza un producto inexistente", async () => {
    const repository =
      new InMemoryProductRepository();

    const useCase =
      new SetProductCoverImage(repository);

    await expect(
      useCase.execute(
        "missing-product",
        "image-1",
      ),
    ).rejects.toThrowError(
      new NotFoundError(
        'No se encontró el producto "missing-product".',
      ),
    );
  });

  it("rechaza una imagen inexistente", async () => {
    const repository =
      new InMemoryProductRepository();

    const product = createProduct();

    await repository.create(product);

    const useCase =
      new SetProductCoverImage(repository);

    await expect(
      useCase.execute(
        product.id,
        "missing-image",
      ),
    ).rejects.toThrow(
      'No se encontró la imagen "missing-image".',
    );
  });
});