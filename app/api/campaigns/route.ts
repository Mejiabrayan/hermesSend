import { createServer } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { SESService } from '@/utils/email/ses-service';

const createCampaignSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  subject: z.string().min(1, 'Subject is required'),
  content: z.string().min(1, 'Content is required'),
  recipients: z.array(z.string()),
  sendImmediately: z.boolean().optional(),
});

export async function POST(req: Request) {
  try {
    const supabase = await createServer();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate input
    const body = await req.json();
    const result = createCampaignSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { sendImmediately, ...campaignData } = result.data;

    // Create campaign with all required fields
    const campaign = {
      user_id: user.id,
      name: campaignData.name,
      subject: campaignData.subject,
      content: campaignData.content,
      status: sendImmediately ? 'sending' : 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      sent_count: 0,
      opens_count: 0,
      clicks_count: 0,
      total_recipients: campaignData.recipients.length,
      deleted_at: null,
      completed_at: null,
      schedule_at: null,
      performance_metrics: null
    };

    // Create campaign
    const { data: createdCampaign, error: campaignError } = await supabase
      .from('campaigns')
      .insert(campaign)
      .select()
      .single();

    if (campaignError) {
      console.error('Campaign creation error:', campaignError);
      throw campaignError;
    }

    // Create campaign sends for recipients
    if (campaignData.recipients.length > 0) {
      const campaignSends = campaignData.recipients.map(contactId => ({
        campaign_id: createdCampaign.id,
        contact_id: contactId,
        status: 'pending',
        created_at: new Date().toISOString(),
        sent_at: null,
        message_id: null
      }));

      const { error: sendsError } = await supabase
        .from('campaign_sends')
        .insert(campaignSends);

      if (sendsError) {
        console.error('Campaign sends error:', sendsError);
        throw sendsError;
      }
    }

    // If sendImmediately is true, send the campaign
    let sendResult;
    if (sendImmediately) {
      // Get contacts for the campaign
      const { data: contacts } = await supabase
        .from('contacts')
        .select('id, email')
        .in('id', campaignData.recipients);

      if (!contacts) {
        throw new Error('Failed to fetch contacts');
      }

      // Send the campaign
      sendResult = await SESService.sendCampaign({
        recipients: contacts.map(c => ({ id: c.id, email: c.email })),
        subject: campaignData.subject,
        content: campaignData.content,
        campaignId: createdCampaign.id,
        userId: user.id
      });

      if (!sendResult.success) {
        throw new Error(sendResult.error || 'Failed to send campaign');
      }

      // Update campaign status and campaign_sends
      await Promise.all([
        supabase
          .from('campaigns')
          .update({ 
            status: 'sent',
            sent_count: sendResult.successfulSends,
            completed_at: new Date().toISOString()
          })
          .eq('id', createdCampaign.id),
        supabase
          .from('campaign_sends')
          .update({ 
            status: 'sent',
            sent_at: new Date().toISOString()
          })
          .eq('campaign_id', createdCampaign.id)
      ]);
    }

    revalidatePath('/dashboard/campaigns');
    return NextResponse.json({ 
      success: true, 
      campaign: createdCampaign,
      ...(sendResult && {
        successfulSends: sendResult.successfulSends,
        failedSends: sendResult.failedSends
      }),
      message: sendImmediately ? 'Campaign created and sent' : 'Campaign created successfully'
    });

  } catch (error) {
    console.error('Campaign creation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 
