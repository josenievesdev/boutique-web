import type { IdGenerator } from "../../core/ports/id-generator";

export class CryptoIdGenerator
  implements IdGenerator
{
  generate(): string {
    return crypto.randomUUID();
  }
}