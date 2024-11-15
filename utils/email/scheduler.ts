import { createServer } from '@/utils/supabase/server';
import { SESService } from './ses-service';

export class EmailScheduler {
  static async scheduleCampaign({
    campaignId,
    scheduledTime,
  }: {
    campaignId: string;
    scheduledTime: Date;
  }) {
    const supabase = await createServer();

    // Store schedule in database
    const { error } = await supabase
      .from('scheduled_campaigns')
      .insert({
        campaign_id: campaignId,
        scheduled_for: scheduledTime.toISOString(),
        status: 'pending'
      });

    if (error) throw error;
  }

  static async processScheduledCampaigns() {
    const supabase = await createServer();
    const now = new Date();

    // Get due campaigns
    const { data: dueCampaigns } = await supabase
      .from('scheduled_campaigns')
      .select(`
        *,
        campaign:campaign_id (
          *,
          contacts (*)
        )
      `)
      .eq('status', 'pending')
      .lte('scheduled_for', now.toISOString());

    if (!dueCampaigns?.length) return;

    // Process each campaign
    for (const scheduled of dueCampaigns) {
      try {
        await SESService.sendCampaign({
          from: `noreply@${scheduled.campaign.domain}`,
          recipients: scheduled.campaign.contacts,
          subject: scheduled.campaign.subject,
          content: scheduled.campaign.content,
          campaignId: scheduled.campaign_id
        });

        // Update status
        await supabase
          .from('scheduled_campaigns')
          .update({ status: 'completed' })
          .eq('id', scheduled.id);

      } catch (error) {
        console.error('Failed to process scheduled campaign:', error);
        await supabase
          .from('scheduled_campaigns')
          .update({ status: 'failed' })
          .eq('id', scheduled.id);
      }
    }
  }
} 