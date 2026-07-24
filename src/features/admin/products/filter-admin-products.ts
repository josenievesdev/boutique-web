import type {
  Product,
  ProductStatus,
} from "../../../core/entities/product";

export type ProductStatusFilter =
  | "all"
  | ProductStatus;

export function filterAdminProducts(
  products: Product[],
  searchTerm: string,
  statusFilter: ProductStatusFilter,
): Product[] {
  const normalizedSearch =
    searchTerm.trim().toLowerCase();

  return products.filter((product) => {
    const matchesStatus =
      statusFilter === "all" ||
      product.status === statusFilter;

    const matchesSearch =
      !normalizedSearch ||
      product.name
        .toLowerCase()
        .includes(normalizedSearch) ||
      product.slug
        .toLowerCase()
        .includes(normalizedSearch) ||
      (product.moldCode
        ?.toLowerCase()
        .includes(normalizedSearch) ?? false);

    return matchesStatus && matchesSearch;
  });
}
