export type Profile = {
  id: string
  full_name: string | null
  avatar_url: string | null
  person_id: string | null
  created_at: string
}

export type Person = {
  id: string
  full_name: string
  birth_date: string | null
  death_date: string | null
  birthplace: string | null
  bio: string | null
  cover_photo_url: string | null
  added_by: string | null
  created_at: string
  updated_at: string
}

export type RelationshipType = 'parent_child' | 'spouse'

export type Relationship = {
  id: string
  person_a_id: string
  person_b_id: string
  relationship_type: RelationshipType
  added_by: string | null
  created_at: string
}

export type HeritageNote = {
  id: string
  person_id: string
  title: string
  body: string
  added_by: string | null
  created_at: string
}
