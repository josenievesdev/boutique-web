import type { SupabaseClient } from "@supabase/supabase-js";
import type { ShopSettings } from "../../core/entities/shop-settings";
import type {
  ShopSettingsRepository,
  UpdateShopSettingsData,
} from "../../core/repositories/shop-settings-repository";
import type { Database } from "../supabase/database.types";

type ShopSettingsRow =
  Database["public"]["Tables"]["shop_settings"]["Row"];

const shopSettingsSelection = `
  id,
  business_name,
  whatsapp_number,
  created_at,
  updated_at
`;

function mapShopSettings(
  row: ShopSettingsRow,
): ShopSettings {
  return {
    id: row.id,
    businessName: row.business_name,
    whatsappNumber: row.whatsapp_number,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

export class SupabaseShopSettingsRepository
  implements ShopSettingsRepository
{
  private readonly client:
    SupabaseClient<Database>;

  constructor(
    client: SupabaseClient<Database>,
  ) {
    this.client = client;
  }

  async get(): Promise<ShopSettings | null> {
    const {
      data,
      error,
    } = await this.client
      .from("shop_settings")
      .select(shopSettingsSelection)
      .eq("id", "default")
      .maybeSingle();

    if (error) {
      throw new Error(
        `No fue posible consultar la configuración: ${error.message}`,
      );
    }

    return data
      ? mapShopSettings(data)
      : null;
  }

  async update(
    data: UpdateShopSettingsData,
  ): Promise<ShopSettings | null> {
    const {
      data: updatedRow,
      error,
    } = await this.client
      .from("shop_settings")
      .update({
        business_name:
          data.businessName,
        whatsapp_number:
          data.whatsappNumber,
      })
      .eq("id", "default")
      .select(shopSettingsSelection)
      .maybeSingle();

    if (error) {
      throw new Error(
        `No fue posible actualizar la configuración: ${error.message}`,
      );
    }

    return updatedRow
      ? mapShopSettings(updatedRow)
      : null;
  }
}