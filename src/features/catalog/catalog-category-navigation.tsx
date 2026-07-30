import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "./catalog-icons";

export interface CatalogCategoryNavigationItem {
  id: string;
  name: string;
}

interface CatalogCategoryNavigationProps {
  categories: ReadonlyArray<CatalogCategoryNavigationItem>;
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

const maxVisibleDesktopCategories = 4;

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
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreCategoriesRef = useRef<HTMLDivElement>(null);
  const moreButtonRef = useRef<HTMLButtonElement>(null);
  const visibleCategories = categories.slice(0, maxVisibleDesktopCategories);
  const overflowCategories = categories.slice(maxVisibleDesktopCategories);
  const activeOverflowCategory = overflowCategories.find(
    (category) => category.id === selectedCategoryId,
  );

  useEffect(() => {
    if (!isMoreOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent): void {
      if (
        event.target instanceof Node &&
        !moreCategoriesRef.current?.contains(event.target)
      ) {
        setIsMoreOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsMoreOpen(false);
        moreButtonRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMoreOpen]);

  useEffect(() => {
    const compactCategories = window.matchMedia("(max-width: 900px)");

    function closeDesktopMenu(): void {
      if (compactCategories.matches) {
        setIsMoreOpen(false);
      }
    }

    closeDesktopMenu();
    compactCategories.addEventListener("change", closeDesktopMenu);

    return () => {
      compactCategories.removeEventListener("change", closeDesktopMenu);
    };
  }, []);

  function selectCategory(categoryId: string | null): void {
    onSelectCategory(categoryId);
    setIsMoreOpen(false);
  }

  function selectOverflowCategory(categoryId: string): void {
    onSelectCategory(categoryId);
    setIsMoreOpen(false);
    moreButtonRef.current?.focus();
  }

  return (
    <nav
      className="catalog-category-navigation"
      id="descubrir"
      aria-label="Categorías de la colección"
    >
      <div className="catalog-container catalog-category-navigation__inner">
        <div
          className="catalog-category-navigation__desktop"
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

          {visibleCategories.map((category) => (
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

          {overflowCategories.length > 0 ? (
            <div
              className="catalog-category-navigation__more"
              ref={moreCategoriesRef}
              onBlur={(event) => {
                if (
                  !(event.relatedTarget instanceof Node) ||
                  !event.currentTarget.contains(event.relatedTarget)
                ) {
                  setIsMoreOpen(false);
                }
              }}
            >
              <button
                className={resolveCategoryClass(Boolean(activeOverflowCategory))}
                ref={moreButtonRef}
                type="button"
                aria-expanded={isMoreOpen}
                aria-controls="catalog-more-categories"
                aria-label={
                  activeOverflowCategory
                    ? `Más categorías, filtro activo: ${activeOverflowCategory.name}`
                    : "Más categorías"
                }
                onClick={() => {
                  setIsMoreOpen((current) => !current);
                }}
              >
                <span>Más</span>
                {activeOverflowCategory ? (
                  <span className="catalog-category-navigation__more-active">
                    {activeOverflowCategory.name}
                  </span>
                ) : null}
                <ChevronDownIcon className="catalog-icon" />
              </button>

              {isMoreOpen ? (
                <div
                  className="catalog-category-navigation__menu"
                  id="catalog-more-categories"
                  role="group"
                  aria-label="Más categorías"
                >
                  {overflowCategories.map((category) => (
                    <button
                      className={
                        selectedCategoryId === category.id
                          ? "catalog-category-navigation__menu-button catalog-category-navigation__menu-button--active"
                          : "catalog-category-navigation__menu-button"
                      }
                      key={category.id}
                      type="button"
                      aria-pressed={selectedCategoryId === category.id}
                      onClick={() => {
                        selectOverflowCategory(category.id);
                      }}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

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
