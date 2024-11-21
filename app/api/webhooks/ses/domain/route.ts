import { createServer } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

interface SESNotification {
  Type: string;
  Message: string;
  MessageId: string;
  Timestamp: string;
  TopicArn: string;
  Message: {
    eventType: 'DomainVerification';
    domain: string;
    status: 'Success' | 'Failed';
  };
}

export async function POST(req: Request) {
  try {
    const notification = await req.json() as SESNotification;
    
    // Verify SNS signature here...
    
    if (notification.Message.eventType === 'DomainVerification') {
      const supabase = await createServer();
      
      if (notification.Message.status === 'Success') {
        await supabase
          .from('domains')
          .update({ 
            status: 'verified',
            verified_at: new Date().toISOString()
          })
          .eq('domain', notification.Message.domain);
      } else {
        await supabase
          .from('domains')
          .update({ 
            status: 'failed',
            updated_at: new Date().toISOString()
          })
          .eq('domain', notification.Message.domain);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('SES Domain Webhook Error:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
} 