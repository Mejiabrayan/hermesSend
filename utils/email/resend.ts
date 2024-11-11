import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendCampaignEmail({
  to,
  subject,
  content,
}: {
  to: string;
  subject: string;
  content: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'you@momentus.com',
      to,
      subject,
      html: content,
    });

    if (error) {
      throw error;
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
} 