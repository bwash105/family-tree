import { fetchPersonById, fetchAllPeople } from '@/lib/queries/people'
import { fetchRelationshipsForPerson } from '@/lib/queries/relationships'
import { fetchHeritageNotes } from '@/lib/queries/heritage'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { RelationshipManager } from '@/components/people/RelationshipManager'
import { HeritageNoteList } from '@/components/people/HeritageNoteList'
import { format } from 'date-fns'

type Props = {
  params: Promise<{ personId: string }>
}

export default async function PersonDetailPage({ params }: Props) {
  const { personId } = await params
  const [person, relationships, notes, allPeople, supabase] = await Promise.all([
    fetchPersonById(personId),
    fetchRelationshipsForPerson(personId),
    fetchHeritageNotes(personId),
    fetchAllPeople(),
    createClient(),
  ])

  if (!person) notFound()

  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="max-w-lg mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center overflow-hidden flex-shrink-0 relative">
          {person.cover_photo_url ? (
            <Image
              src={person.cover_photo_url}
              alt={person.full_name}
              fill
              sizes="80px"
              className="object-cover"
            />
          ) : (
            <span className="text-3xl">👤</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 break-words">{person.full_name}</h1>
          {person.birth_date && (
            <p className="text-gray-500 text-sm mt-1">
              b. {format(new Date(person.birth_date + 'T00:00:00'), 'MMMM d, yyyy')}
              {person.death_date && ` — d. ${format(new Date(person.death_date + 'T00:00:00'), 'MMMM d, yyyy')}`}
            </p>
          )}
          {person.birthplace && (
            <p className="text-gray-500 text-sm">📍 {person.birthplace}</p>
          )}
        </div>
        <Link
          href={`/people/${personId}/edit`}
          className="flex-shrink-0 px-3 py-2 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 touch-manipulation"
        >
          Edit
        </Link>
      </div>

      {/* Bio */}
      {person.bio && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">About</h2>
          <p className="text-gray-700 text-sm whitespace-pre-wrap">{person.bio}</p>
        </section>
      )}

      {/* Family connections */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Family</h2>
        <RelationshipManager
          personId={personId}
          relationships={relationships}
          people={allPeople}
        />
      </section>

      {/* Heritage notes */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Stories & Notes</h2>
        <HeritageNoteList
          personId={personId}
          notes={notes}
          currentUserId={user?.id ?? ''}
        />
      </section>
    </div>
  )
}
