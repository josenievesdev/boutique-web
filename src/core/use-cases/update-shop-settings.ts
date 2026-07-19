import type { ShopSettings } from "../entities/shop-settings";
import { DomainError } from "../errors/domain-error";
import { NotFoundError } from "../errors/not-found-error";
import type { ShopSettingsRepository } from "../repositories/shop-settings-repository";
import {
  isValidWhatsAppNumber,
  normalizeWhatsAppNumber,
} from "../../lib/normalize-whatsapp-number";

export interface UpdateShopSettingsInput {
  businessName: string;
  whatsappNumber: string;
}

export class UpdateShopSettings {
  private readonly repository:
    ShopSettingsRepository;

  constructor(
    repository: ShopSettingsRepository,
  ) {
    this.repository = repository;
  }

  async execute(
    input: UpdateShopSettingsInput,
  ): Promise<ShopSettings> {
    const businessName =
      input.businessName.trim();

    if (!businessName) {
      throw new DomainError(
        "El nombre de la boutique es obligatorio.",
      );
    }

    if (businessName.length > 120) {
      throw new DomainError(
        "El nombre de la boutique no puede superar 120 caracteres.",
      );
    }

    const normalizedNumber =
      normalizeWhatsAppNumber(
        input.whatsappNumber,
      );

    if (
      normalizedNumber &&
      !isValidWhatsAppNumber(
        normalizedNumber,
      )
    ) {
      throw new DomainError(
        "El número de WhatsApp debe incluir el código del país y contener entre 8 y 15 dígitos.",
      );
    }

    const updatedSettings =
      await this.repository.update({
        businessName,
        whatsappNumber:
          normalizedNumber || null,
      });

    if (!updatedSettings) {
      throw new NotFoundError(
        "No se encontró la configuración de la boutique.",
      );
    }

    return updatedSettings;
  }
}