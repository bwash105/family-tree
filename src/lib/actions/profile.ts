'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(data: {
  full_name?: string
  avatar_url?: string
  person_id?: string | null
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('profiles')
    .upsert({ id: user.id, ...data })

  if (error) return { error: error.message }

  revalidatePath('/profile')
  return { success: true }
}
