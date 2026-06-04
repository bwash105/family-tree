'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Person } from '@/lib/types'

type Props = {
  onSelect: (person: Person) => void
  excludeIds?: string[]
  placeholder?: string
}

export function PeopleSearch({ onSelect, excludeIds = [], placeholder = 'Search people…' }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Person[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
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
        .limit(10)
      setResults((data ?? []).filter((p) => !excludeIds.includes(p.id)))
      setLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [query, excludeIds])

  return (
    <div className="relative">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-amber-500"
      />
      {loading && (
        <div className="absolute right-3 top-3.5 text-gray-400 text-sm">…</div>
      )}
      {results.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {results.map((person) => (
            <li key={person.id}>
              <button
                type="button"
                onClick={() => {
                  onSelect(person)
                  setQuery('')
                  setResults([])
                }}
                className="w-full text-left px-4 py-3 text-sm hover:bg-amber-50 active:bg-amber-100 touch-manipulation"
              >
                <span className="font-medium">{person.full_name}</span>
                {person.birth_date && (
                  <span className="text-gray-400 ml-2 text-xs">b. {person.birth_date}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
