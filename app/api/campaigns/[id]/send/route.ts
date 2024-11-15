import { createServer } from '@/utils/supabase/server';
import { SESService } from '@/utils/email/ses-service';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { Tables } from '@/utils/database.types';

type CampaignWithSends = Tables<'campaigns'> & {
  campaign_sends: Array<{
    id: string;
    contact_id: string;
    contacts: {
      email: string;
      id: string;
    } | null;
  }>;
};

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServer();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get campaign with recipients using proper types
    const { data: campaign } = await supabase
      .from('campaigns')
      .select(`
        *,
        campaign_sends (
          id,
          contact_id,
          contacts (
            id,
            email
          )
        )
      `)
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single();

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    const typedCampaign = campaign as CampaignWithSends;

    // Format recipients for SES
    const recipients = typedCampaign.campaign_sends
      .filter(send => send.contacts)
      .map(send => ({
        email: send.contacts!.email,
        id: send.contacts!.id
      }));

    // Send campaign
    const result = await SESService.sendCampaign({
      recipients,
      subject: typedCampaign.subject,
      content: typedCampaign.content,
      campaignId: typedCampaign.id
    });

    if (!result.success) {
      throw new Error(result.error || 'Failed to send campaign');
    }

    // Update campaign status using proper types
    const { error: updateError } = await supabase
      .from('campaigns')
      .update({ 
        status: 'sent',
        sent_count: result.successfulSends,
        updated_at: new Date().toISOString()
      })
      .eq('id', typedCampaign.id);

    if (updateError) throw updateError;

    // Update campaign_sends status
    const { error: sendsError } = await supabase
      .from('campaign_sends')
      .update({ 
        status: 'sent',
        sent_at: new Date().toISOString()
      })
      .eq('campaign_id', typedCampaign.id);

    if (sendsError) throw sendsError;

    revalidatePath('/dashboard/campaigns');
    
    return NextResponse.json({ 
      success: true,
      ...result
    });

  } catch (error) {
    console.error('Campaign send error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to send campaign'
      },
      { status: 500 }
    );
  }
} 