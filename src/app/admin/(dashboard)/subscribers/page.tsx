import { SubscribersTable } from "@/components/admin/subscribers-table";
import { getAdminClient } from "@/lib/supabase/admin";

export default async function AdminSubscribersPage() {
  const admin = getAdminClient();
  const { data: subscribers } = admin
    ? await admin
        .from("newsletter_subscribers")
        .select("email, source, promo_interest, created_at")
        .order("created_at", { ascending: false })
    : { data: [] };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Newsletter</h2>
        <p className="text-sm text-muted-foreground">
          Email signups captured from the storefront.
        </p>
      </div>
      <SubscribersTable subscribers={subscribers ?? []} />
    </div>
  );
}
