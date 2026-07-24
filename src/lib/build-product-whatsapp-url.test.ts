import {
  describe,
  expect,
  it,
} from "vitest";
import { buildProductWhatsAppUrl } from "./build-product-whatsapp-url";

describe("buildProductWhatsAppUrl", () => {
it("genera un enlace para el número configurado", () => {
  const phoneNumber = "573001234567";

  const result =
    buildProductWhatsAppUrl({
      phoneNumber,
      productName: "Vestido Aurora",
      priceInPesos: 180_000,
      productUrl:
        "https://boutique.test/productos/vestido-aurora",
    });

  expect(
    result.startsWith(
      `https://wa.me/${phoneNumber}?text=`,
    ),
  ).toBe(true);
});

  it("incluye nombre, precio y enlace en el mensaje", () => {
    const result =
      buildProductWhatsAppUrl({
        phoneNumber: "573215394234",
        productName: "Blusa Sofía",
        priceInPesos: 95_000,
        productUrl:
          "https://boutique.test/productos/blusa-sofia",
      });

    const url = new URL(result);

    const message =
      url.searchParams.get("text");

    expect(message).toContain(
      "Blusa Sofía",
    );

    expect(message).toContain(
      "95.000",
    );

    expect(message).toContain(
      "https://boutique.test/productos/blusa-sofia",
    );

    expect(message).not.toContain(
      "Código de molde",
    );
  });

  it("incluye el código de molde cuando existe", () => {
    const result = buildProductWhatsAppUrl({
      phoneNumber: "573215394234",
      productName: "Vestido Aurora",
      moldCode: " V-024 ",
      priceInPesos: 180_000,
      productUrl:
        "https://boutique.test/productos/vestido-aurora",
    });

    const message = new URL(result).searchParams.get(
      "text",
    );

    expect(message).toContain(
      "Código de molde: V-024",
    );
  });
});
