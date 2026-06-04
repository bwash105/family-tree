import Link from 'next/link'
import Image from 'next/image'
import type { Person } from '@/lib/types'

type Props = {
  person: Person
}

export function PersonCard({ person }: Props) {
  return (
    <Link
      href={`/people/${person.id}`}
      className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow touch-manipulation active:scale-[0.99]"
    >
      <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center overflow-hidden flex-shrink-0 relative">
        {person.cover_photo_url ? (
          <Image
            src={person.cover_photo_url}
            alt={person.full_name}
            fill
            sizes="56px"
            className="object-cover"
          />
        ) : (
          <span className="text-2xl">👤</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 truncate">{person.full_name}</p>
        <p className="text-sm text-gray-500 mt-0.5">
          {person.birth_date
            ? `b. ${person.birth_date.slice(0, 4)}`
            : ''}
          {person.birth_date && person.death_date ? ' — ' : ''}
          {person.death_date ? `d. ${person.death_date.slice(0, 4)}` : ''}
          {!person.birth_date && !person.death_date && person.birthplace
            ? person.birthplace
            : ''}
        </p>
      </div>
      <span className="text-gray-300 text-lg flex-shrink-0">›</span>
    </Link>
  )
}
