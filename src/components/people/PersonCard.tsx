import Link from 'next/link'
import Image from 'next/image'
import type { Person } from '@/lib/types'

type Props = {
  person: Person
}

export function PersonCard({ person }: Props) {
  const years = [
    person.birth_date ? `b. ${person.birth_date.slice(0, 4)}` : '',
    person.death_date ? `d. ${person.death_date.slice(0, 4)}` : '',
  ].filter(Boolean).join(' — ') || person.birthplace || ''

  return (
    <Link
      href={`/people/${person.id}`}
      className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-stone-100 hover:border-amber-200 hover:shadow-md transition-all duration-200 touch-manipulation active:scale-[0.99] cursor-pointer"
    >
      <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center overflow-hidden flex-shrink-0 relative border border-amber-100">
        {person.cover_photo_url ? (
          <Image src={person.cover_photo_url} alt={person.full_name} fill sizes="56px" className="object-cover" />
        ) : (
          <svg className="w-7 h-7 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-stone-800 truncate font-body">{person.full_name}</p>
        {years && <p className="text-xs text-stone-400 mt-0.5">{years}</p>}
      </div>
      <svg className="w-4 h-4 text-stone-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
      </svg>
    </Link>
  )
}
