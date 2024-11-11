import { Resend } from 'resend';
import { createServer } from '@/utils/supabase/server';

const resend = new Resend(process.env.RESEND_API_KEY);

interface ResendEmailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
  tags?: Array<{ name: string; value: string }>;
  click_tracking?: boolean;
}

export class EmailService {
  static async sendCampaign(campaignId: string) {
    const supabase = await createServer();
    
    // Get campaign details
    const { data: campaign } = await supabase
      .from('campaigns')
      .select('*, contacts(*)')
      .eq('id', campaignId)
      .single();

    if (!campaign) throw new Error('Campaign not found');

    // Send to each contact
    for (const contact of campaign.contacts) {
      try {
        const { data, error } = await resend.emails.send({
          from: `${campaign.user_id}@momentus.com`,
          to: contact.email,
          subject: campaign.subject,
          html: campaign.content,
          tags: [
            { name: 'campaign_id', value: campaignId },
            { name: 'user_id', value: campaign.user_id }
          ],
          click_tracking: true
        } as ResendEmailOptions);

        // Record the send
        await supabase
          .from('campaign_sends')
          .insert({
            campaign_id: campaignId,
            contact_id: contact.id,
            status: error ? 'failed' : 'sent',
            message_id: data?.id
          });

      } catch (error) {
        console.error('Failed to send email:', error);
        // Record the failure
      }
    }

    // Update campaign status
    await supabase
      .from('campaigns')
      .update({ status: 'sent' })
      .eq('id', campaignId);
  }
} 