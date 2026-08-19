import { apiRequest } from "../api";
import { clearSession, type SessionUser, saveSession } from "./session";

interface AuthResponse {
  access_token: string;
  token_type: string;
  user: SessionUser;
}

export interface SignInInput {
  email: string;
  password: string;
}

export interface SignUpInput {
  email: string;
  name: string;
  password: string;
}

async function authenticate(path: string, body: SignInInput | SignUpInput) {
  const data = await apiRequest<AuthResponse>(path, {
    body,
    method: "POST",
  });

  saveSession(data.access_token, data.user);

  return data.user;
}

export function signIn(input: SignInInput) {
  return authenticate("/auth/login", input);
}

export function signUp(input: SignUpInput) {
  return authenticate("/auth/signup", input);
}

export function signOut() {
  clearSession();
}
