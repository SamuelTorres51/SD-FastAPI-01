export interface SessionUser {
  email: string;
  id: string;
  name: string;
}

const TOKEN_KEY = "auth:token";
const USER_KEY = "auth:user";

function hasStorage() {
  return typeof localStorage !== "undefined";
}

export function getToken(): string | null {
  if (!hasStorage()) {
    return null;
  }

  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): SessionUser | null {
  if (!hasStorage()) {
    return null;
  }

  const raw = localStorage.getItem(USER_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export function saveSession(token: string, user: SessionUser) {
  if (!hasStorage()) {
    return;
  }

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  if (!hasStorage()) {
    return;
  }

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated() {
  return getToken() !== null;
}
