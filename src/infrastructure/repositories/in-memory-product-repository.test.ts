import { describe, expect, it } from "vitest";
import {
  Product,
  type ProductProps,
} from "../../core/entities/product";
import { ConflictError } from "../../core/errors/conflict-error";
import { NotFoundError } from "../../core/errors/not-found-error";
import { InMemoryProductRepository } from "./in-memory-product-repository";

function createProduct(
  overrides: Partial<ProductProps> = {},
): Product {
  const now = new Date("2026-07-18T12:00:00.000Z");

  return new Product({
    id: "product-1",
    name: "Vestido Aurora",
    slug: "vestido-aurora",
    shortDescription: "Vestido elegante sobre pedido.",
    description: "Vestido confeccionado en diferentes tallas.",
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
    ...overrides,
  });
}

describe("InMemoryProductRepository", () => {
  it("crea y encuentra un producto por identificador", async () => {
    const repository = new InMemoryProductRepository();
    const product = createProduct();

    await repository.create(product);

    const storedProduct = await repository.findById(
      "product-1",
    );

    expect(storedProduct).toBe(product);
  });

  it("encuentra un producto por slug", async () => {
    const repository = new InMemoryProductRepository();
    const product = createProduct();

    await repository.create(product);

    const storedProduct = await repository.findBySlug(
      "vestido-aurora",
    );

    expect(storedProduct).toBe(product);
  });

  it("impide crear dos productos con el mismo slug", async () => {
    const repository = new InMemoryProductRepository();

    await repository.create(createProduct());

    const repeatedProduct = createProduct({
      id: "product-2",
    });

    await expect(
      repository.create(repeatedProduct),
    ).rejects.toThrowError(
      new ConflictError(
        'Ya existe un producto con el slug "vestido-aurora".',
      ),
    );
  });

  it("lista únicamente los productos publicados", async () => {
    const repository = new InMemoryProductRepository();

    const draftProduct = createProduct();

    const publishedProduct = createProduct({
      id: "product-2",
      name: "Blusa Serena",
      slug: "blusa-serena",
      status: "published",
    });

    await repository.create(draftProduct);
    await repository.create(publishedProduct);

    const products = await repository.listPublished();

    expect(products).toHaveLength(1);
    expect(products[0]?.id).toBe("product-2");
  });

  it("elimina definitivamente un producto", async () => {
    const repository = new InMemoryProductRepository();
    const product = createProduct();

    await repository.create(product);
    await repository.deletePermanently(product.id);

    const storedProduct = await repository.findById(product.id);

    expect(storedProduct).toBeNull();
  });

  it("rechaza eliminar un producto inexistente", async () => {
    const repository = new InMemoryProductRepository();

    await expect(
      repository.deletePermanently("missing-product"),
    ).rejects.toThrowError(
      new NotFoundError(
        'No se encontró el producto "missing-product".',
      ),
    );
  });
});