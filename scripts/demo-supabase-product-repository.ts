/// <reference types="node" />

import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import type { Clock } from "../src/core/ports/clock";
import type { IdGenerator } from "../src/core/ports/id-generator";
import { AddProductImage } from "../src/core/use-cases/add-product-image";
import { ArchiveProduct } from "../src/core/use-cases/archive-product";
import { CreateProduct } from "../src/core/use-cases/create-product";
import { HideProduct } from "../src/core/use-cases/hide-product";
import { PublishProduct } from "../src/core/use-cases/publish-product";
import { SupabaseProductRepository } from "../src/infrastructure/repositories/supabase-product-repository";
import type { Database } from "../src/infrastructure/supabase/database.types";

class RandomIdGenerator implements IdGenerator {
  generate(): string {
    return randomUUID();
  }
}

class SystemClock implements Clock {
  now(): Date {
    return new Date();
  }
}

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

function printProduct(
  title: string,
  product: {
    id: string;
    name: string;
    slug: string;
    status: string;
    imageCount: number;
  },
): void {
  console.log(`\n${title}`);

  console.table({
    id: product.id,
    nombre: product.name,
    slug: product.slug,
    estado: product.status,
    imagenes: product.imageCount,
  });
}

async function main(): Promise<void> {
  const supabaseUrl = requireEnvironmentVariable(
    "VITE_SUPABASE_URL",
  );

  const publishableKey = requireEnvironmentVariable(
    "VITE_SUPABASE_PUBLISHABLE_KEY",
  );

  const email = requireEnvironmentVariable(
    "LOCAL_ADMIN_EMAIL",
  );

  const password = requireEnvironmentVariable(
    "LOCAL_ADMIN_PASSWORD",
  );

  const client = createClient<Database>(
    supabaseUrl,
    publishableKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    },
  );

  const { error: signInError } =
    await client.auth.signInWithPassword({
      email,
      password,
    });

  if (signInError) {
    throw new Error(
      `No fue posible iniciar sesión: ${signInError.message}`,
    );
  }

  const repository =
    new SupabaseProductRepository(client);

  const createProduct = new CreateProduct(
    repository,
    new RandomIdGenerator(),
    new SystemClock(),
  );

  const addProductImage =
    new AddProductImage(repository);

  const publishProduct =
    new PublishProduct(repository);

  const hideProduct = new HideProduct(repository);
  const archiveProduct = new ArchiveProduct(repository);

  let temporaryProductId: string | null = null;

  try {
    const uniqueSuffix = randomUUID().slice(0, 8);

    const product = await createProduct.execute({
      name: "Vestido temporal Supabase",
      slug: `vestido-temporal-${uniqueSuffix}`,
      shortDescription:
        "Producto temporal para probar el repositorio.",
      description:
        "Este producto será eliminado al terminar la demostración.",
      priceInPesos: 195_000,
      categoryId:
        "10000000-0000-0000-0000-000000000001",
      customizable: true,
      madeToOrder: true,
      preparationDays: 10,
    });

    temporaryProductId = product.id;

    printProduct("1. Producto persistido", product);

    await addProductImage.execute(product.id, {
      id: randomUUID(),
      path: `products/${product.id}/cover.webp`,
      altText: "Vestido temporal visto de frente",
      position: 1,
      isCover: true,
    });

    const productWithImage =
      await repository.findById(product.id);

    if (!productWithImage) {
      throw new Error(
        "El producto desapareció después de agregar la imagen.",
      );
    }

    printProduct(
      "2. Imagen persistida",
      productWithImage,
    );

    const publishedProduct =
      await publishProduct.execute(product.id);

    printProduct(
      "3. Producto publicado",
      publishedProduct,
    );

    const storedBySlug =
      await repository.findBySlug(product.slug);

    if (!storedBySlug) {
      throw new Error(
        "No fue posible encontrar el producto por slug.",
      );
    }

    printProduct(
      "4. Producto recuperado por slug",
      storedBySlug,
    );

    const hiddenProduct =
      await hideProduct.execute(product.id);

    printProduct(
      "5. Producto ocultado",
      hiddenProduct,
    );

    const archivedProduct =
      await archiveProduct.execute(product.id);

    printProduct(
      "6. Producto archivado",
      archivedProduct,
    );

    await repository.deletePermanently(product.id);

    temporaryProductId = null;

    const deletedProduct =
      await repository.findById(product.id);

    console.log("\n7. Eliminación definitiva");

    console.table({
      eliminado: deletedProduct === null,
      resultadoEsperado: true,
    });

    if (deletedProduct !== null) {
      throw new Error(
        "El producto continuó existiendo después de eliminarlo.",
      );
    }

    console.log(
      "\nRepositorio de Supabase probado correctamente.",
    );
  } finally {
    if (temporaryProductId) {
      const existingProduct =
        await repository.findById(temporaryProductId);

      if (existingProduct) {
        await repository.deletePermanently(
          temporaryProductId,
        );
      }
    }

    await client.auth.signOut();
  }
}

main().catch((error: unknown) => {
  console.error(
    "\nLa demostración del repositorio falló:",
    error,
  );

  process.exitCode = 1;
});