'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { createServer } from '@/utils/supabase/server';
import { Tables } from '@/utils/database.types';
import { encodedRedirect } from '@/utils/encodedRedirect';

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createServer();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (signUpError) {
    console.error(signUpError.code + " " + signUpError.message);
    return encodedRedirect("error", "/sign-up", signUpError.message);
  }

  // Create user profile in users table
  if (signUpData.user) {
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: signUpData.user.id,
        email: signUpData.user.email!,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (profileError) {
      console.error('Error creating user profile:', profileError);
      // Still continue since auth was successful
    }
  }

  return encodedRedirect(
    "success",
    "/sign-up",
    "Thanks for signing up! Please check your email for a verification link.",
  );
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createServer();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/dashboard");
};
export const signOutAction = async () => {
  const supabase = await createServer();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Signout error:', error);
    return encodedRedirect(
      'error',
      '/sign-in',
      'An error occurred during sign out.'
    );
  }

  revalidatePath('/', 'layout');
  return redirect('/sign-in');
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get('email')?.toString();
  const supabase = await createServer();
  const origin = (await headers()).get('origin');
  const callbackUrl = formData.get('callbackUrl')?.toString();

  if (!email) {
    return encodedRedirect(
      'error',
      '/forgot-password',
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
      '/forgot-password',
      'Could not reset password'
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    'success',
    '/forgot-password',
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
      .select('*')
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

export const updateUserProfile = async (formData: FormData) => {
  const username = formData.get('username')?.toString();
  
  try {
    const supabase = await createServer();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: authError?.message || 'User not authenticated' };
    }

    const { error } = await supabase
      .from('users')
      .update({ username })
      .eq('id', user.id);

    if (error) {
      console.error('Error updating user profile:', error);
      return { error: 'Failed to update user profile' };
    }

    // Revalidate both the settings page and the userProfile query
    revalidatePath('/dashboard/settings');
    revalidatePath('/', 'layout'); // This will revalidate the entire layout including the sidebar
    return { success: true };
    
  } catch (error) {
    console.error('Unexpected error updating user profile:', error);
    return { error: 'An unexpected error occurred' };
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
        scopes: 'email',
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


export const updateAvatarAction = async (formData: FormData) => {
  try {
    const file = formData.get("avatar") as File;
    const supabase = await createServer();
    
    if (!file) {
      return { error: 'No file provided' };
    }

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { error: 'User not authenticated' };
    }

    // Create unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from('avatar')
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error('Error uploading avatar:', uploadError);
      return { error: 'Failed to upload avatar' };
    }

    // Construct URL using the S3 endpoint pattern from your settings
    const avatarUrl = `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/object/public/avatar/${fileName}`;
    console.log(avatarUrl);
    const { error: updateError } = await supabase
      .from('users')
      .update({ photo_url: avatarUrl })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating profile:', updateError);
      return { error: 'Failed to update profile' };
    }

    revalidatePath('/dashboard/settings');
    revalidatePath('/', 'layout');
    return { success: true };

  } catch (error) {
    console.error('Unexpected error updating avatar:', error);
    return { error: 'An unexpected error occurred' };
  }
};
