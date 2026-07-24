import { describe, expect, it } from "vitest";
import {
  Product,
  type ProductStatus,
} from "../../../core/entities/product";
import { filterAdminProducts } from "./filter-admin-products";

interface CreateProductOptions {
  id: string;
  name: string;
  slug: string;
  moldCode: string | null;
  status?: ProductStatus;
}

function createProduct({
  id,
  name,
  slug,
  moldCode,
  status = "draft",
}: CreateProductOptions): Product {
  const now = new Date(
    "2026-07-24T12:00:00.000Z",
  );

  return new Product({
    id,
    name,
    slug,
    moldCode,
    shortDescription: `Descripción corta de ${name}.`,
    description: `Descripción completa de ${name}.`,
    priceInPesos: 120_000,
    previousPriceInPesos: null,
    categoryId: null,
    collectionId: null,
    status,
    featured: false,
    customizable: false,
    madeToOrder: false,
    preparationDays: null,
    images: [],
    createdAt: now,
    updatedAt: now,
  });
}

describe("filterAdminProducts", () => {
  const products = [
    createProduct({
      id: "product-1",
      name: "Vestido Aurora",
      slug: "vestido-aurora",
      moldCode: "MOL-VEST-018",
    }),
    createProduct({
      id: "product-2",
      name: "Blusa Serena",
      slug: "blusa-serena",
      moldCode: null,
    }),
  ];

  it("busca por código de molde sin distinguir mayúsculas", () => {
    const result = filterAdminProducts(
      products,
      " mol-vest-018 ",
      "all",
    );

    expect(result).toHaveLength(1);
    expect(result[0]?.name).toBe("Vestido Aurora");
  });

  it("mantiene productos sin código cuando no hay búsqueda", () => {
    const result = filterAdminProducts(
      products,
      "",
      "all",
    );

    expect(result).toHaveLength(2);
  });
});
