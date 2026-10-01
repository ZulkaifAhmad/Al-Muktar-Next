import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY || "dummy_resend_key";
const resend = new Resend(resendApiKey);
const FROM = process.env.RESEND_FROM || "onboarding@resend.dev";

/**
 * Send OTP email for signup verification or password reset.
 * @param {string} to - recipient email
 * @param {string} otp - 6-digit OTP code
 * @param {"verify"|"reset"} type - purpose of the OTP
 */
export async function sendOtpEmail(to, otp, type = "verify") {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not configured. Mocking email sending for OTP:", otp);
    return;
  }

  const isReset = type === "reset";
  const subject = isReset
    ? "Al-Mukhtar Academy — Password Reset OTP"
    : "Al-Mukhtar Academy — Verify Your Email";

  const heading = isReset ? "Reset Your Password" : "Verify Your Email";
  const intro = isReset
    ? "You requested a password reset. Use the OTP below to reset your password. This code is valid for <strong>10 minutes</strong>."
    : "Thank you for registering. Use the OTP below to verify your email address. This code is valid for <strong>10 minutes</strong>.";

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>${subject}</title>
    </head>
    <body style="margin:0;padding:0;background:#f4f6f4;font-family:'Segoe UI',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f4;padding:40px 20px;">
        <tr>
          <td align="center">
            <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
              <!-- Header -->
              <tr>
                <td style="background:#0F6E8C;padding:32px 40px;">
                  <p style="margin:0;color:#C0DAD1;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">Al-Mukhtar Institute</p>
                  <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;font-weight:700;">${heading}</h1>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding:36px 40px;">
                  <p style="margin:0 0 24px;color:#4b5563;font-size:15px;line-height:1.6;">${intro}</p>
                  <!-- OTP Box -->
                  <div style="background:#f9fafb;border:2px dashed #0F6E8C;border-radius:10px;padding:28px;text-align:center;margin:0 0 28px;">
                    <p style="margin:0 0 6px;color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:2px;">Your OTP Code</p>
                    <span style="font-size:40px;font-weight:800;letter-spacing:10px;color:#0F6E8C;">${otp}</span>
                  </div>
                  <p style="margin:0;color:#9ca3af;font-size:13px;line-height:1.5;">
                    If you did not request this, please ignore this email. Do not share this code with anyone.
                  </p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb;">
                  <p style="margin:0;color:#9ca3af;font-size:12px;">© ${new Date().getFullYear()} Al-Mukhtar Institute. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await resend.emails.send({ from: FROM, to, subject, html });
}

/**
 * Send a broadcast email to multiple users (admin feature).
 * @param {string[]} emails - list of recipient emails
 * @param {string} subject - email subject
 * @param {string} message - plain-text message body
 */
export async function sendBulkEmail(emails, subject, message) {
  if (!process.env.RESEND_API_KEY) return;
  const CHUNK = 50;
  const promises = [];

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
    <body style="margin:0;padding:0;background:#f4f6f4;font-family:'Segoe UI',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f4;padding:40px 20px;">
        <tr>
          <td align="center">
            <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
              <tr>
                <td style="background:#0F6E8C;padding:32px 40px;">
                  <p style="margin:0;color:#C0DAD1;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">Al-Mukhtar Institute</p>
                  <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;font-weight:700;">${subject}</h1>
                </td>
              </tr>
              <tr>
                <td style="padding:36px 40px;">
                  <p style="margin:0;color:#374151;font-size:15px;line-height:1.7;white-space:pre-wrap;">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
                </td>
              </tr>
              <tr>
                <td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb;">
                  <p style="margin:0;color:#9ca3af;font-size:12px;">© ${new Date().getFullYear()} Al-Mukhtar Institute. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  for (let i = 0; i < emails.length; i += CHUNK) {
    const chunk = emails.slice(i, i + CHUNK);
    promises.push(resend.emails.send({ from: FROM, to: chunk, subject, html }));
  }

  await Promise.all(promises);
}

/**
 * Send contact form submission to ADMIN_EMAIL via Resend.
 */
export async function sendContactFormEmail({ name, email, phone, subject, message }) {
  const adminEmail = process.env.ADMIN_EMAIL || "izhar5ullah@gmail.com";

  const emailSubject = `[Al-Mukhtar Contact Form] ${subject}`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>${emailSubject}</title>
    </head>
    <body style="margin:0;padding:0;background:#f4f6f8;font-family:'Segoe UI',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 4px 18px rgba(0,0,0,0.06);border:1px solid #e5e7eb;">
              <tr>
                <td style="background:#0F6E8C;padding:32px 40px;">
                  <p style="margin:0;color:#C0DAD1;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">Al-Mukhtar Institute</p>
                  <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;font-weight:700;">New Contact Message</h1>
                </td>
              </tr>
              <tr>
                <td style="padding:36px 40px;">
                  <p style="margin:0 0 20px;color:#4b5563;font-size:15px;line-height:1.6;">
                    You received a new inquiry from the website contact form:
                  </p>
                  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:10px;padding:20px;margin-bottom:24px;border:1px solid #e5e7eb;">
                    <tr>
                      <td style="padding:6px 0;color:#6b7280;font-size:13px;font-weight:600;width:120px;">Sender Name:</td>
                      <td style="padding:6px 0;color:#111827;font-size:14px;font-weight:700;">${name}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;color:#6b7280;font-size:13px;font-weight:600;">Email Address:</td>
                      <td style="padding:6px 0;color:#0F6E8C;font-size:14px;font-weight:600;"><a href="mailto:${email}" style="color:#0F6E8C;text-decoration:none;">${email}</a></td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;color:#6b7280;font-size:13px;font-weight:600;">Phone Number:</td>
                      <td style="padding:6px 0;color:#111827;font-size:14px;">${phone || "N/A"}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;color:#6b7280;font-size:13px;font-weight:600;">Subject:</td>
                      <td style="padding:6px 0;color:#111827;font-size:14px;font-weight:600;">${subject}</td>
                    </tr>
                  </table>
                  <p style="margin:0 0 8px;color:#374151;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Message:</p>
                  <div style="background:#ffffff;border:1px solid #d1d5db;border-radius:8px;padding:18px;color:#1f2937;font-size:14px;line-height:1.7;white-space:pre-wrap;">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
                </td>
              </tr>
              <tr>
                <td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb;text-align:center;">
                  <p style="margin:0;color:#9ca3af;font-size:12px;">© ${new Date().getFullYear()} Al-Mukhtar Institute. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await resend.emails.send({
    from: FROM,
    to: adminEmail,
    subject: emailSubject,
    replyTo: email,
    html,
  });
}
