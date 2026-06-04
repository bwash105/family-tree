'use client'

import { useState } from 'react'
import { addRelationship, removeRelationship } from '@/lib/actions/relationships'
import { PeopleSearch } from '@/components/search/PeopleSearch'
import type { Person, Relationship } from '@/lib/types'

type Props = {
  personId: string
  relationships: Relationship[]
  people: Person[]
}

type AddingType = 'child' | 'parent' | 'spouse' | null

function getRelationshipLabel(rel: Relationship, personId: string): string {
  if (rel.relationship_type === 'spouse') return 'Spouse'
  if (rel.person_a_id === personId) return 'Parent of'
  return 'Child of'
}

export function RelationshipManager({ personId, relationships, people }: Props) {
  const [addingType, setAddingType] = useState<AddingType>(null)
  const [error, setError] = useState('')

  const peopleById = new Map(people.map((p) => [p.id, p]))
  const connectedIds = relationships
    .flatMap((r) => [r.person_a_id, r.person_b_id])
    .filter((id) => id !== personId)

  function getSearchLabel(type: AddingType): string {
    if (type === 'spouse') return 'Add spouse'
    if (type === 'parent') return 'Add parent'
    if (type === 'child') return 'Add child'
    return ''
  }

  async function handleSelect(selectedPerson: Person) {
    setError('')
    let result: { error?: string; success?: boolean }

    if (addingType === 'child') {
      // This person is the parent (a), selected person is the child (b)
      result = await addRelationship(personId, selectedPerson.id, 'parent_child')
    } else if (addingType === 'parent') {
      // Selected person is the parent (a), this person is the child (b)
      result = await addRelationship(selectedPerson.id, personId, 'parent_child')
    } else if (addingType === 'spouse') {
      result = await addRelationship(personId, selectedPerson.id, 'spouse')
    } else {
      return
    }

    if (result.error) setError(result.error)
    setAddingType(null)
  }

  async function handleRemove(rel: Relationship) {
    const otherId = rel.person_a_id === personId ? rel.person_b_id : rel.person_a_id
    await removeRelationship(rel.id, personId, otherId)
  }

  return (
    <div className="space-y-4">
      {relationships.length > 0 && (
        <ul className="space-y-2">
          {relationships.map((rel) => {
            const otherId = rel.person_a_id === personId ? rel.person_b_id : rel.person_a_id
            const other = peopleById.get(otherId)
            if (!other) return null
            return (
              <li key={rel.id} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wide">
                    {getRelationshipLabel(rel, personId)}
                  </span>
                  <p className="font-medium text-gray-900">{other.full_name}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(rel)}
                  className="text-red-400 hover:text-red-600 text-sm touch-manipulation p-2"
                  aria-label="Remove relationship"
                >
                  ✕
                </button>
              </li>
            )
          })}
        </ul>
      )}

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {addingType ? (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">{getSearchLabel(addingType)}</p>
          <PeopleSearch
            excludeIds={[personId, ...connectedIds]}
            onSelect={handleSelect}
          />
          <button
            type="button"
            onClick={() => setAddingType(null)}
            className="text-sm text-gray-400 touch-manipulation"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setAddingType('child')}
            className="px-4 py-2 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-amber-50 touch-manipulation"
          >
            + Add child
          </button>
          <button
            type="button"
            onClick={() => setAddingType('parent')}
            className="px-4 py-2 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-amber-50 touch-manipulation"
          >
            + Add parent
          </button>
          <button
            type="button"
            onClick={() => setAddingType('spouse')}
            className="px-4 py-2 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-amber-50 touch-manipulation"
          >
            + Add spouse
          </button>
        </div>
      )}
    </div>
  )
}
