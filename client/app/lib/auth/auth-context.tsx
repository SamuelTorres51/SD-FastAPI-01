import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  signIn as requestSignIn,
  signOut as requestSignOut,
  signUp as requestSignUp,
  type SignInInput,
  type SignUpInput,
} from "./auth-service";
import { getUser, type SessionUser } from "./session";

interface AuthContextValue {
  isAuthenticated: boolean;
  signIn: (input: SignInInput) => Promise<SessionUser>;
  signOut: () => void;
  signUp: (input: SignUpInput) => Promise<SessionUser>;
  user: SessionUser | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(() => getUser());

  const signIn = useCallback(async (input: SignInInput) => {
    const nextUser = await requestSignIn(input);
    setUser(nextUser);
    return nextUser;
  }, []);

  const signUp = useCallback(async (input: SignUpInput) => {
    const nextUser = await requestSignUp(input);
    setUser(nextUser);
    return nextUser;
  }, []);

  const signOut = useCallback(() => {
    requestSignOut();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated: user !== null,
      signIn,
      signOut,
      signUp,
      user,
    }),
    [signIn, signOut, signUp, user]
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error("useAuth precisa estar dentro de um AuthProvider.");
  }

  return context;
}
