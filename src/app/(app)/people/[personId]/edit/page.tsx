import { fetchPersonById } from '@/lib/queries/people'
import { PersonForm } from '@/components/people/PersonForm'
import { notFound } from 'next/navigation'
import Link from 'next/link'

type Props = {
  params: Promise<{ personId: string }>
}

export default async function EditPersonPage({ params }: Props) {
  const { personId } = await params
  const person = await fetchPersonById(personId)
  if (!person) notFound()

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <Link href={`/people/${personId}`} className="text-gray-400 hover:text-gray-600 touch-manipulation">
          ← Back
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit {person.full_name}</h1>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <PersonForm person={person} />
      </div>
    </div>
  )
}
