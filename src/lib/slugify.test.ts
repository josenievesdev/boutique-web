import { describe, expect, it } from "vitest";
import { slugify } from "./slugify";

describe("slugify", () => {
  it("convierte un nombre en un slug válido", () => {
    expect(
      slugify("Vestido Elegante Aurora"),
    ).toBe("vestido-elegante-aurora");
  });

  it("elimina tildes y caracteres especiales", () => {
    expect(
      slugify("Blusa Sofía & Diseño Único"),
    ).toBe("blusa-sofia-diseno-unico");
  });
});