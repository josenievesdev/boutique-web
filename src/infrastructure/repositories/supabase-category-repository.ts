import type { SupabaseClient } from "@supabase/supabase-js";
import type { Category } from "../../core/entities/category";
import type { AdminCategoryRepository } from "../../core/repositories/admin-category-repository";
import type { Database } from "../supabase/database.types";

type CategoryRow =
  Database["public"]["Tables"]["categories"]["Row"];

const categorySelection = `
  id,
  name,
  slug,
  description,
  active,
  position,
  created_at,
  updated_at
`;

function mapCategory(
  row: CategoryRow,
): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    active: row.active,
    position: row.position,
    createdAt: new Date(
      row.created_at,
    ),
    updatedAt: new Date(
      row.updated_at,
    ),
  };
}

export class SupabaseCategoryRepository
  implements AdminCategoryRepository
{
  private readonly client:
    SupabaseClient<Database>;

  constructor(
    client: SupabaseClient<Database>,
  ) {
    this.client = client;
  }

  async listActive(): Promise<Category[]> {
    const {
      data,
      error,
    } = await this.client
      .from("categories")
      .select(categorySelection)
      .eq("active", true)
      .order("position", {
        ascending: true,
      })
      .order("name", {
        ascending: true,
      });

    if (error) {
      throw new Error(
        `No fue posible consultar las categorías: ${error.message}`,
      );
    }

    return data.map(mapCategory);
  }

  async listAll(): Promise<Category[]> {
    const {
      data,
      error,
    } = await this.client
      .from("categories")
      .select(categorySelection)
      .order("position", {
        ascending: true,
      })
      .order("name", {
        ascending: true,
      });

    if (error) {
      throw new Error(
        `No fue posible consultar las categorías administrativas: ${error.message}`,
      );
    }

    return data.map(mapCategory);
  }

  async findBySlug(
    slug: string,
  ): Promise<Category | null> {
    const {
      data,
      error,
    } = await this.client
      .from("categories")
      .select(categorySelection)
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      throw new Error(
        `No fue posible consultar la categoría: ${error.message}`,
      );
    }

    return data
      ? mapCategory(data)
      : null;
  }

  async create(
    category: Category,
  ): Promise<void> {
    const { error } = await this.client
      .from("categories")
      .insert({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description:
          category.description,
        active: category.active,
        position: category.position,
        created_at:
          category.createdAt.toISOString(),
        updated_at:
          category.updatedAt.toISOString(),
      });

    if (error) {
      throw new Error(
        `No fue posible crear la categoría: ${error.message}`,
      );
    }
  }
}