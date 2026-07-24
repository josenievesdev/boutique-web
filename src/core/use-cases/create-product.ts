import { Product } from "../entities/product";
import { ConflictError } from "../errors/conflict-error";
import type { Clock } from "../ports/clock";
import type { IdGenerator } from "../ports/id-generator";
import type { ProductRepository } from "../repositories/product-repository";

export interface CreateProductInput {
  name: string;
  slug: string;
  moldCode?: string | null;
  shortDescription: string;
  description: string;
  priceInPesos: number;
  previousPriceInPesos?: number | null;
  categoryId?: string | null;
  collectionId?: string | null;
  featured?: boolean;
  customizable?: boolean;
  madeToOrder?: boolean;
  preparationDays?: number | null;
}

export class CreateProduct {
  private readonly productRepository: ProductRepository;
  private readonly idGenerator: IdGenerator;
  private readonly clock: Clock;

  constructor(
    productRepository: ProductRepository,
    idGenerator: IdGenerator,
    clock: Clock,
  ) {
    this.productRepository = productRepository;
    this.idGenerator = idGenerator;
    this.clock = clock;
  }

  async execute(input: CreateProductInput): Promise<Product> {
    const normalizedSlug = input.slug.trim().toLowerCase();

    const existingProduct =
      await this.productRepository.findBySlug(normalizedSlug);

    if (existingProduct) {
      throw new ConflictError(
        `Ya existe un producto con el slug "${normalizedSlug}".`,
      );
    }

    const now = this.clock.now();

    const product = new Product({
      id: this.idGenerator.generate(),
      name: input.name.trim(),
      slug: normalizedSlug,
      moldCode: input.moldCode?.trim() || null,
      shortDescription: input.shortDescription.trim(),
      description: input.description.trim(),
      priceInPesos: input.priceInPesos,
      previousPriceInPesos:
        input.previousPriceInPesos ?? null,
      categoryId: input.categoryId ?? null,
      collectionId: input.collectionId ?? null,
      status: "draft",
      featured: input.featured ?? false,
      customizable: input.customizable ?? false,
      madeToOrder: input.madeToOrder ?? false,
      preparationDays: input.preparationDays ?? null,
      images: [],
      createdAt: new Date(now),
      updatedAt: new Date(now),
    });

    await this.productRepository.create(product);

    return product;
  }
}
