import { SettingsForm } from "@/components/admin/settings-form";
import { getStoreSettingsForAdmin } from "@/lib/store-settings";

export default async function GeneralSettingsPage() {
  const settings = await getStoreSettingsForAdmin();
  if (!settings) {
    return <p className="text-sm text-muted-foreground">Store settings unavailable.</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">General</h2>
        <p className="text-sm text-muted-foreground">Store identity and contact details.</p>
      </div>
      <SettingsForm settings={settings} fields="general" />
    </div>
  );
}
