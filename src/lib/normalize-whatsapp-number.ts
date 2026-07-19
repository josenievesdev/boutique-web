export function normalizeWhatsAppNumber(
  value: string,
): string {
  return value.replace(/\D/g, "");
}

export function isValidWhatsAppNumber(
  value: string,
): boolean {
  return /^[1-9][0-9]{7,14}$/.test(value);
}