import type { SupabaseClient } from "@supabase/supabase-js";
import type { Category } from "../../core/entities/category";
import type { CategoryRepository } from "../../core/repositories/category-repository";
import type { Database } from "../supabase/database.types";

export class SupabaseCategoryRepository
  implements CategoryRepository
{
  private readonly client: SupabaseClient<Database>;

  constructor(client: SupabaseClient<Database>) {
    this.client = client;
  }

  async listActive(): Promise<Category[]> {
    const { data, error } = await this.client
      .from("categories")
      .select(
        `
          id,
          name,
          slug,
          description,
          active,
          position,
          created_at,
          updated_at
        `,
      )
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

    return data.map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      active: row.active,
      position: row.position,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }));
  }
}