import { createServer } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const updateCampaignSchema = z.object({
  name: z.string().min(1),
  subject: z.string().min(1),
  content: z.string().min(1),
  recipients: z.array(z.string()).optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServer();
    const { data: { user } } = await supabase.auth.getUser();
    const { id } = await params;
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate input
    const body = await req.json();
    const result = updateCampaignSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    // Check if campaign exists and belongs to user
    const { data: campaign } = await supabase
      .from('campaigns')
      .select('id, status')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    if (campaign.status !== 'draft') {
      return NextResponse.json(
        { error: 'Only draft campaigns can be edited' },
        { status: 400 }
      );
    }

    // Update campaign using the already verified user.id
    const { error: campaignError } = await supabase
      .from('campaigns')
      .update({
        name: result.data.name,
        subject: result.data.subject,
        content: result.data.content,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id);

    if (campaignError) {
      throw campaignError;
    }

    // Update recipients if provided
    if (result.data.recipients) {
      // First, remove all existing campaign_sends
      await supabase
        .from('campaign_sends')
        .delete()
        .eq('campaign_id', id);

      // Then, insert new campaign_sends
      if (result.data.recipients.length > 0) {
        const campaignSends = result.data.recipients.map(contactId => ({
          campaign_id: id,
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
    }

    revalidatePath(`/dashboard/campaigns/${id}`);
    return NextResponse.json({ 
      success: true,
      message: 'Campaign updated successfully'
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServer();
    const { data: { user } } = await supabase.auth.getUser();
    const { id } = await params;
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // First delete related records
    await supabase
      .from('campaign_sends')
      .delete()
      .eq('campaign_id', id);

    await supabase
      .from('campaign_analytics')
      .delete()
      .eq('campaign_id', id);

    // Then delete the campaign
    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting campaign:', error);
      return NextResponse.json(
        { error: 'Failed to delete campaign' },
        { status: 500 }
      );
    }

    revalidatePath('/dashboard/campaigns');
    return NextResponse.json({ 
      success: true,
      message: 'Campaign deleted successfully'
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServer();
    const { data: { user } } = await supabase.auth.getUser();
    const { id } = await params;
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: campaign, error } = await supabase
      .from('campaigns')
      .select(`
        *,
        campaign_sends (
          id,
          contact_id
        )
      `)
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ campaign });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 