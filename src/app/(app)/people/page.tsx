import { fetchAllPeople } from '@/lib/queries/people'
import { PeopleListClient } from '@/components/people/PeopleListClient'
import Link from 'next/link'

export default async function PeoplePage() {
  const people = await fetchAllPeople()

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          People
          {people.length > 0 && (
            <span className="ml-2 text-base font-normal text-gray-400">
              ({people.length})
            </span>
          )}
        </h1>
      </div>

      <PeopleListClient initialPeople={people} />

      {/* Floating action button */}
      <Link
        href="/people/new"
        className="fixed bottom-24 right-6 md:bottom-8 w-14 h-14 bg-amber-600 hover:bg-amber-700 text-white rounded-full shadow-xl flex items-center justify-center text-2xl font-bold z-30 touch-manipulation active:scale-95 transition-all"
        aria-label="Add new person"
      >
        +
      </Link>
    </div>
  )
}
