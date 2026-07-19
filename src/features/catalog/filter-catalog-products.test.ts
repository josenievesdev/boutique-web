import { describe, expect, it } from "vitest";
import { Product } from "../../core/entities/product";
import { filterCatalogProducts } from "./filter-catalog-products";

interface CreateProductOptions {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  featured?: boolean;
  updatedAt?: Date;
}

function createProduct({
  id,
  name,
  slug,
  categoryId,
  featured = false,
  updatedAt = new Date(
    "2026-07-19T12:00:00.000Z",
  ),
}: CreateProductOptions): Product {
  return new Product({
    id,
    name,
    slug,
    shortDescription:
      `Descripción corta de ${name}.`,
    description:
      `Descripción completa de ${name}.`,
    priceInPesos: 120_000,
    previousPriceInPesos: null,
    categoryId,
    collectionId: null,
    status: "published",
    featured,
    customizable: false,
    madeToOrder: false,
    preparationDays: null,
    images: [
      {
        id: `${id}-image`,
        path: `${id}/cover.webp`,
        altText: name,
        position: 1,
        isCover: true,
      },
    ],
    createdAt: updatedAt,
    updatedAt,
  });
}

describe("filterCatalogProducts", () => {
  const products = [
    createProduct({
      id: "product-1",
      name: "Vestido Aurora",
      slug: "vestido-aurora",
      categoryId: "category-dresses",
    }),
    createProduct({
      id: "product-2",
      name: "Blusa Magnolia",
      slug: "blusa-magnolia",
      categoryId: "category-blouses",
    }),
  ];

  it("filtra productos por texto", () => {
    const result = filterCatalogProducts(
      products,
      {
        searchTerm: "magnolia",
        categoryId: null,
      },
    );

    expect(result).toHaveLength(1);

    expect(result[0]?.name).toBe(
      "Blusa Magnolia",
    );
  });

  it("filtra productos por categoría", () => {
    const result = filterCatalogProducts(
      products,
      {
        searchTerm: "",
        categoryId: "category-dresses",
      },
    );

    expect(result).toHaveLength(1);

    expect(result[0]?.name).toBe(
      "Vestido Aurora",
    );
  });

  it("muestra los productos destacados primero", () => {
    const regularProduct = createProduct({
      id: "product-regular",
      name: "Producto regular",
      slug: "producto-regular",
      categoryId: "category-dresses",
      updatedAt: new Date(
        "2026-07-21T12:00:00.000Z",
      ),
    });

    const featuredProduct = createProduct({
      id: "product-featured",
      name: "Producto destacado",
      slug: "producto-destacado",
      categoryId: "category-dresses",
      featured: true,
      updatedAt: new Date(
        "2026-07-19T12:00:00.000Z",
      ),
    });

    const result = filterCatalogProducts(
      [
        regularProduct,
        featuredProduct,
      ],
      {
        searchTerm: "",
        categoryId: null,
      },
    );

    expect(result[0]?.name).toBe(
      "Producto destacado",
    );
  });
});