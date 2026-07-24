export interface BuildProductWhatsAppUrlInput {
  phoneNumber: string;
  productName: string;
  moldCode?: string | null;
  priceInPesos: number;
  productUrl: string;
}

const currencyFormatter =
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });

export function buildProductWhatsAppUrl(
  input: BuildProductWhatsAppUrlInput,
): string {
  const moldCode = input.moldCode?.trim();

  const message = [
    "Hola, me interesa este producto:",
    "",
    input.productName,
    ...(moldCode
      ? [`Código de molde: ${moldCode}`]
      : []),
    `Precio: ${currencyFormatter.format(
      input.priceInPesos,
    )}`,
    `Enlace: ${input.productUrl}`,
    "",
    "¿Me compartes disponibilidad y opciones?",
  ].join("\n");

  return (
    `https://wa.me/${input.phoneNumber}` +
    `?text=${encodeURIComponent(message)}`
  );
}
