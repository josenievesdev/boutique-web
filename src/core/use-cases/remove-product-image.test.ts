import { describe, expect, it } from "vitest";
import { Product } from "../entities/product";
import { InMemoryProductRepository } from "../../infrastructure/repositories/in-memory-product-repository";
import { InMemoryProductImageStorage } from "../../infrastructure/storage/in-memory-product-image-storage";
import { RemoveProductImage } from "./remove-product-image";

describe("RemoveProductImage", () => {
  it("elimina los metadatos y el archivo", async () => {
    const repository =
      new InMemoryProductRepository();

    const storage =
      new InMemoryProductImageStorage();

    const now = new Date(
      "2026-07-19T01:50:00.000Z",
    );

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
      moldCode: null,
      status: "draft",
      featured: false,
      customizable: true,
      madeToOrder: true,
      preparationDays: 8,
      images: [],
      createdAt: now,
      updatedAt: now,
    });

    await repository.create(product);

    const storedImage = await storage.upload({
      productId: product.id,
      imageId: "image-1",
      extension: "png",
      contentType: "image/png",
      data: new Uint8Array([1, 2, 3]).buffer,
    });

    product.addImage({
      id: "image-1",
      path: storedImage.path,
      altText: "Vista frontal",
      position: 1,
      isCover: true,
    });

    await repository.update(product);

    const useCase = new RemoveProductImage(
      repository,
      storage,
    );

    const updatedProduct =
      await useCase.execute(
        product.id,
        "image-1",
      );

    expect(updatedProduct.imageCount).toBe(0);
    expect(storage.has(storedImage.path)).toBe(
      false,
    );
  });
});
