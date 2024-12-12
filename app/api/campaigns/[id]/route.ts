import { createServer } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const updateCampaignSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  subject: z.string().min(1, 'Subject is required').optional(),
  content: z.string().min(1, 'Content is required').optional(),
  recipients: z.array(z.string()).optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServer();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const result = updateCampaignSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { recipients, ...campaignData } = result.data;

    // Start a transaction
    const { error: transactionError } = await supabase.rpc('update_campaign_with_recipients', {
      p_campaign_id: id,
      p_user_id: user.id,
      p_campaign_data: campaignData,
      p_recipients: recipients || []
    });

    if (transactionError) {
      console.error('Transaction error:', transactionError);
      throw transactionError;
    }

    revalidatePath(`/dashboard/campaigns/${id}`);
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Update campaign error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update campaign' },
      { status: 500 }
    );
  }
} 