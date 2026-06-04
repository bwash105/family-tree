'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addHeritageNote(
  personId: string,
  title: string,
  body: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase.from('heritage_notes').insert({
    person_id: personId,
    title,
    body,
    added_by: user.id,
  })

  if (error) return { error: error.message }

  revalidatePath(`/people/${personId}`)
  return { success: true }
}

export async function deleteHeritageNote(noteId: string, personId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('heritage_notes')
    .delete()
    .eq('id', noteId)

  if (error) return { error: error.message }

  revalidatePath(`/people/${personId}`)
  return { success: true }
}
