import { createClient } from '@/lib/supabase/server'
import type { HeritageNote } from '@/lib/types'

export async function fetchHeritageNotes(personId: string): Promise<HeritageNote[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('heritage_notes')
    .select('*')
    .eq('person_id', personId)
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data ?? []
}
