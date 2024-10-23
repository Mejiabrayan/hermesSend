'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createServer } from '@/utils/supabase/server';

const emailSchema = z.string().email('Invalid email address');
const passwordSchema = z
  .string()
  .min(6, 'Password must be at least 6 characters');

const authSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

const emailOnlySchema = z.object({
  email: emailSchema,
});

type AuthState = {
  message: string | null;
};

export async function signIn(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const supabase = createServer();

  const result = authSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return { message: result.error.errors[0].message };
  }

  const { email, password } = result.data;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { message: error.message };
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function signUp(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  try {
    const supabase = createServer();

    const result = authSchema.safeParse(Object.fromEntries(formData));

    if (!result.success) {
      return { message: result.error.errors[0].message };
    }

    const { email, password } = result.data;

    const {
      data: { user },
      error: signUpError,
    } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
      },
    });

    if (signUpError) {
      return { message: signUpError.message };
    }

    if (!user) {
      return { message: 'An error occurred during sign up.' };
    }

    // Create user profile in a transaction-like manner
    const { error: insertError } = await supabase.from('users').insert({
      id: user.id,
      user_email: user.email,
      created_at: new Date().toISOString(),
      display_name: null,
      photo_url: null,
    }).select().single();

    if (insertError) {
      // If profile creation fails, we should clean up the auth user
      await supabase.auth.admin.deleteUser(user.id);
      console.error('Error inserting user into users table:', insertError);
      return { message: 'An error occurred during sign up. Please try again.' };
    }

    revalidatePath('/', 'layout');
    redirect('/dashboard');
  } catch (error) {
    console.error('Signup error:', error);
    return { message: 'An unexpected error occurred.' };
  }
}

export async function signOut(): Promise<AuthState> {
  try {
    const supabase = createServer();
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return { message: error.message };
    }

    // Clear any server-side state
    revalidatePath('/', 'layout');
    redirect('/auth/sign-in');
  } catch (error) {
    console.error('Signout error:', error);
    return { message: 'An error occurred during sign out.' };
  }
}

export async function passwordReset(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const supabase = createServer();

  const result = emailOnlySchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return { message: result.error.errors[0].message };
  }

  const { email } = result.data;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/update-password`,
  });

  if (error) {
    return { message: error.message };
  }

  return { message: 'Password reset email sent. Please check your inbox.' };
}

export async function updatePassword(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const supabase = createServer();

  const result = z
    .object({ password: passwordSchema })
    .safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return { message: result.error.errors[0].message };
  }

  const { password } = result.data;

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { message: error.message };
  }

  return { message: 'Password updated successfully' };
}

export async function signInWithGoogle() {
  const supabase = createServer();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:3000'
          : process.env.NEXT_PUBLIC_BASE_URL
      }/callback`,
    },
  });

  if (error) {
    console.error('Failed to sign in with Google:', error);
    return { error: error.message };
  }

  if (data.url) {
    redirect(data.url);
  }

  redirect('/dashboard');
}
