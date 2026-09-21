import { NextResponse } from "next/server";
import { z } from "zod";
import { sendEmail } from "@/lib/email";

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

    const sent = await sendEmail({
      to: contactEmail,
      replyTo: data.email,
      subject: `[Magali Contact] ${data.subject} | ${data.name}`,
      text: `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone ?? "N/A"}\nSubject: ${data.subject}\n\nMessage:\n${data.message}`,
    });

    if (!sent) {
      return NextResponse.json(
        { error: "Unable to send message. Please try again." },
        { status: 503 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Unable to send message. Please try again." },
      { status: 500 },
    );
  }
}
