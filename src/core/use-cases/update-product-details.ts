import { Product } from "../entities/product";
import { ConflictError } from "../errors/conflict-error";
import { DomainError } from "../errors/domain-error";
import { NotFoundError } from "../errors/not-found-error";
import type { Clock } from "../ports/clock";
import type { ProductRepository } from "../repositories/product-repository";

export interface UpdateProductDetailsInput {
  productId: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  priceInPesos: number;
  categoryId: string | null;
  featured: boolean;
  customizable: boolean;
  madeToOrder: boolean;
  preparationDays: number | null;
}

export class UpdateProductDetails {
  private readonly productRepository:
    ProductRepository;

  private readonly clock: Clock;

  constructor(
    productRepository: ProductRepository,
    clock: Clock,
  ) {
    this.productRepository = productRepository;
    this.clock = clock;
  }

  async execute(
    input: UpdateProductDetailsInput,
  ): Promise<Product> {
    const existingProduct =
      await this.productRepository.findById(
        input.productId,
      );

    if (!existingProduct) {
      throw new NotFoundError(
        `No se encontró el producto "${input.productId}".`,
      );
    }

    const normalizedSlug =
      input.slug.trim().toLowerCase();

    const productWithSameSlug =
      await this.productRepository.findBySlug(
        normalizedSlug,
      );

    if (
      productWithSameSlug &&
      productWithSameSlug.id !== input.productId
    ) {
      throw new ConflictError(
        `Ya existe un producto con el slug "${normalizedSlug}".`,
      );
    }

    if (
      existingProduct.status === "published" &&
      !input.categoryId
    ) {
      throw new DomainError(
        "Un producto publicado necesita una categoría.",
      );
    }

    const currentData =
      existingProduct.toObject();

    const updatedProduct = new Product({
      ...currentData,
      name: input.name.trim(),
      slug: normalizedSlug,
      shortDescription:
        input.shortDescription.trim(),
      description: input.description.trim(),
      priceInPesos: input.priceInPesos,
      categoryId: input.categoryId,
      featured: input.featured,
      customizable: input.customizable,
      madeToOrder: input.madeToOrder,
      preparationDays: input.preparationDays,
      updatedAt: new Date(this.clock.now()),
    });

    await this.productRepository.update(
      updatedProduct,
    );

    return updatedProduct;
  }
}