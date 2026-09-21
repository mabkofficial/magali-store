export const AUTH_NEXT_COOKIE = "magali_auth_next";

export function authNextCookieValue(next: string): string {
  return encodeURIComponent(next);
}

export function parseAuthNextCookie(raw: string | undefined): string | null {
  if (!raw) return null;
  try {
    return decodeURIComponent(raw);
  } catch {
    return null;
  }
}
