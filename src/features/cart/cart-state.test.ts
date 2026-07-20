import {
  describe,
  expect,
  it,
} from "vitest";
import type { CartItem } from "./cart-types";
import {
  addCartItem,
  calculateCartTotal,
  countCartItems,
  removeCartItem,
  setCartItemQuantity,
} from "./cart-state";

const product = {
  productId: "product-1",
  slug: "vestido-aurora",
  name: "Vestido Aurora",
  priceInPesos: 180_000,
  imagePath: "product-1/cover.webp",
  imageAltText: "Vestido Aurora",
};

describe("cart state", () => {
  it("agrega un producto nuevo", () => {
    const result = addCartItem(
      [],
      product,
    );

    expect(result).toEqual([
      {
        ...product,
        quantity: 1,
      },
    ]);
  });

  it("incrementa un producto existente", () => {
    const firstResult = addCartItem(
      [],
      product,
    );

    const secondResult = addCartItem(
      firstResult,
      product,
    );

    expect(secondResult[0]?.quantity).toBe(
      2,
    );
  });

  it("actualiza y elimina productos", () => {
    const items: CartItem[] = [
      {
        ...product,
        quantity: 1,
      },
    ];

    const updatedItems =
      setCartItemQuantity(
        items,
        product.productId,
        3,
      );

    expect(
      updatedItems[0]?.quantity,
    ).toBe(3);

    expect(
      removeCartItem(
        updatedItems,
        product.productId,
      ),
    ).toEqual([]);
  });

  it("calcula cantidad y valor total", () => {
    const items: CartItem[] = [
      {
        ...product,
        quantity: 2,
      },
      {
        productId: "product-2",
        slug: "blusa-magnolia",
        name: "Blusa Magnolia",
        priceInPesos: 95_000,
        imagePath: null,
        imageAltText: "Blusa Magnolia",
        quantity: 1,
      },
    ];

    expect(countCartItems(items)).toBe(3);

    expect(
      calculateCartTotal(items),
    ).toBe(455_000);
  });
});