import { createServer } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params first
    const { id } = await params;
    
    const supabase = await createServer();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // First delete campaign_sends (due to foreign key constraint)
    const { error: sendsError } = await supabase
      .from('campaign_sends')
      .delete()
      .eq('campaign_id', id);

    if (sendsError) throw sendsError;

    // Then delete campaign analytics if any
    const { error: analyticsError } = await supabase
      .from('campaign_analytics')
      .delete()
      .eq('campaign_id', id);

    if (analyticsError) throw analyticsError;

    // Finally delete the campaign
    const { error: campaignError } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id); // Ensure user owns the campaign

    if (campaignError) throw campaignError;

    revalidatePath('/dashboard/campaigns');
    
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Delete campaign error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete campaign' },
      { status: 500 }
    );
  }
} 