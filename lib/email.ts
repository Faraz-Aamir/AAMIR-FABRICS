import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "farazaamir126@gmail.com";

interface ContactEmailProps {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export async function sendContactEmail({ name, email, subject, message }: ContactEmailProps) {
  return resend.emails.send({
    from: "Aamir Fabrics <onboarding@resend.dev>",
    to: ADMIN_EMAIL,
    subject: `New Contact: ${subject || "No Subject"}`,
    html: `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background: #fafafa; border: 1px solid #e5e5e5;">
        <div style="background: #1a1a1a; padding: 24px; text-align: center;">
          <h1 style="color: #c8a97e; font-size: 20px; margin: 0; letter-spacing: 2px;">AAMIR FABRICS</h1>
        </div>
        <div style="padding: 32px;">
          <h2 style="color: #1a1a1a; font-size: 18px; margin-bottom: 20px;">New Contact Message</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #888; font-size: 13px;">Name</td><td style="padding: 8px 0; color: #1a1a1a;">${name}</td></tr>
            <tr><td style="padding: 8px 0; color: #888; font-size: 13px;">Email</td><td style="padding: 8px 0; color: #1a1a1a;"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #888; font-size: 13px;">Subject</td><td style="padding: 8px 0; color: #1a1a1a;">${subject || "N/A"}</td></tr>
          </table>
          <div style="margin-top: 20px; padding: 16px; background: #fff; border: 1px solid #eee;">
            <p style="color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Message</p>
            <p style="color: #333; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
        </div>
      </div>
    `,
  });
}

export async function sendNewsletterNotification(subscriberEmail: string) {
  return resend.emails.send({
    from: "Aamir Fabrics <onboarding@resend.dev>",
    to: ADMIN_EMAIL,
    subject: `New Newsletter Subscriber: ${subscriberEmail}`,
    html: `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background: #fafafa; border: 1px solid #e5e5e5;">
        <div style="background: #1a1a1a; padding: 24px; text-align: center;">
          <h1 style="color: #c8a97e; font-size: 20px; margin: 0; letter-spacing: 2px;">AAMIR FABRICS</h1>
        </div>
        <div style="padding: 32px; text-align: center;">
          <p style="color: #888; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">New Subscriber</p>
          <p style="color: #1a1a1a; font-size: 18px; margin-top: 8px;">${subscriberEmail}</p>
        </div>
      </div>
    `,
  });
}
