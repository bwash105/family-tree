import type { Person, Relationship } from '@/lib/types'

export type TreeNodeDatum = {
  name: string
  attributes?: Record<string, string>
  children?: TreeNodeDatum[]
  __person: Person
}

export function buildTreeData(
  people: Person[],
  relationships: Relationship[]
): TreeNodeDatum[] {
  const peopleById = new Map(people.map((p) => [p.id, p]))

  // Build adjacency: parentId → childIds
  const childrenOf = new Map<string, string[]>()
  const parentOf = new Map<string, string[]>()

  for (const rel of relationships) {
    if (rel.relationship_type === 'parent_child') {
      const parentId = rel.person_a_id
      const childId = rel.person_b_id

      if (!childrenOf.has(parentId)) childrenOf.set(parentId, [])
      childrenOf.get(parentId)!.push(childId)

      if (!parentOf.has(childId)) parentOf.set(childId, [])
      parentOf.get(childId)!.push(parentId)
    }
  }

  // Find roots: people with no parents
  const roots = people.filter((p) => !parentOf.has(p.id) || parentOf.get(p.id)!.length === 0)

  function buildNode(personId: string, visited = new Set<string>()): TreeNodeDatum | null {
    if (visited.has(personId)) return null
    visited.add(personId)

    const person = peopleById.get(personId)
    if (!person) return null

    const childIds = childrenOf.get(personId) ?? []
    const childNodes = childIds
      .map((cId) => buildNode(cId, new Set(visited)))
      .filter((n): n is TreeNodeDatum => n !== null)

    const attrs: Record<string, string> = {}
    if (person.birth_date) attrs['Born'] = person.birth_date
    if (person.death_date) attrs['Died'] = person.death_date
    if (person.birthplace) attrs['From'] = person.birthplace

    return {
      name: person.full_name,
      attributes: Object.keys(attrs).length > 0 ? attrs : undefined,
      children: childNodes.length > 0 ? childNodes : undefined,
      __person: person,
    }
  }

  if (roots.length === 0 && people.length > 0) {
    // No roots found (cycle or all have parents) — show all as flat roots
    return people.map((p) => ({
      name: p.full_name,
      __person: p,
    }))
  }

  return roots
    .map((r) => buildNode(r.id))
    .filter((n): n is TreeNodeDatum => n !== null)
}
