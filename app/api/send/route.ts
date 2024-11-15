import { createServer } from '@/utils/supabase/server';
import { SESService } from '@/utils/email/ses-service';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const supabase = await createServer();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { to, subject, html } = await req.json();

    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await SESService.sendEmail({ to, subject, html });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send email' },
        { status: 500 }
      );
    }

    // Log the email send in our database
    const { error: logError } = await supabase
      .from('email_logs')
      .insert({
        user_id: user.id,
        to_email: Array.isArray(to) ? to.join(', ') : to,
        subject,
        status: 'sent',
        message_id: result.messageId,
        sent_at: new Date().toISOString()
      });

    if (logError) {
      console.error('Failed to log email:', logError);
    }

    return NextResponse.json({ 
      success: true, 
      messageId: result.messageId 
    });
  } catch (error) {
    console.error('Send error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 