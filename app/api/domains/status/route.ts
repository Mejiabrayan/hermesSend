import { createServer } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const domain = searchParams.get('domain');
    
    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
    }

    const supabase = await createServer();
    const { data } = await supabase
      .from('domains')
      .select('status')
      .eq('domain', domain)
      .single();

    return NextResponse.json({ status: data?.status || 'pending' });
  } catch (error) {
    console.error('Domain status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check domain status' },
      { status: 500 }
    );
  }
} 