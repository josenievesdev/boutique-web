import type { ShopSettings } from "../entities/shop-settings";
import { NotFoundError } from "../errors/not-found-error";
import type { ShopSettingsRepository } from "../repositories/shop-settings-repository";

export class GetShopSettings {
  private readonly repository:
    ShopSettingsRepository;

  constructor(
    repository: ShopSettingsRepository,
  ) {
    this.repository = repository;
  }

  async execute(): Promise<ShopSettings> {
    const settings =
      await this.repository.get();

    if (!settings) {
      throw new NotFoundError(
        "No se encontró la configuración de la boutique.",
      );
    }

    return settings;
  }
}