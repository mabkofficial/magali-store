"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { siteConfig } from "@/config/site";
import { isEmailAdminAllowed } from "@/lib/admin/auth";
import {
  bootstrapCustomerAccount,
  linkOrdersToUser,
} from "@/lib/customer/auth";
import { sendWelcomeEmail } from "@/lib/customer/emails";
import { safeCustomerRedirectPath } from "@/lib/customer/redirect";
import { createClient } from "@/lib/supabase/server";

async function siteOrigin(): Promise<string> {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  const proto = headerList.get("x-forwarded-proto") ?? "https";
  if (host) return `${proto}://${host}`;
  return siteConfig.url.replace(/\/$/, "");
}

export async function customerSignIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeCustomerRedirectPath(String(formData.get("next") ?? ""));

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    await bootstrapCustomerAccount(data.user);
  }

  redirect(next);
}

export async function customerSignUp(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("fullName") ?? "").trim();
  const next = safeCustomerRedirectPath(String(formData.get("next") ?? ""));

  if (isEmailAdminAllowed(email)) {
    return {
      error:
        "This email is registered for store administration. Use the admin login instead.",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: fullName ? { full_name: fullName } : undefined,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    await bootstrapCustomerAccount(data.user);
    await linkOrdersToUser(data.user.id, email);
    if (data.user.email) {
      void sendWelcomeEmail(data.user.email, fullName || null);
    }
  }

  redirect(next);
}

export async function customerSignOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/account/login");
}

export async function customerRequestPasswordReset(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const origin = await siteOrigin();

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/account/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true as const };
}

export async function customerUpdatePassword(formData: FormData) {
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message };
  }

  redirect("/account/profile?password=updated");
}
