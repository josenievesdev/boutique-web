import { describe, expect, it } from "vitest";
import { Product } from "../entities/product";
import type { IdGenerator } from "../ports/id-generator";
import { InMemoryProductRepository } from "../../infrastructure/repositories/in-memory-product-repository";
import { InMemoryProductImageStorage } from "../../infrastructure/storage/in-memory-product-image-storage";
import { UploadProductImage } from "./upload-product-image";

class FixedImageIdGenerator
  implements IdGenerator
{
  generate(): string {
    return "image-generated-1";
  }
}

function createProduct(): Product {
  const now = new Date(
    "2026-07-19T01:50:00.000Z",
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

describe("UploadProductImage", () => {
  it("sube el archivo y guarda sus metadatos", async () => {
    const repository =
      new InMemoryProductRepository();

    const storage =
      new InMemoryProductImageStorage();

    const product = createProduct();

    await repository.create(product);

    const useCase = new UploadProductImage(
      repository,
      storage,
      new FixedImageIdGenerator(),
    );

    const result = await useCase.execute({
      productId: product.id,
      extension: "webp",
      contentType: "image/webp",
      data: new Uint8Array([1, 2, 3]).buffer,
      altText: "Vestido visto de frente",
      position: 1,
      isCover: true,
    });

    expect(result.imageId).toBe(
      "image-generated-1",
    );

    expect(result.path).toBe(
      "product-1/image-generated-1.webp",
    );

    expect(result.product.imageCount).toBe(1);
    expect(storage.has(result.path)).toBe(true);

    const storedProduct =
      await repository.findById(product.id);

    expect(storedProduct?.imageCount).toBe(1);
    expect(storedProduct?.images[0]?.path).toBe(
      result.path,
    );
  });

  it("elimina el archivo si no puede guardar los metadatos", async () => {
    const repository =
      new InMemoryProductRepository();

    const storage =
      new InMemoryProductImageStorage();

    const product = createProduct();

    product.addImage({
      id: "existing-image",
      path: "product-1/existing.webp",
      altText: "Imagen existente",
      position: 1,
      isCover: true,
    });

    await repository.create(product);

    const useCase = new UploadProductImage(
      repository,
      storage,
      new FixedImageIdGenerator(),
    );

    await expect(
      useCase.execute({
        productId: product.id,
        extension: "webp",
        contentType: "image/webp",
        data: new Uint8Array([1, 2, 3]).buffer,
        altText: "Nueva imagen",
        position: 1,
        isCover: false,
      }),
    ).rejects.toThrow(
      "Ya existe una imagen en la posición 1.",
    );

    expect(storage.count()).toBe(0);
  });
});