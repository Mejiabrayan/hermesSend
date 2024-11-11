import { createServer } from '@/utils/supabase/server';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

const resend = new Resend(process.env.RESEND_API_KEY);

interface CampaignSend {
  id: string;
  contact_id: string;
  contacts: {
    email: string;
    name: string | null;
  };
}

interface Campaign {
  id: string;
  status: string;
  subject: string;
  content: string;
  campaign_sends: CampaignSend[];
}

export async function POST(
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

    // Get campaign and verify ownership
    const { data: campaign } = await supabase
      .from('campaigns')
      .select(`
        *,
        campaign_sends (
          id,
          contact_id,
          contacts (
            email,
            name
          )
        )
      `)
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
        { error: 'Only draft campaigns can be sent' },
        { status: 400 }
      );
    }

  
    const emails = (campaign as Campaign).campaign_sends.map((send) => ({
      from: 'brayanmejia@brayancodes.com',
      to: send.contacts.email,
      subject: campaign.subject,
      html: campaign.content.replace(
        '{{name}}', 
        send.contacts.name || 'there'
      ),
      reply_to: user.email,
      tags: [
        { name: 'campaign_id', value: id },
        { name: 'campaign_send_id', value: send.id }
      ]
    }));

    // Send in batches of 100 (Resend's limit)
    const batchSize = 100;
    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      await resend.batch.send(batch);
    }

    // Update campaign status
    await supabase
      .from('campaigns')
      .update({ 
        status: 'sent',
        sent_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    // Update campaign_sends status
    await supabase
      .from('campaign_sends')
      .update({ 
        status: 'sent',
        sent_at: new Date().toISOString()
      })
      .eq('campaign_id', id);

    revalidatePath(`/dashboard/campaigns/${id}`);
    return NextResponse.json({ 
      success: true,
      message: 'Campaign is being sent'
    });

  } catch (error) {
    console.error('Error sending campaign:', error);
    return NextResponse.json(
      { error: 'Failed to send campaign' },
      { status: 500 }
    );
  }
} 