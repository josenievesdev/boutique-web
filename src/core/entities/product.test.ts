import { describe, expect, it } from "vitest";
import {
  Product,
  type ProductProps,
} from "./product";
import { DomainError } from "../errors/domain-error";

function createProduct(
  overrides: Partial<ProductProps> = {},
): Product {
  const now = new Date("2026-07-18T12:00:00.000Z");

  return new Product({
    id: "product-1",
    name: "Vestido Aurora",
    slug: "vestido-aurora",
    shortDescription: "Vestido elegante sobre pedido.",
    description:
      "Vestido confeccionado en diferentes tallas y colores.",
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

describe("Product", () => {
  it("crea un producto inicialmente como borrador", () => {
    const product = createProduct();

    expect(product.name).toBe("Vestido Aurora");
    expect(product.priceInPesos).toBe(180_000);
    expect(product.status).toBe("draft");
  });

  it("rechaza un precio negativo", () => {
    expect(() => {
      createProduct({
        priceInPesos: -10_000,
      });
    }).toThrowError(
      new DomainError("El precio no puede ser negativo."),
    );
  });

  it("rechaza un precio con decimales", () => {
    expect(() => {
      createProduct({
        priceInPesos: 180_000.5,
      });
    }).toThrowError(
      new DomainError(
        "El precio debe expresarse en pesos enteros.",
      ),
    );
  });

  it("impide publicar un producto sin categoría", () => {
    const product = createProduct({
      categoryId: null,
    });

    expect(() => product.publish()).toThrow(
      "El producto necesita una categoría antes de publicarse.",
    );
  });

  it("impide publicar un producto sin imágenes", () => {
    const product = createProduct();

    expect(() => product.publish()).toThrow(
      "El producto necesita al menos una imagen antes de publicarse.",
    );
  });

  it("publica un producto válido", () => {
    const product = createProduct();

    product.addImage({
      id: "image-1",
      path: "products/product-1/cover.webp",
      altText: "Vestido Aurora visto de frente",
      position: 1,
      isCover: true,
    });

    product.publish();

    expect(product.status).toBe("published");
    expect(product.imageCount).toBe(1);
  });

  it("mantiene una sola imagen como portada", () => {
    const product = createProduct();

    product.addImage({
      id: "image-1",
      path: "products/product-1/front.webp",
      altText: "Vista frontal del vestido",
      position: 1,
      isCover: true,
    });

    product.addImage({
      id: "image-2",
      path: "products/product-1/back.webp",
      altText: "Vista posterior del vestido",
      position: 2,
      isCover: true,
    });

    const coverImages = product.images.filter(
      (image) => image.isCover,
    );

    expect(coverImages).toHaveLength(1);
    expect(coverImages[0]?.id).toBe("image-2");
  });

  it("impide repetir la posición de una imagen", () => {
    const product = createProduct();

    product.addImage({
      id: "image-1",
      path: "products/product-1/front.webp",
      altText: "Vista frontal del vestido",
      position: 1,
      isCover: true,
    });

    expect(() => {
      product.addImage({
        id: "image-2",
        path: "products/product-1/back.webp",
        altText: "Vista posterior del vestido",
        position: 1,
        isCover: false,
      });
    }).toThrow("Ya existe una imagen en la posición 1.");
  });
});

it("elimina una imagen del producto", () => {
  const product = createProduct();

  product.addImage({
    id: "image-1",
    path: "products/product-1/front.webp",
    altText: "Vista frontal",
    position: 1,
    isCover: true,
  });

  const removedImage =
    product.removeImage("image-1");

  expect(removedImage.id).toBe("image-1");
  expect(product.imageCount).toBe(0);
});

it("asigna una nueva portada al eliminar la portada actual", () => {
  const product = createProduct();

  product.addImage({
    id: "image-1",
    path: "products/product-1/front.webp",
    altText: "Vista frontal",
    position: 1,
    isCover: true,
  });

  product.addImage({
    id: "image-2",
    path: "products/product-1/back.webp",
    altText: "Vista posterior",
    position: 2,
    isCover: false,
  });

  product.removeImage("image-1");

  expect(product.images).toHaveLength(1);
  expect(product.images[0]?.id).toBe("image-2");
  expect(product.images[0]?.isCover).toBe(true);
});

it("permite cambiar la imagen de portada", () => {
  const product = createProduct();

  product.addImage({
    id: "image-1",
    path: "products/product-1/front.webp",
    altText: "Vista frontal",
    position: 1,
    isCover: true,
  });

  product.addImage({
    id: "image-2",
    path: "products/product-1/back.webp",
    altText: "Vista posterior",
    position: 2,
    isCover: false,
  });

  product.setCoverImage("image-2");

  expect(
    product.images.find(
      (image) => image.id === "image-1",
    )?.isCover,
  ).toBe(false);

  expect(
    product.images.find(
      (image) => image.id === "image-2",
    )?.isCover,
  ).toBe(true);
});

it("rechaza eliminar una imagen inexistente", () => {
  const product = createProduct();

  expect(() => {
    product.removeImage("missing-image");
  }).toThrow(
    'No se encontró la imagen "missing-image".',
  );
});

