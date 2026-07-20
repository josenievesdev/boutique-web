import type { Category } from "../../core/entities/category";
import type { CategoryManagementRepository } from "../../core/repositories/category-management-repository";

function sortCategories(
  categories: Category[],
): Category[] {
  return [...categories].sort(
    (firstCategory, secondCategory) => {
      const positionDifference =
        firstCategory.position -
        secondCategory.position;

      if (positionDifference !== 0) {
        return positionDifference;
      }

      return firstCategory.name.localeCompare(
        secondCategory.name,
        "es",
      );
    },
  );
}

export class InMemoryCategoryManagementRepository
  implements CategoryManagementRepository
{
  private readonly categories:
    Category[];

  private readonly productCounts:
    Map<string, number>;

  constructor(
    categories: Category[] = [],
    productCounts:
      Record<string, number> = {},
  ) {
    this.categories = [...categories];

    this.productCounts = new Map(
      Object.entries(productCounts),
    );
  }

  async listActive(): Promise<Category[]> {
    return sortCategories(
      this.categories.filter(
        (category) => category.active,
      ),
    );
  }

  async listAll(): Promise<Category[]> {
    return sortCategories(
      this.categories,
    );
  }

  async findById(
    categoryId: string,
  ): Promise<Category | null> {
    return (
      this.categories.find(
        (category) =>
          category.id === categoryId,
      ) ?? null
    );
  }

  async findBySlug(
    slug: string,
  ): Promise<Category | null> {
    return (
      this.categories.find(
        (category) =>
          category.slug === slug,
      ) ?? null
    );
  }

  async create(
    category: Category,
  ): Promise<void> {
    this.categories.push(category);
  }

  async update(
    category: Category,
  ): Promise<void> {
    const categoryIndex =
      this.categories.findIndex(
        (currentCategory) =>
          currentCategory.id ===
          category.id,
      );

    if (categoryIndex === -1) {
      throw new Error(
        `No se encontró la categoría "${category.id}".`,
      );
    }

    this.categories[categoryIndex] =
      category;
  }

  async countProducts(
    categoryId: string,
  ): Promise<number> {
    return (
      this.productCounts.get(
        categoryId,
      ) ?? 0
    );
  }

  setProductCount(
    categoryId: string,
    productCount: number,
  ): void {
    this.productCounts.set(
      categoryId,
      productCount,
    );
  }
}