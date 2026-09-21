import { NextResponse } from "next/server";
import { getAdminContext } from "@/lib/admin/auth";
import { sendEmail } from "@/lib/email";

export async function POST() {
  const admin = await getAdminContext();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const inbox = process.env.CONTACT_TO_EMAIL;
  if (!process.env.RESEND_API_KEY || !inbox) {
    return NextResponse.json(
      {
        error:
          "Email is not configured. Set RESEND_API_KEY and CONTACT_TO_EMAIL in Vercel.",
      },
      { status: 503 },
    );
  }

  const sent = await sendEmail({
    to: [inbox, admin.email],
    subject: "[Magali] Test email from admin",
    text: `This is a test message from the Magali admin panel.\n\nSent to: ${inbox} and ${admin.email}\n\nIf you received this, Resend is configured correctly.`,
  });

  if (!sent) {
    return NextResponse.json(
      { error: "Resend rejected the message. Check domain verification and RESEND_FROM_EMAIL." },
      { status: 502 },
    );
  }

  return NextResponse.json({ success: true });
}
