/// <reference types="node" />

import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { SupabaseProductImageStorage } from "../src/infrastructure/storage/supabase-product-image-storage";
import type { Database } from "../src/infrastructure/supabase/database.types";

const BUCKET_NAME = "product-images";

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

  const anonymousClient = createClient<Database>(
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

  const anonymousStorage =
    new SupabaseProductImageStorage(
      anonymousClient,
    );

  const imageData = createTinyPng();

  const unauthorizedProductId = randomUUID();
  const unauthorizedImageId = randomUUID();

  let anonymousUploadWasBlocked = false;

  try {
    await anonymousStorage.upload({
      productId: unauthorizedProductId,
      imageId: unauthorizedImageId,
      extension: "png",
      contentType: "image/png",
      data: imageData,
    });
  } catch (error) {
    anonymousUploadWasBlocked = true;

    console.log(
      "\n1. Carga anónima bloqueada correctamente",
    );

    console.table({
      bloqueada: true,
      mensaje:
        error instanceof Error
          ? error.message
          : "Error desconocido",
    });
  }

  if (!anonymousUploadWasBlocked) {
    throw new Error(
      "Un visitante anónimo logró subir una imagen.",
    );
  }

  const adminClient = createClient<Database>(
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
    await adminClient.auth.signInWithPassword({
      email,
      password,
    });

  if (signInError) {
    throw new Error(
      `No fue posible iniciar sesión: ${signInError.message}`,
    );
  }

  const storage = new SupabaseProductImageStorage(
    adminClient,
  );

  const productId = randomUUID();
  const imageId = randomUUID();

  let uploadedPath: string | null = null;

  try {
    const storedImage = await storage.upload({
      productId,
      imageId,
      extension: "png",
      contentType: "image/png",
      data: imageData,
    });

    uploadedPath = storedImage.path;

    console.log(
      "\n2. Imagen subida por administrador",
    );

    console.table({
      ruta: storedImage.path,
      urlPublica: storedImage.publicUrl,
    });

    const publicResponse = await fetch(
      storedImage.publicUrl,
    );

    console.log("\n3. Acceso público");

    console.table({
      disponible: publicResponse.ok,
      estadoHttp: publicResponse.status,
      tipo:
        publicResponse.headers.get("content-type"),
    });

    if (!publicResponse.ok) {
      throw new Error(
        "La imagen subida no está disponible públicamente.",
      );
    }

    const { data: filesBeforeDelete, error: listError } =
      await adminClient.storage
        .from(BUCKET_NAME)
        .list(productId, {
          limit: 100,
          search: imageId,
        });

    if (listError) {
      throw new Error(
        `No fue posible listar las imágenes: ${listError.message}`,
      );
    }

    console.log(
      "\n4. Imagen encontrada en el bucket",
    );

    console.table({
      encontrada: filesBeforeDelete.length === 1,
      archivos: filesBeforeDelete.length,
    });

    await storage.remove([storedImage.path]);
    uploadedPath = null;

    const { data: filesAfterDelete, error: finalListError } =
      await adminClient.storage
        .from(BUCKET_NAME)
        .list(productId, {
          limit: 100,
          search: imageId,
        });

    if (finalListError) {
      throw new Error(
        `No fue posible verificar la eliminación: ${finalListError.message}`,
      );
    }

    console.log("\n5. Imagen eliminada");

    console.table({
      eliminada: filesAfterDelete.length === 0,
      archivosRestantes: filesAfterDelete.length,
    });

    if (filesAfterDelete.length !== 0) {
      throw new Error(
        "La imagen continuó en Storage después de eliminarla.",
      );
    }

    console.log(
      "\nSupabase Storage probado correctamente.",
    );
  } finally {
    if (uploadedPath) {
      await storage.remove([uploadedPath]);
    }

    await adminClient.auth.signOut();
  }
}

main().catch((error: unknown) => {
  console.error(
    "\nLa demostración de Storage falló:",
    error,
  );

  process.exitCode = 1;
});