import { TestEmailButton } from "@/components/admin/test-email-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getProductionEnvChecks } from "@/lib/production-readiness";

export default function NotificationsSettingsPage() {
  const emailChecks = getProductionEnvChecks().filter((c) =>
    ["resend_key", "contact_inbox", "resend_from"].includes(c.id),
  );

  return (
    <div className="stack-md">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Notifications</h2>
        <p className="text-sm text-muted-foreground">
          Order confirmations, fulfillment alerts, and contact form mail use Resend.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Status</CardTitle>
          <CardDescription>
            Values are set in Vercel → Project → Settings → Environment Variables.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <ul className="space-y-2">
            {emailChecks.map((check) => (
              <li key={check.id} className="flex gap-3">
                <span
                  className={
                    check.ok
                      ? "font-medium text-emerald-700"
                      : "font-medium text-amber-700"
                  }
                  aria-hidden
                >
                  {check.ok ? "✓" : "!"}
                </span>
                <span>
                  <span className="font-medium">{check.label}</span>
                  {!check.ok && check.hint ? (
                    <span className="mt-1 block text-muted-foreground">
                      {check.hint}
                    </span>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
          <TestEmailButton />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Environment variables</CardTitle>
          <CardDescription>
            Local: <code className="rounded bg-muted px-2 py-1">.env.local</code>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>
            <code className="rounded bg-muted px-2 py-1">CONTACT_TO_EMAIL</code>{" "}
            — inbox for contact form and new-order alerts
          </p>
          <p>
            <code className="rounded bg-muted px-2 py-1">RESEND_FROM_EMAIL</code>{" "}
            — verified sender (e.g.{" "}
            <code className="rounded bg-muted px-2 py-1">
              Magali &lt;hello@magali.store&gt;
            </code>
            )
          </p>
          <p>
            <code className="rounded bg-muted px-2 py-1">RESEND_API_KEY</code> — Resend
            API key
          </p>
          <p className="text-muted-foreground">
            Domain setup: see <code className="rounded bg-muted px-2 py-1">docs/RESEND_PRODUCTION.md</code>{" "}
            in the repo (Resend + GoDaddy DNS for magali.store).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
