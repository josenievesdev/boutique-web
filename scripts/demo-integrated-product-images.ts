/// <reference types="node" />

import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import type { Clock } from "../src/core/ports/clock";
import type { IdGenerator } from "../src/core/ports/id-generator";
import { CreateProduct } from "../src/core/use-cases/create-product";
import { DeleteProductPermanently } from "../src/core/use-cases/delete-product-permanently";
import { PublishProduct } from "../src/core/use-cases/publish-product";
import { RemoveProductImage } from "../src/core/use-cases/remove-product-image";
import { UploadProductImage } from "../src/core/use-cases/upload-product-image";
import { SupabaseProductRepository } from "../src/infrastructure/repositories/supabase-product-repository";
import { SupabaseProductImageStorage } from "../src/infrastructure/storage/supabase-product-image-storage";
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

function createTinyPng(): ArrayBuffer {
  const base64 =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9ZV7sAAAAASUVORK5CYII=";

  const buffer = Buffer.from(base64, "base64");

  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength,
  ) as ArrayBuffer;
}

async function main(): Promise<void> {
  const url = requireEnvironmentVariable(
    "VITE_SUPABASE_URL",
  );

  const key = requireEnvironmentVariable(
    "VITE_SUPABASE_PUBLISHABLE_KEY",
  );

  const email = requireEnvironmentVariable(
    "LOCAL_ADMIN_EMAIL",
  );

  const password = requireEnvironmentVariable(
    "LOCAL_ADMIN_PASSWORD",
  );

  const client = createClient<Database>(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

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

  const storage =
    new SupabaseProductImageStorage(client);

  const idGenerator = new RandomIdGenerator();

  const createProduct = new CreateProduct(
    repository,
    idGenerator,
    new SystemClock(),
  );

  const uploadImage = new UploadProductImage(
    repository,
    storage,
    idGenerator,
  );

  const removeImage = new RemoveProductImage(
    repository,
    storage,
  );

  const publishProduct = new PublishProduct(
    repository,
  );

  const deleteProduct =
    new DeleteProductPermanently(
      repository,
      storage,
    );

  let productId: string | null = null;

  try {
    const suffix = randomUUID().slice(0, 8);

    const product = await createProduct.execute({
      name: "Producto integrado temporal",
      slug: `producto-integrado-${suffix}`,
      shortDescription:
        "Prueba integrada de imágenes.",
      description:
        "Producto temporal creado para probar Storage y PostgreSQL.",
      priceInPesos: 210_000,
      categoryId:
        "10000000-0000-0000-0000-000000000001",
      customizable: true,
      madeToOrder: true,
      preparationDays: 10,
    });

    productId = product.id;

    console.log("\n1. Producto creado");

    console.table({
      id: product.id,
      estado: product.status,
      imagenes: product.imageCount,
    });

    const firstUpload = await uploadImage.execute({
      productId: product.id,
      extension: "png",
      contentType: "image/png",
      data: createTinyPng(),
      altText: "Portada temporal",
      position: 1,
      isCover: true,
    });

    console.log(
      "\n2. Imagen subida y relacionada",
    );

    console.table({
      imageId: firstUpload.imageId,
      ruta: firstUpload.path,
      url: firstUpload.publicUrl,
      imagenes:
        firstUpload.product.imageCount,
    });

    const publicResponse = await fetch(
      firstUpload.publicUrl,
    );

    if (!publicResponse.ok) {
      throw new Error(
        "La primera imagen no está disponible públicamente.",
      );
    }

const publishedProduct =
  await publishProduct.execute(product.id);

console.log("\n3. Producto publicado");

console.table({
  estado: publishedProduct.status,
  imagenes: publishedProduct.imageCount,
});

const secondUpload = await uploadImage.execute({
  productId: product.id,
  extension: "png",
  contentType: "image/png",
  data: createTinyPng(),
  altText: "Segunda imagen temporal",
  position: 2,
  isCover: false,
});

console.log("\n4. Segunda imagen subida");

console.table({
  ruta: secondUpload.path,
  imagenes:
    secondUpload.product.imageCount,
});

const productAfterRemoval =
  await removeImage.execute(
    product.id,
    firstUpload.imageId,
  );

const remainingImage =
  productAfterRemoval.images[0];

console.log(
  "\n5. Primera imagen eliminada",
);

console.table({
  imagenes: productAfterRemoval.imageCount,
  nuevaPortada:
    remainingImage?.id ===
      secondUpload.imageId &&
    remainingImage.isCover,
});

const removedResponse = await fetch(
  firstUpload.publicUrl,
);

if (removedResponse.ok) {
  throw new Error(
    "La imagen eliminada continúa disponible.",
  );
}

    await deleteProduct.execute(product.id);
    productId = null;

    console.log(
      "\n6. Producto e imágenes eliminados",
    );

    const deletedProduct =
      await repository.findById(product.id);

    const deletedImageResponse = await fetch(
      secondUpload.publicUrl,
    );

    console.table({
      productoEliminado:
        deletedProduct === null,
      imagenEliminada:
        !deletedImageResponse.ok,
    });

    if (
      deletedProduct !== null ||
      deletedImageResponse.ok
    ) {
      throw new Error(
        "La limpieza integrada no se completó.",
      );
    }

    console.log(
      "\nIntegración de imágenes completada correctamente.",
    );
  } finally {
    if (productId) {
      const product =
        await repository.findById(productId);

      if (product) {
        await deleteProduct.execute(productId);
      }
    }

    await client.auth.signOut();
  }
}

main().catch((error: unknown) => {
  console.error(
    "\nLa demostración integrada falló:",
    error,
  );

  process.exitCode = 1;
});