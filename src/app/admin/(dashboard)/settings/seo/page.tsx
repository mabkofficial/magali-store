import { SettingsForm } from "@/components/admin/settings-form";
import { getStoreSettingsForAdmin } from "@/lib/store-settings";

export default async function SeoSettingsPage() {
  const settings = await getStoreSettingsForAdmin();
  if (!settings) {
    return <p className="text-sm text-muted-foreground">Store settings unavailable.</p>;
  }

  return (
    <div className="stack-md">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">SEO defaults</h2>
        <p className="text-sm text-muted-foreground">
          Fallback metadata when products do not override values.
        </p>
      </div>
      <SettingsForm settings={settings} fields="seo" />
    </div>
  );
}
