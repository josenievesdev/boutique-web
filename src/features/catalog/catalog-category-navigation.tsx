export interface CatalogCategoryNavigationItem {
  id: string;
  name: string;
}

interface CatalogCategoryNavigationProps {
  categories: ReadonlyArray<CatalogCategoryNavigationItem>;
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

function resolveCategoryClass(isActive: boolean): string {
  return isActive
    ? "catalog-category-navigation__button catalog-category-navigation__button--active"
    : "catalog-category-navigation__button";
}

export function CatalogCategoryNavigation({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CatalogCategoryNavigationProps) {
  function selectCategory(categoryId: string | null): void {
    onSelectCategory(categoryId);
  }

  return (
    <nav
      className="catalog-category-navigation"
      id="descubrir"
      aria-label="Categorías de la colección"
    >
      <div className="catalog-container catalog-category-navigation__inner">
        <div
          className="catalog-category-navigation__scroller"
          role="group"
          aria-label="Filtrar por categoría"
        >
          <button
            className={resolveCategoryClass(selectedCategoryId === null)}
            type="button"
            aria-pressed={selectedCategoryId === null}
            onClick={() => {
              selectCategory(null);
            }}
          >
            Todo
          </button>

          {categories.map((category) => (
            <button
              className={resolveCategoryClass(
                selectedCategoryId === category.id,
              )}
              key={category.id}
              type="button"
              aria-pressed={selectedCategoryId === category.id}
              onClick={() => {
                selectCategory(category.id);
              }}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
