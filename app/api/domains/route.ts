import { createServer } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { SESVerification } from '@/utils/email/ses-verification';

export async function POST(req: Request) {
  try {
    const supabase = await createServer();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { domain } = await req.json();

    // Verify domain with SES
    const { verificationToken, dkimTokens } = await SESVerification.verifyDomain(domain);

    // Store domain in database
    const { data, error } = await supabase
      .from('domains')
      .insert({
        user_id: user.id,
        domain: domain,
        verification_token: verificationToken,
        dkim_tokens: dkimTokens,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to add domain:', error);
    return NextResponse.json(
      { error: 'Failed to add domain' },
      { status: 500 }
    );
  }
}

// Get user's domains
export async function GET() {
  try {
    const supabase = await createServer();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('domains')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch domains' },
      { status: 500 }
    );
  }
} 