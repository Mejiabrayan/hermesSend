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

    // Create campaign
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .insert({
        user_id: user.id,
        name: result.data.name,
        subject: result.data.subject,
        content: result.data.content,
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (campaignError) {
      throw campaignError;
    }

    // Create campaign sends for recipients
    if (result.data.recipients.length > 0) {
      const campaignSends = result.data.recipients.map(contactId => ({
        campaign_id: campaign.id,
        contact_id: contactId,
        status: 'pending',
        created_at: new Date().toISOString(),
      }));

      const { error: sendsError } = await supabase
        .from('campaign_sends')
        .insert(campaignSends);

      if (sendsError) {
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
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 