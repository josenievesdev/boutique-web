/// <reference types="node" />

import { createClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";
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

async function findUserByEmail(
  email: string,
  adminClient: ReturnType<
    typeof createClient<Database>
  >,
): Promise<User | null> {
  const { data, error } =
    await adminClient.auth.admin.listUsers({
      page: 1,
      perPage: 100,
    });

  if (error) {
    throw new Error(
      `No fue posible consultar los usuarios: ${error.message}`,
    );
  }

  return (
    data.users.find(
      (user) =>
        user.email?.toLowerCase() === email.toLowerCase(),
    ) ?? null
  );
}

async function main(): Promise<void> {
  const supabaseUrl = requireEnvironmentVariable(
    "VITE_SUPABASE_URL",
  );

  const secretKey = requireEnvironmentVariable(
    "SUPABASE_SECRET_KEY",
  );

  const email = requireEnvironmentVariable(
    "LOCAL_ADMIN_EMAIL",
  );

  const password = requireEnvironmentVariable(
    "LOCAL_ADMIN_PASSWORD",
  );

  const adminClient = createClient<Database>(
    supabaseUrl,
    secretKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    },
  );

  let user = await findUserByEmail(
    email,
    adminClient,
  );

  if (!user) {
    const { data, error } =
      await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (error) {
      throw new Error(
        `No fue posible crear el usuario: ${error.message}`,
      );
    }

    user = data.user;

    console.log(
      `\nUsuario administrativo creado: ${email}`,
    );
  } else {
    console.log(
      `\nEl usuario administrativo ya existe: ${email}`,
    );
  }

  const { error: adminError } = await adminClient
    .from("admin_users")
    .upsert(
      {
        user_id: user.id,
        email,
      },
      {
        onConflict: "user_id",
      },
    );

  if (adminError) {
    throw new Error(
      `No fue posible asignar el rol administrativo: ${adminError.message}`,
    );
  }

  console.table({
    id: user.id,
    email,
    administrador: true,
  });

  console.log(
    "\nAdministrador local configurado correctamente.",
  );
}

main().catch((error: unknown) => {
  console.error(
    "\nNo fue posible configurar el administrador:",
    error,
  );

  process.exitCode = 1;
});