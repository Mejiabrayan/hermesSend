import { createServer } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

interface SESEvent {
  eventType: 'Send' | 'Delivery' | 'Open' | 'Click' | 'Bounce' | 'Complaint';
  mail: {
    messageId: string;
    timestamp: string;
    tags: {
      campaignId: [string];
    };
  };
  delivery?: {
    timestamp: string;
  };
  open?: {
    timestamp: string;
  };
  click?: {
    timestamp: string;
    link: string;
  };
}

export async function POST(req: Request) {
  try {
    const event = await req.json() as SESEvent;
    const supabase = await createServer();

    const campaignId = event.mail.tags.campaignId[0];
    const messageId = event.mail.messageId;

    switch (event.eventType) {
      case 'Delivery':
        await supabase
          .from('campaign_sends')
          .update({ 
            status: 'delivered',
            sent_at: event.delivery?.timestamp 
          })
          .eq('message_id', messageId);
        break;

      case 'Open':
        await supabase
          .from('campaign_analytics')
          .upsert({
            campaign_id: campaignId,
            opened_at: event.open?.timestamp,
            message_id: messageId
          });
        break;

      case 'Click':
        await supabase
          .from('campaign_analytics')
          .upsert({
            campaign_id: campaignId,
            clicked_at: event.click?.timestamp,
            message_id: messageId
          });
        break;
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('SES Webhook Error:', error);
    return NextResponse.json(
      { error: 'Failed to process SES event' },
      { status: 500 }
    );
  }
} 