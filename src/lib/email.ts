interface SendEmailOptions {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}

export function getResendFromEmail(): string {
  return process.env.RESEND_FROM_EMAIL ?? "Magali <onboarding@resend.dev>";
}

export function isTransactionalEmailConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY?.trim() && process.env.CONTACT_TO_EMAIL?.trim(),
  );
}

export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  const resendKey = process.env.RESEND_API_KEY;
  const fromEmail = getResendFromEmail();

  if (!resendKey) {
    console.log("Email not configured:", options.subject);
    return false;
  }

  const payload: Record<string, unknown> = {
    from: fromEmail,
    to: options.to,
    subject: options.subject,
    text: options.text,
  };

  if (options.html) {
    payload.html = options.html;
  }

  if (options.replyTo) {
    payload.reply_to = options.replyTo;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    console.error("Resend error:", await response.text());
    return false;
  }

  return true;
}

export {
  sendFulfillmentEmail,
  sendOrderConfirmationEmail,
} from "@/lib/order-emails";
