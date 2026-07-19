import type { SupabaseClient } from "@supabase/supabase-js";
import { Product } from "../../core/entities/product";
import type { ProductCatalogRepository } from "../../core/repositories/product-catalog-repository";
import type { Database } from "../supabase/database.types";

type ProductRow =
  Database["public"]["Tables"]["products"]["Row"];

type ProductImageRow =
  Database["public"]["Tables"]["product_images"]["Row"];

type ProductWithImagesRow = ProductRow & {
  product_images: ProductImageRow[];
};

const productSelection = `
  id,
  name,
  slug,
  short_description,
  description,
  price_in_pesos,
  previous_price_in_pesos,
  category_id,
  status,
  featured,
  customizable,
  made_to_order,
  preparation_days,
  created_at,
  updated_at,
  product_images (
    id,
    product_id,
    storage_path,
    alt_text,
    position,
    is_cover,
    created_at
  )
`;

export class SupabaseProductCatalogRepository
  implements ProductCatalogRepository
{
  private readonly client: SupabaseClient<Database>;

  constructor(client: SupabaseClient<Database>) {
    this.client = client;
  }

  async listPublished(): Promise<Product[]> {
    const { data, error } = await this.client
      .from("products")
      .select(productSelection)
      .eq("status", "published")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      throw new Error(
        `No fue posible consultar el catálogo: ${error.message}`,
      );
    }

    return data.map((row) => {
      return this.mapRowToProduct(
        row as ProductWithImagesRow,
      );
    });
  }

  async findPublishedBySlug(
    slug: string,
  ): Promise<Product | null> {
    const normalizedSlug = slug.trim().toLowerCase();

    const { data, error } = await this.client
      .from("products")
      .select(productSelection)
      .eq("slug", normalizedSlug)
      .eq("status", "published")
      .maybeSingle();

    if (error) {
      throw new Error(
        `No fue posible consultar el producto: ${error.message}`,
      );
    }

    if (!data) {
      return null;
    }

    return this.mapRowToProduct(
      data as ProductWithImagesRow,
    );
  }

  private mapRowToProduct(
    row: ProductWithImagesRow,
  ): Product {
    const images = [...row.product_images]
      .sort((firstImage, secondImage) => {
        return firstImage.position - secondImage.position;
      })
      .map((image) => ({
        id: image.id,
        path: image.storage_path,
        altText: image.alt_text,
        position: image.position,
        isCover: image.is_cover,
      }));

    return new Product({
      id: row.id,
      name: row.name,
      slug: row.slug,
      shortDescription: row.short_description,
      description: row.description,
      priceInPesos: row.price_in_pesos,
      previousPriceInPesos:
        row.previous_price_in_pesos,
      categoryId: row.category_id,
      collectionId: null,
      status: row.status,
      featured: row.featured,
      customizable: row.customizable,
      madeToOrder: row.made_to_order,
      preparationDays: row.preparation_days,
      images,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
  }
}