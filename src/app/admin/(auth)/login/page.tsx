import { LoginForm } from "./login-form";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect: redirectTo } = await searchParams;

  const safeRedirect =
    redirectTo?.startsWith("/admin") && !redirectTo.startsWith("//")
      ? redirectTo
      : undefined;

  return <LoginForm redirectTo={safeRedirect} />;
}
