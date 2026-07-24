export interface CartProductSnapshot {
  productId: string;
  slug: string;
  name: string;
  moldCode: string | null;
  priceInPesos: number;
  imagePath: string | null;
  imageAltText: string;
}

export interface CartItem
  extends CartProductSnapshot {
  quantity: number;
}
