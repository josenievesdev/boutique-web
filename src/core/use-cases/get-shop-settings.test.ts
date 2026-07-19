import {
  describe,
  expect,
  it,
} from "vitest";
import type { ShopSettings } from "../entities/shop-settings";
import type { ShopSettingsRepository } from "../repositories/shop-settings-repository";
import { GetShopSettings } from "./get-shop-settings";

const settings: ShopSettings = {
  id: "default",
  businessName: "Boutique Magnolia",
  whatsappNumber: "573001234567",
  createdAt: new Date(
    "2026-07-19T12:00:00.000Z",
  ),
  updatedAt: new Date(
    "2026-07-19T12:00:00.000Z",
  ),
};

describe("GetShopSettings", () => {
  it("devuelve la configuración existente", async () => {
    const repository: ShopSettingsRepository = {
      async get() {
        return settings;
      },

      async update() {
        return settings;
      },
    };

    const useCase =
      new GetShopSettings(repository);

    await expect(
      useCase.execute(),
    ).resolves.toEqual(settings);
  });

  it("rechaza una configuración inexistente", async () => {
    const repository: ShopSettingsRepository = {
      async get() {
        return null;
      },

      async update() {
        return null;
      },
    };

    const useCase =
      new GetShopSettings(repository);

    await expect(
      useCase.execute(),
    ).rejects.toThrow(
      "No se encontró la configuración de la boutique.",
    );
  });
});