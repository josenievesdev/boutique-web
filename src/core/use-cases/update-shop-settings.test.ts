import {
  describe,
  expect,
  it,
} from "vitest";
import type { ShopSettings } from "../entities/shop-settings";
import type {
  ShopSettingsRepository,
  UpdateShopSettingsData,
} from "../repositories/shop-settings-repository";
import { UpdateShopSettings } from "./update-shop-settings";

class InMemoryShopSettingsRepository
  implements ShopSettingsRepository
{
  private settings:
    ShopSettings | null;

  constructor(
    settings: ShopSettings | null,
  ) {
    this.settings = settings;
  }

  async get(): Promise<ShopSettings | null> {
    return this.settings;
  }

  async update(
    data: UpdateShopSettingsData,
  ): Promise<ShopSettings | null> {
    if (!this.settings) {
      return null;
    }

    this.settings = {
      ...this.settings,
      businessName:
        data.businessName,
      whatsappNumber:
        data.whatsappNumber,
      updatedAt: new Date(
        "2026-07-20T15:00:00.000Z",
      ),
    };

    return this.settings;
  }
}

function createSettings(): ShopSettings {
  return {
    id: "default",
    businessName: "Boutique",
    whatsappNumber: null,
    createdAt: new Date(
      "2026-07-19T12:00:00.000Z",
    ),
    updatedAt: new Date(
      "2026-07-19T12:00:00.000Z",
    ),
  };
}

describe("UpdateShopSettings", () => {
  it("normaliza y guarda la configuración", async () => {
    const repository =
      new InMemoryShopSettingsRepository(
        createSettings(),
      );

    const useCase =
      new UpdateShopSettings(repository);

    const result =
      await useCase.execute({
        businessName:
          " Boutique Magnolia ",
        whatsappNumber:
          "+57 300 123 4567",
      });

    expect(result.businessName).toBe(
      "Boutique Magnolia",
    );

    expect(result.whatsappNumber).toBe(
      "573001234567",
    );
  });

  it("rechaza un nombre vacío", async () => {
    const repository =
      new InMemoryShopSettingsRepository(
        createSettings(),
      );

    const useCase =
      new UpdateShopSettings(repository);

    await expect(
      useCase.execute({
        businessName: "   ",
        whatsappNumber:
          "573001234567",
      }),
    ).rejects.toThrow(
      "El nombre de la boutique es obligatorio.",
    );
  });

  it("rechaza un número inválido", async () => {
    const repository =
      new InMemoryShopSettingsRepository(
        createSettings(),
      );

    const useCase =
      new UpdateShopSettings(repository);

    await expect(
      useCase.execute({
        businessName: "Boutique",
        whatsappNumber: "123",
      }),
    ).rejects.toThrow(
      "El número de WhatsApp debe incluir el código del país y contener entre 8 y 15 dígitos.",
    );
  });

  it("rechaza una configuración inexistente", async () => {
    const repository =
      new InMemoryShopSettingsRepository(
        null,
      );

    const useCase =
      new UpdateShopSettings(repository);

    await expect(
      useCase.execute({
        businessName: "Boutique",
        whatsappNumber:
          "573001234567",
      }),
    ).rejects.toThrow(
      "No se encontró la configuración de la boutique.",
    );
  });
});