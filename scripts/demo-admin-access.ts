/// <reference types="node" />

import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../src/infrastructure/supabase/database.types";

function requireEnvironmentVariable(name: string): string {
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

  const unauthorizedProductId = randomUUID();

  const { error: anonymousInsertError } =
    await anonymousClient.from("products").insert({
      id: unauthorizedProductId,
      name: "Producto no autorizado",
      slug: `producto-no-autorizado-${unauthorizedProductId.slice(0, 8)}`,
      short_description: "No debe guardarse.",
      description: "Intento anónimo.",
      price_in_pesos: 100_000,
      category_id:
        "10000000-0000-0000-0000-000000000001",
      status: "draft",
    });

  console.log("\n1. Intento anónimo de escritura");

  console.table({
    bloqueado: anonymousInsertError !== null,
    mensaje:
      anonymousInsertError?.message ??
      "La escritura no fue bloqueada",
  });

  if (!anonymousInsertError) {
    throw new Error(
      "Un visitante anónimo logró crear un producto.",
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

  const { data: signInData, error: signInError } =
    await adminClient.auth.signInWithPassword({
      email,
      password,
    });

  if (signInError) {
    throw new Error(
      `No fue posible iniciar sesión: ${signInError.message}`,
    );
  }

  console.log("\n2. Inicio de sesión administrativo");

  console.table({
    autenticado: true,
    usuario: signInData.user.email,
  });

  const productId = randomUUID();
  const slug = `producto-admin-${productId.slice(0, 8)}`;

  const { data: createdProduct, error: createError } =
    await adminClient
      .from("products")
      .insert({
        id: productId,
        name: "Producto administrativo temporal",
        slug,
        short_description:
          "Producto creado para probar RLS.",
        description:
          "Este registro será eliminado al terminar.",
        price_in_pesos: 125_000,
        category_id:
          "10000000-0000-0000-0000-000000000001",
        status: "draft",
      })
      .select("id, name, slug, status")
      .single();

  if (createError) {
    throw new Error(
      `El administrador no pudo crear el producto: ${createError.message}`,
    );
  }

  console.log("\n3. Producto creado por administrador");

  console.table(createdProduct);

  const { data: updatedProduct, error: updateError } =
    await adminClient
      .from("products")
      .update({
        status: "hidden",
      })
      .eq("id", productId)
      .select("id, name, status")
      .single();

  if (updateError) {
    throw new Error(
      `El administrador no pudo editar el producto: ${updateError.message}`,
    );
  }

  console.log("\n4. Producto actualizado");

  console.table(updatedProduct);

  const { error: deleteError } = await adminClient
    .from("products")
    .delete()
    .eq("id", productId);

  if (deleteError) {
    throw new Error(
      `El administrador no pudo eliminar el producto: ${deleteError.message}`,
    );
  }

  console.log("\n5. Producto temporal eliminado");

  console.table({
    eliminado: true,
    id: productId,
  });

  await adminClient.auth.signOut();

  console.log(
    "\nDemostración administrativa completada correctamente.",
  );
}

main().catch((error: unknown) => {
  console.error(
    "\nLa demostración administrativa falló:",
    error,
  );

  process.exitCode = 1;
});