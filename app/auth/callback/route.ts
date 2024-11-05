import { createServer } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  // Extract the auth code from URL params
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;
  // Get any custom redirect path
  const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();

  if (code) {
    const supabase = await createServer();
    // Exchange the temporary code for a permanent session
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Handle redirects in order of priority
  if (redirectTo) {
    return NextResponse.redirect(`${origin}${redirectTo}`);
  }
  return NextResponse.redirect(`${origin}/dashboard`);
}