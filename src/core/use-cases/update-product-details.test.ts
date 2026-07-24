import { describe, expect, it } from "vitest";
import { Product } from "../entities/product";
import { ConflictError } from "../errors/conflict-error";
import { DomainError } from "../errors/domain-error";
import { NotFoundError } from "../errors/not-found-error";
import type { Clock } from "../ports/clock";
import { InMemoryProductRepository } from "../../infrastructure/repositories/in-memory-product-repository";
import { UpdateProductDetails } from "./update-product-details";

class FixedClock implements Clock {
  now(): Date {
    return new Date(
      "2026-07-20T15:30:00.000Z",
    );
  }
}

function createProduct(
  overrides: Partial<
    ConstructorParameters<typeof Product>[0]
  > = {},
): Product {
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
    status: "draft",
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
    ...overrides,
  });
}

function createUseCase(
  repository =
    new InMemoryProductRepository(),
): {
  repository: InMemoryProductRepository;
  useCase: UpdateProductDetails;
} {
  return {
    repository,
    useCase: new UpdateProductDetails(
      repository,
      new FixedClock(),
    ),
  };
}

describe("UpdateProductDetails", () => {
  it("actualiza la información y conserva el ciclo de vida", async () => {
    const { repository, useCase } =
      createUseCase();

    const product = createProduct({
      status: "published",
    });

    await repository.create(product);

    const updatedProduct =
      await useCase.execute({
        productId: product.id,
        name: " Vestido Aurora Renovado ",
        slug: " VESTIDO-AURORA-RENOVADO ",
        moldCode: " AURORA-03 ",
        shortDescription:
          " Nueva descripción corta. ",
        description:
          " Nueva descripción completa. ",
        priceInPesos: 195_000,
        categoryId: "category-dresses",
        featured: true,
        customizable: false,
        madeToOrder: true,
        preparationDays: 10,
      });

    const data = updatedProduct.toObject();

    expect(data.name).toBe(
      "Vestido Aurora Renovado",
    );

    expect(data.slug).toBe(
      "vestido-aurora-renovado",
    );

    expect(data.moldCode).toBe("AURORA-03");

    expect(data.shortDescription).toBe(
      "Nueva descripción corta.",
    );

    expect(data.description).toBe(
      "Nueva descripción completa.",
    );

    expect(data.priceInPesos).toBe(195_000);
    expect(data.featured).toBe(true);
    expect(data.customizable).toBe(false);
    expect(data.preparationDays).toBe(10);

    expect(data.status).toBe("published");
    expect(data.images).toHaveLength(1);

    expect(data.createdAt.toISOString()).toBe(
      "2026-07-19T12:00:00.000Z",
    );

    expect(data.updatedAt.toISOString()).toBe(
      "2026-07-20T15:30:00.000Z",
    );

    const storedProduct =
      await repository.findById(product.id);

    expect(storedProduct).toBe(updatedProduct);
  });

  it("permite conservar el mismo slug", async () => {
    const { repository, useCase } =
      createUseCase();

    const product = createProduct();

    await repository.create(product);

    const updatedProduct =
      await useCase.execute({
        productId: product.id,
        name: "Vestido Aurora",
        slug: "vestido-aurora",
        moldCode: null,
        shortDescription: "Vestido actualizado.",
        description:
          "Nueva descripción del vestido.",
        priceInPesos: 185_000,
        categoryId: "category-dresses",
        featured: false,
        customizable: true,
        madeToOrder: true,
        preparationDays: 8,
      });

    expect(updatedProduct.slug).toBe(
      "vestido-aurora",
    );
  });

  it("permite borrar el código de molde", async () => {
    const { repository, useCase } =
      createUseCase();

    const product = createProduct({
      moldCode: "V-024",
    });

    await repository.create(product);

    const updatedProduct =
      await useCase.execute({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        moldCode: "   ",
        shortDescription: "Vestido actualizado.",
        description:
          "Nueva descripción del vestido.",
        priceInPesos: product.priceInPesos,
        categoryId: "category-dresses",
        featured: false,
        customizable: true,
        madeToOrder: true,
        preparationDays: 8,
      });

    expect(updatedProduct.moldCode).toBeNull();
  });

  it("rechaza utilizar el slug de otro producto", async () => {
    const { repository, useCase } =
      createUseCase();

    const firstProduct = createProduct();

    const secondProduct = createProduct({
      id: "product-2",
      name: "Blusa Magnolia",
      slug: "blusa-magnolia",
    });

    await repository.create(firstProduct);
    await repository.create(secondProduct);

    await expect(
      useCase.execute({
        productId: firstProduct.id,
        name: "Vestido Aurora",
        slug: "BLUSA-MAGNOLIA",
        moldCode: null,
        shortDescription: "Vestido actualizado.",
        description:
          "Nueva descripción del vestido.",
        priceInPesos: 185_000,
        categoryId: "category-dresses",
        featured: false,
        customizable: true,
        madeToOrder: true,
        preparationDays: 8,
      }),
    ).rejects.toThrowError(
      new ConflictError(
        'Ya existe un producto con el slug "blusa-magnolia".',
      ),
    );
  });

  it("impide quitar la categoría de un producto publicado", async () => {
    const { repository, useCase } =
      createUseCase();

    const product = createProduct({
      status: "published",
    });

    await repository.create(product);

    await expect(
      useCase.execute({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        moldCode: null,
        shortDescription: "Descripción corta.",
        description: "Descripción completa.",
        priceInPesos: product.priceInPesos,
        categoryId: null,
        featured: false,
        customizable: true,
        madeToOrder: true,
        preparationDays: 8,
      }),
    ).rejects.toThrowError(
      new DomainError(
        "Un producto publicado necesita una categoría.",
      ),
    );
  });

  it("rechaza editar un producto inexistente", async () => {
    const { useCase } = createUseCase();

    await expect(
      useCase.execute({
        productId: "missing-product",
        name: "Producto inexistente",
        slug: "producto-inexistente",
        moldCode: null,
        shortDescription: "Descripción corta.",
        description: "Descripción completa.",
        priceInPesos: 100_000,
        categoryId: null,
        featured: false,
        customizable: false,
        madeToOrder: false,
        preparationDays: null,
      }),
    ).rejects.toThrowError(
      new NotFoundError(
        'No se encontró el producto "missing-product".',
      ),
    );
  });
});
