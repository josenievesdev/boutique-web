import type {
  CartItem,
  CartProductSnapshot,
} from "./cart-types";

const MAX_QUANTITY = 99;

function normalizeQuantity(
  quantity: number,
): number {
  if (!Number.isFinite(quantity)) {
    return 1;
  }

  return Math.min(
    MAX_QUANTITY,
    Math.max(1, Math.trunc(quantity)),
  );
}

export function addCartItem(
  items: CartItem[],
  product: CartProductSnapshot,
): CartItem[] {
  const existingItem = items.find(
    (item) =>
      item.productId === product.productId,
  );

  if (!existingItem) {
    return [
      ...items,
      {
        ...product,
        quantity: 1,
      },
    ];
  }

  return items.map((item) =>
    item.productId === product.productId
      ? {
          ...item,
          ...product,
          quantity: normalizeQuantity(
            item.quantity + 1,
          ),
        }
      : item,
  );
}

export function setCartItemQuantity(
  items: CartItem[],
  productId: string,
  quantity: number,
): CartItem[] {
  return items.map((item) =>
    item.productId === productId
      ? {
          ...item,
          quantity:
            normalizeQuantity(quantity),
        }
      : item,
  );
}

export function removeCartItem(
  items: CartItem[],
  productId: string,
): CartItem[] {
  return items.filter(
    (item) => item.productId !== productId,
  );
}

export function countCartItems(
  items: CartItem[],
): number {
  return items.reduce(
    (total, item) =>
      total + item.quantity,
    0,
  );
}

export function calculateCartTotal(
  items: CartItem[],
): number {
  return items.reduce(
    (total, item) =>
      total +
      item.priceInPesos * item.quantity,
    0,
  );
}