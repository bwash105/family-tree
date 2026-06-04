'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { PersonCard } from './PersonCard'
import type { Person } from '@/lib/types'

type Props = {
  initialPeople: Person[]
}

export function PeopleListClient({ initialPeople }: Props) {
  const [query, setQuery] = useState('')
  const [filtered, setFiltered] = useState<Person[]>(initialPeople)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query.trim()) {
      setFiltered(initialPeople)
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      const supabase = createClient()
      const { data } = await supabase
        .from('people')
        .select('*')
        .ilike('full_name', `%${query.trim()}%`)
        .order('full_name')
        .limit(50)
      setFiltered(data ?? [])
      setLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [query, initialPeople])

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search family members…"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
        />
        {loading && (
          <span className="absolute right-4 top-3.5 text-gray-400 text-sm">…</span>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-sm">
            {query ? `No results for "${query}"` : 'No family members yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((person) => (
            <PersonCard key={person.id} person={person} />
          ))}
        </div>
      )}
    </div>
  )
}
