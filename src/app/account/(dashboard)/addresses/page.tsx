import { AddressManager } from "./address-manager";
import { getCustomerContext } from "@/lib/customer/auth";
import { createClient } from "@/lib/supabase/server";

export default async function AccountAddressesPage() {
  const customer = await getCustomerContext();
  if (!customer) return null;

  const supabase = await createClient();
  const { data: addresses } = await supabase
    .from("customer_addresses")
    .select("*")
    .eq("user_id", customer.userId)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  return (
    <div>
      <h2 className="font-display text-xl text-ink">Addresses</h2>
      <p className="mt-2 text-sm text-muted">
        Saved for faster checkout in the future.
      </p>
      <AddressManager addresses={addresses ?? []} />
    </div>
  );
}
