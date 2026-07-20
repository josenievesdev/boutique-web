import { createContext } from "react";
import type {
  CartItem,
  CartProductSnapshot,
} from "./cart-types";

export interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalPriceInPesos: number;

  addItem(
    product: CartProductSnapshot,
  ): void;

  setQuantity(
    productId: string,
    quantity: number,
  ): void;

  removeItem(productId: string): void;
  clear(): void;
}

export const CartContext =
  createContext<CartContextValue | null>(
    null,
  );