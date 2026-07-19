import { describe, expect, it } from "vitest";
import { Product } from "../entities/product";
import { InMemoryProductRepository } from "../../infrastructure/repositories/in-memory-product-repository";
import { InMemoryProductImageStorage } from "../../infrastructure/storage/in-memory-product-image-storage";
import { DeleteProductPermanently } from "./delete-product-permanently";

describe("DeleteProductPermanently", () => {
  it("elimina el producto y sus archivos", async () => {
    const repository =
      new InMemoryProductRepository();

    const storage =
      new InMemoryProductImageStorage();

    const now = new Date(
      "2026-07-19T01:50:00.000Z",
    );

    const storedImage = await storage.upload({
      productId: "product-1",
      imageId: "image-1",
      extension: "webp",
      contentType: "image/webp",
      data: new Uint8Array([1, 2, 3]).buffer,
    });

    const product = new Product({
      id: "product-1",
      name: "Vestido Aurora",
      slug: "vestido-aurora",
      shortDescription: "Vestido elegante.",
      description: "Confeccionado sobre pedido.",
      priceInPesos: 180_000,
      previousPriceInPesos: null,
      categoryId: "category-dresses",
      collectionId: null,
      status: "archived",
      featured: false,
      customizable: true,
      madeToOrder: true,
      preparationDays: 8,
      images: [
        {
          id: "image-1",
          path: storedImage.path,
          altText: "Vista frontal",
          position: 1,
          isCover: true,
        },
      ],
      createdAt: now,
      updatedAt: now,
    });

    await repository.create(product);

    const useCase =
      new DeleteProductPermanently(
        repository,
        storage,
      );

    await useCase.execute(product.id);

    expect(
      await repository.findById(product.id),
    ).toBeNull();

    expect(storage.has(storedImage.path)).toBe(
      false,
    );
  });
});