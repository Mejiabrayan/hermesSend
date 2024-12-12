import { createServer } from '@/utils/supabase/server';
import { SESService } from './ses-service';
import { Database, Tables } from '@/utils/database.types';

type ScheduledCampaign = {
  id: string;
  campaign_id: string;
  scheduled_for: string;
  status: Database['public']['Enums']['campaign_status'];
  campaign: Tables<'campaigns'> & {
    contacts: Array<Pick<Tables<'contacts'>, 'id' | 'email' | 'name'>>;
    domain?: string;
  };
};

type ScheduleParams = {
  campaignId: string;
  scheduledTime: Date;
};

export class EmailScheduler {
  static async scheduleCampaign({
    campaignId,
    scheduledTime,
  }: ScheduleParams): Promise<void> {
    const supabase = await createServer();

    // Validate inputs
    if (!campaignId) throw new Error('Campaign ID is required');
    if (!(scheduledTime instanceof Date))
      throw new Error('Invalid schedule time');
    if (scheduledTime < new Date())
      throw new Error('Cannot schedule in the past');

    // Store schedule in database
    const { error } = await supabase.from('scheduled_campaigns').insert({
      campaign_id: campaignId,
      scheduled_for: scheduledTime.toISOString(),
      status: 'scheduled',
    });

    if (error) throw new Error(`Failed to schedule campaign: ${error.message}`);
  }

  static async processScheduledCampaigns(): Promise<void> {
    const supabase = await createServer();
    const now = new Date();

    // Get due campaigns with retries
    const { data: dueCampaigns, error: fetchError } = await supabase
      .from('scheduled_campaigns')
      .select(
        `
        *,
        campaign:campaign_id (
          *,
          contacts (
            id,
            email,
            name
          )
        )
      `
      )
      .eq('status', 'scheduled')
      .lte('scheduled_for', now.toISOString())
      .limit(10); // Process in batches

    if (fetchError) {
      console.error('Failed to fetch scheduled campaigns:', fetchError);
      return;
    }

    if (!dueCampaigns?.length) return;

    // Process each campaign
    for (const scheduled of dueCampaigns as unknown as ScheduledCampaign[]) {
      try {
        if (!scheduled.campaign) {
          throw new Error(`Campaign not found for schedule ${scheduled.id}`);
        }

        if (!scheduled.campaign.domain) {
          throw new Error(
            `Domain not found for campaign ${scheduled.campaign.id}`
          );
        }

        if (!scheduled.campaign.contacts?.length) {
          throw new Error(
            `No recipients found for campaign ${scheduled.campaign.id}`
          );
        }

        // Update to sending status
        await supabase
          .from('scheduled_campaigns')
          .update({ status: 'sending' })
          .eq('id', scheduled.id);

        const campaignParams= {
          from: `noreply@${scheduled.campaign.domain}`,
          recipients: scheduled.campaign.contacts.map((contact) => ({
            id: contact.id,
            email: contact.email,
            name: contact.name ?? undefined,
          })),
          subject: scheduled.campaign.subject,
          content: scheduled.campaign.content,
          campaignId: scheduled.campaign_id,
          userId: scheduled.campaign.user_id,
        };

        await SESService.sendCampaign(campaignParams);

        // Update status
        const { error: updateError } = await supabase
          .from('scheduled_campaigns')
          .update({
            status: 'completed',
            completed_at: now.toISOString(),
          })
          .eq('id', scheduled.id);

        if (updateError) {
          console.error(
            `Failed to update campaign status for ${scheduled.id}:`,
            updateError
          );
        }
      } catch (error) {
        console.error(
          `Failed to process scheduled campaign ${scheduled.id}:`,
          error
        );

        // Update with failure status and error message
        const { error: updateError } = await supabase
          .from('scheduled_campaigns')
          .update({
            status: 'failed',
            error_message:
              error instanceof Error ? error.message : 'Unknown error',
            failed_at: now.toISOString(),
          })
          .eq('id', scheduled.id);

        if (updateError) {
          console.error(
            `Failed to update failure status for campaign ${scheduled.id}:`,
            updateError
          );
        }
      }
    }
  }
}
