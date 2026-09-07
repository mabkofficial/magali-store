import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NotificationsSettingsPage() {
  return (
    <div className="stack-md">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Notifications</h2>
        <p className="text-sm text-muted-foreground">
          Email delivery is configured via environment variables.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Email routing</CardTitle>
          <CardDescription>
            Set these in `.env.local` (local) or your Vercel project settings (production).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>
            <code className="rounded bg-muted px-2 py-1">CONTACT_TO_EMAIL</code> — inbox for contact form and order notifications
          </p>
          <p>
            <code className="rounded bg-muted px-2 py-1">RESEND_FROM_EMAIL</code> — verified Resend sender (e.g.{" "}
            <code className="rounded bg-muted px-2 py-1">Magali &lt;hello@magali.com&gt;</code>)
          </p>
          <p>
            <code className="rounded bg-muted px-2 py-1">RESEND_API_KEY</code> — Resend API key for sending mail
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
