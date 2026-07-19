import { createContext } from "react";
import type {
  Session,
  User,
} from "@supabase/supabase-js";

export interface AuthContextValue {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;

  signIn(
    email: string,
    password: string,
  ): Promise<void>;

  signOut(): Promise<void>;
}

export const AuthContext =
  createContext<AuthContextValue | null>(null);