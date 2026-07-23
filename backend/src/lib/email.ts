import { Resend } from 'resend';
import { env } from '../config/env';

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

const layout = (title: string, bodyHtml: string) => `
<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f4f6f8;font-family:Segoe UI,Arial,sans-serif;color:#1a2332;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:32px 0;">
      <tr>
        <td align="center">
          <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;overflow:hidden;">
            <tr>
              <td style="background:#0f2a3f;padding:24px 32px;">
                <span style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:.3px;">LOREE NETWORKS</span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <h1 style="margin:0 0 16px;font-size:20px;color:#0f2a3f;">${title}</h1>
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;background:#f4f6f8;color:#6b7785;font-size:12px;">
                Loree Networks &middot; Westlands, Nairobi, Kenya &middot; 0111 244747 / 0725 300350
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

const button = (href: string, label: string) => `
  <a href="${href}" style="display:inline-block;margin-top:8px;padding:12px 24px;background:#1a6b5e;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:600;font-size:14px;">${label}</a>
`;

const send = async (to: string, subject: string, html: string) => {
  if (!resend) {
    const link = html.match(/href="([^"]+)"/)?.[1];
    console.warn(
      `RESEND_API_KEY not configured — email "${subject}" to ${to} was not sent.` +
        (link ? ` Link: ${link}` : '')
    );
    return;
  }
  try {
    await resend.emails.send({ from: env.EMAIL_FROM, to, subject, html });
  } catch (err) {
    console.error(`Failed to send email "${subject}" to ${to}:`, err);
  }
};

export const sendVerificationEmail = (to: string, name: string, token: string) => {
  const link = `${env.FRONTEND_URL}/verify-email?token=${token}`;
  return send(
    to,
    'Welcome to Loree Networks — please verify your email',
    layout(
      'Welcome to Loree Networks',
      `<p>Hi ${name},</p>
       <p>Thanks for creating an account. Please confirm your email address to activate it.</p>
       ${button(link, 'Verify Email')}
       <p style="margin-top:24px;color:#6b7785;font-size:13px;">This link expires in 48 hours. If you didn't create this account, you can ignore this email.</p>`
    )
  );
};

export const sendPasswordResetEmail = (to: string, name: string, token: string) => {
  const link = `${env.FRONTEND_URL}/reset-password?token=${token}`;
  return send(
    to,
    'Reset your Loree Networks password',
    layout(
      'Reset Your Password',
      `<p>Hi ${name},</p>
       <p>We received a request to reset your password. Click below to choose a new one.</p>
       ${button(link, 'Reset Password')}
       <p style="margin-top:24px;color:#6b7785;font-size:13px;">This link expires in 1 hour. If you didn't request this, you can safely ignore this email — your password won't change.</p>`
    )
  );
};

export const sendAdminNewEnquiryEmail = (submission: {
  name: string;
  email: string;
  phone: string | null;
  topic: string;
  message: string;
  serviceTitle?: string | null;
}) => {
  return send(
    env.ADMIN_NOTIFICATION_EMAIL,
    `New enquiry: ${submission.name} (${submission.topic.replace(/_/g, ' ').toLowerCase()})`,
    layout(
      'New Enquiry Received',
      `<p><strong>Name:</strong> ${submission.name}</p>
       <p><strong>Email:</strong> ${submission.email}</p>
       <p><strong>Phone:</strong> ${submission.phone || '—'}</p>
       <p><strong>Topic:</strong> ${submission.topic.replace(/_/g, ' ')}</p>
       ${submission.serviceTitle ? `<p><strong>Service:</strong> ${submission.serviceTitle}</p>` : ''}
       <p><strong>Message:</strong></p>
       <p style="white-space:pre-wrap;background:#f4f6f8;padding:12px;border-radius:6px;">${submission.message}</p>
       ${button(`${env.FRONTEND_URL}/admin`, 'Open Admin Panel')}`
    )
  );
};

export const sendCustomerEnquiryConfirmationEmail = (to: string, name: string) => {
  return send(
    to,
    'We received your enquiry — Loree Networks',
    layout(
      'Thanks for reaching out',
      `<p>Hi ${name},</p>
       <p>We've received your enquiry and a member of our team will get back to you within 4 business hours.</p>
       <p>If it's urgent, call us on 0111 244747 / 0725 300350.</p>`
    )
  );
};

export const sendQuoteReplyEmail = (
  to: string,
  name: string,
  message: string,
  amount: number | null
) => {
  return send(
    to,
    'Your quote from Loree Networks',
    layout(
      'Your Quotation',
      `<p>Hi ${name},</p>
       ${amount != null ? `<p style="font-size:22px;font-weight:700;color:#1a6b5e;margin:16px 0;">KSh ${amount.toLocaleString()}</p>` : ''}
       <p style="white-space:pre-wrap;">${message}</p>
       <p style="margin-top:24px;color:#6b7785;font-size:13px;">Reply to this email or call 0111 244747 / 0725 300350 with any questions.</p>`
    )
  );
};
