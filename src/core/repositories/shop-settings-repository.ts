import type { ShopSettings } from "../entities/shop-settings";

export interface UpdateShopSettingsData {
  businessName: string;
  whatsappNumber: string | null;
}

export interface ShopSettingsRepository {
  get(): Promise<ShopSettings | null>;

  update(
    data: UpdateShopSettingsData,
  ): Promise<ShopSettings | null>;
}