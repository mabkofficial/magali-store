import { NextResponse } from "next/server";
import { z } from "zod";
import { wrapBrandEmail } from "@/lib/email/brand-layout";
import { sendEmail } from "@/lib/email";
import { siteConfig } from "@/config/site";

const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(1),
  message: z.string().min(10).max(5000),
  website: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please check your form and try again." },
        { status: 400 },
      );
    }

    const { website, ...data } = parsed.data;

    if (website) {
      return NextResponse.json({ success: true });
    }

    const contactEmail = process.env.CONTACT_TO_EMAIL;

    if (!process.env.RESEND_API_KEY || !contactEmail) {
      console.log("Contact form submission (email not configured):", data);
      return NextResponse.json({ success: true });
    }

    const internalText = `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone ?? "N/A"}\nSubject: ${data.subject}\n\nMessage:\n${data.message}`;

    const sentInternal = await sendEmail({
      to: contactEmail,
      replyTo: data.email,
      subject: `[Magali Contact] ${data.subject} | ${data.name}`,
      text: internalText,
      html: wrapBrandEmail({
        eyebrow: "Magali · Contact",
        headline: "New contact form message",
        preheader: `${data.name} — ${data.subject}`,
        bodyHtml: `<p style="margin:0 0 12px;font-size:14px"><strong>${data.name}</strong> &lt;${data.email}&gt;</p>
<p style="margin:0 0 8px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#6b6860">Subject</p>
<p style="margin:0 0 16px">${data.subject}</p>
<p style="margin:0 0 8px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#6b6860">Message</p>
<p style="margin:0;white-space:pre-wrap;color:#6b6860">${data.message.replace(/</g, "&lt;")}</p>`,
      }),
    });

    if (!sentInternal) {
      return NextResponse.json(
        { error: "Unable to send message. Please try again." },
        { status: 503 },
      );
    }

    await sendEmail({
      to: data.email,
      subject: "We received your message — Magali",
      text: `Hi ${data.name},\n\nThank you for contacting Magali. We received your message about "${data.subject}" and will reply soon.\n\n— Magali`,
      html: wrapBrandEmail({
        headline: "We received your message",
        preheader: "The Magali team will reply soon",
        bodyHtml: `<p style="margin:0 0 16px">Hi ${data.name.replace(/</g, "&lt;")},</p>
<p style="margin:0 0 16px">Thank you for reaching out. We received your message about <strong>${data.subject.replace(/</g, "&lt;")}</strong> and will get back to you as soon as we can.</p>
<p style="margin:0;color:#6b6860;font-size:14px">If your question is urgent, you can also email us at ${siteConfig.contactEmail || "hello@shop.magali.store"}.</p>`,
        cta: { label: "Visit the shop", href: `${siteConfig.url}/shop` },
      }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Unable to send message. Please try again." },
      { status: 500 },
    );
  }
}
