import type { Product } from "../../core/entities/product";

export interface CatalogProductFilters {
  searchTerm: string;
  categoryId: string | null;
}

export function filterCatalogProducts(
  products: Product[],
  filters: CatalogProductFilters,
): Product[] {
  const normalizedSearch =
    filters.searchTerm.trim().toLowerCase();

  return [...products]
    .filter((product) => {
      const productData = product.toObject();

      const searchableText = [
        productData.name,
        productData.slug,
        productData.shortDescription,
        productData.description,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        searchableText.includes(normalizedSearch);

      const matchesCategory =
        !filters.categoryId ||
        productData.categoryId ===
          filters.categoryId;

      return matchesSearch && matchesCategory;
    })
    .sort((firstProduct, secondProduct) => {
      const firstData =
        firstProduct.toObject();

      const secondData =
        secondProduct.toObject();

      if (
        firstData.featured !==
        secondData.featured
      ) {
        return firstData.featured ? -1 : 1;
      }

      return (
        secondData.updatedAt.getTime() -
        firstData.updatedAt.getTime()
      );
    });
}