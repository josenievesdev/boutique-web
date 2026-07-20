export interface CartProductSnapshot {
  productId: string;
  slug: string;
  name: string;
  priceInPesos: number;
  imagePath: string | null;
  imageAltText: string;
}

export interface CartItem
  extends CartProductSnapshot {
  quantity: number;
}