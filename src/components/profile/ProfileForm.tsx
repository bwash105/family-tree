'use client'

import { useState } from 'react'
import { updateProfile } from '@/lib/actions/profile'
import { PhotoUploader } from '@/components/people/PhotoUploader'
import { PeopleSearch } from '@/components/search/PeopleSearch'
import type { Profile, Person } from '@/lib/types'

type Props = {
  profile: Profile
  linkedPerson: Person | null
}

export function ProfileForm({ profile, linkedPerson }: Props) {
  const [name, setName] = useState(profile.full_name ?? '')
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url ?? '')
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(linkedPerson)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  async function handleSave() {
    setSaving(true)
    setError('')
    setSaved(false)
    const result = await updateProfile({
      full_name: name || undefined,
      avatar_url: avatarUrl || undefined,
      person_id: selectedPerson?.id ?? null,
    })
    setSaving(false)
    if (result.error) {
      setError(result.error)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  return (
    <div className="space-y-6">
      {/* Avatar */}
      <div className="flex flex-col items-center">
        <PhotoUploader
          bucket="avatars"
          currentUrl={avatarUrl}
          onUpload={setAvatarUrl}
        />
      </div>

      {/* Display name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Display name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      {/* Link to own family record */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Your family record
        </label>
        <p className="text-sm text-gray-500 mb-2">
          Link your account to your entry in the family tree.
        </p>
        {selectedPerson ? (
          <div className="flex items-center justify-between bg-amber-50 rounded-xl px-4 py-3">
            <span className="font-medium text-gray-900">{selectedPerson.full_name}</span>
            <button
              type="button"
              onClick={() => setSelectedPerson(null)}
              className="text-red-400 text-sm touch-manipulation"
            >
              Unlink
            </button>
          </div>
        ) : (
          <PeopleSearch
            onSelect={setSelectedPerson}
            placeholder="Find your entry…"
          />
        )}
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-xl py-3 font-semibold text-base disabled:opacity-50 active:scale-95 transition-all touch-manipulation"
      >
        {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save profile'}
      </button>
    </div>
  )
}
