import { createServer } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

interface WebhookTag {
  name: string;
  value: string;
}

interface WebhookPayload {
  type: string;
  email_id: string;
  clicked_url?: string;
  recipient?: string;
  tags: WebhookTag[];
  created_at: string;
}

export async function POST(req: Request) {
  try {
    const payload = await req.json() as WebhookPayload;
    const supabase = await createServer();

    const { 
      email_id: messageId,
      type,
      tags
    } = payload;

    // Get campaign_send to find contact_id
    const { data: campaignSend } = await supabase
      .from('campaign_sends')
      .select('contact_id')
      .eq('message_id', messageId)
      .single();

    if (!campaignSend) {
      return NextResponse.json({ error: 'Campaign send not found' }, { status: 404 });
    }

    const campaignId = tags.find(t => t.name === 'campaign_id')?.value;

    if (!campaignId) {
      return NextResponse.json({ error: 'Campaign ID not found in tags' }, { status: 400 });
    }

    // Handle different event types
    switch (type) {
      case 'click':
        // Store click event
        await supabase
          .from('campaign_analytics')
          .upsert({
            campaign_id: campaignId,
            contact_id: campaignSend.contact_id,
            clicked_at: new Date().toISOString()
          });

        // Increment clicks count
        await supabase
          .from('campaigns')
          .update({ 
            clicks_count: supabase.rpc('increment', { row_id: campaignId }),
            updated_at: new Date().toISOString()
          })
          .eq('id', campaignId);
        break;

      case 'open':
        // Store open event
        await supabase
          .from('campaign_analytics')
          .upsert({
            campaign_id: campaignId,
            contact_id: campaignSend.contact_id,
            opened_at: new Date().toISOString()
          });

        // Increment opens count
        await supabase
          .from('campaigns')
          .update({ 
            opens_count: supabase.rpc('increment', { row_id: campaignId }),
            updated_at: new Date().toISOString()
          })
          .eq('id', campaignId);
        break;

      case 'bounce':
      case 'complaint':
        // Update contact status
        await supabase
          .from('contacts')
          .update({ 
            status: 'bounced',
            updated_at: new Date().toISOString()
          })
          .eq('id', campaignSend.contact_id);

        // Update campaign send status
        await supabase
          .from('campaign_sends')
          .update({ 
            status: 'failed',
            updated_at: new Date().toISOString()
          })
          .eq('id', messageId);
        break;

      case 'delivery':
        // Update campaign send status
        await supabase
          .from('campaign_sends')
          .update({ 
            status: 'delivered',
            sent_at: new Date().toISOString()
          })
          .eq('message_id', messageId);
        break;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
} 