import { createClient } from '@/lib/supabase/server'
import type { Relationship } from '@/lib/types'

export async function fetchRelationshipsForPerson(personId: string): Promise<Relationship[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('relationships')
    .select('*')
    .or(`person_a_id.eq.${personId},person_b_id.eq.${personId}`)
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function fetchAllRelationships(): Promise<Relationship[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('relationships')
    .select('*')
  if (error) throw new Error(error.message)
  return data ?? []
}
