import { createClient } from '@/lib/supabase/server'
import type { Person } from '@/lib/types'

export async function fetchAllPeople(): Promise<Person[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('people')
    .select('*')
    .order('full_name')
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function fetchPersonById(id: string): Promise<Person | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('people')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return data
}

export async function searchPeople(query: string): Promise<Person[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('people')
    .select('*')
    .ilike('full_name', `%${query}%`)
    .order('full_name')
    .limit(20)
  if (error) throw new Error(error.message)
  return data ?? []
}
