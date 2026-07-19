import {
  useEffect,
  useState,
  type FormEvent,
} from "react";
import {
  Navigate,
  useNavigate,
} from "react-router";
import { useAuth } from "./use-auth";

export function AdminLoginPage() {
  const navigate = useNavigate();

  const {
    session,
    isAdmin,
    isLoading,
    error,
    signIn,
  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  useEffect(() => {
    if (
      !isLoading &&
      session &&
      isAdmin
    ) {
      navigate("/admin", {
        replace: true,
      });
    }
  }, [
    session,
    isAdmin,
    isLoading,
    navigate,
  ]);

  if (
    !isLoading &&
    session &&
    isAdmin
  ) {
    return (
      <Navigate
        to="/admin"
        replace
      />
    );
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    try {
      await signIn(
        email.trim(),
        password,
      );

      navigate("/admin", {
        replace: true,
      });
    } catch {
      // El contexto ya expone un mensaje seguro.
    }
  }

  return (
    <main className="admin-login">
      <section className="admin-login__card">
        <div>
          <p className="admin-eyebrow">
            Administración
          </p>

          <h1>Gestiona tu boutique</h1>

          <p className="admin-login__intro">
            Inicia sesión para publicar y administrar
            los productos del catálogo.
          </p>
        </div>

        <form
          className="admin-form"
          onSubmit={(event) => {
            void handleSubmit(event);
          }}
        >
          <label>
            <span>Correo electrónico</span>

            <input
              type="email"
              value={email}
              autoComplete="email"
              required
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
          </label>

          <label>
            <span>Contraseña</span>

            <input
              type="password"
              value={password}
              autoComplete="current-password"
              required
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
          </label>

          {error ? (
            <p
              className="admin-form__error"
              role="alert"
            >
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isLoading}
          >
            {isLoading
              ? "Ingresando..."
              : "Ingresar"}
          </button>
        </form>
      </section>
    </main>
  );
}