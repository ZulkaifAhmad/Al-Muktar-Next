import { NextResponse } from "next/server";
import { sendContactFormEmail } from "@/lib/email";
import { contactSchema, validatePayload } from "@/lib/validations";

export async function POST(req) {
  try {
    const body = await req.json();
    const validation = validatePayload(contactSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: validation.error },
        { status: 400 }
      );
    }

    const { name, email, phone, subject, message } = validation.data;

    try {
      await sendContactFormEmail({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : "",
        subject: subject.trim(),
        message: message.trim(),
      });
    } catch (emailErr) {
      console.error("Failed to send contact email:", emailErr.message);
    }

    return NextResponse.json({
      success: true,
      message: "Your message has been sent successfully to the administration.",
    });
  } catch (error) {
    console.error("ContactForm error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to send contact message." },
      { status: 500 }
    );
  }
}
