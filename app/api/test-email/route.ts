import { NextResponse } from 'next/server';
import { SESService } from '@/utils/email/ses-service';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const result = await SESService.sendTestEmail(email);
    
    if (!result.success) {
      throw result.error;
    }

    return NextResponse.json({ success: true, messageId: result.messageId });
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json(
      { error: 'Failed to send test email' },
      { status: 500 }
    );
  }
} 