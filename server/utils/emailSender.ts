// file: ~/server/utils/emailSender.ts
import { createTransport } from 'nodemailer';
import mustache from 'mustache';
import { useStorage } from '#imports';

export interface EmailOptions {
  to: string;
  subject: string;
  templatePath: string;
  templateData: Record<string, any>;
  text?: string;
  from?: string;
}

// Nodemailer Transporter Setup
const transporter = createTransport({
  host: useRuntimeConfig().mailSmtp,
  port: useRuntimeConfig().mailPort,
  auth: {
    user: useRuntimeConfig().mailUsername,
    pass: useRuntimeConfig().mailPassword,
  },
});

async function renderTemplate(templatePath: string, data: Record<string, any>) {
  const storage = useStorage('assets:server');
  const templateContent = await storage.getItem(templatePath);

  if (!templateContent) {
    throw new Error(`Template not found at path: ${templatePath}`);
  }

  return mustache.render(templateContent.toString(), data);
}

// Main function to send an email
export async function sendEmail({
  to,
  subject,
  templatePath,
  templateData,
  text,
  from = useRuntimeConfig().emailFrom,
}: EmailOptions) {
  const htmlContent = await renderTemplate(templatePath, templateData);

  const mailOptions = {
    from,
    to,
    subject,
    text: text || `Please view this email in an HTML-compatible client.`,
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
  console.log(`Email sent to ${to} with subject "${subject}"`);
}
