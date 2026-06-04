'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createPerson(formData: {
  full_name: string
  birth_date?: string
  death_date?: string
  birthplace?: string
  bio?: string
  cover_photo_url?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data, error } = await supabase
    .from('people')
    .insert({ ...formData, added_by: user.id })
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/tree')
  revalidatePath('/people')
  return { data }
}

export async function updatePerson(
  id: string,
  formData: {
    full_name?: string
    birth_date?: string
    death_date?: string
    birthplace?: string
    bio?: string
    cover_photo_url?: string
  }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data, error } = await supabase
    .from('people')
    .update(formData)
    .eq('id', id)
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/tree')
  revalidatePath('/people')
  revalidatePath(`/people/${id}`)
  return { data }
}
