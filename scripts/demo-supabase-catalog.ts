/// <reference types="node" />

import { createClient } from "@supabase/supabase-js";
import { SupabaseProductCatalogRepository } from "../src/infrastructure/repositories/supabase-product-catalog-repository";
import type { Database } from "../src/infrastructure/supabase/database.types";

function requireEnvironmentVariable(
  name: string,
): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `Falta la variable de entorno "${name}".`,
    );
  }

  return value;
}

async function main(): Promise<void> {
  const supabaseUrl = requireEnvironmentVariable(
    "VITE_SUPABASE_URL",
  );

  const supabasePublishableKey =
    requireEnvironmentVariable(
      "VITE_SUPABASE_PUBLISHABLE_KEY",
    );

  const client = createClient<Database>(
    supabaseUrl,
    supabasePublishableKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    },
  );

  const repository =
    new SupabaseProductCatalogRepository(client);

  const publishedProducts =
    await repository.listPublished();

  console.log("\n1. Catálogo público desde Supabase");

  console.table(
    publishedProducts.map((product) => ({
      id: product.id,
      nombre: product.name,
      slug: product.slug,
      precio: product.priceInPesos,
      estado: product.status,
      imagenes: product.imageCount,
    })),
  );

  const publishedProduct =
    await repository.findPublishedBySlug(
      "vestido-aurora",
    );

  console.log("\n2. Producto publicado por slug");

  console.table({
    encontrado: publishedProduct !== null,
    nombre: publishedProduct?.name ?? null,
    estado: publishedProduct?.status ?? null,
    imagenes: publishedProduct?.imageCount ?? 0,
  });

  const draftProduct =
    await repository.findPublishedBySlug(
      "vestido-luna",
    );

  console.log("\n3. Intento de consultar el borrador");

  console.table({
    encontrado: draftProduct !== null,
    resultadoEsperado: false,
  });

  if (publishedProducts.length !== 1) {
    throw new Error(
      "El catálogo público debería contener exactamente un producto.",
    );
  }

  if (!publishedProduct) {
    throw new Error(
      "Vestido Aurora debería ser visible públicamente.",
    );
  }

  if (draftProduct !== null) {
    throw new Error(
      "Vestido Luna no debería ser visible públicamente.",
    );
  }

  console.log(
    "\nDemostración completada correctamente.",
  );
}

main().catch((error: unknown) => {
  console.error(
    "\nLa demostración de Supabase falló:",
    error,
  );

  process.exitCode = 1;
});