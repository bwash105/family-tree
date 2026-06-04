import { PersonForm } from '@/components/people/PersonForm'

export default function NewPersonPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add family member</h1>
        <p className="text-gray-500 text-sm mt-1">
          Add someone to your family tree. You can add more details later.
        </p>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <PersonForm />
      </div>
    </div>
  )
}
