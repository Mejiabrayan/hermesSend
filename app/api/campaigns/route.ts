import { createServer } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const createCampaignSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  subject: z.string().min(1, 'Subject is required'),
  content: z.string().min(1, 'Content is required'),
  recipients: z.array(z.string()),
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

    // Create campaign with all required fields
    const campaignData = {
      user_id: user.id,
      name: result.data.name,
      subject: result.data.subject,
      content: result.data.content,
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      sent_count: 0,
      opens_count: 0,
      clicks_count: 0,
      total_recipients: result.data.recipients.length,
      deleted_at: null,
      completed_at: null,
      schedule_at: null,
      performance_metrics: null
    };

    // Create campaign
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .insert(campaignData)
      .select()
      .single();

    if (campaignError) {
      console.error('Campaign creation error:', campaignError);
      throw campaignError;
    }

    // Create campaign sends for recipients
    if (result.data.recipients.length > 0) {
      const campaignSends = result.data.recipients.map(contactId => ({
        campaign_id: campaign.id,
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

    revalidatePath('/dashboard/campaigns');
    return NextResponse.json({ 
      success: true, 
      campaign,
      message: 'Campaign created successfully'
    });

  } catch (error) {
    console.error('Campaign creation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 
