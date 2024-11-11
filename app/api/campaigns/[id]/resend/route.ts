import { createServer } from '@/utils/supabase/server';
import { EmailService } from '@/utils/email/emailService';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

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

    // Get campaign and verify ownership
    const { data: campaign } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single();

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    // Update campaign status to sending
    await supabase
      .from('campaigns')
      .update({ status: 'sending', updated_at: new Date().toISOString() })
      .eq('id', params.id);

    // Send campaign
    await EmailService.sendCampaign(params.id);

    revalidatePath(`/dashboard/campaigns/${params.id}`);
    return NextResponse.json({ 
      success: true,
      message: 'Campaign resent successfully'
    });

  } catch (error) {
    console.error('Error resending campaign:', error);
    return NextResponse.json(
      { error: 'Failed to resend campaign' },
      { status: 500 }
    );
  }
} 