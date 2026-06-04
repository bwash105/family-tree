'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { RelationshipType } from '@/lib/types'

export async function addRelationship(
  personAId: string,
  personBId: string,
  type: RelationshipType
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase.from('relationships').insert({
    person_a_id: personAId,
    person_b_id: personBId,
    relationship_type: type,
    added_by: user.id,
  })

  if (error) return { error: error.message }

  revalidatePath('/tree')
  revalidatePath(`/people/${personAId}`)
  revalidatePath(`/people/${personBId}`)
  return { success: true }
}

export async function removeRelationship(relationshipId: string, personAId: string, personBId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('relationships')
    .delete()
    .eq('id', relationshipId)

  if (error) return { error: error.message }

  revalidatePath('/tree')
  revalidatePath(`/people/${personAId}`)
  revalidatePath(`/people/${personBId}`)
  return { success: true }
}
