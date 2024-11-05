'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { createServer } from '@/utils/supabase/server';
import { Tables } from '@/utils/database.types';
import { encodedRedirect } from '@/utils/encodedRedirect';

export const signUpAction = async (formData: FormData) => {
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();
  const supabase = await createServer();
  const origin = (await headers()).get('origin');

  if (!email || !password) {
    return encodedRedirect('error', '/auth/sign-up', 'Email and password are required');
  }

  try {
    // First create the auth user
    const {
      data: { user },
      error: signUpError,
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
        data: {
          email: email,
          display_name: email.split('@')[0],
        }
      },
    });

    if (signUpError) throw signUpError;
    if (!user) throw new Error('No user returned from signup');

    // Immediately try to create the profile
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: user.id,
        user_email: email,
        created_at: new Date().toISOString(),
        display_name: email.split('@')[0],
        photo_url: null,
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // Log the specific error for debugging
      console.error('Full profile error:', JSON.stringify(profileError, null, 2));
    }

    return encodedRedirect(
      'success',
      '/auth/sign-up',
      'Account created! Please check your email to verify your account.'
    );

  } catch (error) {
    console.error('Signup error:', error);
    return encodedRedirect(
      'error',
      '/auth/sign-up',
      error instanceof Error ? error.message : 'An error occurred during sign up'
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = await createServer();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect('error', '/auth/sign-in', error.message);
  }

  return redirect('/dashboard');
};

export const signOutAction = async () => {
  const supabase = await createServer();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Signout error:', error);
    return encodedRedirect(
      'error',
      '/auth/sign-in',
      'An error occurred during sign out.'
    );
  }

  revalidatePath('/', 'layout');
  return redirect('/auth/sign-in');
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get('email')?.toString();
  const supabase = await createServer();
  const origin = (await headers()).get('origin');
  const callbackUrl = formData.get('callbackUrl')?.toString();

  if (!email) {
    return encodedRedirect(
      'error',
      '/auth/forgot-password',
      'Email is required'
    );
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/dashboard/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      'error',
      '/auth/forgot-password',
      'Could not reset password'
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    'success',
    '/auth/forgot-password',
    'Check your email for a link to reset your password.'
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;
  const supabase = await createServer();

  if (!password || !confirmPassword) {
    return encodedRedirect(
      'error',
      '/protected/reset-password',
      'Password and confirm password are required'
    );
  }

  if (password !== confirmPassword) {
    return encodedRedirect(
      'error',
      '/protected/reset-password',
      'Passwords do not match'
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return encodedRedirect(
      'error',
      '/protected/reset-password',
      'Password update failed'
    );
  }

  return encodedRedirect(
    'success',
    '/protected/reset-password',
    'Password updated'
  );
};

export const getUserProfile = async (): Promise<{
  data: Tables<'users'> | null;
  error: string | null;
}> => {
  try {
    const supabase = await createServer();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        data: null,
        error: authError?.message || 'User not authenticated',
      };
    }

    const { data, error } = await supabase
      .from('users')
      .select('id, display_name, photo_url, created_at, user_email')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return {
        data: null,
        error: 'Failed to fetch user profile',
      };
    }

    return {
      data,
      error: null,
    };
  } catch (error) {
    console.error('Unexpected error fetching user profile:', error);
    return {
      data: null,
      error: 'An unexpected error occurred',
    };
  }
};

export const updateUserProfile = async (
  updates: Partial<Tables<'users'>>
): Promise<{
  data: Tables<'users'> | null;
  error: string | null;
}> => {
  try {
    const supabase = await createServer();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        data: null,
        error: authError?.message || 'User not authenticated',
      };
    }

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating user profile:', error);
      return {
        data: null,
        error: 'Failed to update user profile',
      };
    }

    return {
      data,
      error: null,
    };
  } catch (error) {
    console.error('Unexpected error updating user profile:', error);
    return {
      data: null,
      error: 'An unexpected error occurred',
    };
  }
};

type GoogleAuthState = {
  error: string | null;
};

export const signUpWithGoogleAction = async (): Promise<GoogleAuthState> => {
  try {
    const supabase = await createServer();
    const origin = (await headers()).get('origin');

    const { data, error: signInError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });

    if (signInError) {
      return { error: signInError.message };
    }

    if (data?.url) {
      redirect(data.url);
    }

    return { error: null };
  } catch (err) {
    console.error('Google sign-in error:', err);
    return { error: 'An unexpected error occurred' };
  }
};

export const checkAuthStatus = async (): Promise<{
  isAuthenticated: boolean;
  error: string | null;
}> => {
  try {
    const supabase = await createServer();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      return {
        isAuthenticated: false,
        error: error.message,
      };
    }

    return {
      isAuthenticated: !!user,
      error: null,
    };
  } catch (error) {
    console.error('Auth check error:', error);
    return {
      isAuthenticated: false,
      error: 'Failed to check authentication status',
    };
  }
};
