import { describe, expect, it } from "vitest";
import { ConflictError } from "../errors/conflict-error";
import { DomainError } from "../errors/domain-error";
import type { Clock } from "../ports/clock";
import type { IdGenerator } from "../ports/id-generator";
import { InMemoryProductRepository } from "../../infrastructure/repositories/in-memory-product-repository";
import { CreateProduct } from "./create-product";

class FixedIdGenerator implements IdGenerator {
  generate(): string {
    return "generated-product-id";
  }
}

class FixedClock implements Clock {
  now(): Date {
    return new Date("2026-07-18T15:30:00.000Z");
  }
}

function createUseCase(
  repository = new InMemoryProductRepository(),
): {
  repository: InMemoryProductRepository;
  useCase: CreateProduct;
} {
  return {
    repository,
    useCase: new CreateProduct(
      repository,
      new FixedIdGenerator(),
      new FixedClock(),
    ),
  };
}

describe("CreateProduct", () => {
  it("crea un producto como borrador", async () => {
    const { repository, useCase } = createUseCase();

    const product = await useCase.execute({
      name: " Vestido Aurora ",
      slug: " VESTIDO-AURORA ",
      moldCode: " V-024 ",
      shortDescription: " Vestido elegante. ",
      description: " Confeccionado sobre pedido. ",
      priceInPesos: 180_000,
      categoryId: "category-dresses",
      customizable: true,
      madeToOrder: true,
      preparationDays: 8,
    });

    expect(product.id).toBe("generated-product-id");
    expect(product.name).toBe("Vestido Aurora");
    expect(product.slug).toBe("vestido-aurora");
    expect(product.moldCode).toBe("V-024");
    expect(product.status).toBe("draft");
    expect(product.imageCount).toBe(0);

    const storedProduct = await repository.findById(
      "generated-product-id",
    );

    expect(storedProduct).toBe(product);
  });

  it("aplica los valores predeterminados", async () => {
    const { useCase } = createUseCase();

    const product = await useCase.execute({
      name: "Blusa Serena",
      slug: "blusa-serena",
      shortDescription: "Blusa casual.",
      description: "Disponible sobre pedido.",
      priceInPesos: 75_000,
    });

    const productData = product.toObject();

    expect(productData.previousPriceInPesos).toBeNull();
    expect(productData.categoryId).toBeNull();
    expect(productData.collectionId).toBeNull();
    expect(productData.moldCode).toBeNull();
    expect(productData.featured).toBe(false);
    expect(productData.customizable).toBe(false);
    expect(productData.madeToOrder).toBe(false);
    expect(productData.preparationDays).toBeNull();
  });

  it("rechaza un código de molde de más de 40 caracteres", async () => {
    const { useCase } = createUseCase();

    await expect(
      useCase.execute({
        name: "Blusa Serena",
        slug: "blusa-serena",
        moldCode: "M".repeat(41),
        shortDescription: "Blusa casual.",
        description: "Disponible sobre pedido.",
        priceInPesos: 75_000,
      }),
    ).rejects.toThrowError(
      new DomainError(
        "El código de molde no puede superar los 40 caracteres.",
      ),
    );
  });

  it("impide crear productos con un slug repetido", async () => {
    const repository = new InMemoryProductRepository();

    const firstUseCase = new CreateProduct(
      repository,
      new FixedIdGenerator(),
      new FixedClock(),
    );

    await firstUseCase.execute({
      name: "Vestido Aurora",
      slug: "vestido-aurora",
      shortDescription: "Vestido elegante.",
      description: "Confeccionado sobre pedido.",
      priceInPesos: 180_000,
    });

    const secondUseCase = new CreateProduct(
      repository,
      {
        generate: () => "second-product-id",
      },
      new FixedClock(),
    );

    await expect(
      secondUseCase.execute({
        name: "Otro vestido",
        slug: "VESTIDO-AURORA",
        shortDescription: "Otra descripción.",
        description: "Otro producto.",
        priceInPesos: 200_000,
      }),
    ).rejects.toThrowError(
      new ConflictError(
        'Ya existe un producto con el slug "vestido-aurora".',
      ),
    );
  });
});
