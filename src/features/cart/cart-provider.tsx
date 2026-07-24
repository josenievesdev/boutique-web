import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  addCartItem,
  calculateCartTotal,
  countCartItems,
  removeCartItem,
  setCartItemQuantity,
} from "./cart-state";
import {
  CartContext,
  type CartContextValue,
} from "./cart-context";
import type {
  CartItem,
  CartProductSnapshot,
} from "./cart-types";

const STORAGE_KEY =
  "boutique-request-items-v1";

interface CartProviderProps {
  children: ReactNode;
}

type StoredCartItem = Omit<
  CartItem,
  "moldCode"
> & {
  moldCode?: unknown;
};

function isCartItem(
  value: unknown,
): value is StoredCartItem {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  const item =
    value as Record<string, unknown>;

  return (
    typeof item.productId === "string" &&
    typeof item.slug === "string" &&
    typeof item.name === "string" &&
    typeof item.priceInPesos ===
      "number" &&
    (typeof item.imagePath === "string" ||
      item.imagePath === null) &&
    typeof item.imageAltText ===
      "string" &&
    typeof item.quantity === "number"
  );
}

function readStoredItems(): CartItem[] {
  try {
    const storedValue =
      localStorage.getItem(STORAGE_KEY);

    if (!storedValue) {
      return [];
    }

    const parsedValue: unknown =
      JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue
      .filter(isCartItem)
      .map((item) => {
        const normalizedMoldCode =
          typeof item.moldCode === "string"
            ? item.moldCode.trim()
            : "";

        return {
          ...item,
          moldCode:
            normalizedMoldCode &&
            Array.from(normalizedMoldCode).length <= 40
              ? normalizedMoldCode
              : null,
          quantity: Math.min(
            99,
            Math.max(
              1,
              Math.trunc(item.quantity),
            ),
          ),
        };
      });
  } catch {
    return [];
  }
}

export function CartProvider({
  children,
}: CartProviderProps) {
  const [items, setItems] =
    useState<CartItem[]>(
      readStoredItems,
    );

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(items),
    );
  }, [items]);

  function addItem(
    product: CartProductSnapshot,
  ): void {
    setItems((currentItems) =>
      addCartItem(
        currentItems,
        product,
      ),
    );
  }

  function setQuantity(
    productId: string,
    quantity: number,
  ): void {
    setItems((currentItems) =>
      setCartItemQuantity(
        currentItems,
        productId,
        quantity,
      ),
    );
  }

  function removeItem(
    productId: string,
  ): void {
    setItems((currentItems) =>
      removeCartItem(
        currentItems,
        productId,
      ),
    );
  }

  function clear(): void {
    setItems([]);
  }

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      totalItems:
        countCartItems(items),
      totalPriceInPesos:
        calculateCartTotal(items),
      addItem,
      setQuantity,
      removeItem,
      clear,
    }),
    [items],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
