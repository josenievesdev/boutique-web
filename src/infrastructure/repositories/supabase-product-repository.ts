import type { SupabaseClient } from "@supabase/supabase-js";
import {
  Product,
  type ProductProps,
} from "../../core/entities/product";
import { ConflictError } from "../../core/errors/conflict-error";
import { NotFoundError } from "../../core/errors/not-found-error";
import type { ProductRepository } from "../../core/repositories/product-repository";
import type { Database } from "../supabase/database.types";

type ProductRow =
  Database["public"]["Tables"]["products"]["Row"];

type ProductInsert =
  Database["public"]["Tables"]["products"]["Insert"];

type ProductUpdate =
  Database["public"]["Tables"]["products"]["Update"];

type ProductImageRow =
  Database["public"]["Tables"]["product_images"]["Row"];

type ProductImageInsert =
  Database["public"]["Tables"]["product_images"]["Insert"];

type ProductWithImagesRow = ProductRow & {
  product_images: ProductImageRow[];
};

const productSelection = `
  id,
  name,
  slug,
  mold_code,
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

export class SupabaseProductRepository
  implements ProductRepository
{
  private readonly client: SupabaseClient<Database>;

  constructor(client: SupabaseClient<Database>) {
    this.client = client;
  }

  async create(product: Product): Promise<void> {
    const existingProductById = await this.findById(
      product.id,
    );

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

    const productData = product.toObject();

    const { error: productError } = await this.client
      .from("products")
      .insert(this.mapProductInsert(productData));

    if (productError) {
      this.throwDatabaseError(
        "No fue posible crear el producto",
        productError,
      );
    }

    try {
      await this.insertImages(productData);
    } catch (error) {
      await this.client
        .from("products")
        .delete()
        .eq("id", product.id);

      throw error;
    }
  }

  async update(product: Product): Promise<void> {
    const existingProduct = await this.findById(
      product.id,
    );

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

    const productData = product.toObject();

    const { error: updateError } = await this.client
      .from("products")
      .update(this.mapProductUpdate(productData))
      .eq("id", product.id);

    if (updateError) {
      this.throwDatabaseError(
        "No fue posible actualizar el producto",
        updateError,
      );
    }

    const { error: deleteImagesError } =
      await this.client
        .from("product_images")
        .delete()
        .eq("product_id", product.id);

    if (deleteImagesError) {
      throw new Error(
        `No fue posible actualizar las imágenes: ${deleteImagesError.message}`,
      );
    }

    await this.insertImages(productData);
  }

  async findById(id: string): Promise<Product | null> {
    const { data, error } = await this.client
      .from("products")
      .select(productSelection)
      .eq("id", id)
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

  async findBySlug(
    slug: string,
  ): Promise<Product | null> {
    const normalizedSlug = slug.trim().toLowerCase();

    const { data, error } = await this.client
      .from("products")
      .select(productSelection)
      .eq("slug", normalizedSlug)
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

  async listAll(): Promise<Product[]> {
    const { data, error } = await this.client
      .from("products")
      .select(productSelection)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      throw new Error(
        `No fue posible consultar los productos: ${error.message}`,
      );
    }

    return data.map((row) =>
      this.mapRowToProduct(
        row as ProductWithImagesRow,
      ),
    );
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

    return data.map((row) =>
      this.mapRowToProduct(
        row as ProductWithImagesRow,
      ),
    );
  }

  async deletePermanently(id: string): Promise<void> {
    const existingProduct = await this.findById(id);

    if (!existingProduct) {
      throw new NotFoundError(
        `No se encontró el producto "${id}".`,
      );
    }

    const { error } = await this.client
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(
        `No fue posible eliminar el producto: ${error.message}`,
      );
    }
  }

  private async insertImages(
    product: ProductProps,
  ): Promise<void> {
    if (product.images.length === 0) {
      return;
    }

    const images: ProductImageInsert[] =
      product.images.map((image) => ({
        id: image.id,
        product_id: product.id,
        storage_path: image.path,
        alt_text: image.altText,
        position: image.position,
        is_cover: image.isCover,
      }));

    const { error } = await this.client
      .from("product_images")
      .insert(images);

    if (error) {
      throw new Error(
        `No fue posible guardar las imágenes: ${error.message}`,
      );
    }
  }

  private mapProductInsert(
    product: ProductProps,
  ): ProductInsert {
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      mold_code: product.moldCode ?? null,
      short_description: product.shortDescription,
      description: product.description,
      price_in_pesos: product.priceInPesos,
      previous_price_in_pesos:
        product.previousPriceInPesos,
      category_id: product.categoryId,
      status: product.status,
      featured: product.featured,
      customizable: product.customizable,
      made_to_order: product.madeToOrder,
      preparation_days: product.preparationDays,
      created_at: product.createdAt.toISOString(),
      updated_at: product.updatedAt.toISOString(),
    };
  }

  private mapProductUpdate(
    product: ProductProps,
  ): ProductUpdate {
    return {
      name: product.name,
      slug: product.slug,
      mold_code: product.moldCode ?? null,
      short_description: product.shortDescription,
      description: product.description,
      price_in_pesos: product.priceInPesos,
      previous_price_in_pesos:
        product.previousPriceInPesos,
      category_id: product.categoryId,
      status: product.status,
      featured: product.featured,
      customizable: product.customizable,
      made_to_order: product.madeToOrder,
      preparation_days: product.preparationDays,
      updated_at: product.updatedAt.toISOString(),
    };
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
      moldCode: row.mold_code,
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

  private throwDatabaseError(
    context: string,
    error: {
      code?: string;
      message: string;
    },
  ): never {
    if (error.code === "23505") {
      throw new ConflictError(
        `${context}: ya existe un registro con esos datos.`,
      );
    }

    throw new Error(`${context}: ${error.message}`);
  }
}
