import type { Product } from "../../core/entities/product";
import { ConflictError } from "../../core/errors/conflict-error";
import { NotFoundError } from "../../core/errors/not-found-error";
import type { ProductCatalogRepository } from "../../core/repositories/product-catalog-repository";
import type { ProductRepository } from "../../core/repositories/product-repository";

export class InMemoryProductRepository
  implements ProductRepository, ProductCatalogRepository
{
  private readonly products = new Map<string, Product>();

  async create(product: Product): Promise<void> {
    const existingProductById = await this.findById(product.id);

    if (existingProductById) {
      throw new ConflictError(
        `Ya existe un producto con el identificador "${product.id}".`,
      );
    }

    const existingProductBySlug = await this.findBySlug(
      product.slug,
    );

    if (existingProductBySlug) {
      throw new ConflictError(
        `Ya existe un producto con el slug "${product.slug}".`,
      );
    }

    this.products.set(product.id, product);
  }

  async update(product: Product): Promise<void> {
    const existingProduct = await this.findById(product.id);

    if (!existingProduct) {
      throw new NotFoundError(
        `No se encontró el producto "${product.id}".`,
      );
    }

    const productWithSameSlug = await this.findBySlug(
      product.slug,
    );

    if (
      productWithSameSlug &&
      productWithSameSlug.id !== product.id
    ) {
      throw new ConflictError(
        `Ya existe un producto con el slug "${product.slug}".`,
      );
    }

    this.products.set(product.id, product);
  }

  async findById(id: string): Promise<Product | null> {
    return this.products.get(id) ?? null;
  }

  async findBySlug(slug: string): Promise<Product | null> {
    const normalizedSlug = slug.trim().toLowerCase();

    return (
      [...this.products.values()].find(
        (product) => product.slug === normalizedSlug,
      ) ?? null
    );
  }

  async listAll(): Promise<Product[]> {
    return [...this.products.values()];
  }

  async listPublished(): Promise<Product[]> {
    return [...this.products.values()].filter(
      (product) => product.status === "published",
    );
  }

  async findPublishedBySlug(
  slug: string,
): Promise<Product | null> {
  const product = await this.findBySlug(slug);

  if (!product || product.status !== "published") {
    return null;
  }

  return product;
}

  async deletePermanently(id: string): Promise<void> {
    const productExists = this.products.has(id);

    if (!productExists) {
      throw new NotFoundError(
        `No se encontró el producto "${id}".`,
      );
    }

    this.products.delete(id);
  }
}