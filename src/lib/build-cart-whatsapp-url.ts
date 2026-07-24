export interface CartWhatsAppItem {
  name: string;
  moldCode?: string | null;
  quantity: number;
  priceInPesos: number;
  productUrl: string;
}

export interface BuildCartWhatsAppUrlInput {
  phoneNumber: string;
  items: CartWhatsAppItem[];
}

const currencyFormatter =
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });

export function buildCartWhatsAppUrl(
  input: BuildCartWhatsAppUrlInput,
): string {
  const total = input.items.reduce(
    (currentTotal, item) =>
      currentTotal +
      item.priceInPesos * item.quantity,
    0,
  );

  const productLines = input.items.flatMap(
    (item, index) => {
      const moldCode = item.moldCode?.trim();

      return [
        `${index + 1}. ${item.name}`,
        ...(moldCode
          ? [`Código de molde: ${moldCode}`]
          : []),
        `Cantidad: ${item.quantity}`,
        `Precio unitario: ${currencyFormatter.format(
          item.priceInPesos,
        )}`,
        `Enlace: ${item.productUrl}`,
        "",
      ];
    },
  );

  const message = [
    "Hola, quiero consultar estos productos:",
    "",
    ...productLines,
    `Valor de referencia: ${currencyFormatter.format(
      total,
    )}`,
    "",
    "¿Me compartes disponibilidad, opciones de personalización y tiempos de elaboración?",
  ].join("\n");

  return (
    `https://wa.me/${input.phoneNumber}` +
    `?text=${encodeURIComponent(message)}`
  );
}
