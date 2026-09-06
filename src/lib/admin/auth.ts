import { createClient } from "@/lib/supabase/server";

export type AdminContext = {
  userId: string;
  email: string;
  displayName: string;
};

function getAdminAllowlist(): Set<string> {
  const raw = process.env.ADMIN_EMAILS ?? "";
  return new Set(
    raw
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

export async function getAdminContext(): Promise<AdminContext | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return null;

  const allowlist = getAdminAllowlist();
  if (allowlist.size > 0 && !allowlist.has(user.email.toLowerCase())) {
    return null;
  }

  const displayName =
    (user.user_metadata?.display_name as string | undefined) ??
    user.email.split("@")[0];

  return {
    userId: user.id,
    email: user.email,
    displayName,
  };
}

export function isEmailAdminAllowed(email: string): boolean {
  const allowlist = getAdminAllowlist();
  if (allowlist.size === 0) return true;
  return allowlist.has(email.toLowerCase());
}
