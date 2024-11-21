import { createServer } from '@/utils/supabase/server';

interface EmailOptions {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail({ 
  to, 
  subject,
}: EmailOptions) {
  try {
    const supabase = await createServer();
    
    // Insert into email_logs table
    const { data, error } = await supabase
      .from('email_logs')
      .insert({
        to_email: to,
        subject,
        status: 'pending',
        message_id: null,
        sent_at: null,
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Failed to queue email:', error);
    throw error;
  }
} 