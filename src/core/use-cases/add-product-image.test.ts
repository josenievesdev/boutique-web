import { describe, expect, it } from "vitest";
import { Product } from "../entities/product";
import { NotFoundError } from "../errors/not-found-error";
import { InMemoryProductRepository } from "../../infrastructure/repositories/in-memory-product-repository";
import { AddProductImage } from "./add-product-image";

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

describe("AddProductImage", () => {
  it("agrega y guarda una imagen", async () => {
    const repository = new InMemoryProductRepository();
    const product = createProduct();

    await repository.create(product);

    const useCase = new AddProductImage(repository);

    const updatedProduct = await useCase.execute(
      product.id,
      {
        id: "image-1",
        path: "products/product-1/cover.webp",
        altText: "Vestido Aurora visto de frente",
        position: 1,
        isCover: true,
      },
    );

    expect(updatedProduct.imageCount).toBe(1);
    expect(updatedProduct.images[0]?.isCover).toBe(true);

    const storedProduct = await repository.findById(
      product.id,
    );

    expect(storedProduct?.imageCount).toBe(1);
  });

  it("rechaza agregar una imagen a un producto inexistente", async () => {
    const repository = new InMemoryProductRepository();
    const useCase = new AddProductImage(repository);

    await expect(
      useCase.execute("missing-product", {
        id: "image-1",
        path: "products/missing/cover.webp",
        altText: "Imagen de prueba",
        position: 1,
        isCover: true,
      }),
    ).rejects.toThrowError(
      new NotFoundError(
        'No se encontró el producto "missing-product".',
      ),
    );
  });

  it("mantiene las validaciones de posición de las imágenes", async () => {
    const repository = new InMemoryProductRepository();
    const product = createProduct();

    await repository.create(product);

    const useCase = new AddProductImage(repository);

    await useCase.execute(product.id, {
      id: "image-1",
      path: "products/product-1/front.webp",
      altText: "Vista frontal",
      position: 1,
      isCover: true,
    });

    await expect(
      useCase.execute(product.id, {
        id: "image-2",
        path: "products/product-1/back.webp",
        altText: "Vista posterior",
        position: 1,
        isCover: false,
      }),
    ).rejects.toThrow(
      "Ya existe una imagen en la posición 1.",
    );
  });
});
