export function safeCustomerRedirectPath(path: string | null | undefined): string {
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return "/account";
  }
  if (path.startsWith("/account") || path.startsWith("/admin")) {
    return path;
  }
  return "/account";
}

export const ACCOUNT_AUTH_PATHS = new Set([
  "/account/login",
  "/account/register",
  "/account/forgot-password",
  "/account/reset-password",
]);

export function isAccountAuthPath(pathname: string): boolean {
  return ACCOUNT_AUTH_PATHS.has(pathname);
}
