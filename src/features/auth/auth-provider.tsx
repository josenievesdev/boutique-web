import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../infrastructure/supabase/supabase-client";
import {
  AuthContext,
  type AuthContextValue,
} from "./auth-context";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [session, setSession] =
    useState<Session | null>(null);

  const [isAdmin, setIsAdmin] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const synchronizeSession = useCallback(
    async (
      nextSession: Session | null,
    ): Promise<void> => {
      setSession(nextSession);
      setError(null);

      if (!nextSession) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      const {
        data,
        error: adminCheckError,
      } = await supabase.rpc(
        "current_user_is_admin",
      );

      if (adminCheckError) {
        setIsAdmin(false);
        setError(
          "No fue posible comprobar el acceso administrativo.",
        );
        setIsLoading(false);
        return;
      }

      setIsAdmin(data === true);
      setIsLoading(false);
    },
    [],
  );

  useEffect(() => {
    let isActive = true;

    async function initializeSession(): Promise<void> {
      const {
        data,
        error: sessionError,
      } = await supabase.auth.getSession();

      if (!isActive) {
        return;
      }

      if (sessionError) {
        setError(
          "No fue posible recuperar la sesión.",
        );
        setIsLoading(false);
        return;
      }

      await synchronizeSession(data.session);
    }

    void initializeSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        if (isActive) {
          void synchronizeSession(nextSession);
        }
      },
    );

    return () => {
      isActive = false;
      subscription.unsubscribe();
    };
  }, [synchronizeSession]);

  const signIn = useCallback(
    async (
      email: string,
      password: string,
    ): Promise<void> => {
      setIsLoading(true);
      setError(null);

      const {
        data,
        error: signInError,
      } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setIsLoading(false);
        setError(
          "El correo o la contraseña no son correctos.",
        );

        throw signInError;
      }

      await synchronizeSession(data.session);
    },
    [synchronizeSession],
  );

  const signOut = useCallback(
    async (): Promise<void> => {
      setIsLoading(true);
      setError(null);

      const {
        error: signOutError,
      } = await supabase.auth.signOut();

      if (signOutError) {
        setIsLoading(false);
        setError(
          "No fue posible cerrar la sesión.",
        );

        throw signOutError;
      }

      await synchronizeSession(null);
    },
    [synchronizeSession],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      isAdmin,
      isLoading,
      error,
      signIn,
      signOut,
    }),
    [
      session,
      isAdmin,
      isLoading,
      error,
      signIn,
      signOut,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}