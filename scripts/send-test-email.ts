import { loadEnvLocal } from "./load-env-local.mjs";
import { sendEmail } from "../src/lib/email";

loadEnvLocal();

async function main() {
  const inbox = process.env.CONTACT_TO_EMAIL;
  if (!process.env.RESEND_API_KEY || !inbox) {
    console.error("Set RESEND_API_KEY and CONTACT_TO_EMAIL in .env.local first.");
    process.exit(1);
  }

  const ok = await sendEmail({
    to: inbox,
    subject: "[Magali] CLI test email",
    text: "If you received this, Resend is configured correctly for Magali Store.",
  });

  if (!ok) {
    console.error("Send failed — check Resend dashboard and RESEND_FROM_EMAIL.");
    process.exit(1);
  }

  console.log(`Sent test email to ${inbox}`);
}

main();
