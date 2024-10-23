import { TypedSupabaseClient } from '@/utils/types'
import { Tables } from '@/utils/database.types'

export async function getUserInfo(
  supabase: TypedSupabaseClient,
  userId: number
): Promise<Tables<'users'> | null> {
  const { data, error } = await supabase
    .from('users')
    .select('id, display_name, photo_url, created_at, user_email')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching user info:', error)
    return null
  }

  return data
}
