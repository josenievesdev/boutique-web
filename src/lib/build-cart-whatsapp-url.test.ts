import {
  describe,
  expect,
  it,
} from "vitest";
import { buildCartWhatsAppUrl } from "./build-cart-whatsapp-url";

describe("buildCartWhatsAppUrl", () => {
  const phoneNumber =
    "573001234567";

  const items = [
    {
      name: "Vestido Aurora",
      moldCode: "MOL-VEST-018",
      quantity: 2,
      priceInPesos: 180_000,
      productUrl:
        "https://boutique.test/productos/vestido-aurora",
    },
    {
      name: "Blusa Magnolia",
      moldCode: null,
      quantity: 1,
      priceInPesos: 95_000,
      productUrl:
        "https://boutique.test/productos/blusa-magnolia",
    },
  ];

  it("genera el enlace para WhatsApp", () => {
    const result =
      buildCartWhatsAppUrl({
        phoneNumber,
        items,
      });

    expect(
      result.startsWith(
        `https://wa.me/${phoneNumber}?text=`,
      ),
    ).toBe(true);
  });

  it("incluye productos, cantidades y total", () => {
    const result =
      buildCartWhatsAppUrl({
        phoneNumber,
        items,
      });

    const message =
      new URL(result).searchParams.get(
        "text",
      );

    expect(message).toContain(
      "Vestido Aurora",
    );

    expect(message).toContain(
      "Cantidad: 2",
    );

    expect(message).toContain(
      "Blusa Magnolia",
    );

    expect(message).toContain(
      "455.000",
    );

    expect(message).toContain(
      "https://boutique.test/productos/vestido-aurora",
    );

    expect(message).toContain(
      "https://boutique.test/productos/blusa-magnolia",
    );
  });

  it("incluye únicamente los códigos de molde existentes", () => {
    const result = buildCartWhatsAppUrl({
      phoneNumber,
      items,
    });

    const message = new URL(result).searchParams.get(
      "text",
    );

    expect(message).toContain(
      "Código de molde: MOL-VEST-018",
    );

    expect(
      message?.match(/Código de molde:/g),
    ).toHaveLength(1);

    expect(message).not.toContain(
      "Código de molde: null",
    );
  });
});
