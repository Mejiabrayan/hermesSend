import { signUpAction } from "@/utils/actions";
import { FormMessage, type Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function SignUp(props: {
  searchParams: Promise<{ type?: string; message?: string }>;
}) {
  const params = await props.searchParams;

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
          <h1 className="text-2xl font-medium">Create Account</h1>
          <p className="text-sm text-secondary-foreground">
            Already have an account?{" "}
            <Link className="text-primary underline" href="/sign-in">
              Sign in
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
          <SubmitButton formAction={signUpAction}>Sign Up</SubmitButton>
          <FormMessage message={message} />
        </div>
      </form>
    </>
  );
}
