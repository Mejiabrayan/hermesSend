import { signInAction } from "@/utils/actions";
import { FormMessage, type Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function SignIn(props: {
  searchParams: Promise<{ type?: string; message?: string }>;
}) {
  const params = await props.searchParams;
  
  // Handle the null case with optional chaining and type guard
  const message: Message | null = params.message 
    ? {
        type: (params.type as 'error' | 'success') ?? 'error',
        message: params.message,
      }
    : null;

  return (
    <>
      <form className="flex-1 flex flex-col w-full gap-2 text-foreground [&>input]:mb-6 min-w-64 max-w-64 mx-auto">
        <div>
          <h1 className="text-2xl font-medium">Sign In</h1>
          <p className="text-sm text-secondary-foreground">
            New here?{" "}
            <Link className="text-primary underline" href="/sign-up">
              Create an account
            </Link>
          </p>
        </div>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="you@example.com" required />
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            placeholder="••••••••"
            required
          />
          <SubmitButton formAction={signInAction}>Sign In</SubmitButton>
          <FormMessage message={message} />
          <Link
            href="/forgot-password"
            className="text-sm text-secondary-foreground hover:text-primary"
          >
            Forgot your password?
          </Link>
        </div>
      </form>
    </>
  );
}
