import { ProfileForms } from "./profile-forms";
import { getCustomerContext } from "@/lib/customer/auth";
import { createClient } from "@/lib/supabase/server";

export default async function AccountProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ password?: string }>;
}) {
  const customer = await getCustomerContext();
  if (!customer) return null;

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("customer_profiles")
    .select("full_name, phone")
    .eq("user_id", customer.userId)
    .maybeSingle();

  const { password } = await searchParams;

  return (
    <ProfileForms
      email={customer.email}
      fullName={profile?.full_name ?? customer.fullName ?? ""}
      phone={profile?.phone ?? ""}
      isGoogleAuth={customer.isGoogleAuth}
      passwordUpdated={password === "updated"}
    />
  );
}
